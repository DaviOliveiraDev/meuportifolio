<?php

namespace App\Application\Actions\Project;

use App\Application\DTOs\Project\CreateProjectDTO;
use App\Domain\Repositories\ProjectRepositoryInterface;
use App\Infrastructure\Models\Project;
use DomainException;

class CreateProjectAction
{
    public function __construct(
        private readonly ProjectRepositoryInterface $projectRepository
    ) {}

    /**
     * Executa a criação de um novo projeto, validando as regras de negócio de destaque.
     *
     * @param CreateProjectDTO $dto
     * @return Project
     * @throws DomainException
     */
    public function execute(CreateProjectDTO $dto): Project
    {
        // Regra de Negócio: Limite de no máximo 3 projetos destacados (featured) por perfil
        if ($dto->isFeatured) {
            $featuredCount = Project::where('profile_id', $dto->profileId)
                ->where('is_featured', true)
                ->count();

            if ($featuredCount >= 3) {
                throw new DomainException('Você pode ter no máximo 3 projetos destacados em seu perfil. Desmarque algum projeto destacado atual para destacar este.');
            }
        }

        $project = $this->projectRepository->create($dto->toArray());

        if ($dto->technologies !== null) {
            $project->technologies()->sync($dto->technologies);
        }

        if ($project->profile) {
            $xpManager = app(\App\Domain\Services\XpManagerService::class);
            $xpManager->awardXpForAction($project->profile, 'add_project');
            \App\Jobs\UpdateDeveloperCardJob::dispatch($project->profile);
        }

        return $project;
    }
}
