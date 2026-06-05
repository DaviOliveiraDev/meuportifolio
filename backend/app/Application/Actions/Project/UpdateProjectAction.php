<?php

namespace App\Application\Actions\Project;

use App\Application\DTOs\Project\UpdateProjectDTO;
use App\Domain\Repositories\ProjectRepositoryInterface;
use App\Infrastructure\Models\Project;
use DomainException;

class UpdateProjectAction
{
    public function __construct(
        private readonly ProjectRepositoryInterface $projectRepository
    ) {}

    /**
     * Executa a atualização de um projeto existente.
     *
     * @param string $projectId
     * @param UpdateProjectDTO $dto
     * @return Project
     * @throws DomainException
     */
    public function execute(string $projectId, UpdateProjectDTO $dto): Project
    {
        $project = $this->projectRepository->findById($projectId);
        
        if (!$project) {
            throw new DomainException('Projeto não encontrado.', 404);
        }

        // Regra de Negócio: Limite de no máximo 3 destacados por perfil
        if ($dto->isFeatured) {
            $featuredCount = Project::where('profile_id', $project->profile_id)
                ->where('is_featured', true)
                ->where('id', '!=', $projectId) // Exclui o próprio projeto da contagem
                ->count();

            if ($featuredCount >= 3) {
                throw new DomainException('Você pode ter no máximo 3 projetos destacados em seu perfil. Desmarque algum projeto destacado atual para destacar este.');
            }
        }

        return $this->projectRepository->update($projectId, $dto->toArray());
    }
}
