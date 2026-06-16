<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCompetencyScore extends Model
{
    use HasFactory;

    protected $table = 'user_competency_scores';
    public $incrementing = false;
    protected $primaryKey = ['user_id', 'competency_id'];
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'competency_id',
        'score',
        'percentile_rank',
        'top_technologies',
        'engine_version',
        'computed_at',
    ];

    protected $casts = [
        'score' => 'float',
        'percentile_rank' => 'float',
        'top_technologies' => 'array',
        'computed_at' => 'datetime',
    ];

    /**
     * Set the keys for a save update query (Composite Primary Key Support).
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function competency(): BelongsTo
    {
        return $this->belongsTo(TechCompetency::class, 'competency_id');
    }
}
