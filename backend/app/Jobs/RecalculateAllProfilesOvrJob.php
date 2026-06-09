<?php

namespace App\Jobs;

use App\Infrastructure\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RecalculateAllProfilesOvrJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 600; // 10 minutos de limite para o lote
    public $tries = 1;

    public function __construct()
    {
        $this->onQueue('default');
    }

    public function handle(): void
    {
        Log::info("Iniciando recalculo em lote para todos os perfis cadastrados.");

        Profile::chunk(100, function ($profiles) {
            foreach ($profiles as $profile) {
                UpdateDeveloperCardJob::dispatch($profile);
            }
        });

        Log::info("Despachados os jobs de recalculo para todos os perfis com sucesso.");
    }
}
