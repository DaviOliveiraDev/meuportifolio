<?php

namespace App\Domain\Gamification\Services;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Title;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TitleEvaluatorService
{
    /**
     * Avalia e concede os títulos baseados nos badges desbloqueados pelo usuário.
     */
    public function evaluateAndAwardTitles(Profile $profile): void
    {
        $unlockedBadgeIds = $profile->badges()->pluck('badges.id')->toArray();
        $unlockedTitleIds = $profile->titles()->pluck('titles.id')->toArray();

        $titles = Title::where('is_active', true)->whereNotNull('unlock_badge_id')->get();

        foreach ($titles as $title) {
            // Se já possui o título, pula
            if (in_array($title->id, $unlockedTitleIds)) {
                continue;
            }

            // Se possui a conquista que desbloqueia o título
            if (in_array($title->unlock_badge_id, $unlockedBadgeIds)) {
                DB::transaction(function () use ($profile, $title) {
                    $profile->titles()->attach($title->id, ['unlocked_at' => now()]);
                    Log::info("Título desbloqueado para o perfil {$profile->id}: {$title->name}");
                });
            }
        }
    }
}
