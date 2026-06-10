<?php

namespace App\Domain\Services;

use App\Infrastructure\Models\Profile;
use App\Domain\Gamification\Services\OvrEngineService as NewOvrEngine;

class OvrEngineService
{
    protected NewOvrEngine $newOvrEngine;

    public function __construct()
    {
        $this->newOvrEngine = app(NewOvrEngine::class);
    }

    /**
     * Calcula e atualiza o OVR de um perfil.
     */
    public function calculateAndUpdateOvr(Profile $profile): int
    {
        return $this->newOvrEngine->calculateAndUpdateOvr($profile);
    }

    /**
     * Retorna a distribuição detalhada dos sub-scores do OVR.
     */
    public function getOvrBreakdown(Profile $profile): array
    {
        // Retorna mapeado para chaves antigas se necessário para compatibilidade, ou as novas
        $breakdown = $this->newOvrEngine->getOvrBreakdown($profile);
        return [
            'experience' => $breakdown['exp'],
            'projects' => $breakdown['bck'], // Backend/Projects mapeado para compatibilidade
            'skills_badges' => $breakdown['frt'],
            'github' => $breakdown['oss'],
            'education' => $breakdown['edu'],
            'completeness' => $profile->profile_completeness ?? 0,
        ];
    }
}
