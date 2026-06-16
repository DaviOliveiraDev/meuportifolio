<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Collection;

class OVRCalculator
{
    /**
     * Calcula o OVR (Overall Rating) do desenvolvedor.
     */
    public function calculate(string $userId, Collection $domainScores, Collection $evidences): float
    {
        // Retorna zero/mock na Fase 0 (esqueleto)
        return 0.0;
    }
}
