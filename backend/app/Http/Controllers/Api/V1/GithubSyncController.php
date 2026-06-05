<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\SyncGithubRepositoriesJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GithubSyncController extends Controller
{
    /**
     * Inicia a sincronização de repositórios do GitHub em segundo plano.
     */
    public function sync(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'message' => 'Perfil profissional não encontrado. Por favor, crie seu perfil primeiro.'
            ], 422);
        }

        if (empty($profile->github_url)) {
            return response()->json([
                'message' => 'Por favor, preencha a URL do GitHub em seu perfil antes de realizar a sincronização.'
            ], 422);
        }

        $profileId = $profile->id;
        $currentStatus = Cache::get("github_sync_{$profileId}");

        if (in_array($currentStatus, ['pending', 'processing'])) {
            return response()->json([
                'message' => 'Uma sincronização já está em andamento.',
                'status' => $currentStatus
            ], 422);
        }

        // Inicializa o estado como pendente e despacha o Job
        Cache::put("github_sync_{$profileId}", 'pending', now()->addMinutes(10));
        Cache::forget("github_sync_error_{$profileId}"); // Limpa erros antigos

        SyncGithubRepositoriesJob::dispatch($profile);

        return response()->json([
            'message' => 'Sincronização iniciada com sucesso em segundo plano.',
            'status' => 'pending'
        ]);
    }

    /**
     * Retorna o status atual da sincronização.
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['status' => 'idle']);
        }

        $profileId = $profile->id;
        $status = Cache::get("github_sync_{$profileId}", 'idle');
        $lastSync = Cache::get("github_sync_last_{$profileId}");
        $error = Cache::get("github_sync_error_{$profileId}");

        return response()->json([
            'status' => $status,
            'last_sync' => $lastSync,
            'error' => $status === 'failed' ? $error : null,
        ]);
    }
}
