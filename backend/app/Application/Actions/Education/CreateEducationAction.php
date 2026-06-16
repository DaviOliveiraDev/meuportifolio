<?php

namespace App\Application\Actions\Education;

use App\Application\DTOs\Education\CreateEducationDTO;
use App\Domain\Repositories\EducationRepositoryInterface;
use App\Infrastructure\Models\Education;

class CreateEducationAction
{
    public function __construct(
        private readonly EducationRepositoryInterface $educationRepository
    ) {}

    public function execute(CreateEducationDTO $dto): Education
    {
        $education = $this->educationRepository->create($dto->toArray());

        if ($dto->technologies !== null) {
            $legacyIds = collect($dto->technologies)->map(function ($item) {
                return is_string($item) ? $item : ($item['id'] ?? $item['technology_id'] ?? null);
            })->filter()->toArray();
            
            $education->technologies()->sync($legacyIds);
            
            app(\App\Domain\Gamification\Services\Reputation\EvidenceSyncService::class)->syncEducation($education, $dto->technologies);
        }

        if ($education->profile) {
            $xpManager = app(\App\Domain\Services\XpManagerService::class);
            $xpManager->awardXpForAction($education->profile, 'add_education');
            \App\Jobs\UpdateDeveloperCardJob::dispatch($education->profile);
        }

        return $education;
    }
}
