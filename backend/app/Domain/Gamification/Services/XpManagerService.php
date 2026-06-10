<?php

namespace App\Domain\Gamification\Services;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\ProfileXpHistory;
use App\Domain\Gamification\Events\LevelUpEvent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class XpManagerService
{
    /**
     * Determina o nível, o XP acumulado no nível atual, o XP necessário para o próximo nível
     * e o progresso percentual baseado no XP total acumulado.
     *
     * Fórmula: XP necessário para nível L = floor(100 * pow(L, 1.5))
     */
    public function determineLevel(int $totalXp): array
    {
        $level = 1;
        $xpInCurrentLevel = $totalXp;

        while (true) {
            $xpRequired = (int) floor(100 * pow($level, 1.5));
            if ($xpInCurrentLevel >= $xpRequired) {
                $xpInCurrentLevel -= $xpRequired;
                $level++;
            } else {
                break;
            }
        }

        $xpRequiredForNext = (int) floor(100 * pow($level, 1.5));
        $percentage = $xpRequiredForNext > 0 ? (int) round(($xpInCurrentLevel / $xpRequiredForNext) * 100) : 0;

        return [
            'level' => $level,
            'xp_in_level' => $xpInCurrentLevel,
            'xp_required_for_next' => $xpRequiredForNext,
            'percentage' => min(100, max(0, $percentage)),
        ];
    }

    /**
     * Concede XP ao perfil por uma ação e registra histórico de transação de XP.
     */
    public function awardXp(Profile $profile, string $action, int $amount): void
    {
        if ($amount <= 0) {
            return;
        }

        DB::transaction(function () use ($profile, $action, $amount) {
            // 1. Registrar no histórico de transações de XP
            ProfileXpHistory::create([
                'profile_id' => $profile->id,
                'action' => $action,
                'amount' => $amount,
            ]);

            // 2. Incrementar XP do perfil
            $oldXp = $profile->xp;
            $newXp = $oldXp + $amount;

            $levelData = $this->determineLevel($newXp);
            $oldLevel = $profile->level;

            $profile->xp = $newXp;
            $profile->level = $levelData['level'];
            $profile->save();

            // 3. Atualizar telemetria cache
            $stats = $profile->stats()->firstOrCreate([]);
            $stats->update([
                'current_xp' => $newXp,
                'current_level' => $levelData['level'],
            ]);

            Log::info("XP concedido ao perfil {$profile->id}: +{$amount} XP por '{$action}'. Novo total: {$newXp}. Nível antigo: {$oldLevel}, Novo nível: {$profile->level}");

            // 4. Se subiu de nível, dispara evento
            if ($profile->level > $oldLevel) {
                event(new LevelUpEvent($profile, $profile->level, $oldLevel));
            }
        });
    }
}
