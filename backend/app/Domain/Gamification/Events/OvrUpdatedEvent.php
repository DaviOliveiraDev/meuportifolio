<?php

namespace App\Domain\Gamification\Events;

use App\Infrastructure\Models\Profile;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OvrUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Profile $profile,
        public int $newOvr,
        public int $oldOvr,
        public array $cardMetadata
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
            'ovr_update' => [
                'new_ovr' => $this->newOvr,
                'old_ovr' => $this->oldOvr,
                'metadata' => $this->cardMetadata,
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
