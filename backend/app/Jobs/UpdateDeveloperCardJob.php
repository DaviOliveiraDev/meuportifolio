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

class UpdateDeveloperCardJob
{
    use Dispatchable, SerializesModels;

    public function __construct(public Profile $profile)
    {
    }

    public function handle(): void
    {
        Log::info("TechDNA: Orchestrator iniciando cadeia síncrona para o perfil: {$this->profile->id}");

        // Executa de forma síncrona
        UpdateProfileStatsJob::dispatchSync($this->profile);
        RecalculateTechDnaJob::dispatchSync($this->profile);
        
        if (\App\Infrastructure\Services\FeatureFlag::isEnabled('reputation_v2')) {
            \App\Jobs\RecalculateUserScore::dispatch($this->profile->user_id, 'profile_update');
        } else {
            RecalculateOvrJob::dispatchSync($this->profile);
        }
        
        EvaluateBadgesJob::dispatchSync($this->profile);
    }
}
