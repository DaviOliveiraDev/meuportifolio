<?php

namespace App\Domain\Services;

use App\Infrastructure\Models\Profile;
use Illuminate\Support\Facades\Cache;

class ProfileCompletenessCalculator
{
    /**
     * Calcula o percentual de completude do perfil de um desenvolvedor.
     *
     * Regras:
     * - Avatar preenchido: +15%
     * - Bio preenchida: +15%
     * - Ao menos 1 Projeto cadastrado: +15%
     * - Ao menos 1 Experiência cadastrada: +15%
     * - Ao menos 1 Formação cadastrada: +15%
     * - Ao menos 3 Skills cadastradas: +10%
     * - GitHub conectado: +10%
     * - Currículo PDF gerado com sucesso: +10%
     */
    public function calculate(Profile $profile): int
    {
        $percentage = 0;

        // 1. Avatar preenchido (+15%)
        if (!empty($profile->avatar_url)) {
            $percentage += 15;
        }

        // 2. Bio preenchida (+15%)
        if (!empty($profile->bio)) {
            $percentage += 15;
        }

        // 3. Ao menos 1 Projeto cadastrado (+15%)
        $hasProjects = $profile->relationLoaded('projects')
            ? $profile->projects->count() > 0
            : $profile->projects()->exists();
        if ($hasProjects) {
            $percentage += 15;
        }

        // 4. Ao menos 1 Experiência cadastrada (+15%)
        $hasExperiences = $profile->relationLoaded('experiences')
            ? $profile->experiences->count() > 0
            : $profile->experiences()->exists();
        if ($hasExperiences) {
            $percentage += 15;
        }

        // 5. Ao menos 1 Formação cadastrada (+15%)
        $hasEducations = $profile->relationLoaded('educations')
            ? $profile->educations->count() > 0
            : $profile->educations()->exists();
        if ($hasEducations) {
            $percentage += 15;
        }

        // 6. Ao menos 3 Skills cadastradas (+10%)
        $skillsCount = $profile->relationLoaded('skills')
            ? $profile->skills->count()
            : $profile->skills()->count();
        if ($skillsCount >= 3) {
            $percentage += 10;
        }

        // 7. GitHub conectado (+10%)
        if (!empty($profile->github_url)) {
            $percentage += 10;
        }

        // 8. Currículo PDF gerado com sucesso (+10%)
        $pdfCache = Cache::get("pdf_resume_{$profile->id}");
        if ($pdfCache && isset($pdfCache['status']) && $pdfCache['status'] === 'completed') {
            $percentage += 10;
        }

        return min(100, $percentage);
    }
}
