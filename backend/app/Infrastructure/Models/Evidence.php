<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Evidence extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'evidences';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'evidence_type',
        'verification_level',
        'verification_source',
        'verified_at',
        'start_date',
        'end_date',
        'is_current',
        'quality_score',
        'recency_factor',
        'is_active',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'quality_score' => 'float',
        'recency_factor' => 'float',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function projectDetail(): HasOne
    {
        return $this->hasOne(EvidenceProject::class, 'evidence_id');
    }

    public function experienceDetail(): HasOne
    {
        return $this->hasOne(EvidenceExperience::class, 'evidence_id');
    }

    public function educationDetail(): HasOne
    {
        return $this->hasOne(EvidenceEducation::class, 'evidence_id');
    }

    public function certificationDetail(): HasOne
    {
        return $this->hasOne(EvidenceCertification::class, 'evidence_id');
    }

    public function githubDetail(): HasOne
    {
        return $this->hasOne(EvidenceGithub::class, 'evidence_id');
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'evidence_technologies', 'evidence_id', 'technology_id')
                    ->withPivot('id', 'usage_depth', 'is_primary');
    }
}
