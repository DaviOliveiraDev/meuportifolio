<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileSeasonStat extends Model
{
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'profile_id',
        'season_id',
        'xp_earned',
        'ovr_reached',
        'joined_at',
    ];

    protected function casts(): array
    {
        return [
            'xp_earned' => 'integer',
            'ovr_reached' => 'integer',
            'joined_at' => 'datetime',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }
}
