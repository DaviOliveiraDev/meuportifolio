<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Models\Profile;
use Illuminate\Http\JsonResponse;

class PortfolioController extends Controller
{
    /**
     * Retorna o perfil público do usuário com seus relacionamentos.
     */
    public function show(string $username): JsonResponse
    {
        $profile = Profile::where('username', strtolower($username))
            ->with([
                'projects' => function ($query) {
                    $query->orderBy('order_weight')->orderBy('created_at', 'desc');
                },
                'experiences' => function ($query) {
                    $query->orderBy('start_date', 'desc');
                },
                'educations' => function ($query) {
                    $query->orderBy('start_date', 'desc');
                },
                'skills' => function ($query) {
                    $query->withPivot('proficiency_level');
                }
            ])
            ->first();

        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não encontrado.'], 404);
        }

        return response()->json([
            'profile' => $profile,
        ]);
    }
}
