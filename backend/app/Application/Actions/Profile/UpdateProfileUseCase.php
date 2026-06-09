<?php

namespace App\Application\Actions\Profile;

use App\Application\DTOs\Profile\UpdateProfileDTO;
use App\Infrastructure\Models\Profile;
use DomainException;

class UpdateProfileUseCase
{
    /**
     * Executa a atualização do perfil profissional.
     *
     * @param string $profileId
     * @param UpdateProfileDTO $dto
     * @return Profile
     * @throws DomainException
     */
    public function execute(string $profileId, UpdateProfileDTO $dto): Profile
    {
        $profile = Profile::find($profileId);

        if (!$profile) {
            throw new DomainException('Perfil não encontrado.', 404);
        }

        // Validação extra de domínio para colisão de username
        $usernameExists = Profile::where('username', $dto->username)
            ->where('id', '!=', $profileId)
            ->exists();

        if ($usernameExists) {
            throw new DomainException('O nome de usuário já está sendo utilizado por outra pessoa.');
        }

        $profile->update($dto->toArray());

        if ($dto->skills !== null) {
            $skillIds = [];
            foreach ($dto->skills as $skillName) {
                if (empty(trim($skillName))) {
                    continue;
                }
                $skill = \App\Infrastructure\Models\Skill::firstOrCreate([
                    'name' => trim($skillName)
                ]);
                $skillIds[] = $skill->id;
            }
            $profile->skills()->sync($skillIds);

            if ($profile->skills()->count() >= 3) {
                app(\App\Domain\Services\XpManagerService::class)->awardXpForAction($profile, 'add_skills');
            }
        }

        \App\Jobs\UpdateDeveloperCardJob::dispatch($profile);

        return $profile;
    }
}
