<?php

namespace App\Domain\Gamification\Services\Reputation;

use App\Infrastructure\Models\UserSkillScore;
use Illuminate\Support\Collection;

class SkillScoreCalculator
{
    /**
     * Calcula os scores de habilidades (Skill Scores) com base nos pesos normalizados.
     */
    public function calculate(string $userId, Collection $normalizedWeights): Collection
    {
        // Agrupa as evidências normalizadas por tecnologia
        $grouped = $normalizedWeights->groupBy('technology_id');

        $skillScores = collect();

        foreach ($grouped as $techId => $items) {
            $rawSum = 0.0;
            $evidenceCount = $items->count();

            foreach ($items as $item) {
                // Fatores individuais: peso_base * recencia * verificação * profundidade
                $itemScore = $item->base_weight * $item->recency_factor * $item->verification_factor * $item->depth_factor;
                $rawSum += $itemScore;
            }

            // Multiplicador de quantidade de evidências: min(1.0, ln(1 + n_evidences) / ln(5))
            // Usamos log natural (ln) conforme a fórmula
            $countMultiplier = min(1.0, log(1 + $evidenceCount) / log(5.0));

            // Fator de diversidade baseado nos tipos únicos de evidências: min(1.0, ln(1 + unique_types) / ln(4))
            $uniqueTypes = $items->pluck('evidence_type')->unique()->count();
            $diversityFactor = min(1.0, log(1 + $uniqueTypes) / log(4.0));

            $rawScoreWithMultipliers = $rawSum * $countMultiplier * $diversityFactor;

            // Curva assintótica de normalização (0 a 99)
            // Impede crescimento linear infinito e modela platô de aprendizado sênior
            $score = 99.0 * (1.0 - exp(-$rawScoreWithMultipliers / 30.0));

            // Arredonda para 1 casa decimal
            $score = round($score, 1);

            $skillScores->push(new UserSkillScore([
                'user_id' => $userId,
                'technology_id' => $techId,
                'score' => $score,
                'evidence_count' => $evidenceCount,
                'score_breakdown' => [
                    'raw_score' => round($rawSum, 2),
                    'count_multiplier' => round($countMultiplier, 2),
                    'diversity_factor' => round($diversityFactor, 2),
                    'raw_final' => round($rawScoreWithMultipliers, 2),
                ],
                'engine_version' => '2.0',
                'computed_at' => now(),
            ]));
        }

        return $skillScores;
    }
}
