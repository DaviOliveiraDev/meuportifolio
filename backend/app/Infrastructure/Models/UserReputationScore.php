<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserReputationScore extends Model
{
    use HasFactory;

    protected $table = 'user_reputation_scores';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'ovr',
        'recruiter_score',
        'technical_depth',
        'delivery_impact',
        'scope_influence',
        'breadth_adaptability',
        'community_visibility',
        'primary_domain_id',
        'secondary_domain_id',
        'profile_label',
        'top_technologies',
        'domain_scores_snapshot',
        'last_significant_change',
        'change_count_this_month',
        'anomaly_flags',
        'engine_version',
        'computed_at',
        'previous_ovr',
        'previous_computed_at',
    ];

    protected $casts = [
        'ovr' => 'float',
        'recruiter_score' => 'float',
        'technical_depth' => 'float',
        'delivery_impact' => 'float',
        'scope_influence' => 'float',
        'breadth_adaptability' => 'float',
        'community_visibility' => 'float',
        'top_technologies' => 'array',
        'domain_scores_snapshot' => 'array',
        'last_significant_change' => 'datetime',
        'change_count_this_month' => 'integer',
        'anomaly_flags' => 'array',
        'computed_at' => 'datetime',
        'previous_ovr' => 'float',
        'previous_computed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function primaryDomain(): BelongsTo
    {
        return $this->belongsTo(TechDomain::class, 'primary_domain_id');
    }

    public function secondaryDomain(): BelongsTo
    {
        return $this->belongsTo(TechDomain::class, 'secondary_domain_id');
    }
}
