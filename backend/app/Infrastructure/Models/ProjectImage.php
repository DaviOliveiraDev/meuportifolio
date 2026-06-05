<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectImage extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    // Desativa atualizações de timestamps automáticas
    const UPDATED_AT = null;

    protected $fillable = [
        'project_id',
        'image_url',
        'order_weight',
    ];

    protected function casts(): array
    {
        return [
            'order_weight' => 'integer',
        ];
    }

    /**
     * Relação com o projeto pai.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
