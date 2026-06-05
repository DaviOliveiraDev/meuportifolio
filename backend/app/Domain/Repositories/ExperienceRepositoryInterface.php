<?php

namespace App\Domain\Repositories;

use App\Infrastructure\Models\Experience;
use Illuminate\Support\Collection;

interface ExperienceRepositoryInterface
{
    public function findById(string $id): ?Experience;
    
    public function allForProfile(string $profileId): Collection;
    
    public function create(array $data): Experience;
    
    public function update(string $id, array $data): ?Experience;
    
    public function delete(string $id): bool;
}
