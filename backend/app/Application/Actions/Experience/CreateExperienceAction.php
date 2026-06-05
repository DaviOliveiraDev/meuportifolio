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
        return $this->experienceRepository->create($dto->toArray());
    }
}
