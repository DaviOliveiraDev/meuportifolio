<?php

namespace App\Domain\Gamification\Services\Reputation;

use App\Infrastructure\Models\TechCompetency;
use App\Infrastructure\Models\TechDomain;
use App\Infrastructure\Models\UserCompetencyScore;
use App\Infrastructure\Models\UserDomainScore;
use Illuminate\Support\Collection;

class DomainAggregator
{
    /**
     * Agrega os Skill Scores em Competency Scores e Domain Scores.
     */
    public function aggregate(string $userId, Collection $skillScores): Collection
    {
        $scoresByTech = $skillScores->pluck('score', 'technology_id');

        // 1. Carrega todas as competências com seus mapeamentos de tecnologia
        $competencies = TechCompetency::with('technologies')->where('is_active', true)->get();
        $competencyScores = collect();

        foreach ($competencies as $comp) {
            $weightedSum = 0.0;
            $weightSum = 0.0;
            $techBreakdown = [];

            foreach ($comp->technologies as $tech) {
                $techScore = $scoresByTech->get($tech->id, null);
                if ($techScore !== null) {
                    $weight = (float) ($tech->pivot->contribution_weight ?? 1.0);
                    $weightedSum += $techScore * $weight;
                    $weightSum += $weight;
                    $techBreakdown[$tech->id] = $techScore;
                }
            }

            $compScore = $weightSum > 0 ? ($weightedSum / $weightSum) : 0.0;
            $compScore = round($compScore, 1);

            $competencyScores->push(new UserCompetencyScore([
                'user_id' => $userId,
                'competency_id' => $comp->id,
                'score' => $compScore,
                'top_technologies' => $techBreakdown,
                'engine_version' => '2.0',
                'computed_at' => now(),
            ]));
        }

        // 2. Carrega todos os domínios para calcular os Domain Scores
        $domains = TechDomain::where('is_active', true)->get();
        $domainScores = collect();
        $compScoresByCompId = $competencyScores->pluck('score', 'competency_id');

        foreach ($domains as $domain) {
            $domainCompetencies = $competencies->where('domain_id', $domain->id);
            $weightedSum = 0.0;
            $weightSum = 0.0;
            $competenciesAbove30Count = 0;
            $compBreakdown = [];

            foreach ($domainCompetencies as $comp) {
                $compScore = $compScoresByCompId->get($comp->id, 0.0);
                $compWeight = (float) ($comp->weight_in_domain ?? 1.0);

                $weightedSum += $compScore * $compWeight;
                $weightSum += $compWeight;

                if ($compScore > 30.0) {
                    $competenciesAbove30Count++;
                }

                $compBreakdown[$comp->id] = $compScore;
            }

            $domainScoreRaw = $weightSum > 0 ? ($weightedSum / $weightSum) : 0.0;

            // BreadthBonus = 1.0 + (0.1 * min(3, distinct_competencies_with_score_above_30))
            $breadthBonus = 1.0 + (0.1 * min(3, $competenciesAbove30Count));
            $finalDomainScore = min(99.0, $domainScoreRaw * $breadthBonus);
            $finalDomainScore = round($finalDomainScore, 1);

            // Coleta tecnologias relevantes do domínio para visualização rápida
            $domainTechs = [];
            foreach ($domainCompetencies as $comp) {
                foreach ($comp->technologies as $tech) {
                    $techScore = $scoresByTech->get($tech->id, null);
                    if ($techScore !== null) {
                        $domainTechs[$tech->name] = $techScore;
                    }
                }
            }
            arsort($domainTechs);
            $topDomainTechs = array_slice($domainTechs, 0, 5, true);

            $domainScores->push(new UserDomainScore([
                'user_id' => $userId,
                'domain_id' => $domain->id,
                'score' => $finalDomainScore,
                'top_technologies' => $topDomainTechs,
                'competency_breakdown' => $compBreakdown,
                'engine_version' => '2.0',
                'computed_at' => now(),
            ]));
        }

        return collect([
            'competencies' => $competencyScores,
            'domains' => $domainScores,
            'skills' => $skillScores,
        ]);
    }
}
