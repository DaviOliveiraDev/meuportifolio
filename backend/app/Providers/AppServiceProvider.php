<?php

namespace App\Providers;

use App\Domain\Services\StorageServiceInterface;
use App\Infrastructure\Services\Storage\S3FileStorage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(StorageServiceInterface::class, S3FileStorage::class);
        $this->app->singleton(
            \App\Domain\Services\GithubServiceInterface::class,
            \App\Infrastructure\Services\Github\GithubService::class
        );
        $this->app->singleton(
            \App\Domain\Services\AnalyticsServiceInterface::class,
            \App\Infrastructure\Services\Analytics\RedisAnalyticsService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
