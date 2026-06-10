<?php

namespace App\Console\Commands;

use App\Infrastructure\Models\Profile;
use App\Domain\Gamification\Services\TechDnaEngineService;
use App\Domain\Gamification\Services\OvrEngineService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ConsolidateTechDna extends Command
{
    /**
     * O nome e a assinatura do comando do console.
     *
     * @var string
     */
    protected $signature = 'devfolio:consolidate-tech-dna';

    /**
     * A descrição do comando do console.
     *
     * @var string
     */
    protected $description = 'Consolida o Tech DNA, recalcula o OVR e atualiza os rankings globais e específicos por tecnologia';

    /**
     * Executa o comando de console.
     */
    public function handle(TechDnaEngineService $techDnaEngine, OvrEngineService $ovrEngine): int
    {
        $this->info('Iniciando consolidação noturna do Tech DNA e rankings...');
        Log::info('TechDNA: Iniciando comando Artisan devfolio:consolidate-tech-dna...');

        $profiles = Profile::where('is_active', true)->get();
        $count = $profiles->count();

        $this->output->progressStart($count);

        foreach ($profiles as $profile) {
            try {
                // 1. Recalcula o Tech DNA (evidências, scores, histórico)
                $techDnaEngine->calculateProfileTechDna($profile);

                // 2. Recalcula o OVR 2.0 (que lê os novos scores de tecnologia)
                $ovrEngine->calculateAndUpdateOvr($profile);
            } catch (\Exception $e) {
                Log::error("TechDNA: Erro ao consolidar perfil {$profile->id}: " . $e->getMessage());
            }

            $this->output->progressAdvance();
        }

        $this->output->progressFinish();

        // 3. Recalcula rankings globais e específicos por tecnologia
        $techDnaEngine->recalculateRankings();

        $this->info("Concluído. Tech DNA e Rankings de {$count} perfis ativos foram consolidados.");
        Log::info("TechDNA: Comando Artisan devfolio:consolidate-tech-dna concluído com sucesso.");

        return Command::SUCCESS;
    }
}
