<?php

namespace App\Domain\Gamification\Events;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Badge;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AchievementUnlockedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Profile $profile,
        public Badge $badge
    ) {}

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("profile.{$this->profile->id}"),
        ];
    }

    /**
     * Data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'achievement' => [
                'id' => $this->badge->id,
                'name' => $this->badge->name,
                'description' => $this->badge->description,
                'rarity' => $this->badge->rarity,
                'xp_reward' => $this->badge->xp_reward,
                'icon_path' => $this->badge->icon_path,
                'is_secret' => $this->badge->is_secret,
            ],
            'profile' => [
                'id' => $this->profile->id,
                'xp' => $this->profile->xp,
                'level' => $this->profile->level,
                'ovr' => $this->profile->ovr,
            ]
        ];
    }
}
