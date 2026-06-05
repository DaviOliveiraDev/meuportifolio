<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Repositories\EducationRepositoryInterface;
use App\Infrastructure\Models\Education;
use Illuminate\Support\Collection;

class EducationRepository implements EducationRepositoryInterface
{
    public function findById(string $id): ?Education
    {
        return Education::find($id);
    }

    public function allForProfile(string $profileId): Collection
    {
        return Education::where('profile_id', $profileId)
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function create(array $data): Education
    {
        return Education::create($data);
    }

    public function update(string $id, array $data): ?Education
    {
        $education = Education::find($id);
        if ($education) {
            $education->update($data);
            return $education;
        }
        return null;
    }

    public function delete(string $id): bool
    {
        $education = Education::find($id);
        if ($education) {
            return $education->delete();
        }
        return false;
    }
}
