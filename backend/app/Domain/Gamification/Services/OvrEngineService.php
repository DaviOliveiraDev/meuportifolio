<?php

namespace App\Domain\Gamification\Services;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\ProfileRatingsHistory;
use App\Infrastructure\Models\ScoringConfig;
use App\Domain\Gamification\Events\OvrUpdatedEvent;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OvrEngineService
{
    public function __construct(
        protected \App\Domain\Services\ProfileCompletenessCalculator $completenessCalculator
    ) {}

    /**
     * Skill mappings for attribute evaluations.
     */
    protected array $skillCategories = [
        'bck' => ['PHP', 'Laravel', 'Node.js', 'Go', 'Python', 'Ruby', 'C#', 'Java', 'NestJS', 'Express', 'SQL'],
        'frt' => ['React', 'Next.js', 'TypeScript', 'JavaScript', 'TailwindCSS', 'CSS', 'HTML', 'Vue', 'Angular', 'Svelte'],
        'dat' => ['Docker', 'AWS', 'Cloudflare', 'GitHub Actions', 'Nginx', 'PostgreSQL', 'Redis', 'MySQL', 'MongoDB', 'CI/CD', 'Kubernetes']
    ];

    /**
     * Calcula e atualiza o OVR e atributos do card de um perfil.
     */
    public function calculateAndUpdateOvr(Profile $profile): int
    {
        $stats = $profile->stats()->firstOrCreate([]);

        // 1. Calcular completude do perfil
        $completeness = $this->completenessCalculator->calculate($profile);
        $profile->profile_completeness = $completeness;

        // 2. Calcula sub-scores do OVR 2.0
        $techDnaScore = $this->calculateTechDnaScore($profile);
        $projScore = $this->calculateProjectsScore($profile, $stats);
        $githubScore = $this->calculateOpenSourceScore($profile, $stats);
        $eduScore = $this->calculateEducationScore($profile, $stats);
        $commScore = $this->calculateCommunityScore($profile, $stats);

        // 3. OVR 2.0 Ponderado: Tech DNA (35%), Projects (25%), GitHub (20%), Education (15%), Community (5%)
        $ovr = (int) round(
            ($techDnaScore * 0.35) +
            ($projScore * 0.25) +
            ($githubScore * 0.20) +
            ($eduScore * 0.15) +
            ($commScore * 0.05)
        );

        // Garante que o OVR fica entre 1 e 99 (estilo FIFA/TCG)
        $ovr = max(1, min(99, $ovr));
        $oldOvr = $profile->ovr;

        DB::transaction(function () use ($profile, $stats, $ovr, $oldOvr) {
            // 5. Atualizar no perfil
            $profile->ovr = $ovr;
            $profile->save();

            // 6. Atualizar telemetria cache
            $stats->update([
                'current_ovr' => $ovr
            ]);

            // 7. Salvar histórico diário
            $today = Carbon::today()->toDateString();
            ProfileRatingsHistory::updateOrCreate(
                [
                    'profile_id' => $profile->id,
                    'recorded_at' => $today,
                ],
                [
                    'ovr' => $ovr,
                    'xp' => $profile->xp,
                    'level' => $profile->level,
                ]
            );

            Log::info("OVR recalculado para o perfil {$profile->id}: {$oldOvr} -> {$ovr}");

            // 8. Se mudou de OVR, dispara evento Reverb
            if ($ovr !== $oldOvr) {
                event(new OvrUpdatedEvent($profile, $ovr, $oldOvr, $this->getCardMetadata($ovr)));
            }
        });

        return $ovr;
    }

    /**
     * Pesos padrão do algoritmo.
     */
    public function getDefaultWeights(): array
    {
        return [
            'experience' => 30,
            'projects' => 25,
            'skills_badges' => 15,
            'github' => 15,
            'education' => 10,
            'completeness' => 5,
        ];
    }

    /**
     * Retorna os metadados do card com base no OVR.
     */
    public function getCardMetadata(int $ovr): array
    {
        if ($ovr >= 85) { // Diamond/Legendary
            return [
                'tier' => 'Diamond',
                'color' => '#0EA5E9',
                'gradient' => 'from-sky-500 via-blue-500 to-indigo-600',
                'glow' => 'shadow-[0_0_20px_rgba(14,165,233,0.6)]',
                'effect' => 'light-beam'
            ];
        } elseif ($ovr >= 75) {
            return [
                'tier' => 'Gold',
                'color' => '#F59E0B',
                'gradient' => 'from-yellow-500 via-amber-500 to-orange-500',
                'glow' => 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
                'effect' => 'gold-aura'
            ];
        } elseif ($ovr >= 65) {
            return [
                'tier' => 'Silver',
                'color' => '#94A3B8',
                'gradient' => 'from-slate-400 to-slate-300',
                'glow' => 'shadow-[0_0_10px_rgba(148,163,184,0.4)]',
                'effect' => 'silver-glow'
            ];
        } else {
            return [
                'tier' => 'Bronze',
                'color' => '#B45309',
                'gradient' => 'from-amber-800 to-amber-700',
                'glow' => 'shadow-sm',
                'effect' => 'none'
            ];
        }
    }

    /**
     * Retorna a distribuição detalhada dos sub-scores do OVR de 7 atributos para o Card.
     */
    public function getOvrBreakdown(Profile $profile): array
    {
        $stats = $profile->stats()->firstOrCreate([]);
        return [
            'bck' => $this->calculateBackendScore($profile, $stats),
            'frt' => $this->calculateFrontendScore($profile, $stats),
            'dat' => $this->calculateDevOpsScore($profile, $stats),
            'oss' => $this->calculateOpenSourceScore($profile, $stats),
            'com' => $this->calculateCommunityScore($profile, $stats),
            'exp' => $this->calculateExperienceScore($profile, $stats),
            'edu' => $this->calculateEducationScore($profile, $stats),
        ];
    }

    /**
     * Calcula pontuação de Backend (BCK).
     */
    private function calculateBackendScore(Profile $profile, $stats): int
    {
        $skills = $profile->skills()->get();
        $backendSkills = $skills->filter(fn($s) => in_array($s->name, $this->skillCategories['bck']));

        if ($backendSkills->isEmpty() && $profile->projects()->count() === 0) {
            return 0;
        }

        $base = $backendSkills->isEmpty() ? 10 : $backendSkills->avg('pivot.proficiency_level');
        $projects = $profile->projects()->get();
        $backendProjCount = 0;
        foreach ($projects as $proj) {
            $matched = false;
            foreach ($this->skillCategories['bck'] as $term) {
                if (stripos($proj->title, $term) !== false || stripos($proj->description, $term) !== false) {
                    $matched = true;
                    break;
                }
            }
            if ($matched) {
                $backendProjCount++;
            }
        }
        $bonus = min(30, $backendProjCount * 5);

        return (int) min(100, round($base + $bonus));
    }

    /**
     * Calcula pontuação de Frontend (FRT).
     */
    private function calculateFrontendScore(Profile $profile, $stats): int
    {
        $skills = $profile->skills()->get();
        $frontendSkills = $skills->filter(fn($s) => in_array($s->name, $this->skillCategories['frt']));

        if ($frontendSkills->isEmpty() && $profile->projects()->count() === 0) {
            return 0;
        }

        $base = $frontendSkills->isEmpty() ? 10 : $frontendSkills->avg('pivot.proficiency_level');
        $projects = $profile->projects()->get();
        $frontendProjCount = 0;
        foreach ($projects as $proj) {
            $matched = false;
            foreach ($this->skillCategories['frt'] as $term) {
                if (stripos($proj->title, $term) !== false || stripos($proj->description, $term) !== false) {
                    $matched = true;
                    break;
                }
            }
            if ($matched) {
                $frontendProjCount++;
            }
        }
        $bonus = min(30, $frontendProjCount * 5);

        return (int) min(100, round($base + $bonus));
    }

    /**
     * Calcula pontuação de DevOps & Database (DAT).
     */
    private function calculateDevOpsScore(Profile $profile, $stats): int
    {
        $skills = $profile->skills()->get();
        $devopsSkills = $skills->filter(fn($s) => in_array($s->name, $this->skillCategories['dat']));

        if ($devopsSkills->isEmpty() && $profile->projects()->count() === 0) {
            return 0;
        }

        $base = $devopsSkills->isEmpty() ? 10 : $devopsSkills->avg('pivot.proficiency_level');

        $bonus = 0;
        if ($stats->total_projects > 0) {
            $projects = $profile->projects()->get();
            $dockerCount = 0;
            foreach ($projects as $proj) {
                if (stripos($proj->description, 'docker') !== false || stripos($proj->description, 'k8s') !== false) {
                    $dockerCount++;
                }
            }
            $bonus += min(15, $dockerCount * 5);
        }

        if ($stats->github_connected) {
            $bonus += 15;
        }

        return (int) min(100, round($base + $bonus));
    }

    /**
     * Calcula pontuação de Open Source & GitHub (OSS).
     */
    private function calculateOpenSourceScore(Profile $profile, $stats): int
    {
        if (!$stats->github_connected) {
            return 0;
        }

        $base = 20;
        $commitsPoints = min(40, floor($stats->github_commits / 10));
        $reposPoints = min(20, $stats->github_repositories * 5);
        $starsPoints = min(20, $stats->github_stars * 2);

        return (int) min(100, $base + $commitsPoints + $reposPoints + $starsPoints);
    }

    /**
     * Calcula pontuação de Comunidade (COM).
     */
    private function calculateCommunityScore(Profile $profile, $stats): int
    {
        if ($stats->profile_views === 0 && $stats->profile_shares === 0) {
            return 0;
        }

        $base = 10;
        $viewsPoints = min(40, floor($stats->profile_views / 15));
        $sharesPoints = min(30, $stats->profile_shares * 10);
        $communityPoints = min(20, $stats->community_points);

        return (int) min(100, $base + $viewsPoints + $sharesPoints + $communityPoints);
    }

    /**
     * Calcula pontuação de Experiência (EXP / e para OVR).
     */
    private function calculateExperienceScore(Profile $profile, $stats): int
    {
        $experiences = $profile->experiences()->get();

        if ($experiences->isEmpty()) {
            return 0;
        }

        $totalMonths = 0;
        foreach ($experiences as $exp) {
            $startDate = Carbon::parse($exp->start_date);
            $endDate = $exp->is_current ? Carbon::now() : Carbon::parse($exp->end_date);
            $totalMonths += max(1, $startDate->diffInMonths($endDate));
        }

        return (int) min(100, round(($totalMonths / 60) * 100));
    }

    /**
     * Calcula pontuação de Projetos (para OVR).
     */
    private function calculateProjectsScore(Profile $profile, $stats): int
    {
        $projects = $profile->projects()->get();

        if ($projects->isEmpty()) {
            return 0;
        }

        $totalScore = 0;
        foreach ($projects as $proj) {
            $score = 10;
            if ($proj->is_featured) $score += 10;
            if (!empty($proj->repository_url)) $score += 10;
            if (!empty($proj->demo_url)) $score += 10;
            if (!empty($proj->cover_image_url)) $score += 10;
            $totalScore += $score;
        }

        return (int) min(100, $totalScore);
    }

    /**
     * Calcula pontuação de Habilidades e Conquistas (para OVR).
     */
    private function calculateSkillsBadgesScore(Profile $profile, $stats): int
    {
        $skills = $profile->skills()->get();
        $badgesCount = $profile->badges()->count();

        $skillsAvg = 0;
        if ($skills->isNotEmpty()) {
            $skillsAvg = $skills->avg('pivot.proficiency_level') ?? 0;
        }

        $score = ($skillsAvg * 0.7) + min(30, $badgesCount * 10);

        return (int) min(100, round($score));
    }

    /**
     * Calcula pontuação de atividade do GitHub (legada).
     */
    private function calculateLegacyGithubScore(Profile $profile, $stats): int
    {
        if (empty($profile->github_url)) {
            return 0;
        }

        $projects = $profile->projects()->get();
        $githubProjectsCount = $projects->filter(function ($proj) {
            return !empty($proj->repository_url) && stripos($proj->repository_url, 'github.com') !== false;
        })->count();

        $score = ($githubProjectsCount * 15) + 25;

        return (int) min(100, $score);
    }

    /**
     * Calcula pontuação de Formação Acadêmica (EDU / e para OVR).
     */
    private function calculateEducationScore(Profile $profile, $stats): int
    {
        $educationsCount = $profile->educations()->count();
        return (int) min(100, $educationsCount * 40);
    }

    /**
     * Calcula pontuação de Formação Acadêmica (legada).
     */
    private function calculateLegacyEducationScore(Profile $profile, $stats): int
    {
        $educationsCount = $profile->educations()->count();
        return (int) min(100, $educationsCount * 50);
    }

    /**
     * Calcula o score de Tech DNA (média harmônica dos top 3 scores de tecnologia).
     */
    public function calculateTechDnaScore(Profile $profile): int
    {
        $topScores = \Illuminate\Support\Facades\DB::table('technology_scores')
            ->where('profile_id', $profile->id)
            ->orderBy('score', 'desc')
            ->limit(3)
            ->pluck('score')
            ->toArray();

        $validScores = array_filter($topScores, fn($s) => $s > 0);
        $n = count($validScores);

        if ($n === 0) {
            return 0;
        }

        $sumReciprocals = 0;
        foreach ($validScores as $score) {
            $sumReciprocals += 1.0 / $score;
        }

        return (int) round($n / $sumReciprocals);
    }
}
