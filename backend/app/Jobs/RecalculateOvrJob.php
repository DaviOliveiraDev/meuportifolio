<?php

namespace App\Jobs;

use App\Infrastructure\Models\Profile;
use App\Domain\Gamification\Services\OvrEngineService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RecalculateOvrJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    public function handle(OvrEngineService $ovrEngine): void
    {
        $profileId = $this->profile->id;
        Log::info("TechDNA: Rodando RecalculateOvrJob para o perfil: {$profileId}");

        $ovrEngine->calculateAndUpdateOvr($this->profile);

        Log::info("TechDNA: RecalculateOvrJob concluído para o perfil: {$profileId}");
    }
}
