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

        if ($experience->profile) {
            $xpManager = app(\App\Domain\Services\XpManagerService::class);
            $xpManager->awardXpForAction($experience->profile, 'add_experience');
        }

        return $experience;
    }
}
