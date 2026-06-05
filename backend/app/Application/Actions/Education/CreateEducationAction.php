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
        return $this->educationRepository->create($dto->toArray());
    }
}
