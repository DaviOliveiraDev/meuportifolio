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

                // Busca se o projeto já existe
                $project = Project::where('profile_id', $profileId)
                    ->where('repository_url', $repoUrl)
                    ->first();

                if (!$project) {
                    // Trata descrição opcional e limita a 2000 caracteres
                    $description = $repo['description'] ?? 'Projeto importado do GitHub.';
                    if (mb_strlen($description) > 2000) {
                        $description = mb_substr($description, 0, 1997) . '...';
                    }

                    $project = Project::create([
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

                // Sincroniza a evidência do GitHub V2
                try {
                    $languages = $githubService->fetchRepositoryLanguages($username, $repo['name']);
                    if (empty($languages) && !empty($repo['language'])) {
                        $languages = [$repo['language'] => 1];
                    }

                    // 1. Cria a evidência base
                    $evidence = \App\Infrastructure\Models\Evidence::updateOrCreate(
                        ['id' => $project->evidence_id],
                        [
                            'user_id' => $this->profile->user_id,
                            'evidence_type' => 'github',
                            'verification_level' => 'auto_verified',
                            'verification_source' => 'github_oauth',
                            'is_active' => true,
                        ]
                    );

                    if ($project->evidence_id !== $evidence->id) {
                        $project->evidence_id = $evidence->id;
                        $project->saveQuietly();
                    }

                    // 2. Cria/Atualiza EvidenceGithub
                    \App\Infrastructure\Models\EvidenceGithub::updateOrCreate(
                        ['evidence_id' => $evidence->id],
                        [
                            'github_repo_id' => $repo['id'] ?? null,
                            'repo_full_name' => $repo['full_name'] ?? null,
                            'repo_url' => $repoUrl,
                            'stars' => $repo['stargazers_count'] ?? 0,
                            'forks' => $repo['forks_count'] ?? 0,
                            'open_issues' => $repo['open_issues_count'] ?? 0,
                            'subscribers' => $repo['watchers_count'] ?? 0,
                            'has_readme' => false,
                            'has_tests' => false,
                            'has_ci' => false,
                            'languages' => $languages,
                            'last_commit_at' => isset($repo['pushed_at']) ? \Illuminate\Support\Carbon::parse($repo['pushed_at']) : null,
                            'synced_at' => now(),
                        ]
                    );

                    // 3. Sincroniza tecnologias
                    $syncData = [];
                    foreach ($languages as $langName => $bytes) {
                        $slug = \Illuminate\Support\Str::slug($langName);
                        $isSqlite = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'sqlite';
                        $tech = \App\Infrastructure\Models\Technology::where('name', $isSqlite ? 'like' : 'ilike', $langName)
                            ->orWhere('slug', $slug)
                            ->first();

                        if ($tech) {
                            $isPrimary = (strtolower($langName) === strtolower($repo['language'] ?? ''));
                            $syncData[$tech->id] = [
                                'id' => (string) \Illuminate\Support\Str::uuid(),
                                'usage_depth' => $isPrimary ? 'primary' : 'used',
                                'is_primary' => $isPrimary,
                            ];
                        }
                    }

                    $evidence->technologies()->sync($syncData);
                } catch (\Exception $e) {
                    Log::error("ReputationV2: Erro ao sincronizar evidência do GitHub para o repositório {$repo['name']}: " . $e->getMessage());
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
