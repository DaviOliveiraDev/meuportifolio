<?php

namespace App\Infrastructure\Services;

class FeatureFlag
{
    /**
     * Verifica se uma determinada feature flag está ativa no arquivo de configuração.
     */
    public static function isEnabled(string $feature): bool
    {
        return (bool) config("features.{$feature}", false);
    }
}
