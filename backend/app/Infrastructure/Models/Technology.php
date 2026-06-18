<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Technology extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'logo_url',
        'is_verified',
        'category',
        'status',
        'aliases',
        'market_demand_score',
        'deprecated_at',
        'replacement_id',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'aliases' => 'array',
        'market_demand_score' => 'float',
        'deprecated_at' => 'datetime',
    ];

    /**
     * Relação de pertencimento com categoria (legada).
     */
    public function categoryLegacy(): BelongsTo
    {
        return $this->belongsTo(TechnologyCategory::class, 'category_id');
    }

    /**
     * Relação com as competências associadas (M:N).
     */
    public function competencies(): BelongsToMany
    {
        return $this->belongsToMany(TechCompetency::class, 'tech_competency_mappings', 'technology_id', 'competency_id')
                    ->withPivot('is_primary', 'contribution_weight');
    }

    /**
     * Relação N:N com perfis (skills autodeclaradas).
     */
    public function profiles(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, 'profile_technologies')
                    ->withPivot('self_proficiency', 'is_featured')
                    ->withTimestamps();
    }

    /**
     * Relação N:N com projetos onde a tecnologia foi usada.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_technologies')
                    ->withPivot('usage_intensity');
    }

    /**
     * Relação N:N com experiências de trabalho.
     */
    public function experiences(): BelongsToMany
    {
        return $this->belongsToMany(Experience::class, 'experience_technologies')
                    ->withPivot('is_primary');
    }

    /**
     * Relação N:N com formação acadêmica/cursos.
     */
    public function educations(): BelongsToMany
    {
        return $this->belongsToMany(Education::class, 'education_technologies');
    }

    /**
     * Relação com registros de evidências do Tech DNA.
     */
    public function evidences(): HasMany
    {
        return $this->hasMany(TechnologyEvidence::class, 'technology_id');
    }

    /**
     * Relação com scores dos usuários.
     */
    public function scores(): HasMany
    {
        return $this->hasMany(TechnologyScore::class, 'technology_id');
    }

    /**
     * Relação com histórico de pontuações.
     */
    public function scoreHistories(): HasMany
    {
        return $this->hasMany(TechnologyScoreHistory::class, 'technology_id');
    }

    /**
     * Relação com rankings da tecnologia.
     */
    public function rankings(): HasMany
    {
        return $this->hasMany(TechnologyRanking::class, 'technology_id');
    }
}
