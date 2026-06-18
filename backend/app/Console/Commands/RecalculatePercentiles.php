<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RecalculatePercentiles extends Command
{
    /**
     * O nome e a assinatura do comando do console.
     *
     * @var string
     */
    protected $signature = 'devfolio:recalculate-percentiles';

    /**
     * A descrição do comando do console.
     *
     * @var string
     */
    protected $description = 'Recalcula os percentis offline de OVR (por faixa de experiência), competências e domínios no PostgreSQL';

    /**
     * Executa o comando de console.
     */
    public function handle(): int
    {
        $this->info('Iniciando recálculo analítico de percentis no PostgreSQL...');
        Log::info('ReputationEngine: Iniciando devfolio:recalculate-percentiles...');

        try {
            DB::transaction(function () {
                // 1. Recalcula os percentis de OVR por faixa de experiência
                // Faixas: '0-12' (Júnior), '12-36' (Pleno Inicial), '36-72' (Pleno Avançado), '72+' (Sênior/Lead)
                $this->info('Calculando percentis de OVR por faixa de experiência...');
                DB::statement("
                    WITH user_experience AS (
                      SELECT 
                        user_id,
                        COALESCE(
                          SUM(
                            EXTRACT(year FROM age(COALESCE(end_date, CURRENT_DATE), start_date)) * 12 +
                            EXTRACT(month FROM age(COALESCE(end_date, CURRENT_DATE), start_date))
                          ),
                          0
                        ) AS total_months
                      FROM evidences
                      WHERE evidence_type = 'experience' AND is_active = true
                      GROUP BY user_id
                    ),
                    user_buckets AS (
                      SELECT 
                        u.id AS user_id,
                        CASE 
                          WHEN COALESCE(ue.total_months, 0) < 12 THEN '0-12'
                          WHEN COALESCE(ue.total_months, 0) < 36 THEN '12-36'
                          WHEN COALESCE(ue.total_months, 0) < 72 THEN '36-72'
                          ELSE '72+'
                        END AS experience_bucket
                      FROM users u
                      LEFT JOIN user_experience ue ON ue.user_id = u.id
                    ),
                    percentiles AS (
                      SELECT 
                        urs.user_id,
                        ROUND(
                          (PERCENT_RANK() OVER (
                            PARTITION BY ub.experience_bucket
                            ORDER BY urs.ovr
                          ) * 100)::numeric, 
                          1
                        ) AS pct
                      FROM user_reputation_scores urs
                      JOIN user_buckets ub ON ub.user_id = urs.user_id
                    )
                    UPDATE user_reputation_scores urs
                    SET percentile_rank = percentiles.pct
                    FROM percentiles
                    WHERE urs.user_id = percentiles.user_id
                ");

                // 2. Recalcula percentis por competência
                $this->info('Calculando percentis por competência...');
                DB::statement("
                    WITH percentiles AS (
                      SELECT 
                        user_id,
                        competency_id,
                        ROUND(
                          (PERCENT_RANK() OVER (
                            PARTITION BY competency_id
                            ORDER BY score
                          ) * 100)::numeric, 
                          1
                        ) AS pct
                      FROM user_competency_scores
                    )
                    UPDATE user_competency_scores ucs
                    SET percentile_rank = percentiles.pct
                    FROM percentiles
                    WHERE ucs.user_id = percentiles.user_id AND ucs.competency_id = percentiles.competency_id
                ");

                // 3. Recalcula percentis por domínio de tecnologia
                $this->info('Calculando percentis por domínio de tecnologia...');
                DB::statement("
                    WITH percentiles AS (
                      SELECT 
                        user_id,
                        domain_id,
                        ROUND(
                          (PERCENT_RANK() OVER (
                            PARTITION BY domain_id
                            ORDER BY score
                          ) * 100)::numeric, 
                          1
                        ) AS pct
                      FROM user_domain_scores
                    )
                    UPDATE user_domain_scores uds
                    SET percentile_rank = percentiles.pct
                    FROM percentiles
                    WHERE uds.user_id = percentiles.user_id AND uds.domain_id = percentiles.domain_id
                ");
            });

            $this->info('Recálculo de percentis concluído com sucesso!');
            Log::info('ReputationEngine: devfolio:recalculate-percentiles executado com sucesso.');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Erro ao recalcular percentis: ' . $e->getMessage());
            Log::error('ReputationEngine: Erro no devfolio:recalculate-percentiles: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
