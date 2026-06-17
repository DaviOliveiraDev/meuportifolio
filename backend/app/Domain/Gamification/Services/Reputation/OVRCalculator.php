<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Collection;

class OVRCalculator
{
    /**
     * Calcula o OVR (Overall Rating) do desenvolvedor e anexa os componentes calculados no $domainScores.
     */
    public function calculate(string $userId, Collection $domainScores, Collection $evidences): float
    {
        $domains = $domainScores->get('domains', collect());
        $skills = $domainScores->get('skills', collect());

        // 1. Technical Depth
        // TechnicalDepth = max(domain_scores.top3_average) * 0.7 + top_skill_score_average(5) * 0.3
        $top3DomainAvg = 0.0;
        if ($domains->isNotEmpty()) {
            $top3DomainAvg = $domains->pluck('score')->sortDesc()->take(3)->average() ?? 0.0;
        }

        $top5SkillAvg = 0.0;
        if ($skills->isNotEmpty()) {
            $top5SkillAvg = $skills->pluck('score')->sortDesc()->take(5)->average() ?? 0.0;
        }

        $technicalDepth = ($top3DomainAvg * 0.7) + ($top5SkillAvg * 0.3);

        // 2. Delivery Impact
        // DeliveryImpact = production_projects_score * 0.4 + employment_quality_score * 0.4 + impact_statements_score * 0.2
        $productionProjectsScore = 0.0;
        $employmentQualityScore = 0.0;
        $impactStatementsScore = 30.0; // Base de impacto padrão

        foreach ($evidences as $evidence) {
            if ($evidence->evidence_type === 'project') {
                $project = $evidence->projectDetail;
                if ($project && $project->is_production) {
                    $projVal = 30.0; // Personal
                    switch ($project->user_scale ?? 'personal') {
                        case 'massive': $projVal = 95.0; break;
                        case 'large': $projVal = 85.0; break;
                        case 'medium': $projVal = 70.0; break;
                        case 'small': $projVal = 50.0; break;
                    }
                    $productionProjectsScore = max($productionProjectsScore, $projVal);
                }
            } elseif ($evidence->evidence_type === 'experience') {
                $exp = $evidence->experienceDetail;
                if ($exp) {
                    $expVal = 50.0; // Company default
                    switch ($exp->company_tier ?? 'company') {
                        case 'tier1_global': $expVal = 95.0; break;
                        case 'tier1_br': $expVal = 85.0; break;
                        case 'startup_funded': $expVal = 70.0; break;
                        case 'freelance': $expVal = 35.0; break;
                    }
                    $employmentQualityScore = max($employmentQualityScore, $expVal);

                    // Impacto de descrição detalhada
                    if (strlen($exp->description ?? '') > 120) {
                        $impactStatementsScore = max($impactStatementsScore, 80.0);
                    }
                }
            }
        }

        $deliveryImpact = ($productionProjectsScore * 0.4) + ($employmentQualityScore * 0.4) + ($impactStatementsScore * 0.2);

        // 3. Scope Influence
        // ScopeInfluence = leadership_evidence_score * 0.5 + oss_adoption_score * 0.3 + mentorship_score * 0.2
        $leadershipEvidenceScore = 30.0;
        $ossAdoptionScore = 0.0;
        $mentorshipScore = 30.0;

        foreach ($evidences as $evidence) {
            if ($evidence->evidence_type === 'experience') {
                $exp = $evidence->experienceDetail;
                if ($exp) {
                    $roleLower = strtolower($exp->role_title ?? '');
                    if (preg_match('/(lead|architect|principal|cto|director|manager|head|co-founder)/', $roleLower)) {
                        $leadershipEvidenceScore = max($leadershipEvidenceScore, 90.0);
                        $mentorshipScore = max($mentorshipScore, 85.0);
                    } elseif (str_contains($roleLower, 'senior') || str_contains($roleLower, 'sênior')) {
                        $leadershipEvidenceScore = max($leadershipEvidenceScore, 65.0);
                        $mentorshipScore = max($mentorshipScore, 60.0);
                    }

                    if (preg_match('/(mentor|train|lead|help|guide|teach)/', strtolower($exp->description ?? ''))) {
                        $mentorshipScore = max($mentorshipScore, 70.0);
                    }
                }
            } elseif ($evidence->evidence_type === 'project') {
                $project = $evidence->projectDetail;
                if ($project && $project->is_open_source) {
                    $ossVal = 50.0;
                    $stars = $project->github_stars ?? 0;
                    if ($stars > 100) {
                        $ossVal = 90.0;
                    } elseif ($stars > 10) {
                        $ossVal = 70.0;
                    }
                    $ossAdoptionScore = max($ossAdoptionScore, $ossVal);
                }
            }
        }

        $scopeInfluence = ($leadershipEvidenceScore * 0.5) + ($ossAdoptionScore * 0.3) + ($mentorshipScore * 0.2);

        // 4. Breadth Adaptability
        // BreadthAdapt = domains_with_score_above_40 * 10 [max 50] + unique_tech_categories_count * 5 [max 25] + recent_learning_signal * 25
        $domainsAbove40Count = $domains->where('score', '>=', 40.0)->count();
        $domainPoints = min(50.0, $domainsAbove40Count * 10.0);

        // Obter categorias únicas de tecnologias usadas
        $techIds = $skills->pluck('technology_id');
        $uniqueCategoriesCount = \App\Infrastructure\Models\Technology::whereIn('id', $techIds)->pluck('category')->unique()->count();
        $categoryPoints = min(25.0, $uniqueCategoriesCount * 5.0);

        // Sinal de aprendizado recente (nos últimos 6 meses)
        $recentLearningSignal = 10.0;
        foreach ($evidences as $evidence) {
            $date = $evidence->end_date ?? $evidence->start_date;
            if ($evidence->is_current || ($date && \Carbon\Carbon::parse($date)->diffInMonths(now()) <= 6)) {
                $recentLearningSignal = 25.0;
                break;
            }
        }

        $breadthAdapt = $domainPoints + $categoryPoints + $recentLearningSignal;

        // 5. Community Visibility
        // CommunityVis = oss_project_score * 0.4 + speaking_writing_score * 0.3 + peer_validation_score * 0.3
        $ossProjectScore = 0.0;
        $speakingWritingScore = 30.0;
        $peerValidationScore = 40.0;

        foreach ($evidences as $evidence) {
            if ($evidence->evidence_type === 'github') {
                $github = $evidence->githubDetail;
                if ($github) {
                    $stars = $github->stars ?? 0;
                    $forks = $github->forks ?? 0;
                    $ossProjectScore = max($ossProjectScore, min(99.0, ($stars * 2.0) + ($forks * 5.0)));
                }
            }

            if ($evidence->verification_level === 'socially_verified' || $evidence->verification_level === 'social') {
                $peerValidationScore = 80.0;
            }
        }

        $communityVis = ($ossProjectScore * 0.4) + ($speakingWritingScore * 0.3) + ($peerValidationScore * 0.3);

        // OVR final ponderado (0 a 99)
        $rawOvr = ($technicalDepth * 0.25) + ($deliveryImpact * 0.25) + ($scopeInfluence * 0.20) + ($breadthAdapt * 0.15) + ($communityVis * 0.15);
        $finalOvr = round(min(99.0, max(0.0, $rawOvr)), 1);

        // Anexa os componentes calculados ao $domainScores para serem persistidos
        $domainScores->put('ovr_components', [
            'technical_depth' => round($technicalDepth, 1),
            'delivery_impact' => round($deliveryImpact, 1),
            'scope_influence' => round($scopeInfluence, 1),
            'breadth_adaptability' => round($breadthAdapt, 1),
            'community_visibility' => round($communityVis, 1),
        ]);

        return $finalOvr;
    }
}
