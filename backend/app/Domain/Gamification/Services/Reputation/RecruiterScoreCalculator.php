<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Collection;

class RecruiterScoreCalculator
{
    /**
     * Calcula o Recruiter Score do desenvolvedor.
     */
    public function calculate(string $userId, Collection $evidences, Collection $domainScores): float
    {
        // Retorna zero/mock na Fase 0 (esqueleto)
        return 0.0;
    }
}
