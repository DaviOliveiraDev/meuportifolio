<?php

namespace App\Domain\Services;

use App\Infrastructure\Models\Profile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class XpManagerService
{
    /**
     * Adiciona XP ao perfil do desenvolvedor por uma ação específica.
     */
    public function awardXpForAction(Profile $profile, string $action): void
    {
        $xpAmount = $this->getXpAmountForAction($action);
        if ($xpAmount <= 0) {
            return;
        }

        // Verifica limites/regras anti-abuso para ações específicas
        if (!$this->canAwardXpForAction($profile, $action)) {
            return;
        }

        $this->addXp($profile, $xpAmount);
    }

    /**
     * Adiciona uma quantidade de XP direto.
     */
    public function addXp(Profile $profile, int $amount): void
    {
        if ($amount <= 0) {
            return;
        }

        $oldXp = $profile->xp;
        $newXp = $oldXp + $amount;
        
        $levelData = $this->determineLevel($newXp);
        
        $profile->xp = $newXp;
        $oldLevel = $profile->level;
        $profile->level = $levelData['level'];
        $profile->save();

        Log::info("XP adicionado ao perfil {$profile->id}: +{$amount} XP. Novo total: {$newXp}. Nível antigo: {$oldLevel}, Novo nível: {$profile->level}");
    }

    /**
     * Determina o nível e XP residual baseado no XP total.
     *
     * Fórmula: XP necessário para o próximo nível = 100 * (Level ^ 1.5)
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

        return [
            'level' => $level,
            'xp_in_level' => $xpInCurrentLevel,
            'xp_required_for_next' => (int) floor(100 * pow($level, 1.5))
        ];
    }

    /**
     * Retorna o valor de XP para cada ação.
     */
    private function getXpAmountForAction(string $action): int
    {
        return match ($action) {
            'complete_profile' => 1000,
            'add_project' => 200,
            'add_experience' => 150,
            'add_education' => 100,
            'connect_github' => 500,
            'generate_pdf' => 300,
            'profile_view' => 10,
            'unlock_badge' => 300,
            default => 0,
        };
    }

    /**
     * Valida se o XP pode ser concedido (anti-abuso e limites).
     */
    private function canAwardXpForAction(Profile $profile, string $action): bool
    {
        switch ($action) {
            case 'complete_profile':
                $cacheKey = "xp_awarded_complete_profile_{$profile->id}";
                if (Cache::has($cacheKey)) {
                    return false;
                }
                Cache::forever($cacheKey, true);
                return true;

            case 'connect_github':
                $cacheKey = "xp_awarded_connect_github_{$profile->id}";
                if (Cache::has($cacheKey)) {
                    return false;
                }
                Cache::forever($cacheKey, true);
                return true;

            case 'generate_pdf':
                $cacheKey = "xp_awarded_generate_pdf_{$profile->id}";
                if (Cache::has($cacheKey)) {
                    return false;
                }
                Cache::forever($cacheKey, true);
                return true;

            case 'add_project':
                $countKey = "xp_count_projects_{$profile->id}";
                $count = Cache::get($countKey, 0);
                if ($count >= 5) {
                    return false;
                }
                Cache::put($countKey, $count + 1, now()->addYears(1));
                return true;

            case 'add_experience':
                $countKey = "xp_count_experiences_{$profile->id}";
                $count = Cache::get($countKey, 0);
                if ($count >= 3) {
                    return false;
                }
                Cache::put($countKey, $count + 1, now()->addYears(1));
                return true;

            case 'add_education':
                $countKey = "xp_count_educations_{$profile->id}";
                $count = Cache::get($countKey, 0);
                if ($count >= 2) {
                    return false;
                }
                Cache::put($countKey, $count + 1, now()->addYears(1));
                return true;

            case 'profile_view':
                $date = now()->format('Y-m-d');
                $viewsXpTodayKey = "xp_views_today_{$profile->id}_{$date}";
                $xpToday = Cache::get($viewsXpTodayKey, 0);
                if ($xpToday >= 100) { // Limite de 100 XP por dia
                    return false;
                }
                Cache::put($viewsXpTodayKey, $xpToday + 10, now()->endOfDay());
                return true;

            case 'unlock_badge':
                return true;
        }

        return true;
    }
}
