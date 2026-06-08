<?php

namespace App\Jobs;

use App\Domain\Services\BadgeEvaluatorService;
use App\Domain\Services\OvrEngineService;
use App\Domain\Services\XpManagerService;
use App\Infrastructure\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UpdateDeveloperCardJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    public function handle(
        OvrEngineService $ovrEngine,
        BadgeEvaluatorService $badgeEvaluator,
        XpManagerService $xpManager
    ): void {
        Log::info("Iniciando recalculo do Developer Card para o perfil: {$this->profile->id}");

        // 1. Recalcula e atualiza OVR e Completude
        $ovrEngine->calculateAndUpdateOvr($this->profile);

        // 2. Avalia e concede badges (isso pode gerar mais XP)
        $badgeEvaluator->evaluateAndAwardBadges($this->profile);

        // 3. Se atingiu 100% de completude, concede o XP correspondente
        if ($this->profile->profile_completeness >= 100) {
            $xpManager->awardXpForAction($this->profile, 'complete_profile');
        }

        // 4. Salva o perfil após todas as alterações
        $this->profile->save();

        Log::info("Developer Card atualizado com sucesso para o perfil: {$this->profile->id}. OVR: {$this->profile->ovr}, Level: {$this->profile->level}, XP: {$this->profile->xp}");
    }
}
