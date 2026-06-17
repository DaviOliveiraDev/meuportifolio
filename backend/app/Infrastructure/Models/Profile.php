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
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'custom_styles' => 'array',
            'profile_completeness' => 'integer',
            'xp' => 'integer',
            'level' => 'integer',
            'ovr' => 'integer',
            'is_active' => 'boolean',
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
     * Relação N:N com as tecnologias (autodeclaradas).
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'profile_technologies')
                    ->withPivot('self_proficiency', 'is_featured')
                    ->withTimestamps();
    }

    /**
     * Relação 1:N com scores de tecnologias.
     */
    public function technologyScores(): HasMany
    {
        return $this->hasMany(TechnologyScore::class, 'profile_id');
    }

    /**
     * Relação 1:N com histórico de scores técnicos.
     */
    public function technologyScoreHistories(): HasMany
    {
        return $this->hasMany(TechnologyScoreHistory::class, 'profile_id');
    }

    /**
     * Relação 1:N com as evidências de reputação técnica.
     */
    public function technologyEvidences(): HasMany
    {
        return $this->hasMany(TechnologyEvidence::class, 'profile_id');
    }

    /**
     * Relação 1:N com os rankings do desenvolvedor.
     */
    public function technologyRankings(): HasMany
    {
        return $this->hasMany(TechnologyRanking::class, 'profile_id');
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

    /**
     * Relação 1:1 com as estatísticas do perfil (telemetria/cache).
     */
    public function stats(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ProfileStat::class);
    }

    /**
     * Relação N:N com títulos desbloqueados.
     */
    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(Title::class, 'profile_titles')
                    ->withPivot('is_equipped', 'unlocked_at');
    }

    /**
     * Relação N:N com cosméticos (bordas/efeitos) do card.
     */
    public function cosmetics(): BelongsToMany
    {
        return $this->belongsToMany(Cosmetic::class, 'profile_cosmetics')
                    ->withPivot('is_equipped', 'unlocked_at');
    }

    /**
     * Relação 1:N com progresso de conquistas.
     */
    public function badgeProgress(): HasMany
    {
        return $this->hasMany(ProfileBadgeProgress::class);
    }

    /**
     * Relação 1:N com estatísticas de temporadas.
     */
    public function seasonStats(): HasMany
    {
        return $this->hasMany(ProfileSeasonStat::class);
    }

    /**
     * Relação 1:N com histórico de transações de XP.
     */
    public function xpHistory(): HasMany
    {
        return $this->hasMany(ProfileXpHistory::class);
    }

    /**
     * Relação com o score de reputação v2 do usuário.
     */
    public function reputationScore(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(UserReputationScore::class, 'user_id', 'user_id');
    }

    /**
     * Relação com scores de domínios.
     */
    public function userDomainScores(): HasMany
    {
        return $this->hasMany(UserDomainScore::class, 'user_id', 'user_id')->orderBy('score', 'desc');
    }

    /**
     * Relação com scores de competências.
     */
    public function userCompetencyScores(): HasMany
    {
        return $this->hasMany(UserCompetencyScore::class, 'user_id', 'user_id');
    }

    /**
     * Relação com scores de habilidades.
     */
    public function userSkillScores(): HasMany
    {
        return $this->hasMany(UserSkillScore::class, 'user_id', 'user_id')->orderBy('score', 'desc');
    }
}
