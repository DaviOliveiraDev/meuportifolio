<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Collection;

class SkillScoreCalculator
{
    /**
     * Calcula os scores de habilidades com base nas evidências normalizadas.
     */
    public function calculate(string $userId, Collection $normalizedWeights): Collection
    {
        // Retorna uma coleção vazia na Fase 0 (esqueleto)
        return collect();
    }
}
