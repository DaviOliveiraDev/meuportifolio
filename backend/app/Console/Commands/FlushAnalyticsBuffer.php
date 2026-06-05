<?php

namespace App\Console\Commands;

use App\Domain\Services\AnalyticsServiceInterface;
use Illuminate\Console\Command;

class FlushAnalyticsBuffer extends Command
{
    /**
     * O nome e a assinatura do comando do console.
     *
     * @var string
     */
    protected $signature = 'devfolio:flush-analytics';

    /**
     * A descrição do comando do console.
     *
     * @var string
     */
    protected $description = 'Descarrega eventos de analytics acumulados no Redis para o banco PostgreSQL';

    /**
     * Executa o comando de console.
     */
    public function handle(AnalyticsServiceInterface $analyticsService): int
    {
        $this->info('Iniciando o descarregamento do buffer de analytics do Redis...');
        
        $count = $analyticsService->flushEventsToDatabase();
        
        $this->info("Concluído. {$count} eventos de analytics foram salvos no PostgreSQL.");

        return Command::SUCCESS;
    }
}
