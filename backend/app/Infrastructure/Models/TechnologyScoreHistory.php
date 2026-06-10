<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnologyScoreHistory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'technology_score_history';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'technology_id',
        'score',
        'confidence_level',
        'recorded_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'recorded_at' => 'date',
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
}
