<?php

namespace App\Domain\Gamification\Services\Reputation;

use App\Infrastructure\Models\TechDomain;
use Illuminate\Support\Collection;

class DNAProfileBuilder
{
    /**
     * Define o perfil de DNA tecnológico do desenvolvedor.
     */
    public function build(string $userId, Collection $domainScores, Collection $skillScores): array
    {
        $domains = $domainScores->get('domains', collect());

        if ($domains->isEmpty()) {
            return [
                'primary_domain_id' => null,
                'secondary_domain_id' => null,
                'profile_label' => 'Generalist Engineer',
            ];
        }

        // 1. Mapeia os scores de domínio pelos seus respectivos slugs
        $domainModels = TechDomain::all()->keyBy('id');
        $scoresBySlug = [];

        foreach ($domains as $ds) {
            $domainModel = $domainModels->get($ds->domain_id);
            if ($domainModel) {
                $scoresBySlug[$domainModel->slug] = $ds->score;
            }
        }

        $backend = $scoresBySlug['backend'] ?? 0.0;
        $frontend = $scoresBySlug['frontend'] ?? 0.0;
        $mobile = $scoresBySlug['mobile'] ?? 0.0;
        $devops = $scoresBySlug['devops-cloud'] ?? 0.0;
        $data = $scoresBySlug['data-engineering'] ?? 0.0;
        $aiMl = $scoresBySlug['ai-ml'] ?? 0.0;
        $security = $scoresBySlug['security'] ?? 0.0;

        // 2. Classifica o rótulo com base nos thresholds de domínio
        $label = 'Generalist Engineer';

        if ($backend >= 70.0 && $frontend < 50.0) {
            $label = 'Backend Specialist';
        } elseif ($frontend >= 70.0 && $backend < 50.0) {
            $label = 'Frontend Specialist';
        } elseif ($backend >= 55.0 && $frontend >= 55.0) {
            $label = 'Full Stack Engineer';
        } elseif ($mobile >= 65.0) {
            $label = 'Mobile Engineer';
        } elseif ($devops >= 65.0) {
            $label = 'Platform Engineer';
        } elseif ($data >= 65.0) {
            $label = 'Data Engineer';
        } elseif ($aiMl >= 65.0) {
            $label = 'AI/ML Engineer';
        } elseif ($security >= 65.0) {
            $label = 'Security Engineer';
        }

        // 3. Determina o domínio primário e secundário (maiores pontuações)
        $sortedDomains = $domains->sortByDesc('score')->values();
        $primaryDomainId = null;
        $secondaryDomainId = null;

        if ($sortedDomains->count() > 0 && $sortedDomains[0]->score > 0.0) {
            $primaryDomainId = $sortedDomains[0]->domain_id;
        }
        if ($sortedDomains->count() > 1 && $sortedDomains[1]->score > 0.0) {
            $secondaryDomainId = $sortedDomains[1]->domain_id;
        }

        return [
            'primary_domain_id' => $primaryDomainId,
            'secondary_domain_id' => $secondaryDomainId,
            'profile_label' => $label,
        ];
    }
}
