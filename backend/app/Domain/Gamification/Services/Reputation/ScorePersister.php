<?php

namespace App\Domain\Gamification\Services\Reputation;

use App\Infrastructure\Models\UserReputationScore;
use Illuminate\Support\Facades\DB;

class ScorePersister
{
    /**
     * Persiste os scores recalculados no banco de dados e retorna o resultado.
     */
    public function persist(string $userId, array $data): UserReputationResult
    {
        return DB::transaction(function () use ($userId, $data) {
            $existing = UserReputationScore::find($userId);
            $previousOvr = $existing ? (float) $existing->ovr : 0.0;
            $previousComputedAt = $existing ? $existing->computed_at : null;

            $dna = $data['dna'] ?? [];

            $record = UserReputationScore::updateOrCreate(
                ['user_id' => $userId],
                [
                    'ovr' => $data['ovr'] ?? 0.0,
                    'recruiter_score' => $data['recruiter_score'] ?? 0.0,
                    'primary_domain_id' => $dna['primary_domain_id'] ?? null,
                    'secondary_domain_id' => $dna['secondary_domain_id'] ?? null,
                    'profile_label' => $dna['profile_label'] ?? 'Generalist Engineer',
                    'engine_version' => '2.0',
                    'computed_at' => now(),
                    'previous_ovr' => $previousOvr,
                    'previous_computed_at' => $previousComputedAt,
                ]
            );

            return new UserReputationResult(
                userId: $userId,
                ovr: (float) $record->ovr,
                recruiterScore: (float) $record->recruiter_score,
                previousOvr: $previousOvr,
                data: $data
            );
        });
    }
}
