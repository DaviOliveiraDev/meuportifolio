<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Actions\Profile\UpdateProfileUseCase;
use App\Application\DTOs\Profile\UpdateProfileDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Retorna o perfil profissional do usuário logado.
     */
    public function show(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        return response()->json([
            'profile' => $profile->load(['experiences', 'educations', 'skills'])
        ]);
    }

    /**
     * Atualiza o perfil profissional do usuário logado.
     */
    public function update(UpdateProfileRequest $request, UpdateProfileUseCase $useCase): JsonResponse
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        try {
            $dto = UpdateProfileDTO::fromRequest($request);
            $updatedProfile = $useCase->execute($profile->id, $dto);

            return response()->json([
                'message' => 'Perfil atualizado com sucesso.',
                'profile' => $updatedProfile->load(['experiences', 'educations', 'skills']),
            ]);
        } catch (DomainException $e) {
            $statusCode = $e->getCode() === 404 ? 404 : 422;
            return response()->json([
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }
}
