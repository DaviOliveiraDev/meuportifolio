<?php

namespace App\Domain\Gamification\Services;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Cosmetic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CosmeticEvaluatorService
{
    /**
     * Avalia e concede os cosméticos do card baseados nos badges desbloqueados e OVR.
     */
    public function evaluateAndAwardCosmetics(Profile $profile): void
    {
        $unlockedBadgeIds = $profile->badges()->pluck('badges.id')->toArray();
        $unlockedCosmeticIds = $profile->cosmetics()->pluck('cosmetics.id')->toArray();

        $cosmetics = Cosmetic::all();

        foreach ($cosmetics as $cosmetic) {
            // Se já possui o cosmético, pula
            if (in_array($cosmetic->id, $unlockedCosmeticIds)) {
                continue;
            }

            $shouldUnlock = false;

            // 1. Verificar se desbloqueia por Badge
            if ($cosmetic->unlock_badge_id && in_array($cosmetic->unlock_badge_id, $unlockedBadgeIds)) {
                $shouldUnlock = true;
            }

            // 2. Verificar se desbloqueia por OVR diretamente (caso de molduras de tier)
            if (!$cosmetic->unlock_badge_id) {
                if ($cosmetic->name === 'Moldura Silver' && $profile->ovr >= 65) {
                    $shouldUnlock = true;
                } elseif ($cosmetic->name === 'Moldura Gold' && $profile->ovr >= 75) {
                    $shouldUnlock = true;
                } elseif ($cosmetic->name === 'Moldura Diamond' && $profile->ovr >= 85) {
                    $shouldUnlock = true;
                } elseif ($cosmetic->name === 'Moldura Legendary' && $profile->ovr >= 95) {
                    $shouldUnlock = true;
                } elseif ($cosmetic->name === 'Moldura Bronze') {
                    $shouldUnlock = true; // Bronze é padrão e liberado por padrão
                }
            }

            if ($shouldUnlock) {
                DB::transaction(function () use ($profile, $cosmetic) {
                    $profile->cosmetics()->attach($cosmetic->id, ['unlocked_at' => now()]);
                    Log::info("Cosmético desbloqueado para o perfil {$profile->id}: {$cosmetic->name}");
                });
            }
        }
    }
}
