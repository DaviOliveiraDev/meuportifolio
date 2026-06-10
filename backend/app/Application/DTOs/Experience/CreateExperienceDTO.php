<?php

namespace App\Application\DTOs\Experience;

use Illuminate\Http\Request;

class CreateExperienceDTO
{
    public function __construct(
        public readonly string $profileId,
        public readonly string $company,
        public readonly string $role,
        public readonly string $startDate,
        public readonly ?string $endDate = null,
        public readonly bool $isCurrent = false,
        public readonly ?string $description = null,
        public readonly ?array $technologies = null
    ) {}

    public static function fromRequest(Request $request, string $profileId): self
    {
        return new self(
            profileId: $profileId,
            company: $request->input('company'),
            role: $request->input('role'),
            startDate: $request->input('start_date'),
            endDate: $request->input('end_date'),
            isCurrent: $request->boolean('is_current', false),
            description: $request->input('description'),
            technologies: $request->input('technologies')
        );
    }

    public function toArray(): array
    {
        return [
            'profile_id' => $this->profileId,
            'company' => $this->company,
            'role' => $this->role,
            'start_date' => $this->startDate,
            'end_date' => $this->isCurrent ? null : $this->endDate,
            'is_current' => $this->isCurrent,
            'description' => $this->description,
        ];
    }
}
