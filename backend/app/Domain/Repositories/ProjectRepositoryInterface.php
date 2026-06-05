<?php

namespace App\Domain\Repositories;

use App\Infrastructure\Models\Project;
use Illuminate\Support\Collection;

interface ProjectRepositoryInterface
{
    public function findById(string $id): ?Project;
    
    public function allForProfile(string $profileId): Collection;
    
    public function create(array $data): Project;
    
    public function update(string $id, array $data): ?Project;
    
    public function delete(string $id): bool;
}
