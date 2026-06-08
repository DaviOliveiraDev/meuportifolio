<?php

namespace App\Jobs;

use App\Domain\Services\GithubServiceInterface;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class SyncGithubRepositoriesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * O número de segundos que o job pode rodar antes de expirar.
     */
    public $timeout = 120;

    /**
     * O número de vezes que o job pode ser tentado.
     */
    public $tries = 2;

    /**
     * Cria uma nova instância de Job.
     */
    public function __construct(public Profile $profile)
    {
        // Mapeamos para a fila customizada 'github' configurada no worker
        $this->onQueue('github');
    }

    /**
     * Executa o Job.
     */
    public function handle(GithubServiceInterface $githubService): void
    {
        $profileId = $this->profile->id;
        Log::info("Processando SyncGithubRepositoriesJob para o perfil: {$profileId}");

        try {
            Cache::put("github_sync_{$profileId}", 'processing', now()->addMinutes(10));

            $githubUrl = $this->profile->github_url;
            if (empty($githubUrl)) {
                throw new \Exception("URL do GitHub não configurada no perfil.");
            }

            // Extrai o nome de usuário do GitHub a partir da URL
            if (preg_match('/github\.com\/([a-zA-Z0-9_-]+)/i', $githubUrl, $matches)) {
                $username = $matches[1];
            } else {
                $username = trim($githubUrl);
            }

            // Busca repositórios públicos
            $repos = $githubService->fetchUserRepositories($username);
            $importedCount = 0;

            foreach ($repos as $repo) {
                // Ignorar se for privado
                if ($repo['private'] ?? false) {
                    continue;
                }

                $repoUrl = $repo['html_url'] ?? null;
                if (!$repoUrl) {
                    continue;
                }

                // Verifica duplicado com base na URL do repositório para o mesmo perfil
                $exists = Project::where('profile_id', $profileId)
                    ->where('repository_url', $repoUrl)
                    ->exists();

                if (!$exists) {
                    // Trata descrição opcional e limita a 2000 caracteres
                    $description = $repo['description'] ?? 'Projeto importado do GitHub.';
                    if (mb_strlen($description) > 2000) {
                        $description = mb_substr($description, 0, 1997) . '...';
                    }

                    Project::create([
                        'profile_id' => $profileId,
                        'title' => $repo['name'],
                        'description' => $description,
                        'cover_image_url' => null,
                        'repository_url' => $repoUrl,
                        'demo_url' => $repo['homepage'] ?? null,
                        'is_featured' => false,
                        'order_weight' => 0,
                    ]);
                    $importedCount++;
                }
            }

            Log::info("Sincronização concluída com sucesso para o perfil {$profileId}. {$importedCount} projetos importados.");
            
            Cache::put("github_sync_{$profileId}", 'completed', now()->addHours(24));
            Cache::put("github_sync_last_{$profileId}", now()->toIso8601String(), now()->addHours(24));

            // Concede XP e atualiza a carta por conectar/sincronizar GitHub
            $xpManager = app(\App\Domain\Services\XpManagerService::class);
            $xpManager->awardXpForAction($this->profile, 'connect_github');
            \App\Jobs\UpdateDeveloperCardJob::dispatch($this->profile);

        } catch (Throwable $e) {
            Log::error("Falha no Job de Sincronização do GitHub para o perfil {$profileId}: " . $e->getMessage());
            
            Cache::put("github_sync_{$profileId}", 'failed', now()->addHours(24));
            Cache::put("github_sync_error_{$profileId}", $e->getMessage(), now()->addHours(24));
            
            throw $e;
        }
    }

    /**
     * Trata a falha definitiva do Job.
     */
    public function failed(Throwable $exception): void
    {
        $profileId = $this->profile->id;
        Log::error("Job SyncGithubRepositoriesJob falhou definitivamente para o perfil {$profileId}.");
        Cache::put("github_sync_{$profileId}", 'failed', now()->addHours(24));
    }
}
