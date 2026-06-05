<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Repositories\ProjectRepositoryInterface;
use App\Infrastructure\Models\Project;
use Illuminate\Support\Collection;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function findById(string $id): ?Project
    {
        return Project::with('images')->find($id);
    }

    public function allForProfile(string $profileId): Collection
    {
        return Project::where('profile_id', $profileId)
            ->orderBy('order_weight')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Project
    {
        return Project::create($data);
    }

    public function update(string $id, array $data): ?Project
    {
        $project = Project::find($id);
        if ($project) {
            $project->update($data);
            return $project;
        }
        return null;
    }

    public function delete(string $id): bool
    {
        $project = Project::find($id);
        if ($project) {
            return $project->delete();
        }
        return false;
    }
}
