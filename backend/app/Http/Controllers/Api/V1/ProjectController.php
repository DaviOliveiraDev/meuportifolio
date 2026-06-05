<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Actions\Project\CreateProjectAction;
use App\Application\Actions\Project\UpdateProjectAction;
use App\Application\DTOs\Project\CreateProjectDTO;
use App\Application\DTOs\Project\UpdateProjectDTO;
use App\Domain\Repositories\ProjectRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectRepositoryInterface $projectRepository
    ) {}

    /**
     * Lista todos os projetos vinculados ao perfil do usuário autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $projects = $this->projectRepository->allForProfile($profile->id);

        return response()->json([
            'projects' => $projects,
        ]);
    }

    /**
     * Cria um novo projeto sob o perfil do usuário logado.
     */
    public function store(CreateProjectRequest $request, CreateProjectAction $action): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        try {
            $dto = CreateProjectDTO::fromRequest($request, $profile->id);
            $project = $action->execute($dto);

            return response()->json([
                'message' => 'Projeto criado com sucesso.',
                'project' => $project,
            ], 201);
        } catch (DomainException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Retorna detalhes de um projeto específico de posse do usuário.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $project = $this->projectRepository->findById($id);

        if (!$project) {
            return response()->json(['message' => 'Projeto não encontrado.'], 404);
        }

        // Validação de posse do recurso
        if ($project->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para visualizar este recurso.'], 403);
        }

        return response()->json([
            'project' => $project,
        ]);
    }

    /**
     * Atualiza um projeto específico.
     */
    public function update(UpdateProjectRequest $request, string $id, UpdateProjectAction $action): JsonResponse
    {
        $project = $this->projectRepository->findById($id);

        if (!$project) {
            return response()->json(['message' => 'Projeto não encontrado.'], 404);
        }

        // Validação de posse do recurso
        if ($project->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para alterar este recurso.'], 403);
        }

        try {
            $dto = UpdateProjectDTO::fromRequest($request);
            $updatedProject = $action->execute($id, $dto);

            return response()->json([
                'message' => 'Projeto atualizado com sucesso.',
                'project' => $updatedProject,
            ]);
        } catch (DomainException $e) {
            $statusCode = $e->getCode() === 404 ? 404 : 422;
            return response()->json([
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    /**
     * Remove um projeto específico.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $project = $this->projectRepository->findById($id);

        if (!$project) {
            return response()->json(['message' => 'Projeto não encontrado.'], 404);
        }

        // Validação de posse do recurso
        if ($project->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para remover este recurso.'], 403);
        }

        $this->projectRepository->delete($id);

        return response()->json([
            'message' => 'Projeto removido com sucesso.',
        ]);
    }
}
