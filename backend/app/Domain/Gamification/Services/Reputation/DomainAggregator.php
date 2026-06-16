<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Collection;

class DomainAggregator
{
    /**
     * Agrega os scores de habilidades em competências e domínios.
     */
    public function aggregate(string $userId, Collection $skillScores): Collection
    {
        // Retorna uma coleção vazia na Fase 0 (esqueleto)
        return collect();
    }
}
