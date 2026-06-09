<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ExploreController extends Controller
{
    /**
     * Busca pública de portfólios.
     */
    public function explore(Request $request): JsonResponse
    {
        $query = Profile::where('is_active', true);

        // Filtro por texto geral (nome, bio, cargo)
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
     * Retorna a classificação dos top desenvolvedores (Leaderboard).
     */
    public function leaderboard(Request $request): JsonResponse
    {
        $role = $request->input('role');
        $cacheKey = $role ? 'leaderboard:role:' . md5($role) : 'leaderboard:global';

        $leaderboard = Cache::remember($cacheKey, 600, function () use ($role) {
            $query = Profile::where('is_active', true)
                ->with('badges');

            if ($role) {
                $query->where('role', 'like', "%{$role}%");
            }

            return $query->orderBy('ovr', 'desc')
                ->orderBy('level', 'desc')
                ->orderBy('xp', 'desc')
                ->limit(100)
                ->get();
        });

        return response()->json([
            'leaderboard' => $leaderboard
        ]);
    }
}
