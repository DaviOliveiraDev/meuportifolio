<?php

namespace App\Domain\Gamification\Services\Reputation;

use App\Infrastructure\Models\UserReputationScore;
use App\Infrastructure\Models\UserSkillScore;
use App\Infrastructure\Models\UserCompetencyScore;
use App\Infrastructure\Models\UserDomainScore;
use App\Infrastructure\Models\UserScoreHistory;
use App\Infrastructure\Models\TechDomain;
use App\Infrastructure\Models\Technology;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class ScorePersister
{
    /**
     * Persiste os scores recalculados no banco de dados e retorna o resultado.
     */
    public function persist(string $userId, array $data): UserReputationResult
    {
        return DB::transaction(function () use ($userId, $data) {
            $now = now();
            
            // 1. Obter score de reputação existente para obter OVR anterior e contadores
            $existing = UserReputationScore::find($userId);
            $previousOvr = $existing ? (float) $existing->ovr : 0.0;
            $previousComputedAt = $existing ? $existing->computed_at : null;
            $changeCountThisMonth = $existing ? $existing->change_count_this_month : 0;
            $lastSignificantChange = $existing ? $existing->last_significant_change : null;

            $ovr = (float) ($data['ovr'] ?? 0.0);

            // Incrementa contador se houver mudança significativa
            if (round($ovr) !== round($previousOvr)) {
                $changeCountThisMonth++;
                $lastSignificantChange = $now;
            }

            // 2. Salvar Skill Scores
            $skillScores = $data['skill_scores'] ?? collect();
            $newTechIds = [];
            foreach ($skillScores as $skillScore) {
                UserSkillScore::updateOrCreate(
                    ['user_id' => $userId, 'technology_id' => $skillScore->technology_id],
                    [
                        'score' => $skillScore->score,
                        'evidence_count' => $skillScore->evidence_count,
                        'score_breakdown' => $skillScore->score_breakdown,
                        'engine_version' => '2.0',
                        'computed_at' => $now,
                    ]
                );
                $newTechIds[] = $skillScore->technology_id;
            }
            // Deleta skills obsoletas (que não estão mais no cálculo)
            UserSkillScore::where('user_id', $userId)
                ->whereNotIn('technology_id', $newTechIds)
                ->delete();

            // 3. Salvar Competency Scores
            $competencyScores = $data['domain_scores'] ? $data['domain_scores']->get('competencies', collect()) : collect();
            $newCompIds = [];
            foreach ($competencyScores as $compScore) {
                UserCompetencyScore::updateOrCreate(
                    ['user_id' => $userId, 'competency_id' => $compScore->competency_id],
                    [
                        'score' => $compScore->score,
                        'top_technologies' => $compScore->top_technologies,
                        'engine_version' => '2.0',
                        'computed_at' => $now,
                    ]
                );
                $newCompIds[] = $compScore->competency_id;
            }
            UserCompetencyScore::where('user_id', $userId)
                ->whereNotIn('competency_id', $newCompIds)
                ->delete();

            // 4. Salvar Domain Scores
            $domainScores = $data['domain_scores'] ? $data['domain_scores']->get('domains', collect()) : collect();
            $newDomainIds = [];
            foreach ($domainScores as $domainScore) {
                UserDomainScore::updateOrCreate(
                    ['user_id' => $userId, 'domain_id' => $domainScore->domain_id],
                    [
                        'score' => $domainScore->score,
                        'top_technologies' => $domainScore->top_technologies,
                        'competency_breakdown' => $domainScore->competency_breakdown,
                        'engine_version' => '2.0',
                        'computed_at' => $now,
                    ]
                );
                $newDomainIds[] = $domainScore->domain_id;
            }
            UserDomainScore::where('user_id', $userId)
                ->whereNotIn('domain_id', $newDomainIds)
                ->delete();

            // 5. Coleta as top 5 tecnologias gerais
            $topSkills = $skillScores->sortByDesc('score')->take(5);
            $topTechIds = $topSkills->pluck('technology_id')->toArray();
            $techNames = Technology::whereIn('id', $topTechIds)->pluck('name', 'id')->toArray();

            $topTechsMap = [];
            foreach ($topSkills as $skill) {
                $name = $techNames[$skill->technology_id] ?? null;
                if ($name) {
                    $topTechsMap[$name] = (float) $skill->score;
                }
            }

            // 6. Monta snapshot de scores por slug do domínio
            $domainScoresSnapshot = [];
            $domainModels = TechDomain::all()->keyBy('id');
            foreach ($domainScores as $ds) {
                $domainModel = $domainModels->get($ds->domain_id);
                if ($domainModel) {
                    $domainScoresSnapshot[$domainModel->slug] = (float) $ds->score;
                }
            }

            // 7. Salvar User Reputation Score
            $dna = $data['dna'] ?? [];
            $ovrComponents = $data['domain_scores'] ? $data['domain_scores']->get('ovr_components', []) : [];

            $record = UserReputationScore::updateOrCreate(
                ['user_id' => $userId],
                [
                    'ovr' => $ovr,
                    'recruiter_score' => $data['recruiter_score'] ?? 0.0,
                    'technical_depth' => $ovrComponents['technical_depth'] ?? 0.0,
                    'delivery_impact' => $ovrComponents['delivery_impact'] ?? 0.0,
                    'scope_influence' => $ovrComponents['scope_influence'] ?? 0.0,
                    'breadth_adaptability' => $ovrComponents['breadth_adaptability'] ?? 0.0,
                    'community_visibility' => $ovrComponents['community_visibility'] ?? 0.0,
                    'primary_domain_id' => $dna['primary_domain_id'] ?? null,
                    'secondary_domain_id' => $dna['secondary_domain_id'] ?? null,
                    'profile_label' => $dna['profile_label'] ?? 'Generalist Engineer',
                    'top_technologies' => $topTechsMap,
                    'domain_scores_snapshot' => $domainScoresSnapshot,
                    'last_significant_change' => $lastSignificantChange,
                    'change_count_this_month' => $changeCountThisMonth,
                    'anomaly_flags' => [],
                    'engine_version' => '2.0',
                    'computed_at' => $now,
                    'previous_ovr' => $previousOvr,
                    'previous_computed_at' => $previousComputedAt,
                ]
            );

            // 8. Gravar histórico de score
            UserScoreHistory::create([
                'user_id' => $userId,
                'ovr' => $ovr,
                'recruiter_score' => $data['recruiter_score'] ?? 0.0,
                'trigger_event' => 'recalculate',
                'full_snapshot' => [
                    'ovr_components' => $ovrComponents,
                    'domain_scores' => $domainScoresSnapshot,
                    'top_technologies' => $topTechsMap,
                    'dna' => $dna,
                ],
                'recorded_at' => $now,
            ]);

            // 9. Atualizar Redis Sorted Sets (Leaderboards)
            try {
                Redis::zadd('leaderboard:global', $ovr, $userId);

                foreach ($domainScores as $ds) {
                    $domainModel = $domainModels->get($ds->domain_id);
                    if ($domainModel) {
                        Redis::zadd("leaderboard:domain:{$domainModel->slug}", $ds->score, $userId);
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Falha ao atualizar Redis leaderboards para o usuário {$userId}: " . $e->getMessage());
            }

            return new UserReputationResult(
                userId: $userId,
                ovr: (float) $record->ovr,
                recruiterScore: (float) $record->recruiter_score,
                previousOvr: $previousOvr,
                data: $data
            );
        });
    }
}

