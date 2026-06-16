<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeasonScore extends Model
{
    use HasFactory;

    protected $table = 'season_scores';
    public $incrementing = false;
    protected $primaryKey = ['season_id', 'user_id'];
    protected $keyType = 'string';

    protected $fillable = [
        'season_id',
        'user_id',
        'season_ovr',
        'rank',
        'percentile',
        'badges_earned',
        'final_snapshot',
    ];

    protected $casts = [
        'season_ovr' => 'float',
        'rank' => 'integer',
        'percentile' => 'float',
        'badges_earned' => 'array',
        'final_snapshot' => 'array',
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

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class, 'season_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
