<?php

namespace App\Domain\Gamification\Services;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Badge;
use App\Infrastructure\Models\ProfileBadgeProgress;
use App\Domain\Gamification\Events\AchievementUnlockedEvent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BadgeEvaluatorService
{
    public function __construct(
        protected XpManagerService $xpManager
    ) {}

    /**
     * Avalia e concede as conquistas (badges) que o desenvolvedor atinge,
     * e atualiza o progresso das conquistas em andamento.
     */
    public function evaluateAndAwardBadges(Profile $profile): void
    {
        $this->ensureDefaultBadgesExist();

        $activeBadges = Badge::where('is_active', true)->get();
        $unlockedBadgeIds = $profile->badges()->pluck('badges.id')->toArray();
        $stats = $profile->stats()->firstOrCreate([]);

        foreach ($activeBadges as $badge) {
            // Se já desbloqueou, pula
            if (in_array($badge->id, $unlockedBadgeIds)) {
                continue;
            }

            $criteria = $badge->rules_criteria;
            if (empty($criteria) || !isset($criteria['type'])) {
                continue;
            }

            // 1. Calcular progresso atual
            $currentVal = $this->calculateCurrentProgressValue($profile, $stats, $criteria);
            $targetVal = (int) ($criteria['value'] ?? 1);

            // 2. Atualizar ou criar o progresso no banco para a exibição no frontend
            DB::table('profile_badge_progress')->updateOrInsert(
                [
                    'profile_id' => $profile->id,
                    'badge_id' => $badge->id,
                ],
                [
                    'current_value' => min($currentVal, $targetVal),
                    'target_value' => $targetVal,
                    'last_updated_at' => now(),
                ]
            );

            // 3. Verificar se preenche o critério de desbloqueio
            if ($currentVal >= $targetVal) {
                DB::transaction(function () use ($profile, $badge) {
                    $profile->badges()->attach($badge->id, ['unlocked_at' => now()]);
                    
                    // Concede o XP associado à conquista
                    $this->xpManager->awardXp($profile, "unlock_badge_{$badge->name}", $badge->xp_reward);

                    Log::info("Conquista desbloqueada para o perfil {$profile->id}: {$badge->name} (+{$badge->xp_reward} XP)");

                    // Dispara evento em tempo real via Reverb
                    event(new AchievementUnlockedEvent($profile, $badge));
                });
            }
        }
    }

    /**
     * Retorna o valor atual da métrica com base no tipo de critério.
     */
    private function calculateCurrentProgressValue(Profile $profile, $stats, array $criteria): int
    {
        switch ($criteria['type']) {
            case 'completeness':
                return $profile->profile_completeness ?? 0;

            case 'bio_filled':
                return !empty($profile->bio) && strlen($profile->bio) >= 30 ? 1 : 0;

            case 'location_filled':
                return !empty($profile->location) ? 1 : 0;

            case 'avatar_filled':
                return !empty($profile->avatar_url) ? 1 : 0;

            case 'role_filled':
                return !empty($profile->role) ? 1 : 0;

            case 'open_to_work':
                // Se ativou flag de contato
                return $profile->is_active ? 1 : 0;

            case 'projects_count':
                return $stats->total_projects;

            case 'featured_projects':
                return $profile->projects()->where('is_featured', true)->count();

            case 'experiences_count':
                return $stats->total_experiences;

            case 'educations_count':
                return $stats->total_educations;

            case 'skills_count':
                return $stats->total_skills;

            case 'github_connected':
                return $stats->github_connected ? 1 : 0;

            case 'github_commits':
                return $stats->github_commits;

            case 'github_repos':
                return $stats->github_repositories;

            case 'github_stars':
                return $stats->github_stars;

            case 'streak':
                return $stats->streak_days;

            case 'views':
                return $stats->profile_views;

            case 'shares':
                return $stats->profile_shares;

            case 'ovr':
                return $stats->current_ovr;

            case 'level':
                return $stats->current_level;

            case 'tech_skill':
                // rules_criteria = {"type": "tech_skill", "skill": "Laravel", "value": 80}
                $skillName = $criteria['skill'] ?? '';
                $skill = $profile->skills()->where('name', $skillName)->first();
                return $skill ? (int) $skill->pivot->proficiency_level : 0;

            case 'docker_projects':
                return $profile->projects()->where(function($q) {
                    $q->where('title', 'like', '%Docker%')
                      ->orWhere('description', 'like', '%Docker%');
                })->count();

            case 'docker_compose':
                return $profile->projects()->where('description', 'like', '%docker-compose%')->count() > 0 ? 1 : 0;

            case 'gitflow':
                return $profile->projects()->where('description', 'like', '%gitflow%')->count() > 0 ? 1 : 0;

            case 'github_actions':
                return $profile->projects()->where(function($q) {
                    $q->where('description', 'like', '%github-actions%')
                      ->orWhere('description', 'like', '%ci/cd%');
                })->count();

            case 'cloud_deploy':
                return $profile->projects()->where(function($q) {
                    $q->where('description', 'like', '%aws%')
                      ->orWhere('description', 'like', '%cloudflare%');
                })->count();

            case 'polyglot':
                return $profile->skills()->count();

            case 'saas_tag':
                return $profile->projects()->where('description', 'like', '%saas%')->count();

            case 'pdf_exports':
                return $stats->pdf_resume_exports_count;

            case 'secret_clicks':
                // Simulado via contador de visualizações/shares para teste
                return $stats->profile_views >= 10 ? 10 : $stats->profile_views;

            default:
                return 0;
        }
    }

    /**
     * Cadastra conquistas padrão caso ainda não existam.
     */
    public function ensureDefaultBadgesExist(): void
    {
        $defaultBadges = [
            [
                'name' => 'Perfil Estrela',
                'description' => 'Atingiu 100% de completude do perfil profissional.',
                'category' => 'Onboarding',
                'rarity' => 'epica',
                'xp_reward' => 500,
                'icon_path' => 'star',
                'rules_criteria' => ['type' => 'completeness', 'value' => 100],
            ],
            [
                'name' => 'Octocat Connect',
                'description' => 'Conectou com sucesso a conta do GitHub ao portfólio.',
                'category' => 'GitHub',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'icon_path' => 'github',
                'rules_criteria' => ['type' => 'github_connected', 'value' => true],
            ],
            [
                'name' => 'Currículo Exportado',
                'description' => 'Gerou o primeiro currículo em PDF otimizado para ATS.',
                'category' => 'Resume',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'icon_path' => 'pdf',
                'rules_criteria' => ['type' => 'pdf_generated', 'value' => true],
            ],
            [
                'name' => 'Portfólio Ativo',
                'description' => 'Cadastrou pelo menos 3 projetos no portfólio.',
                'category' => 'Projects',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'icon_path' => 'projects',
                'rules_criteria' => ['type' => 'projects_count', 'value' => 3],
            ],
            [
                'name' => 'Carreira em Foco',
                'description' => 'Adicionou pelo menos 2 experiências profissionais.',
                'category' => 'Career',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'icon_path' => 'experiences',
                'rules_criteria' => ['type' => 'experiences_count', 'value' => 2],
            ],
            [
                'name' => 'Especialista',
                'description' => 'Adicionou pelo menos 5 habilidades ao seu perfil.',
                'category' => 'Skills',
                'rarity' => 'comum',
                'xp_reward' => 100,
                'icon_path' => 'skills',
                'rules_criteria' => ['type' => 'skills_count', 'value' => 5],
            ],
        ];

        foreach ($defaultBadges as $badgeData) {
            Badge::firstOrCreate(
                ['name' => $badgeData['name']],
                [
                    'description' => $badgeData['description'],
                    'category' => $badgeData['category'],
                    'rarity' => $badgeData['rarity'],
                    'xp_reward' => $badgeData['xp_reward'],
                    'icon_path' => $badgeData['icon_path'],
                    'rules_criteria' => $badgeData['rules_criteria'],
                    'is_active' => true,
                ]
            );
        }
    }
}
