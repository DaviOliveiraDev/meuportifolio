<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateResumePdfJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PdfGenerationController extends Controller
{
    /**
     * Dispara a geração de PDF para o perfil do usuário logado.
     */
    public function generate(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'message' => 'Você precisa preencher seu perfil profissional antes de gerar o currículo.'
            ], 400);
        }

        $profileId = $profile->id;
        $cacheKey = "pdf_resume_{$profileId}";
        $cached = Cache::get($cacheKey);

        // Se já estiver processando ou pendente, não dispara outro job redundante
        if ($cached && isset($cached['status']) && in_array($cached['status'], ['pending', 'processing'])) {
            return response()->json([
                'message' => 'A geração do PDF já está em andamento.',
                'status' => $cached['status']
            ]);
        }

        // Define status pendente no cache
        Cache::put($cacheKey, [
            'status' => 'pending',
            'url' => null,
            'updated_at' => now()->toIso8601String()
        ], now()->addHours(24));

        // Despacha o Job
        GenerateResumePdfJob::dispatch($profile);

        return response()->json([
            'message' => 'Geração de PDF iniciada com sucesso.',
            'status' => 'pending'
        ], 202);
    }

    /**
     * Retorna o status atual da geração de PDF para o perfil do usuário logado.
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'message' => 'Perfil profissional não encontrado.'
            ], 404);
        }

        $profileId = $profile->id;
        $cacheKey = "pdf_resume_{$profileId}";
        $cached = Cache::get($cacheKey);

        if (!$cached) {
            return response()->json([
                'status' => 'idle',
                'url' => null,
                'updated_at' => null
            ]);
        }

        return response()->json([
            'status' => $cached['status'] ?? 'idle',
            'url' => $cached['url'] ?? null,
            'error' => $cached['error'] ?? null,
            'updated_at' => $cached['updated_at'] ?? null
        ]);
    }
}
