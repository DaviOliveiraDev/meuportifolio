<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    |
    | Aqui estão as definições de controle de recursos e flags da plataforma.
    | Por padrão, novas features começam desativadas em produção/desenvolvimento
    | e podem ser ativadas via variáveis no arquivo .env.
    |
    */

    'reputation_v2' => env('FEATURE_REPUTATION_V2', false),
    'recruiter_score' => env('FEATURE_RECRUITER_SCORE', false),
    'satori_og_card' => env('FEATURE_SATORI_OG_CARD', false),

];
