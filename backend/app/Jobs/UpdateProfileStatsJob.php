<?php

namespace App\Jobs;

use App\Infrastructure\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateProfileStatsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    public function handle(): void
    {
        $profileId = $this->profile->id;
        Log::info("TechDNA: Rodando UpdateProfileStatsJob para o perfil: {$profileId}");

        DB::transaction(function () use ($profileId) {
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
            $githubCommits = Cache::get("profile_commits_count_{$profileId}", $stats->github_commits ?: 0);
            $githubStars = Cache::get("profile_stars_count_{$profileId}", $stats->github_stars ?: 0);

            // Resgatar visualizações e cliques em cache (Analytics buffering)
            $profileViews = Cache::get("profile_views_count_{$profileId}", $stats->profile_views ?: 0);
            $profileShares = Cache::get("profile_shares_count_{$profileId}", $stats->profile_shares ?: 0);
            $streakDays = Cache::get("profile_streak_days_{$profileId}", $stats->streak_days ?: 1);

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
        });

        Log::info("TechDNA: UpdateProfileStatsJob concluído para o perfil: {$profileId}");
    }
}
