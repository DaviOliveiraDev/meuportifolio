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

        if ($education->profile) {
            $xpManager = app(\App\Domain\Services\XpManagerService::class);
            $xpManager->awardXpForAction($education->profile, 'add_education');
        }

        return $education;
    }
}
