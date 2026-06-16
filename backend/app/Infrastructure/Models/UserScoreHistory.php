<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserScoreHistory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'user_score_history';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'ovr',
        'recruiter_score',
        'trigger_event',
        'trigger_entity_id',
        'full_snapshot',
        'recorded_at',
    ];

    protected $casts = [
        'ovr' => 'float',
        'recruiter_score' => 'float',
        'full_snapshot' => 'array',
        'recorded_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
