<?php

namespace App\Domain\Services;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\ProfileRatingsHistory;
use App\Infrastructure\Models\ScoringConfig;
use Illuminate\Support\Carbon;

class OvrEngineService
{
    public function __construct(
        protected ProfileCompletenessCalculator $completenessCalculator
    ) {}

    /**
     * Calcula e atualiza o OVR de um perfil.
     */
    public function calculateAndUpdateOvr(Profile $profile): int
    {
        // 1. Calcula completude do perfil (atualiza a coluna)
        $completeness = $this->completenessCalculator->calculate($profile);
        $profile->profile_completeness = $completeness;

        // 2. Busca configuração ativa ou usa padrões
        $config = ScoringConfig::where('is_active', true)->first();
        $weights = $config?->weights ?? $this->getDefaultWeights();

        // 3. Calcula sub-scores
        $expScore = $this->calculateExperienceScore($profile);
        $projScore = $this->calculateProjectsScore($profile);
        $skillBadgeScore = $this->calculateSkillsBadgesScore($profile);
        $githubScore = $this->calculateGithubScore($profile);
        $eduScore = $this->calculateEducationScore($profile);
        $completeScore = $completeness; // 0-100

        // 4. Calcula OVR final ponderado
        $weightedSum = 
            ($expScore * ($weights['experience'] ?? 30)) +
            ($projScore * ($weights['projects'] ?? 25)) +
            ($skillBadgeScore * ($weights['skills_badges'] ?? 15)) +
            ($githubScore * ($weights['github'] ?? 15)) +
            ($eduScore * ($weights['education'] ?? 10)) +
            ($completeScore * ($weights['completeness'] ?? 5));

        $totalWeight = 
            ($weights['experience'] ?? 30) +
            ($weights['projects'] ?? 25) +
            ($weights['skills_badges'] ?? 15) +
            ($weights['github'] ?? 15) +
            ($weights['education'] ?? 10) +
            ($weights['completeness'] ?? 5);

        $ovr = (int) round($weightedSum / $totalWeight);

        // Garante que o OVR fica entre 1 e 99 (estilo FIFA/TCG)
        $ovr = max(1, min(99, $ovr));

        $profile->ovr = $ovr;
        $profile->save();

        // 5. Registra no histórico (máximo um por dia)
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
     * Calcula pontuação de Experiência (Base: meses totais / 60 meses = 5 anos para pontuação máxima).
     */
    private function calculateExperienceScore(Profile $profile): int
    {
        $experiences = $profile->relationLoaded('experiences')
            ? $profile->experiences
            : $profile->experiences()->get();

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
     * Calcula pontuação de Projetos (Base: completude dos projetos).
     */
    private function calculateProjectsScore(Profile $profile): int
    {
        $projects = $profile->relationLoaded('projects')
            ? $profile->projects
            : $profile->projects()->get();

        if ($projects->isEmpty()) {
            return 0;
        }

        $totalScore = 0;
        foreach ($projects as $proj) {
            $score = 10; // Base
            if ($proj->is_featured) $score += 10;
            if (!empty($proj->repository_url)) $score += 10;
            if (!empty($proj->demo_url)) $score += 10;
            if (!empty($proj->cover_image_url)) $score += 10;
            $totalScore += $score;
        }

        return (int) min(100, $totalScore);
    }

    /**
     * Calcula pontuação de Habilidades e Conquistas (Médias de proficiência + bônus de badges).
     */
    private function calculateSkillsBadgesScore(Profile $profile): int
    {
        $skills = $profile->relationLoaded('skills')
            ? $profile->skills
            : $profile->skills()->get();

        $badgesCount = $profile->relationLoaded('badges')
            ? $profile->badges->count()
            : $profile->badges()->count();

        $skillsAvg = 0;
        if ($skills->isNotEmpty()) {
            $skillsAvg = $skills->avg('pivot.proficiency_level') ?? 0;
        }

        // Média de skills representa 70% da pontuação, e badges representam 30% (cada badge dá +10 pontos, max 30)
        $score = ($skillsAvg * 0.7) + min(30, $badgesCount * 10);

        return (int) min(100, round($score));
    }

    /**
     * Calcula pontuação de atividade do GitHub.
     */
    private function calculateGithubScore(Profile $profile): int
    {
        if (empty($profile->github_url)) {
            return 0;
        }

        $projects = $profile->relationLoaded('projects')
            ? $profile->projects
            : $profile->projects()->get();

        $githubProjectsCount = $projects->filter(function ($proj) {
            return !empty($proj->repository_url) && stripos($proj->repository_url, 'github.com') !== false;
        })->count();

        // 15 pontos por projeto sincronizado + 25 pontos fixos por ter a URL conectada
        $score = ($githubProjectsCount * 15) + 25;

        return (int) min(100, $score);
    }

    /**
     * Calcula pontuação de Formação Acadêmica (Cada entrada vale 50 pontos).
     */
    private function calculateEducationScore(Profile $profile): int
    {
        $educationsCount = $profile->relationLoaded('educations')
            ? $profile->educations->count()
            : $profile->educations()->count();

        return (int) min(100, $educationsCount * 50);
    }
}
