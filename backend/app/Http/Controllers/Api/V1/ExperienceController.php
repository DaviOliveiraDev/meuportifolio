<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Actions\Experience\CreateExperienceAction;
use App\Application\Actions\Experience\UpdateExperienceAction;
use App\Application\DTOs\Experience\CreateExperienceDTO;
use App\Application\DTOs\Experience\UpdateExperienceDTO;
use App\Domain\Repositories\ExperienceRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Experience\CreateExperienceRequest;
use App\Http\Requests\Experience\UpdateExperienceRequest;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function __construct(
        private readonly ExperienceRepositoryInterface $experienceRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $experiences = $this->experienceRepository->allForProfile($profile->id)->load('technologies');

        return response()->json([
            'experiences' => $experiences,
        ]);
    }

    public function store(CreateExperienceRequest $request, CreateExperienceAction $action): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        try {
            $dto = CreateExperienceDTO::fromRequest($request, $profile->id);
            $experience = $action->execute($dto);

            return response()->json([
                'message' => 'Experiência profissional adicionada com sucesso.',
                'experience' => $experience->load('technologies'),
            ], 201);
        } catch (DomainException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $experience = $this->experienceRepository->findById($id);

        if (!$experience) {
            return response()->json(['message' => 'Experiência profissional não encontrada.'], 404);
        }

        if ($experience->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para visualizar este recurso.'], 403);
        }

        return response()->json([
            'experience' => $experience->load('technologies'),
        ]);
    }

    public function update(UpdateExperienceRequest $request, string $id, UpdateExperienceAction $action): JsonResponse
    {
        $experience = $this->experienceRepository->findById($id);

        if (!$experience) {
            return response()->json(['message' => 'Experiência profissional não encontrada.'], 404);
        }

        if ($experience->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para alterar este recurso.'], 403);
        }

        try {
            $dto = UpdateExperienceDTO::fromRequest($request);
            $updatedExperience = $action->execute($id, $dto);

            return response()->json([
                'message' => 'Experiência profissional atualizada com sucesso.',
                'experience' => $updatedExperience->load('technologies'),
            ]);
        } catch (DomainException $e) {
            $statusCode = $e->getCode() === 404 ? 404 : 422;
            return response()->json([
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $experience = $this->experienceRepository->findById($id);

        if (!$experience) {
            return response()->json(['message' => 'Experiência profissional não encontrada.'], 404);
        }

        if ($experience->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para remover este recurso.'], 403);
        }

        $this->experienceRepository->delete($id);

        return response()->json([
            'message' => 'Experiência profissional removida com sucesso.',
        ]);
    }
}
