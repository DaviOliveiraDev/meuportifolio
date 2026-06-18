<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'is_active',
        'slug',
        'starts_at',
        'ends_at',
        'scoring_weights',
        'featured_domains',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'scoring_weights' => 'array',
            'featured_domains' => 'array',
        ];
    }

    /**
     * Relacionamento com as estatísticas dos perfis nesta temporada.
     */
    public function profileStats(): HasMany
    {
        return $this->hasMany(ProfileSeasonStat::class);
    }

    /**
     * Relacionamento com os scores de temporada dos usuários.
     */
    public function seasonScores(): HasMany
    {
        return $this->hasMany(SeasonScore::class, 'season_id');
    }
}
