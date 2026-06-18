<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Project extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'title',
        'description',
        'cover_image_url',
        'repository_url',
        'demo_url',
        'is_featured',
        'order_weight',
        'evidence_id',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'order_weight' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function ($project) {
            if ($project->profile) {
                \App\Jobs\UpdateDeveloperCardJob::dispatch($project->profile);
            }
        });

        static::deleted(function ($project) {
            if ($project->profile) {
                \App\Jobs\UpdateDeveloperCardJob::dispatch($project->profile);
            }
        });
    }

    /**
     * Relação com o perfil.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    /**
     * Evidência V2 associada a este projeto.
     */
    public function evidence(): BelongsTo
    {
        return $this->belongsTo(Evidence::class, 'evidence_id');
    }

    /**
     * Retorna a factory correspondente ao model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\ProjectFactory::new();
    }

    /**
     * Relação com a galeria de imagens secundárias do projeto.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('order_weight');
    }

    /**
     * Relação com as tecnologias utilizadas no projeto.
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'project_technologies')
                    ->withPivot('usage_intensity');
    }

    /**
     * Evidências associadas a este projeto.
     */
    public function evidences(): MorphMany
    {
        return $this->morphMany(TechnologyEvidence::class, 'source');
    }
}
