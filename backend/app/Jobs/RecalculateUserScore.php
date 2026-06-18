<?php

namespace App\Jobs;

use App\Domain\Gamification\Events\ScoreUpdated;
use App\Domain\Gamification\Services\Reputation\ScorePipeline;
use App\Domain\Gamification\Services\Reputation\ScoreRateLimiter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RecalculateUserScore implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private string $userId,
        private string $triggerEvent = 'manual',
        private ?string $triggerEntityId = null
    ) {
        $this->onQueue('reputation-normal');
    }

    /**
     * Execute the job.
     */
    public function handle(ScorePipeline $pipeline, ScoreRateLimiter $rateLimiter): void
    {
        if ($rateLimiter->isThrottled($this->userId)) {
            Log::info("Score recalculation throttled for user {$this->userId}");
            return;
        }

        Log::info("ReputationV2: Iniciando cálculo para o usuário {$this->userId} via evento {$this->triggerEvent}");

        $result = $pipeline->execute($this->userId);

        if ($result->hasSignificantChange()) {
            Log::info("ReputationV2: OVR alterado significativamente de {$result->previousOvr} para {$result->ovr}. Disparando evento.");
            event(new ScoreUpdated($this->userId, $result));
        }

        $rateLimiter->increment($this->userId);
    }

    /**
     * Get the unique ID for the job to avoid duplicate queues.
     */
    public function uniqueId(): string
    {
        return "recalculate_score_{$this->userId}";
    }
}
