<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnologyScore extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $primaryKey = ['profile_id', 'technology_id'];

    // Note: Since standard Eloquent doesn't support array primary keys out-of-the-box for lookups,
    // we set keyType as string and disable incrementing, treating it as a composite index table.
    protected $keyType = 'string';

    protected $fillable = [
        'profile_id',
        'technology_id',
        'score',
        'confidence_level',
        'evidence_count',
        'calculated_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'evidence_count' => 'integer',
        'calculated_at' => 'datetime',
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
