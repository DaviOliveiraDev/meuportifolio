<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileBadgeProgress extends Model
{
    public $incrementing = false;
    public $timestamps = false;
    protected $table = 'profile_badge_progress';

    protected $fillable = [
        'profile_id',
        'badge_id',
        'current_value',
        'target_value',
        'last_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'current_value' => 'integer',
            'target_value' => 'integer',
            'last_updated_at' => 'datetime',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function badge(): BelongsTo
    {
        return $this->belongsTo(Badge::class);
    }
}
