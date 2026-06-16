<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Collection;

class EvidenceNormalizer
{
    /**
     * Normaliza as evidências brutas em pesos utilizáveis para o cálculo.
     */
    public function normalize(Collection $evidences): Collection
    {
        return $evidences->map(function ($evidence) {
            // Mock de mapeamento inicial sem lógica complexa
            return (object) [
                'evidence_id' => $evidence->id,
                'evidence_type' => $evidence->evidence_type,
                'base_weight' => 10.00,
                'recency_factor' => 1.00,
                'verification_factor' => 1.00,
                'depth_factor' => 1.00,
            ];
        });
    }
}
