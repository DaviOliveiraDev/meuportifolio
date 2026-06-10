<?php

namespace App\Jobs;

use App\Infrastructure\Models\Profile;
use App\Domain\Gamification\Services\BadgeEvaluatorService;
use App\Domain\Gamification\Services\TitleEvaluatorService;
use App\Domain\Gamification\Services\CosmeticEvaluatorService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class EvaluateBadgesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    public function handle(
        BadgeEvaluatorService $badgeEvaluator,
        TitleEvaluatorService $titleEvaluator,
        CosmeticEvaluatorService $cosmeticEvaluator
    ): void {
        $profileId = $this->profile->id;
        Log::info("TechDNA: Rodando EvaluateBadgesJob para o perfil: {$profileId}");

        // 1. Avaliar Conquistas (Badges) e seu progresso
        $badgeEvaluator->evaluateAndAwardBadges($this->profile);

        // 2. Avaliar Títulos
        $titleEvaluator->evaluateAndAwardTitles($this->profile);

        // 3. Avaliar Cosméticos
        $cosmeticEvaluator->evaluateAndAwardCosmetics($this->profile);

        Log::info("TechDNA: EvaluateBadgesJob concluído para o perfil: {$profileId}");
    }
}
