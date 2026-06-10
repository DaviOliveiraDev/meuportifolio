<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Technology;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class ExploreController extends Controller
{
    /**
     * Busca pública de portfólios.
     */
    public function explore(Request $request): JsonResponse
    {
        $query = Profile::where('is_active', true)
            ->with(['badges', 'technologyScores.technology', 'technologies', 'titles', 'cosmetics']);

        // Filtro por texto geral (nome, bio, cargo, username)
        if ($q = $request->input('q')) {
            $query->where(function ($subQuery) use ($q) {
                $subQuery->where('name', 'like', "%{$q}%")
                    ->orWhere('bio', 'like', "%{$q}%")
                    ->orWhere('role', 'like', "%{$q}%")
                    ->orWhere('username', 'like', "%{$q}%");
            });
        }

        // Filtro por cargo específico
        if ($role = $request->input('role')) {
            $query->where('role', 'like', "%{$role}%");
        }

        // Filtro por localização
        if ($location = $request->input('location')) {
            $query->where('location', 'like', "%{$location}%");
        }

        // Filtros de OVR
        if ($minOvr = $request->input('min_ovr')) {
            $query->where('ovr', '>=', (int) $minOvr);
        }
        if ($maxOvr = $request->input('max_ovr')) {
            $query->where('ovr', '<=', (int) $maxOvr);
        }

        // Filtros de Tecnologia e Nível de Confiança
        $tech = $request->input('technology');
        $confidence = $request->input('confidence_level');

        if ($tech) {
            $query->whereHas('technologyScores', function ($subQuery) use ($tech, $confidence) {
                $subQuery->whereHas('technology', function ($techQuery) use ($tech) {
                    $techQuery->where('id', $tech)
                        ->orWhere('slug', $tech);
                });

                if ($confidence) {
                    $subQuery->where('confidence_level', $confidence);
                }
            });
        } elseif ($confidence) {
            $query->whereHas('technologyScores', function ($subQuery) use ($confidence) {
                $subQuery->where('confidence_level', $confidence);
            });
        }

        // Ordenação
        $sort = $request->input('sort', 'ovr_desc');
        switch ($sort) {
            case 'level_desc':
                $query->orderBy('level', 'desc')->orderBy('ovr', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'ovr_desc':
            default:
                $query->orderBy('ovr', 'desc')->orderBy('level', 'desc')->orderBy('xp', 'desc');
                break;
        }

        $profiles = $query->paginate((int) $request->input('per_page', 12));

        return response()->json($profiles);
    }

    /**
     * Retorna a classificação dos top desenvolvedores (Leaderboard) via Redis Sorted Sets.
     */
    public function leaderboard(Request $request): JsonResponse
    {
        $role = $request->input('role');
        
        // Define a chave do ZSET no Redis
        $key = $role ? 'leaderboard:role:' . Str::slug($role) : 'leaderboard:global';

        // Verifica se o Sorted Set existe no Redis
        if (!Redis::exists($key)) {
            $query = Profile::where('is_active', true);

            if ($role) {
                $query->where('role', 'like', "%{$role}%");
            }

            $profiles = $query->get();

            foreach ($profiles as $profile) {
                // Pontuação composta para manter ordenação idêntica ao banco (OVR + Level/1000 + XP/10000000)
                $score = (float) $profile->ovr + ($profile->level / 1000) + ($profile->xp / 10000000);
                Redis::zadd($key, $score, $profile->id);
            }
            
            // Define expiração de 10 minutos
            Redis::expire($key, 600);
        }

        // Obtém os top 100 IDs do Sorted Set ordenados de forma decrescente
        $memberIds = Redis::zrevrange($key, 0, 99);

        if (empty($memberIds)) {
            return response()->json([
                'leaderboard' => []
            ]);
        }

        // Carrega os perfis ordenados exatamente conforme a lista de IDs
        $leaderboard = Profile::whereIn('id', $memberIds)
            ->with(['badges', 'technologyScores.technology', 'technologies', 'titles', 'cosmetics'])
            ->get()
            ->sortBy(function ($profile) use ($memberIds) {
                return array_search((string) $profile->id, $memberIds);
            })
            ->values();

        return response()->json([
            'leaderboard' => $leaderboard
        ]);
    }

    /**
     * Retorna todas as tecnologias ativas e cadastradas para filtro.
     */
    public function technologies(): JsonResponse
    {
        $technologies = Cache::remember('technologies:list', 3600, function () {
            return Technology::with('category')->orderBy('name')->get();
        });

        return response()->json($technologies);
    }
}
