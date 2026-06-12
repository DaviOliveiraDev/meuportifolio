<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Actions\Profile\UpdateProfileUseCase;
use App\Application\DTOs\Profile\UpdateProfileDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Domain\Gamification\Services\OvrEngineService;
use App\Infrastructure\Models\Badge;
use App\Infrastructure\Models\ProfileBadgeProgress;
use App\Infrastructure\Models\Title;
use App\Infrastructure\Models\Cosmetic;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'profile' => $profile->load(['experiences', 'educations', 'skills', 'badges', 'titles', 'cosmetics', 'technologies', 'technologyScores.technology'])
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
                'profile' => $updatedProfile->load(['experiences', 'educations', 'skills', 'badges', 'titles', 'cosmetics', 'technologies', 'technologyScores.technology']),
            ]);
        } catch (DomainException $e) {
            $statusCode = $e->getCode() === 404 ? 404 : 422;
            return response()->json([
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    /**
     * Retorna o catálogo de conquistas do usuário.
     */
    public function achievements(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $badges = Badge::where('is_active', true)->get();
        $unlockedBadgeIds = $profile->badges()->pluck('badges.id')->toArray();
        
        $progress = ProfileBadgeProgress::where('profile_id', $profile->id)
            ->get()
            ->keyBy('badge_id');

        $result = $badges->map(function ($badge) use ($unlockedBadgeIds, $progress) {
            $userProgress = $progress->get($badge->id);
            return [
                'id' => $badge->id,
                'name' => $badge->name,
                'description' => $badge->description,
                'category' => $badge->category,
                'rarity' => $badge->rarity,
                'xp_reward' => $badge->xp_reward,
                'icon_path' => $badge->icon_path,
                'is_secret' => $badge->is_secret,
                'unlocked' => in_array($badge->id, $unlockedBadgeIds),
                'current_value' => $userProgress ? $userProgress->current_value : 0,
                'target_value' => $userProgress ? $userProgress->target_value : 1,
            ];
        });

        return response()->json([
            'achievements' => $result
        ]);
    }

    /**
     * Retorna o detalhamento do OVR calculado.
     */
    public function ovrBreakdown(Request $request, OvrEngineService $ovrService): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }
        return response()->json($ovrService->getDetailedOvrBreakdown($profile));
    }

    /**
     * Retorna o catálogo de cosméticos e títulos do usuário.
     */
    public function cosmeticsCatalog(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $allTitles = Title::where('is_active', true)->with('badge')->get();
        $unlockedTitleIds = $profile->titles()->pluck('titles.id')->toArray();
        $equippedTitleObj = $profile->titles()->wherePivot('is_equipped', true)->first();
        $equippedTitleId = $equippedTitleObj ? $equippedTitleObj->id : null;

        $titlesList = $allTitles->map(function ($title) use ($equippedTitleId) {
            return [
                'id' => $title->id,
                'name' => $title->name,
                'unlocked' => true, // Liberado para testes
                'is_equipped' => $title->id === $equippedTitleId,
                'unlock_requirement' => $title->badge ? "Conquiste '{$title->badge->name}'" : null
            ];
        });

        $allCosmetics = Cosmetic::with('badge')->get();
        $equippedCosmeticIds = $profile->cosmetics()->wherePivot('is_equipped', true)->pluck('cosmetics.id')->toArray();

        $cosmeticsList = $allCosmetics->map(function ($cosm) use ($equippedCosmeticIds) {
            $requirement = null;
            if ($cosm->unlock_badge_id && $cosm->badge) {
                $requirement = "Conquiste '{$cosm->badge->name}'";
            } elseif (str_starts_with($cosm->name, 'Moldura Silver')) {
                $requirement = "Alcance OVR 65+";
            } elseif (str_starts_with($cosm->name, 'Moldura Gold')) {
                $requirement = "Alcance OVR 75+";
            } elseif (str_starts_with($cosm->name, 'Moldura Diamond')) {
                $requirement = "Alcance OVR 85+";
            } elseif (str_starts_with($cosm->name, 'Moldura Legendary')) {
                $requirement = "Alcance OVR 95+";
            }

            return [
                'id' => $cosm->id,
                'name' => $cosm->name,
                'type' => $cosm->type,
                'value' => $cosm->value,
                'unlocked' => true, // Liberado para testes
                'is_equipped' => in_array($cosm->id, $equippedCosmeticIds),
                'unlock_requirement' => $requirement
            ];
        });

        return response()->json([
            'titles' => $titlesList,
            'cosmetics' => $cosmeticsList
        ]);
    }

    /**
     * Equipa um título selecionado.
     */
    public function equipTitle(Request $request, string $id): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $hasTitle = $profile->titles()->where('titles.id', $id)->exists();
        if (!$hasTitle) {
            $profile->titles()->attach($id, ['unlocked_at' => now()]);
        }

        DB::transaction(function () use ($profile, $id) {
            // Desequipa todos os títulos
            $profile->titles()->updateExistingPivot($profile->titles()->pluck('titles.id')->toArray(), ['is_equipped' => false]);
            // Equipa o selecionado
            $profile->titles()->updateExistingPivot($id, ['is_equipped' => true]);
        });

        return response()->json(['message' => 'Título equipado com sucesso!']);
    }

    /**
     * Desequipa um título selecionado.
     */
    public function unequipTitle(Request $request, string $id): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $profile->titles()->updateExistingPivot($id, ['is_equipped' => false]);

        return response()->json(['message' => 'Título desequipado com sucesso!']);
    }

    /**
     * Equipa um cosmético selecionado.
     */
    public function equipCosmetic(Request $request, string $id): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $cosmetic = Cosmetic::find($id);
        if (!$cosmetic) {
            return response()->json(['message' => 'Cosmético não encontrado.'], 404);
        }

        $hasCosmetic = $profile->cosmetics()->where('cosmetics.id', $id)->exists();
        if (!$hasCosmetic) {
            $profile->cosmetics()->attach($id, ['unlocked_at' => now()]);
        }

        // Re-read cosmetic reference from profile relationship to get correct object for transaction
        $cosmetic = $profile->cosmetics()->where('cosmetics.id', $id)->first();

        DB::transaction(function () use ($profile, $cosmetic) {
            // Desequipa todos os cosméticos do mesmo tipo
            $cosmeticsOfType = $profile->cosmetics()
                ->where('type', $cosmetic->type)
                ->pluck('cosmetics.id')
                ->toArray();

            if (!empty($cosmeticsOfType)) {
                $profile->cosmetics()->updateExistingPivot($cosmeticsOfType, ['is_equipped' => false]);
            }

            // Equipa o selecionado
            $profile->cosmetics()->updateExistingPivot($cosmetic->id, ['is_equipped' => true]);
            
            \Illuminate\Support\Facades\Cache::put("profile_cosmetic_equipped_{$profile->id}", 1, now()->addYear());
        });

        return response()->json(['message' => 'Cosmético equipado com sucesso!']);
    }

    /**
     * Desequipa um cosmético selecionado.
     */
    public function unequipCosmetic(Request $request, string $id): JsonResponse
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Perfil profissional não inicializado.'], 404);
        }

        $profile->cosmetics()->updateExistingPivot($id, ['is_equipped' => false]);

        return response()->json(['message' => 'Cosmético desequipado com sucesso!']);
    }
}
