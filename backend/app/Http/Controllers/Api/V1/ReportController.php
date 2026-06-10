<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Models\Report;
use App\Infrastructure\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /**
     * Envia uma denúncia contra um perfil.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'reported_username' => 'required|string|exists:profiles,username',
            'reason' => 'required|string|max:500',
            'reported_type' => 'nullable|string|max:50',
            'reported_item_id' => 'nullable|uuid'
        ]);

        $reportedProfile = Profile::where('username', $request->input('reported_username'))->firstOrFail();
        $user = $request->user();

        // Obtém o perfil do relator (se houver, pois é opcional se não logado, mas aqui exigimos auth:sanctum)
        $reporterProfile = $user->profile;

        if ($reporterProfile && $reporterProfile->id === $reportedProfile->id) {
            return response()->json([
                'message' => 'You cannot report your own profile.'
            ], 422);
        }

        $report = Report::create([
            'reporter_profile_id' => $reporterProfile?->id,
            'reported_profile_id' => $reportedProfile->id,
            'reported_type' => $request->input('reported_type', 'profile'),
            'reported_item_id' => $request->input('reported_item_id'),
            'reason' => $request->input('reason'),
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Report submitted successfully. We will review it shortly.',
            'report' => $report
        ], 201); // Usamos status 201 Created para respostas de criação padrão (ou 200, mas 201 é padrão REST)
    }
}
