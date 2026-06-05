<?php

return [

    'dsn' => env('SENTRY_LARAVEL_DSN', env('SENTRY_DSN')),

    // Capture release as git commit hash if available
    'release' => env('SENTRY_RELEASE'),

    // Tracing/Performance monitoring sample rate (0.0 to 1.0)
    'traces_sample_rate' => (float) env('SENTRY_TRACES_SAMPLE_RATE', 0.1),

    // Profiling sample rate (0.0 to 1.0)
    'profiles_sample_rate' => (float) env('SENTRY_PROFILES_SAMPLE_RATE', 0.1),

    'breadcrumbs' => [
        // Log database queries as breadcrumbs
        'sql_queries' => true,
        // Log queue jobs as breadcrumbs
        'queue_info' => true,
    ],

];
