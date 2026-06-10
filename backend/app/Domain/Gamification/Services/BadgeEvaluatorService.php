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
                return (int) ($profile->profile_completeness ?? 0);

            case 'bio_filled':
                return (!empty($profile->bio) && strlen($profile->bio) >= 30) ? 1 : 0;

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
                return (int) ($stats->total_projects ?? 0);

            case 'featured_projects':
                return (int) $profile->projects()->where('is_featured', true)->count();

            case 'experiences_count':
                return (int) ($stats->total_experiences ?? 0);

            case 'educations_count':
                return (int) ($stats->total_educations ?? 0);

            case 'skills_count':
                return (int) ($stats->total_skills ?? 0);

            case 'github_connected':
                return ($stats->github_connected ?? false) ? 1 : 0;

            case 'github_commits':
                return (int) ($stats->github_commits ?? 0);

            case 'github_repos':
                return (int) ($stats->github_repositories ?? 0);

            case 'github_stars':
                return (int) ($stats->github_stars ?? 0);

            case 'streak':
                return (int) ($stats->streak_days ?? 0);

            case 'views':
                return (int) ($stats->profile_views ?? 0);

            case 'shares':
                return (int) ($stats->profile_shares ?? 0);

            case 'ovr':
                return (int) ($stats->current_ovr ?? 0);

            case 'level':
                return (int) ($stats->current_level ?? 0);

            case 'tech_skill':
                // rules_criteria = {"type": "tech_skill", "skill": "Laravel", "value": 80}
                $skillName = $criteria['skill'] ?? '';
                $skill = $profile->skills()->where('name', $skillName)->first();
                return $skill ? (int) $skill->pivot->proficiency_level : 0;

            case 'docker_projects':
                return (int) $profile->projects()->where(function($q) {
                    $q->where('title', 'like', '%Docker%')
                      ->orWhere('description', 'like', '%Docker%');
                })->count();

            case 'docker_compose':
                return $profile->projects()->where('description', 'like', '%docker-compose%')->count() > 0 ? 1 : 0;

            case 'gitflow':
                return $profile->projects()->where('description', 'like', '%gitflow%')->count() > 0 ? 1 : 0;

            case 'github_actions':
                return (int) $profile->projects()->where(function($q) {
                    $q->where('description', 'like', '%github-actions%')
                      ->orWhere('description', 'like', '%ci/cd%');
                })->count();

            case 'cloud_deploy':
                return (int) $profile->projects()->where(function($q) {
                    $q->where('description', 'like', '%aws%')
                      ->orWhere('description', 'like', '%cloudflare%');
                })->count();

            case 'polyglot':
                return (int) $profile->skills()->count();

            case 'saas_tag':
                return (int) $profile->projects()->where('description', 'like', '%saas%')->count();

            case 'pdf_exports':
                return (int) \Illuminate\Support\Facades\Cache::get("profile_pdf_exports_count_{$profile->id}", 0);

            case 'pdf_generated':
                $exports = (int) \Illuminate\Support\Facades\Cache::get("profile_pdf_exports_count_{$profile->id}", 0);
                if ($exports > 0) {
                    return 1;
                }
                $pdfCache = \Illuminate\Support\Facades\Cache::get("pdf_resume_{$profile->id}");
                $generated = ($pdfCache && isset($pdfCache['status']) && $pdfCache['status'] === 'completed');
                return $generated ? 1 : 0;

            case 'pdf_ats_score':
                return (int) \Illuminate\Support\Facades\Cache::get("profile_pdf_ats_score_{$profile->id}", 85);

            case 'secret_pdf_no_bio':
                $pdfCache = \Illuminate\Support\Facades\Cache::get("pdf_resume_{$profile->id}");
                $generated = ($pdfCache && isset($pdfCache['status']) && $pdfCache['status'] === 'completed');
                return ($generated && empty($profile->bio)) ? 1 : 0;

            case 'secret_theme_spam':
                return (int) \Illuminate\Support\Facades\Cache::get("profile_theme_changes_count_{$profile->id}", 0);

            case 'theme_changed':
                return (int) \Illuminate\Support\Facades\Cache::get("profile_theme_changes_count_{$profile->id}", 0) >= 1 ? 1 : 0;

            case 'dark_mode':
                return $profile->theme_name === 'dark' ? 1 : 0;

            case 'completeness_30_days':
                return (int) ($profile->profile_completeness ?? 0) >= 100 ? 1 : 0;

            case 'networks_filled':
                $filledCount = 0;
                if (!empty($profile->linkedin_url)) $filledCount++;
                if (!empty($profile->github_url)) $filledCount++;
                if (!empty($profile->website_url)) $filledCount++;
                return $filledCount;

            case 'cover_image_count':
                return (int) $profile->projects()->whereNotNull('cover_image_url')->where('cover_image_url', '!=', '')->count();

            case 'demo_url_count':
                return (int) $profile->projects()->whereNotNull('demo_url')->where('demo_url', '!=', '')->count();

            case 'detailed_projects_count':
                return (int) $profile->projects()->whereRaw('LENGTH(description) >= 100')->count();

            case 'complete_projects_count':
                return (int) $profile->projects()
                    ->whereNotNull('repository_url')->where('repository_url', '!=', '')
                    ->whereNotNull('demo_url')->where('demo_url', '!=', '')
                    ->whereNotNull('cover_image_url')->where('cover_image_url', '!=', '')
                    ->count();

            case 'project_versions_count':
                return (int) \Illuminate\Support\Facades\Cache::get("profile_project_versions_count_{$profile->id}", 0);

            case 'github_webhook':
                return (int) \Illuminate\Support\Facades\Cache::get("profile_github_webhook_active_{$profile->id}", 0);

            case 'full_cycle':
                $hasDocker = $profile->projects()->where(function($q) {
                    $q->where('title', 'like', '%Docker%')
                      ->orWhere('description', 'like', '%Docker%');
                })->count() > 0;
                $hasCI = $profile->projects()->where(function($q) {
                    $q->where('description', 'like', '%github-actions%')
                      ->orWhere('description', 'like', '%ci/cd%');
                })->count() > 0;
                return ($hasDocker && $hasCI) ? 1 : 0;

            case 'experience_months':
            case 'experience_years':
                $totalMonths = 0;
                foreach ($profile->experiences as $exp) {
                    $start = $exp->start_date ? \Carbon\Carbon::parse($exp->start_date) : null;
                    if (!$start) continue;
                    $end = $exp->is_current ? now() : ($exp->end_date ? \Carbon\Carbon::parse($exp->end_date) : now());
                    $totalMonths += $start->diffInMonths($end);
                }
                if ($criteria['type'] === 'experience_years') {
                    return (int) floor($totalMonths / 12);
                }
                return (int) $totalMonths;

            case 'leadership_role':
                $leadershipWords = ['lead', 'manager', 'coordenador', 'diretor', 'director', 'principal', 'lider', 'líder', 'head', 'gerente'];
                foreach ($profile->experiences as $exp) {
                    $roleLower = mb_strtolower($exp->role ?? '');
                    foreach ($leadershipWords as $word) {
                        if (str_contains($roleLower, $word)) {
                            return 1;
                        }
                    }
                }
                return 0;

            case 'international_experience':
                $intlWords = ['international', 'remoto internacional', 'remote international', 'foreign', 'english speaking', 'global', 'eua', 'usa', 'europe', 'europa', 'uk', 'reino unido'];
                foreach ($profile->experiences as $exp) {
                    $descLower = mb_strtolower($exp->description ?? '');
                    foreach ($intlWords as $word) {
                        if (str_contains($descLower, $word)) {
                            return 1;
                        }
                    }
                }
                return 0;

            case 'resume_completed':
                $hasExp = $profile->experiences()->count() > 0;
                $hasEdu = $profile->educations()->count() > 0;
                return (($profile->profile_completeness ?? 0) >= 100 && $hasExp && $hasEdu) ? 1 : 0;

            case 'secret_clicks':
                return (int) ($stats->profile_views ?? 0) >= 10 ? 10 : (int) ($stats->profile_views ?? 0);

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
