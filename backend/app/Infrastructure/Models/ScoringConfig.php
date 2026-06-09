<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScoringConfig extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $attributes = [
        'xp_rules' => '[]',
    ];

    protected $fillable = [
        'weights',
        'xp_rules',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'weights' => 'array',
            'xp_rules' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Relação com o histórico de alterações desta configuração.
     */
    public function histories(): HasMany
    {
        return $this->hasMany(ScoringConfigHistory::class, 'config_id');
    }
}
