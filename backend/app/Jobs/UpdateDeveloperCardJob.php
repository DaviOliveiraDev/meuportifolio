<?php

namespace App\Jobs;

use App\Infrastructure\Models\Profile;
use App\Domain\Gamification\Jobs\EvaluateProfileProgressJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateDeveloperCardJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    public function __construct(public Profile $profile)
    {
        $this->onQueue('default');
    }

    public function handle(): void
    {
        // Redireciona para o novo Job de avaliação unificado do motor de gamificação
        EvaluateProfileProgressJob::dispatch($this->profile);
    }
}
