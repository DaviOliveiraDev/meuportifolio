<?php

namespace App\Jobs;

use App\Domain\Services\BadgeEvaluatorService;
use App\Infrastructure\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class EvaluateAchievementsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    public function handle(BadgeEvaluatorService $badgeEvaluator): void
    {
        Log::info("Avaliando conquistas de forma isolada para o perfil: {$this->profile->id}");
        $badgeEvaluator->evaluateAndAwardBadges($this->profile);
    }
}
