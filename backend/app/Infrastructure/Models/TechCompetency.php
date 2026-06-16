<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TechCompetency extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'tech_competencies';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'domain_id',
        'name',
        'slug',
        'description',
        'weight_in_domain',
        'is_active',
    ];

    protected $casts = [
        'weight_in_domain' => 'float',
        'is_active' => 'boolean',
    ];

    public function domain(): BelongsTo
    {
        return $this->belongsTo(TechDomain::class, 'domain_id');
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'tech_competency_mappings', 'competency_id', 'technology_id')
                    ->withPivot('is_primary', 'contribution_weight');
    }
}
