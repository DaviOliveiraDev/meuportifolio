<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Collection;

class DNAProfileBuilder
{
    /**
     * Define o perfil de DNA tecnológico do desenvolvedor.
     */
    public function build(string $userId, Collection $domainScores, Collection $skillScores): array
    {
        // Retorna esqueleto/mock na Fase 0
        return [
            'primary_domain_id' => null,
            'secondary_domain_id' => null,
            'profile_label' => 'Generalist Engineer',
        ];
    }
}
