<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Domain\Services\OvrEngineService;
use App\Infrastructure\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CompareController extends Controller
{
    public function __construct(
        protected OvrEngineService $ovrEngine
    ) {}

    /**
     * Compara dois perfis e retorna o OVR e breakdown de sub-scores.
     */
    public function compare(Request $request): JsonResponse
    {
        $usersParam = $request->query('users');
        if (!$usersParam) {
            return response()->json([
                'message' => 'Please provide the "users" query parameter (e.g. ?users=davi,joao)'
            ], 422);
        }

        $usernames = explode(',', $usersParam);
        if (count($usernames) !== 2) {
            return response()->json([
                'message' => 'Comparison requires exactly two usernames.'
            ], 422);
        }

        $profile1 = Profile::where('username', trim($usernames[0]))
            ->where('is_active', true)
            ->with(['badges', 'skills', 'projects', 'experiences', 'educations'])
            ->first();

        $profile2 = Profile::where('username', trim($usernames[1]))
            ->where('is_active', true)
            ->with(['badges', 'skills', 'projects', 'experiences', 'educations'])
            ->first();

        if (!$profile1) {
            return response()->json([
                'message' => "Profile not found or inactive: {$usernames[0]}"
            ], 404);
        }

        if (!$profile2) {
            return response()->json([
                'message' => "Profile not found or inactive: {$usernames[1]}"
            ], 404);
        }

        // Retorna dados comparativos detalhados
        return response()->json([
            'user1' => [
                'id' => $profile1->id,
                'name' => $profile1->name,
                'username' => $profile1->username,
                'avatar_url' => $profile1->avatar_url,
                'role' => $profile1->role,
                'ovr' => $profile1->ovr,
                'level' => $profile1->level,
                'xp' => $profile1->xp,
                'badges_count' => $profile1->badges->count(),
                'breakdown' => $this->ovrEngine->getOvrBreakdown($profile1)
            ],
            'user2' => [
                'id' => $profile2->id,
                'name' => $profile2->name,
                'username' => $profile2->username,
                'avatar_url' => $profile2->avatar_url,
                'role' => $profile2->role,
                'ovr' => $profile2->ovr,
                'level' => $profile2->level,
                'xp' => $profile2->xp,
                'badges_count' => $profile2->badges->count(),
                'breakdown' => $this->ovrEngine->getOvrBreakdown($profile2)
            ]
        ]);
    }
}
