<?php

namespace App\Domain\Gamification\Jobs;

use App\Domain\Gamification\Services\XpManagerService;
use App\Domain\Gamification\Services\OvrEngineService;
use App\Domain\Gamification\Services\BadgeEvaluatorService;
use App\Domain\Gamification\Services\TitleEvaluatorService;
use App\Domain\Gamification\Services\CosmeticEvaluatorService;
use App\Infrastructure\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EvaluateProfileProgressJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    /**
     * Execute the job.
     */
    public function handle(
        XpManagerService $xpManager,
        OvrEngineService $ovrEngine,
        BadgeEvaluatorService $badgeEvaluator,
        TitleEvaluatorService $titleEvaluator,
        CosmeticEvaluatorService $cosmeticEvaluator
    ): void {
        Log::info("Iniciando avaliação completa de gamificação para o perfil: {$this->profile->id}");

        DB::transaction(function () use ($xpManager, $ovrEngine, $badgeEvaluator, $titleEvaluator, $cosmeticEvaluator) {
            // 1. Atualizar cache de telemetria (profile_stats)
            $stats = $this->profile->stats()->firstOrCreate([]);

            $totalProjects = $this->profile->projects()->count();
            $totalExperiences = $this->profile->experiences()->count();
            $totalEducations = $this->profile->educations()->count();
            $totalSkills = $this->profile->skills()->count();
            $totalBadges = $this->profile->badges()->count();
            $totalTitles = $this->profile->titles()->count();
            $githubConnected = !empty($this->profile->github_url);
            
            $githubRepositories = $this->profile->projects()
                ->where('repository_url', 'like', '%github.com%')
                ->count();

            // Puxa valores de commit/estrelas de cache (populados pelo GithubSync) ou mantém valores salvos
            $githubCommits = Cache::get("profile_commits_count_{$this->profile->id}", $stats->github_commits ?: 0);
            $githubStars = Cache::get("profile_stars_count_{$this->profile->id}", $stats->github_stars ?: 0);

            // Resgatar visualizações e cliques em cache (Analytics buffering)
            $profileViews = Cache::get("profile_views_count_{$this->profile->id}", $stats->profile_views ?: 0);
            $profileShares = Cache::get("profile_shares_count_{$this->profile->id}", $stats->profile_shares ?: 0);
            $streakDays = Cache::get("profile_streak_days_{$this->profile->id}", $stats->streak_days ?: 1);

            $stats->update([
                'total_projects' => $totalProjects,
                'total_experiences' => $totalExperiences,
                'total_educations' => $totalEducations,
                'total_skills' => $totalSkills,
                'total_badges' => $totalBadges,
                'total_titles' => $totalTitles,
                'github_connected' => $githubConnected,
                'github_repositories' => $githubRepositories,
                'github_commits' => $githubCommits,
                'github_stars' => $githubStars,
                'profile_views' => $profileViews,
                'profile_shares' => $profileShares,
                'streak_days' => $streakDays,
                'current_xp' => $this->profile->xp,
                'current_level' => $this->profile->level,
            ]);

            // 2. Recalcular OVR
            $ovrEngine->calculateAndUpdateOvr($this->profile);

            // 3. Avaliar Conquistas (Badges) e seu progresso
            $badgeEvaluator->evaluateAndAwardBadges($this->profile);

            // 4. Avaliar Títulos
            $titleEvaluator->evaluateAndAwardTitles($this->profile);

            // 5. Avaliar Cosméticos
            $cosmeticEvaluator->evaluateAndAwardCosmetics($this->profile);
        });

        Log::info("Avaliação concluída com sucesso para o perfil: {$this->profile->id}");
    }
}
