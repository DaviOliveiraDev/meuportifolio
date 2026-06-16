<?php

namespace App\Application\Actions\Experience;

use App\Application\DTOs\Experience\CreateExperienceDTO;
use App\Domain\Repositories\ExperienceRepositoryInterface;
use App\Infrastructure\Models\Experience;

class CreateExperienceAction
{
    public function __construct(
        private readonly ExperienceRepositoryInterface $experienceRepository
    ) {}

    public function execute(CreateExperienceDTO $dto): Experience
    {
        $experience = $this->experienceRepository->create($dto->toArray());

        if ($dto->technologies !== null) {
            $legacyIds = collect($dto->technologies)->map(function ($item) {
                return is_string($item) ? $item : ($item['id'] ?? $item['technology_id'] ?? null);
            })->filter()->toArray();
            
            $experience->technologies()->sync($legacyIds);
            
            app(\App\Domain\Gamification\Services\Reputation\EvidenceSyncService::class)->syncExperience($experience, $dto->technologies);
        }

        if ($experience->profile) {
            $xpManager = app(\App\Domain\Services\XpManagerService::class);
            $xpManager->awardXpForAction($experience->profile, 'add_experience');
            \App\Jobs\UpdateDeveloperCardJob::dispatch($experience->profile);
        }

        return $experience;
    }
}
