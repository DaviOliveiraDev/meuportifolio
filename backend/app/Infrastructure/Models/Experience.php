<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Experience extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'company',
        'role',
        'start_date',
        'end_date',
        'is_current',
        'description',
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
        static::saved(function ($experience) {
            if ($experience->profile) {
                \App\Jobs\UpdateDeveloperCardJob::dispatch($experience->profile);
            }
        });

        static::deleted(function ($experience) {
            if ($experience->profile) {
                \App\Jobs\UpdateDeveloperCardJob::dispatch($experience->profile);
            }
        });
    }

    /**
     * Retorna a factory correspondente ao model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\ExperienceFactory::new();
    }

    /**
     * Relação com o perfil.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    /**
     * Tecnologias vinculadas a esta experiência profissional.
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'experience_technologies')
                    ->withPivot('is_primary');
    }

    /**
     * Evidências associadas a esta experiência.
     */
    public function evidences(): MorphMany
    {
        return $this->morphMany(TechnologyEvidence::class, 'source');
    }
}
