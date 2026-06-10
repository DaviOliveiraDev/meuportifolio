<?php

namespace App\Application\Actions\Education;

use App\Application\DTOs\Education\UpdateEducationDTO;
use App\Domain\Repositories\EducationRepositoryInterface;
use App\Infrastructure\Models\Education;
use DomainException;

class UpdateEducationAction
{
    public function __construct(
        private readonly EducationRepositoryInterface $educationRepository
    ) {}

    public function execute(string $id, UpdateEducationDTO $dto): Education
    {
        $education = $this->educationRepository->findById($id);

        if (!$education) {
            throw new DomainException('Formação acadêmica não encontrada.', 404);
        }

        $updatedEducation = $this->educationRepository->update($id, $dto->toArray());

        if ($dto->technologies !== null) {
            $updatedEducation->technologies()->sync($dto->technologies);
        }

        return $updatedEducation;
    }
}
