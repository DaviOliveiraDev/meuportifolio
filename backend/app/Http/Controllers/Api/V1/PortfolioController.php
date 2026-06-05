<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Models\Profile;
use App\Domain\Services\AnalyticsServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    /**
     * Registra um evento de clique ou visualização do portfólio.
     */
    public function track(Request $request, string $username, AnalyticsServiceInterface $analyticsService): JsonResponse
    {
        $profile = Profile::where('username', strtolower(trim($username)))->first();
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não encontrado.'], 404);
        }

        $request->validate([
            'event_type' => 'required|string|in:view_project,click_link',
            'target_id' => 'nullable|string',
        ]);

        $analyticsService->trackEvent(
            $profile->id,
            $request->input('event_type'),
            $request->input('target_id'),
            $request->ip() ?? '127.0.0.1',
            $request->userAgent(),
            $request->headers->get('referer')
        );

        return response()->json([
            'message' => 'Evento de monitoramento registrado com sucesso.'
        ]);
    }
}
