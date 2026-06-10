<?php

namespace App\Domain\Gamification\Services;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Technology;
use App\Infrastructure\Models\TechnologyEvidence;
use App\Infrastructure\Models\TechnologyScore;
use App\Infrastructure\Models\TechnologyScoreHistory;
use App\Infrastructure\Models\TechnologyRanking;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TechDnaEngineService
{
    /**
     * Calcula e atualiza todo o Tech DNA (scores, evidências, histórico) de um desenvolvedor.
     */
    public function calculateProfileTechDna(Profile $profile): void
    {
        $profileId = $profile->id;
        Log::info("TechDnaEngine: Iniciando cálculo do Tech DNA para o perfil: {$profileId}");

        DB::transaction(function () use ($profile, $profileId) {
            // 1. Limpar evidências anteriores para este perfil (evita órfãos)
            TechnologyEvidence::where('profile_id', $profileId)->delete();

            // 2. Coletar e criar novas evidências
            $this->generateProjectEvidences($profile);
            $this->generateExperienceEvidences($profile);
            $this->generateEducationEvidences($profile);
            $this->generateGithubEvidences($profile);
            $this->generateBadgeEvidences($profile);

            // 3. Consolidar pontuações
            $this->consolidateScores($profile);
        });

        Log::info("TechDnaEngine: Cálculo concluído com sucesso para o perfil: {$profileId}");
    }

    /**
     * Gera evidências baseadas nos projetos do portfólio.
     */
    protected function generateProjectEvidences(Profile $profile): void
    {
        $projects = $profile->projects()->with('technologies')->get();

        foreach ($projects as $project) {
            foreach ($project->technologies as $tech) {
                // Featured vale 15 pontos, normal vale 8 pontos
                $points = $project->is_featured ? 15.00 : 8.00;

                TechnologyEvidence::create([
                    'profile_id' => $profile->id,
                    'technology_id' => $tech->id,
                    'source_type' => 'project',
                    'source_id' => $project->id,
                    'points_awarded' => $points,
                    'evidence_metadata' => [
                        'project_title' => $project->title,
                        'is_featured' => $project->is_featured,
                    ],
                ]);
            }
        }
    }

    /**
     * Gera evidências baseadas nas experiências profissionais com decaimento temporal.
     */
    protected function generateExperienceEvidences(Profile $profile): void
    {
        $experiences = $profile->experiences()->with('technologies')->get();

        foreach ($experiences as $exp) {
            $startDate = Carbon::parse($exp->start_date);
            $endDate = $exp->is_current ? Carbon::now() : Carbon::parse($exp->end_date);
            $months = max(1, $startDate->diffInMonths($endDate));

            // Fórmula: 15 pontos base + 0.5 ponto por mês de experiência
            $basePoints = 15.00 + ($months * 0.50);

            // Cálculo do decaimento temporal (Decay)
            $decay = 1.00;
            if (!$exp->is_current) {
                $yearsAgo = $endDate->diffInYears(Carbon::now());
                if ($yearsAgo >= 1.00 && $yearsAgo <= 3.00) {
                    $decay = 1.00 - ($yearsAgo * 0.15); // decai 15% ao ano
                } elseif ($yearsAgo > 3.00) {
                    $decay = 0.50; // limite inferior de retenção histórica
                }
            }

            $pointsAwarded = $basePoints * $decay;

            foreach ($exp->technologies as $tech) {
                TechnologyEvidence::create([
                    'profile_id' => $profile->id,
                    'technology_id' => $tech->id,
                    'source_type' => 'experience',
                    'source_id' => $exp->id,
                    'points_awarded' => $pointsAwarded,
                    'evidence_metadata' => [
                        'company' => $exp->company,
                        'role' => $exp->role,
                        'duration_months' => $months,
                        'decay_applied' => $decay,
                    ],
                ]);
            }
        }
    }

    /**
     * Gera evidências baseadas em formação acadêmica e cursos.
     */
    protected function generateEducationEvidences(Profile $profile): void
    {
        $educations = $profile->educations()->with('technologies')->get();

        foreach ($educations as $edu) {
            // Verifica se é um curso superior / graduação / mestrado (+20) ou curso simples (+10)
            $isDegree = preg_match('/mestrado|graduação|bacharel|doutorado|pós|mba|faculdade|universidade|college|university|degree/i', $edu->course);
            $points = $isDegree ? 20.00 : 10.00;

            foreach ($edu->technologies as $tech) {
                TechnologyEvidence::create([
                    'profile_id' => $profile->id,
                    'technology_id' => $tech->id,
                    'source_type' => 'education',
                    'source_id' => $edu->id,
                    'points_awarded' => $points,
                    'evidence_metadata' => [
                        'institution' => $edu->institution,
                        'course' => $edu->course,
                        'is_degree' => $isDegree,
                    ],
                ]);
            }
        }
    }

    /**
     * Distribui estatísticas globais do GitHub para as tecnologias dos repositórios importados.
     */
    protected function generateGithubEvidences(Profile $profile): void
    {
        $stats = $profile->stats;
        if (!$stats || !$stats->github_connected) {
            return;
        }

        // Filtra projetos que vieram do GitHub
        $githubProjects = $profile->projects()
            ->where('repository_url', 'like', '%github.com%')
            ->with('technologies')
            ->get();

        $projectCount = $githubProjects->count();
        if ($projectCount === 0) {
            return;
        }

        // Distribui commits e estrelas uniformemente entre os projetos importados do GitHub
        $commitsPerProject = floor($stats->github_commits / $projectCount);
        $starsPerProject = floor($stats->github_stars / $projectCount);

        foreach ($githubProjects as $project) {
            // Fórmula do GitHub: +5 por repo ativo, +1 por 10 commits, +2 por star
            $points = 5.00 + ($commitsPerProject * 0.10) + ($starsPerProject * 2.00);

            foreach ($project->technologies as $tech) {
                TechnologyEvidence::create([
                    'profile_id' => $profile->id,
                    'technology_id' => $tech->id,
                    'source_type' => 'github',
                    'source_id' => $project->id,
                    'points_awarded' => $points,
                    'evidence_metadata' => [
                        'repo_name' => $project->title,
                        'allocated_commits' => $commitsPerProject,
                        'allocated_stars' => $starsPerProject,
                    ],
                ]);
            }
        }
    }

    /**
     * Gera evidências baseadas nas badges/conquistas conquistadas.
     */
    protected function generateBadgeEvidences(Profile $profile): void
    {
        $badges = $profile->badges()->get();
        if ($badges->isEmpty()) {
            return;
        }

        $allTechnologies = Technology::all();

        foreach ($badges as $badge) {
            foreach ($allTechnologies as $tech) {
                // Identifica se a badge é específica desta tecnologia comparando o nome/descrição
                if (stripos($badge->name, $tech->name) !== false) {
                    // Pontos baseados na raridade da Badge
                    $points = 10.00; // comum
                    if ($badge->rarity === 'lendaria' || $badge->rarity === 'mitica') {
                        $points = 25.00;
                    } elseif ($badge->rarity === 'epica') {
                        $points = 20.00;
                    } elseif ($badge->rarity === 'rara') {
                        $points = 15.00;
                    }

                    TechnologyEvidence::create([
                        'profile_id' => $profile->id,
                        'technology_id' => $tech->id,
                        'source_type' => 'badge',
                        'source_id' => $badge->id,
                        'points_awarded' => $points,
                        'evidence_metadata' => [
                            'badge_name' => $badge->name,
                            'rarity' => $badge->rarity,
                        ],
                    ]);
                }
            }
        }
    }

    /**
     * Consolida todas as evidências em um score final de 1 a 100 com Nível de Confiança.
     */
    protected function consolidateScores(Profile $profile): void
    {
        // 1. Obter todas as tecnologias autodeclaradas
        $declaredTechIds = DB::table('profile_technologies')
            ->where('profile_id', $profile->id)
            ->pluck('technology_id')
            ->toArray();

        // 2. Agrupar todas as evidências criadas
        $evidences = TechnologyEvidence::where('profile_id', $profile->id)
            ->select('technology_id', 'source_type', DB::raw('SUM(points_awarded) as total_points'))
            ->groupBy('technology_id', 'source_type')
            ->get()
            ->groupBy('technology_id');

        // União de todas as tecnologias a serem processadas (autodeclaradas ou com evidência)
        $allTechIds = array_unique(array_merge($declaredTechIds, $evidences->keys()->toArray()));

        $today = Carbon::today()->toDateString();

        foreach ($allTechIds as $techId) {
            $techEvidences = $evidences->get($techId) ?? collect();

            // Auto-declaração garante 10 pontos iniciais
            $scoreParts = [
                'declared' => in_array($techId, $declaredTechIds) ? 10.00 : 0.00,
                'project' => 0.00,
                'experience' => 0.00,
                'education' => 0.00,
                'github' => 0.00,
                'badge' => 0.00,
            ];

            foreach ($techEvidences as $ev) {
                $scoreParts[$ev->source_type] = (float) $ev->total_points;
            }

            // Aplicar tetos de categoria (Caps) conforme modelo arquitetado
            $scoreParts['project'] = min(30.00, $scoreParts['project']);
            $scoreParts['experience'] = min(45.00, $scoreParts['experience']);
            $scoreParts['education'] = min(20.00, $scoreParts['education']);
            $scoreParts['github'] = min(35.00, $scoreParts['github']);
            $scoreParts['badge'] = min(25.00, $scoreParts['badge']);

            // Soma final
            $rawScore = array_sum($scoreParts);
            $finalScore = min(100, (int) round($rawScore));

            // Determinar Nível de Confiança
            $confidence = 'Declared';
            if ($finalScore > 10 && $finalScore <= 40) {
                $confidence = 'Verified';
            } elseif ($finalScore > 40 && $finalScore <= 75) {
                $confidence = 'Proven';
            } elseif ($finalScore > 75) {
                $confidence = 'Expert';
            }

            // Conta total de evidências físicas da tecnologia
            $evidenceCount = TechnologyEvidence::where('profile_id', $profile->id)
                ->where('technology_id', $techId)
                ->count();

            // Salva score atual
            TechnologyScore::updateOrCreate(
                [
                    'profile_id' => $profile->id,
                    'technology_id' => $techId
                ],
                [
                    'score' => $finalScore,
                    'confidence_level' => $confidence,
                    'evidence_count' => $evidenceCount,
                    'calculated_at' => Carbon::now()
                ]
            );

            // Grava histórico diário para linha do tempo
            TechnologyScoreHistory::updateOrCreate(
                [
                    'profile_id' => $profile->id,
                    'technology_id' => $techId,
                    'recorded_at' => $today
                ],
                [
                    'score' => $finalScore,
                    'confidence_level' => $confidence,
                ]
            );
        }

        // Limpa scores órfãos que possam ter sido apagados completamente do perfil
        TechnologyScore::where('profile_id', $profile->id)
            ->whereNotIn('technology_id', $allTechIds)
            ->delete();
    }

    /**
     * Recalcula os rankings globais e específicos por tecnologia para todos os perfis ativos.
     */
    public function recalculateRankings(): void
    {
        Log::info("TechDNA: Iniciando recálculo global de rankings...");

        // 1. Ranking Global (Baseado em OVR do Profile)
        $profiles = Profile::where('is_active', true)->orderBy('ovr', 'desc')->get();
        $totalProfiles = $profiles->count();

        if ($totalProfiles > 0) {
            foreach ($profiles as $index => $profile) {
                $rankPosition = $index + 1;
                $percentile = (($totalProfiles - $rankPosition) / $totalProfiles) * 100;

                // Obter ranking antigo
                $oldRanking = TechnologyRanking::where('profile_id', $profile->id)
                    ->whereNull('technology_id')
                    ->first();

                TechnologyRanking::updateOrCreate(
                    [
                        'profile_id' => $profile->id,
                        'technology_id' => null
                    ],
                    [
                        'rank_position' => $rankPosition,
                        'percentile' => round($percentile, 2),
                        'previous_position' => $oldRanking?->rank_position ?? null,
                    ]
                );
            }
        }

        // 2. Rankings por Tecnologia (Baseado nos scores na tabela technology_scores)
        $technologies = Technology::all();

        foreach ($technologies as $tech) {
            $scores = TechnologyScore::where('technology_id', $tech->id)
                ->join('profiles', 'profiles.id', '=', 'technology_scores.profile_id')
                ->where('profiles.is_active', true)
                ->orderBy('score', 'desc')
                ->select('technology_scores.*')
                ->get();

            $totalScores = $scores->count();

            if ($totalScores > 0) {
                foreach ($scores as $index => $score) {
                    $rankPosition = $index + 1;
                    $percentile = (($totalScores - $rankPosition) / $totalScores) * 100;

                    // Obter ranking antigo
                    $oldRanking = TechnologyRanking::where('profile_id', $score->profile_id)
                        ->where('technology_id', $tech->id)
                        ->first();

                    TechnologyRanking::updateOrCreate(
                        [
                            'profile_id' => $score->profile_id,
                            'technology_id' => $tech->id
                        ],
                        [
                            'rank_position' => $rankPosition,
                            'percentile' => round($percentile, 2),
                            'previous_position' => $oldRanking?->rank_position ?? null,
                        ]
                    );
                }
            }
        }

        Log::info("TechDNA: Recálculo global de rankings concluído.");
    }
}
