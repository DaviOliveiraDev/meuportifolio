<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Descarrega o buffer de métricas de analytics do Redis a cada minuto
Schedule::command('devfolio:flush-analytics')->everyMinute();

// Consolidação noturna do Tech DNA e rankings à meia-noite diariamente
Schedule::command('devfolio:consolidate-tech-dna')->daily();
