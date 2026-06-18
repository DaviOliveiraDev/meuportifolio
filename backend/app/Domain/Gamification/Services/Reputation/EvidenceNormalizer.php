<?php

namespace App\Domain\Gamification\Services\Reputation;

use Illuminate\Support\Collection;
use Carbon\Carbon;

class EvidenceNormalizer
{
    /**
     * Normaliza as evidências brutas em pesos e fatores utilizáveis para o cálculo.
     */
    public function normalize(Collection $evidences): Collection
    {
        // Eager load relations to prevent N+1 queries
        if ($evidences instanceof \Illuminate\Database\Eloquent\Collection) {
            $evidences->load([
                'projectDetail',
                'experienceDetail',
                'educationDetail',
                'certificationDetail',
                'githubDetail',
                'technologies'
            ]);
        }

        $normalized = collect();

        foreach ($evidences as $evidence) {
            $recencyFactor = $this->calculateRecencyFactor($evidence);
            $verificationFactor = $this->calculateVerificationFactor($evidence);

            foreach ($evidence->technologies as $tech) {
                $pivot = $tech->pivot;
                $isPrimary = (bool) ($pivot->is_primary ?? false);
                $depthFactor = $this->calculateDepthFactor($pivot->usage_depth ?? 'used');
                $baseWeight = $this->calculateBaseWeight($evidence, $isPrimary);

                $normalized->push((object) [
                    'user_id' => $evidence->user_id,
                    'evidence_id' => $evidence->id,
                    'evidence_type' => $evidence->evidence_type,
                    'technology_id' => $tech->id,
                    'base_weight' => (float) $baseWeight,
                    'recency_factor' => (float) $recencyFactor,
                    'verification_factor' => (float) $verificationFactor,
                    'depth_factor' => (float) $depthFactor,
                    'is_primary' => $isPrimary,
                ]);
            }
        }

        return $normalized;
    }

    /**
     * Calcula o peso base da evidência.
     */
    protected function calculateBaseWeight($evidence, bool $isPrimary): float
    {
        switch ($evidence->evidence_type) {
            case 'github':
                $github = $evidence->githubDetail;
                if ($github) {
                    if ($github->is_owner) {
                        // github_repo_owner: 30 base | max 60 (se produção + dependentes)
                        $weight = 30.0;
                        if ($github->npm_dependents > 0 || $github->pypi_dependents > 0) {
                            $weight += min(30.0, ($github->npm_dependents + $github->pypi_dependents) * 5.0);
                        }
                        return $weight;
                    } else {
                        // github_contribution: 15 base | max 30 (se mais de 5 PRs mergeados)
                        $weight = 15.0;
                        $weight += min(15.0, ($github->prs_merged ?? 0) * 3.0);
                        return $weight;
                    }
                }
                return 15.0;

            case 'experience':
                $exp = $evidence->experienceDetail;
                $tier = $exp->company_tier ?? 'company';
                
                // Categoria primary vs secondary
                $base = $isPrimary ? 25.0 : 15.0;
                
                // Multiplicador/bônus de tier da empresa
                $tierBonus = 0.0;
                switch ($tier) {
                    case 'tier1_global':
                        $tierBonus = $isPrimary ? 15.0 : 10.0;
                        break;
                    case 'tier1_br':
                        $tierBonus = $isPrimary ? 10.0 : 7.0;
                        break;
                    case 'startup_funded':
                        $tierBonus = $isPrimary ? 5.0 : 4.0;
                        break;
                    case 'freelance':
                        $tierBonus = $isPrimary ? -5.0 : -3.0;
                        break;
                    case 'company':
                    default:
                        $tierBonus = 0.0;
                        break;
                }
                return $base + $tierBonus;

            case 'project':
                $project = $evidence->projectDetail;
                if ($project) {
                    if ($project->is_open_source) {
                        // open_source_package: 25 base | max 50 (baseado em downloads)
                        $weight = 25.0;
                        $downloads = ($project->npm_downloads ?? 0) + ($project->pypi_downloads ?? 0);
                        $weight += min(25.0, $downloads / 400.0);
                        return $weight;
                    }

                    if ($project->is_production) {
                        // project_production: 20 base | max 45 (se escala de usuários grande)
                        $weight = 20.0;
                        switch ($project->user_scale ?? 'personal') {
                            case 'massive':
                                $weight += 25.0;
                                break;
                            case 'large':
                                $weight += 20.0;
                                break;
                            case 'medium':
                                $weight += 10.0;
                                break;
                            case 'small':
                                $weight += 5.0;
                                break;
                        }
                        return $weight;
                    } else {
                        // project_development: 12 base | max 20
                        $weight = 12.0;
                        switch ($project->user_scale ?? 'personal') {
                            case 'massive':
                            case 'large':
                                $weight += 8.0;
                                break;
                            case 'medium':
                                $weight += 5.0;
                                break;
                            case 'small':
                                $weight += 2.0;
                                break;
                        }
                        return $weight;
                    }
                }
                return 12.0;

            case 'certification':
                $cert = $evidence->certificationDetail;
                if ($cert) {
                    $isMajor = in_array($cert->issuer_tier ?? '', ['major', 'tier1']);
                    $base = $isMajor ? 20.0 : 8.0;
                    $bonus = 0.0;
                    if ($cert->is_verified) {
                        $bonus = $isMajor ? 5.0 : 4.0;
                    }
                    return $base + $bonus;
                }
                return 8.0;

            case 'education':
                $edu = $evidence->educationDetail;
                $base = 5.0;
                if ($edu && in_array($edu->institution_tier ?? '', ['tier1', 'top'])) {
                    $base += 5.0;
                }
                return $base;

            default:
                return 5.0;
        }
    }

    /**
     * Calcula o fator de recência da evidência.
     */
    protected function calculateRecencyFactor($evidence): float
    {
        if ($evidence->is_current) {
            return 1.0;
        }

        $date = null;
        if ($evidence->end_date) {
            $date = Carbon::parse($evidence->end_date);
        } elseif ($evidence->start_date) {
            $date = Carbon::parse($evidence->start_date);
        }

        if (!$date) {
            return 1.0;
        }

        $monthsAgo = $date->diffInMonths(now());
        $recency = exp(-$monthsAgo / 30.0);
        $minRecency = 0.3;

        // Experiências profissionais não decaem abaixo de 0.5
        if ($evidence->evidence_type === 'experience') {
            $minRecency = 0.5;
        }

        return max($minRecency, $recency);
    }

    /**
     * Calcula o fator de verificação da evidência.
     */
    protected function calculateVerificationFactor($evidence): float
    {
        $level = $evidence->verification_level;

        if ($level === 'auto' || $level === 'auto_verified') {
            return 1.0;
        } elseif ($level === 'social' || $level === 'socially_verified') {
            return 0.8;
        }

        return 0.5;
    }

    /**
     * Calcula o fator de profundidade com base na categoria de uso.
     */
    protected function calculateDepthFactor(string $depth): float
    {
        switch ($depth) {
            case 'mentioned':
                return 0.3;
            case 'primary':
                return 0.9;
            case 'expert':
                return 1.0;
            case 'used':
            default:
                return 0.6;
        }
    }
}
