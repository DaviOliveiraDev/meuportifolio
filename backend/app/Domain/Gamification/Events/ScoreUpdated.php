<?php

namespace App\Domain\Gamification\Events;

use App\Domain\Gamification\Services\Reputation\UserReputationResult;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScoreUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $userId,
        public readonly UserReputationResult $result
    ) {}
}
