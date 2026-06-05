<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsEvent extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    // Apenas timestamp de criação é mantido para logs
    const UPDATED_AT = null;

    protected $fillable = [
        'profile_id',
        'event_type',
        'target_id',
        'viewer_ip_hash',
        'user_agent',
        'referer',
        'created_at',
    ];

    /**
     * Relação com o perfil.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
