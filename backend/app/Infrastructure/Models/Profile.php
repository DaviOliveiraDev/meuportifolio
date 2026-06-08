<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profile extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $attributes = [
        'profile_completeness' => 0,
        'xp' => 0,
        'level' => 1,
        'ovr' => 0,
    ];

    protected $fillable = [
        'user_id',
        'username',
        'name',
        'avatar_url',
        'bio',
        'role',
        'location',
        'linkedin_url',
        'github_url',
        'website_url',
        'theme_name',
        'custom_styles',
        'profile_completeness',
        'xp',
        'level',
        'ovr',
    ];

    protected function casts(): array
    {
        return [
            'custom_styles' => 'array',
            'profile_completeness' => 'integer',
            'xp' => 'integer',
            'level' => 'integer',
            'ovr' => 'integer',
        ];
    }

    /**
     * Relação de volta com o usuário.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relação com os projetos do portfólio.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class)->orderBy('order_weight')->orderBy('created_at', 'desc');
    }

    /**
     * Relação com as experiências profissionais.
     */
    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class)->orderBy('start_date', 'desc');
    }

    /**
     * Relação com a formação acadêmica.
     */
    public function educations(): HasMany
    {
        return $this->hasMany(Education::class)->orderBy('start_date', 'desc');
    }

    /**
     * Relação N:N com habilidades.
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'profile_skills')
                    ->withPivot('proficiency_level');
    }

    /**
     * Retorna a factory correspondente ao model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\ProfileFactory::new();
    }

    /**
     * Relação com os eventos de análise (visualizações/cliques).
     */
    public function analyticsEvents(): HasMany
    {
        return $this->hasMany(AnalyticsEvent::class);
    }

    /**
     * Relação N:N com as conquistas (badges).
     */
    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'profile_badges')
                    ->withPivot('unlocked_at');
    }

    /**
     * Relação 1:N com o histórico de evolução do Developer Card.
     */
    public function ratingsHistory(): HasMany
    {
        return $this->hasMany(ProfileRatingsHistory::class);
    }
}
