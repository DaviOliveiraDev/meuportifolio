<?php

namespace App\Jobs;

use App\Infrastructure\Models\Profile;
use App\Domain\Gamification\Services\TechDnaEngineService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RecalculateTechDnaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    public function handle(TechDnaEngineService $techDnaEngine): void
    {
        $profileId = $this->profile->id;
        Log::info("TechDNA: Rodando RecalculateTechDnaJob para o perfil: {$profileId}");

        $techDnaEngine->calculateProfileTechDna($this->profile);

        Log::info("TechDNA: RecalculateTechDnaJob concluído para o perfil: {$profileId}");
    }
}
