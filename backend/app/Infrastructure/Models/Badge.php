<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Badge extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'description',
        'category',
        'rarity',
        'xp_reward',
        'is_secret',
        'parent_badge_id',
        'icon_path',
        'rules_criteria',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'rules_criteria' => 'array',
            'is_active' => 'boolean',
            'is_secret' => 'boolean',
            'xp_reward' => 'integer',
        ];
    }

    /**
     * Relação N:N com perfis que possuem essa conquista.
     */
    public function profiles(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, 'profile_badges')
                    ->withPivot('unlocked_at');
    }

    /**
     * Conquista pai (no caso de conquistas progressivas).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Badge::class, 'parent_badge_id');
    }

    /**
     * Conquistas filhas (níveis subsequentes da mesma progressão).
     */
    public function children(): HasMany
    {
        return $this->hasMany(Badge::class, 'parent_badge_id');
    }
}
