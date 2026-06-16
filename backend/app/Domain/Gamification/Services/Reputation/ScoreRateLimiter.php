<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Facades\Cache;

class ScoreRateLimiter
{
    /**
     * Verifica se o recálculo para o usuário está bloqueado temporariamente (debounce).
     */
    public function isThrottled(string $userId): bool
    {
        // Debounce de 5 segundos para evitar recálculos excessivos
        return Cache::has($this->getCacheKey($userId));
    }

    /**
     * Registra que o recálculo foi executado, ativando o throttle.
     */
    public function increment(string $userId): void
    {
        Cache::put($this->getCacheKey($userId), true, 5); // 5 segundos de cooldown
    }

    /**
     * Retorna a chave do cache para o controle de rate limit.
     */
    protected function getCacheKey(string $userId): string
    {
        return "recalc_limit:{$userId}";
    }
}
