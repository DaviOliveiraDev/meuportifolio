<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\EducationController;
use App\Http\Controllers\Api\V1\ExperienceController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\UploadController;
use App\Http\Controllers\Api\V1\PortfolioController;
use App\Http\Controllers\Api\V1\GithubSyncController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    
    // Rota pública do portfólio
    Route::get('/portfolios/{username}', [PortfolioController::class, 'show'])->middleware('track.portfolio');
    Route::post('/portfolios/{username}/track', [PortfolioController::class, 'track']);
    
    // Rotas públicas de autenticação
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::get('/redirect/{provider}', [AuthController::class, 'redirectToProvider']);
        Route::get('/callback/{provider}', [AuthController::class, 'handleProviderCallback']);
        
        // Rotas protegidas de autenticação
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    // Recursos protegidos
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::post('upload', [UploadController::class, 'upload']);
        Route::apiResource('projects', ProjectController::class);
        Route::apiResource('experiences', ExperienceController::class);
        Route::apiResource('educations', EducationController::class);
        
        // Sincronização com GitHub
        Route::post('github/sync', [GithubSyncController::class, 'sync']);
        Route::get('github/sync/status', [GithubSyncController::class, 'status']);

        // Geração de PDF do currículo
        Route::post('profile/pdf', [\App\Http\Controllers\Api\V1\PdfGenerationController::class, 'generate']);
        Route::get('profile/pdf/status', [\App\Http\Controllers\Api\V1\PdfGenerationController::class, 'status']);
    });
    
});


