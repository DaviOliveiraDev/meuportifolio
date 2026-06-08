<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
