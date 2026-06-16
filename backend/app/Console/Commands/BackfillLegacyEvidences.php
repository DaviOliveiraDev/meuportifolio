<?php

namespace App\Console\Commands;

use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\Experience;
use App\Infrastructure\Models\Education;
use App\Domain\Gamification\Services\Reputation\EvidenceSyncService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class BackfillLegacyEvidences extends Command
{
    /**
     * O nome e a assinatura do comando do console.
     *
     * @var string
     */
    protected $signature = 'devfolio:backfill-legacy-evidences';

    /**
     * A descrição do comando do console.
     *
     * @var string
     */
    protected $description = 'Migra e realiza o backfill de dados legados de projetos, experiências e formações para as novas tabelas de evidência V2';

    /**
     * Executa o comando de console.
     */
    public function handle(EvidenceSyncService $syncService): int
    {
        $this->info('Iniciando backfill de dados legados para Evidências V2...');
        Log::info('ReputationV2: Iniciando comando Artisan devfolio:backfill-legacy-evidences...');

        // 1. Projetos
        $projects = Project::whereNull('evidence_id')->get();
        $projectCount = $projects->count();
        $this->info("Encontrados {$projectCount} projetos para migração.");
        
        $this->output->progressStart($projectCount);
        foreach ($projects as $project) {
            try {
                $techIds = $project->technologies->pluck('id')->toArray();
                $syncService->syncProject($project, $techIds);
            } catch (\Exception $e) {
                Log::error("ReputationV2: Falha ao migrar projeto {$project->id}: " . $e->getMessage());
            }
            $this->output->progressAdvance();
        }
        $this->output->progressFinish();
        $this->info('Migração de projetos concluída.');

        // 2. Experiências
        $experiences = Experience::whereNull('evidence_id')->get();
        $expCount = $experiences->count();
        $this->info("Encontrados {$expCount} experiências para migração.");

        $this->output->progressStart($expCount);
        foreach ($experiences as $experience) {
            try {
                $techIds = $experience->technologies->pluck('id')->toArray();
                $syncService->syncExperience($experience, $techIds);
            } catch (\Exception $e) {
                Log::error("ReputationV2: Falha ao migrar experiência {$experience->id}: " . $e->getMessage());
            }
            $this->output->progressAdvance();
        }
        $this->output->progressFinish();
        $this->info('Migração de experiências concluída.');

        // 3. Formações
        $educations = Education::whereNull('evidence_id')->get();
        $eduCount = $educations->count();
        $this->info("Encontrados {$eduCount} formações/cursos para migração.");

        $this->output->progressStart($eduCount);
        foreach ($educations as $education) {
            try {
                $techIds = $education->technologies->pluck('id')->toArray();
                $syncService->syncEducation($education, $techIds);
            } catch (\Exception $e) {
                Log::error("ReputationV2: Falha ao migrar formação {$education->id}: " . $e->getMessage());
            }
            $this->output->progressAdvance();
        }
        $this->output->progressFinish();
        $this->info('Migração de formações concluída.');

        $this->info('Backfill de dados legados finalizado com sucesso!');
        Log::info('ReputationV2: Comando Artisan devfolio:backfill-legacy-evidences concluído.');

        return Command::SUCCESS;
    }
}
