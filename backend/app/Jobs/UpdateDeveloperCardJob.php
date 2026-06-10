<?php

namespace App\Jobs;

use App\Infrastructure\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;

class UpdateDeveloperCardJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 120;
    public $tries = 3;

    /**
     * O tempo de atraso (debounce) antes do job começar a rodar.
     * 10 segundos garante que múltiplos salvamentos rápidos em sequência
     * sejam descartados pela chave única do lock da fila.
     */
    public $delay = 10;

    /**
     * Quantidade de tempo (em segundos) que a trava de fila única permanece ativa.
     */
    public $uniqueFor = 60;

    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    /**
     * Define o identificador único para o lock da fila.
     */
    public function uniqueId(): string
    {
        return $this->profile->id;
    }

    public function handle(): void
    {
        Log::info("TechDNA: Orchestrator iniciando cadeia para o perfil: {$this->profile->id}");

        // Orquestra a execução sequencial em lote (Chaining)
        Bus::chain([
            new UpdateProfileStatsJob($this->profile),
            new RecalculateTechDnaJob($this->profile),
            new RecalculateOvrJob($this->profile),
            new EvaluateBadgesJob($this->profile),
        ])->dispatch();
    }
}
