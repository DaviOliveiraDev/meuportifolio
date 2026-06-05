<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Actions\Education\CreateEducationAction;
use App\Application\Actions\Education\UpdateEducationAction;
use App\Application\DTOs\Education\CreateEducationDTO;
use App\Application\DTOs\Education\UpdateEducationDTO;
use App\Domain\Repositories\EducationRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Education\CreateEducationRequest;
use App\Http\Requests\Education\UpdateEducationRequest;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function __construct(
        private readonly EducationRepositoryInterface $educationRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $educations = $this->educationRepository->allForProfile($profile->id);

        return response()->json([
            'educations' => $educations,
        ]);
    }

    public function store(CreateEducationRequest $request, CreateEducationAction $action): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        try {
            $dto = CreateEducationDTO::fromRequest($request, $profile->id);
            $education = $action->execute($dto);

            return response()->json([
                'message' => 'Formação acadêmica adicionada com sucesso.',
                'education' => $education,
            ], 201);
        } catch (DomainException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $education = $this->educationRepository->findById($id);

        if (!$education) {
            return response()->json(['message' => 'Formação acadêmica não encontrada.'], 404);
        }

        if ($education->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para visualizar este recurso.'], 403);
        }

        return response()->json([
            'education' => $education,
        ]);
    }

    public function update(UpdateEducationRequest $request, string $id, UpdateEducationAction $action): JsonResponse
    {
        $education = $this->educationRepository->findById($id);

        if (!$education) {
            return response()->json(['message' => 'Formação acadêmica não encontrada.'], 404);
        }

        if ($education->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para alterar este recurso.'], 403);
        }

        try {
            $dto = UpdateEducationDTO::fromRequest($request);
            $updatedEducation = $action->execute($id, $dto);

            return response()->json([
                'message' => 'Formação acadêmica atualizada com sucesso.',
                'education' => $updatedEducation,
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
        $education = $this->educationRepository->findById($id);

        if (!$education) {
            return response()->json(['message' => 'Formação acadêmica não encontrada.'], 404);
        }

        if ($education->profile_id !== $request->user()->profile?->id) {
            return response()->json(['message' => 'Você não tem permissão para remover este recurso.'], 403);
        }

        $this->educationRepository->delete($id);

        return response()->json([
            'message' => 'Formação acadêmica removida com sucesso.',
        ]);
    }
}
