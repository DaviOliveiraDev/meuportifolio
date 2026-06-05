<?php

namespace App\Providers;

use App\Domain\Repositories\ProjectRepositoryInterface;
use App\Domain\Repositories\UserRepositoryInterface;
use App\Domain\Repositories\ExperienceRepositoryInterface;
use App\Domain\Repositories\EducationRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\ProjectRepository;
use App\Infrastructure\Persistence\Repositories\UserRepository;
use App\Infrastructure\Persistence\Repositories\ExperienceRepository;
use App\Infrastructure\Persistence\Repositories\EducationRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(ExperienceRepositoryInterface::class, ExperienceRepository::class);
        $this->app->bind(EducationRepositoryInterface::class, EducationRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
