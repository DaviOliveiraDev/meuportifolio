<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class TechnologyEvidence extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'technology_id',
        'source_type',
        'source_id',
        'points_awarded',
        'evidence_metadata',
        'verified_at',
    ];

    protected $casts = [
        'points_awarded' => 'decimal:2',
        'evidence_metadata' => 'array',
        'verified_at' => 'datetime',
    ];

    /**
     * Relação com o perfil.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    /**
     * Relação com a tecnologia.
     */
    public function technology(): BelongsTo
    {
        return $this->belongsTo(Technology::class, 'technology_id');
    }

    /**
     * Relação polimórfica para a origem da evidência (Project, Experience, Education).
     */
    public function source(): MorphTo
    {
        return $this->morphTo();
    }
}
