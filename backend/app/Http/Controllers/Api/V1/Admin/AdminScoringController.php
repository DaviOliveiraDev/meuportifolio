<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\RecalculateAllProfilesOvrJob;
use App\Infrastructure\Models\ScoringConfig;
use App\Infrastructure\Models\ScoringConfigHistory;
use App\Infrastructure\Models\AdminAudit;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminScoringController extends Controller
{
    /**
     * Retorna a configuração ativa e histórico de alterações.
     */
    public function index(): JsonResponse
    {
        $activeConfig = ScoringConfig::where('is_active', true)->first();
        
        $history = ScoringConfigHistory::with('updatedBy')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'active_config' => $activeConfig,
            'default_weights' => [
                'experience' => 30,
                'projects' => 25,
                'skills_badges' => 15,
                'github' => 15,
                'education' => 10,
                'completeness' => 5,
            ],
            'history' => $history
        ]);
    }

    /**
     * Salva uma nova configuração de pesos e regras.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'weights' => 'required|array',
            'weights.experience' => 'required|integer|min:0|max:100',
            'weights.projects' => 'required|integer|min:0|max:100',
            'weights.skills_badges' => 'required|integer|min:0|max:100',
            'weights.github' => 'required|integer|min:0|max:100',
            'weights.education' => 'required|integer|min:0|max:100',
            'weights.completeness' => 'required|integer|min:0|max:100',
            'xp_rules' => 'nullable|array',
            'reason' => 'required|string|max:255',
            'recalculate' => 'nullable|boolean'
        ]);

        $weights = $request->input('weights');
        $sum = array_sum($weights);

        if ($sum !== 100) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'weights' => ['The sum of all weights must be exactly 100. Current sum is: ' . $sum]
            ]);
        }

        $user = $request->user();

        $newConfig = DB::transaction(function () use ($request, $weights, $user) {
            // 1. Busca a configuração ativa antiga
            $oldConfig = ScoringConfig::where('is_active', true)->first();

            // 2. Desativa configurações anteriores
            ScoringConfig::where('is_active', true)->update(['is_active' => false]);

            // 3. Cria a nova configuração
            $newConfig = ScoringConfig::create([
                'weights' => $weights,
                'xp_rules' => $request->input('xp_rules', []),
                'is_active' => true
            ]);

            // 4. Cria registro de histórico
            ScoringConfigHistory::create([
                'config_id' => $newConfig->id,
                'updated_by_user_id' => $user->id,
                'old_weights' => $oldConfig?->weights ?? [],
                'new_weights' => $weights,
                'reason' => $request->input('reason')
            ]);

            // 5. Registra na tabela de auditoria geral
            AdminAudit::create([
                'user_id' => $user->id,
                'action' => 'update_scoring_weights',
                'auditable_type' => ScoringConfig::class,
                'auditable_id' => $newConfig->id,
                'old_values' => ['weights' => $oldConfig?->weights ?? []],
                'new_values' => ['weights' => $weights],
                'ip_address' => $request->ip()
            ]);

            return $newConfig;
        });

        // 6. Agenda recalculo geral se solicitado
        if ($request->input('recalculate', false)) {
            RecalculateAllProfilesOvrJob::dispatch();
            $msg = 'Scoring configuration updated successfully. Batch recalculation dispatched.';
        } else {
            $msg = 'Scoring configuration updated successfully.';
        }

        return response()->json([
            'message' => $msg,
            'config' => $newConfig
        ]);
    }

    /**
     * Força o recalculo do OVR de todos os perfis.
     */
    public function recalculate(Request $request): JsonResponse
    {
        RecalculateAllProfilesOvrJob::dispatch();

        AdminAudit::create([
            'user_id' => $request->user()->id,
            'action' => 'recalculate_all_ovr_manual',
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'message' => 'Batch recalculation job dispatched successfully.'
        ]);
    }
}
