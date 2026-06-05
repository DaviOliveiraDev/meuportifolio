<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Repositories\ExperienceRepositoryInterface;
use App\Infrastructure\Models\Experience;
use Illuminate\Support\Collection;

class ExperienceRepository implements ExperienceRepositoryInterface
{
    public function findById(string $id): ?Experience
    {
        return Experience::find($id);
    }

    public function allForProfile(string $profileId): Collection
    {
        return Experience::where('profile_id', $profileId)
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function create(array $data): Experience
    {
        return Experience::create($data);
    }

    public function update(string $id, array $data): ?Experience
    {
        $experience = Experience::find($id);
        if ($experience) {
            $experience->update($data);
            return $experience;
        }
        return null;
    }

    public function delete(string $id): bool
    {
        $experience = Experience::find($id);
        if ($experience) {
            return $experience->delete();
        }
        return false;
    }
}
