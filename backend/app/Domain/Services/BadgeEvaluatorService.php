<?php

namespace App\Domain\Services;

use App\Infrastructure\Models\Badge;
use App\Infrastructure\Models\Profile;

class BadgeEvaluatorService
{
    public function __construct(
        protected XpManagerService $xpManager
    ) {}

    /**
     * Avalia e concede as conquistas (badges) que o desenvolvedor atinge.
     */
    public function evaluateAndAwardBadges(Profile $profile): void
    {
        // Garante que temos as conquistas padrão cadastradas no banco
        $this->ensureDefaultBadgesExist();

        $activeBadges = Badge::where('is_active', true)->get();
        $unlockedBadgeIds = $profile->badges()->pluck('badges.id')->toArray();

        foreach ($activeBadges as $badge) {
            // Se já tem a badge, pula
            if (in_array($badge->id, $unlockedBadgeIds)) {
                continue;
            }

            if ($this->checkCriteria($profile, $badge)) {
                // Desbloqueia badge
                $profile->badges()->attach($badge->id, ['unlocked_at' => now()]);
                
                // Concede XP por desbloquear conquista
                $this->xpManager->awardXpForAction($profile, 'unlock_badge');
            }
        }
    }

    /**
     * Valida os critérios específicos de uma conquista.
     */
    private function checkCriteria(Profile $profile, Badge $badge): bool
    {
        return match ($badge->name) {
            'Perfil Estrela' => $profile->profile_completeness >= 100,
            'Octocat Connect' => !empty($profile->github_url),
            'Currículo Exportado' => $profile->profile_completeness >= 40 && $this->hasCompletedPdf($profile),
            'Portfólio Ativo' => ($profile->projects()->count() >= 3),
            'Carreira em Foco' => ($profile->experiences()->count() >= 2),
            'Especialista' => ($profile->skills()->count() >= 5),
            default => false,
        };
    }

    /**
     * Verifica se o PDF foi gerado.
     */
    private function hasCompletedPdf(Profile $profile): bool
    {
        $pdfCache = \Illuminate\Support\Facades\Cache::get("pdf_resume_{$profile->id}");
        return $pdfCache && isset($pdfCache['status']) && $pdfCache['status'] === 'completed';
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
                'icon_path' => 'star',
                'rules_criteria' => ['type' => 'completeness', 'value' => 100],
            ],
            [
                'name' => 'Octocat Connect',
                'description' => 'Conectou com sucesso a conta do GitHub ao portfólio.',
                'icon_path' => 'github',
                'rules_criteria' => ['type' => 'github_connected', 'value' => true],
            ],
            [
                'name' => 'Currículo Exportado',
                'description' => 'Gerou o primeiro currículo em PDF otimizado para ATS.',
                'icon_path' => 'pdf',
                'rules_criteria' => ['type' => 'pdf_generated', 'value' => true],
            ],
            [
                'name' => 'Portfólio Ativo',
                'description' => 'Cadastrou pelo menos 3 projetos no portfólio.',
                'icon_path' => 'projects',
                'rules_criteria' => ['type' => 'projects_count', 'value' => 3],
            ],
            [
                'name' => 'Carreira em Foco',
                'description' => 'Adicionou pelo menos 2 experiências profissionais.',
                'icon_path' => 'experiences',
                'rules_criteria' => ['type' => 'experiences_count', 'value' => 2],
            ],
            [
                'name' => 'Especialista',
                'description' => 'Adicionou pelo menos 5 habilidades ao seu perfil.',
                'icon_path' => 'skills',
                'rules_criteria' => ['type' => 'skills_count', 'value' => 5],
            ],
        ];

        foreach ($defaultBadges as $badgeData) {
            Badge::firstOrCreate(
                ['name' => $badgeData['name']],
                [
                    'description' => $badgeData['description'],
                    'icon_path' => $badgeData['icon_path'],
                    'rules_criteria' => $badgeData['rules_criteria'],
                    'is_active' => true,
                ]
            );
        }
    }
}
