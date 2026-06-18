<?php

namespace App\Application\Actions\Experience;

use App\Application\DTOs\Experience\UpdateExperienceDTO;
use App\Domain\Repositories\ExperienceRepositoryInterface;
use App\Infrastructure\Models\Experience;
use DomainException;

class UpdateExperienceAction
{
    public function __construct(
        private readonly ExperienceRepositoryInterface $experienceRepository
    ) {}

    public function execute(string $id, UpdateExperienceDTO $dto): Experience
    {
        $experience = $this->experienceRepository->findById($id);

        if (!$experience) {
            throw new DomainException('Experiência não encontrada.', 404);
        }

        $updatedExperience = $this->experienceRepository->update($id, $dto->toArray());

        if ($dto->technologies !== null) {
            $legacyIds = collect($dto->technologies)->map(function ($item) {
                return is_string($item) ? $item : ($item['id'] ?? $item['technology_id'] ?? null);
            })->filter()->toArray();
            
            $updatedExperience->technologies()->sync($legacyIds);
            
            app(\App\Domain\Gamification\Services\Reputation\EvidenceSyncService::class)->syncExperience($updatedExperience, $dto->technologies);
        }

        if ($updatedExperience->profile) {
            \App\Jobs\UpdateDeveloperCardJob::dispatch($updatedExperience->profile);
        }

        return $updatedExperience;
    }
}
