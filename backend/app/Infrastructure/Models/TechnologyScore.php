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
     * Set the keys for a save update query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery($query)
    {
        $keys = $this->getKeyName();
        if (!is_array($keys)) {
            return parent::setKeysForSaveQuery($query);
        }

        foreach ($keys as $keyName) {
            $query->where($keyName, '=', $this->original[$keyName] ?? $this->getAttribute($keyName));
        }

        return $query;
    }

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
