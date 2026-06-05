<?php

namespace App\Domain\Repositories;

use App\Infrastructure\Models\Education;
use Illuminate\Support\Collection;

interface EducationRepositoryInterface
{
    public function findById(string $id): ?Education;
    
    public function allForProfile(string $profileId): Collection;
    
    public function create(array $data): Education;
    
    public function update(string $id, array $data): ?Education;
    
    public function delete(string $id): bool;
}
