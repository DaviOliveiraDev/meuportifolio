<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnologyRanking extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'technology_rankings';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'technology_id',
        'profile_id',
        'rank_position',
        'percentile',
        'previous_position',
    ];

    protected $casts = [
        'rank_position' => 'integer',
        'percentile' => 'decimal:2',
        'previous_position' => 'integer',
    ];

    /**
     * Relação com a tecnologia (nulo representa ranking global geral).
     */
    public function technology(): BelongsTo
    {
        return $this->belongsTo(Technology::class, 'technology_id');
    }

    /**
     * Relação com o perfil.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
}
