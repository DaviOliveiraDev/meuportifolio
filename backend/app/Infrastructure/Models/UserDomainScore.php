<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDomainScore extends Model
{
    use HasFactory;

    protected $table = 'user_domain_scores';
    public $incrementing = false;
    protected $primaryKey = ['user_id', 'domain_id'];
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'domain_id',
        'score',
        'percentile_rank',
        'top_technologies',
        'competency_breakdown',
        'engine_version',
        'computed_at',
    ];

    protected $casts = [
        'score' => 'float',
        'percentile_rank' => 'float',
        'top_technologies' => 'array',
        'competency_breakdown' => 'array',
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

    public function domain(): BelongsTo
    {
        return $this->belongsTo(TechDomain::class, 'domain_id');
    }
}
