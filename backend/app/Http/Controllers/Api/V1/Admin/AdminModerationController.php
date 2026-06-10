<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Infrastructure\Models\Report;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\AdminAudit;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminModerationController extends Controller
{
    /**
     * Lista todas as denúncias de perfis.
     */
    public function index(): JsonResponse
    {
        $reports = Report::with(['reporter', 'reportedProfile'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'reports' => $reports
        ]);
    }

    /**
     * Resolve ou arquiva uma denúncia específica.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:resolved,dismissed',
            'action' => 'nullable|string|in:hide_profile,activate_profile,none',
            'resolution_notes' => 'required|string|max:1000',
        ]);

        $report = Report::findOrFail($id);
        $user = $request->user();

        DB::transaction(function () use ($request, $report, $user) {
            $status = $request->input('status');
            $action = $request->input('action', 'none');
            $notes = $request->input('resolution_notes');

            // 1. Atualiza status da denúncia
            $report->update([
                'status' => $status,
                'resolution_notes' => $notes,
                'resolved_by_user_id' => $user->id
            ]);

            // 2. Executa a ação no perfil se for resolvida
            $profile = Profile::findOrFail($report->reported_profile_id);
            $oldActive = $profile->is_active;

            if ($status === 'resolved') {
                if ($action === 'hide_profile') {
                    $profile->update(['is_active' => false]);
                } elseif ($action === 'activate_profile') {
                    $profile->update(['is_active' => true]);
                }
            }

            // 3. Registra auditoria do administrador
            AdminAudit::create([
                'user_id' => $user->id,
                'action' => 'resolve_report',
                'auditable_type' => Report::class,
                'auditable_id' => $report->id,
                'old_values' => [
                    'status' => 'pending',
                    'profile_is_active' => $oldActive
                ],
                'new_values' => [
                    'status' => $status,
                    'action_applied' => $action,
                    'profile_is_active' => $profile->is_active,
                    'notes' => $notes
                ],
                'ip_address' => $request->ip()
            ]);
        });

        return response()->json([
            'message' => 'Report status updated successfully.',
            'report' => $report->fresh(['reporter', 'reportedProfile'])
        ]);
    }
}
