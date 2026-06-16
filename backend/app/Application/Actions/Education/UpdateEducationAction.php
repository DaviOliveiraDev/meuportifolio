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
            $legacyIds = collect($dto->technologies)->map(function ($item) {
                return is_string($item) ? $item : ($item['id'] ?? $item['technology_id'] ?? null);
            })->filter()->toArray();
            
            $updatedEducation->technologies()->sync($legacyIds);
            
            app(\App\Domain\Gamification\Services\Reputation\EvidenceSyncService::class)->syncEducation($updatedEducation, $dto->technologies);
        }

        if ($updatedEducation->profile) {
            \App\Jobs\UpdateDeveloperCardJob::dispatch($updatedEducation->profile);
        }

        return $updatedEducation;
    }
}
