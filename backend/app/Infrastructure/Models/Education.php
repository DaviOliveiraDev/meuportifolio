<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Education extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'educations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'institution',
        'course',
        'start_date',
        'end_date',
        'is_current',
        'evidence_id',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function ($education) {
            if ($education->profile) {
                \App\Jobs\UpdateDeveloperCardJob::dispatch($education->profile);
            }
        });

        static::deleted(function ($education) {
            if ($education->profile) {
                \App\Jobs\UpdateDeveloperCardJob::dispatch($education->profile);
            }
        });
    }

    /**
     * Retorna a factory correspondente ao model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\EducationFactory::new();
    }

    /**
     * Relação com o perfil.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    /**
     * Evidência V2 associada a esta formação.
     */
    public function evidence(): BelongsTo
    {
        return $this->belongsTo(Evidence::class, 'evidence_id');
    }

    /**
     * Tecnologias vinculadas a esta formação acadêmica/curso.
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'education_technologies');
    }

    /**
     * Evidências associadas a esta formação.
     */
    public function evidences(): MorphMany
    {
        return $this->morphMany(TechnologyEvidence::class, 'source');
    }
}
