<?php

namespace App\Application\DTOs\Experience;

use Illuminate\Http\Request;

class UpdateExperienceDTO
{
    public function __construct(
        public readonly string $company,
        public readonly string $role,
        public readonly string $startDate,
        public readonly ?string $endDate = null,
        public readonly bool $isCurrent = false,
        public readonly ?string $description = null
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            company: $request->input('company'),
            role: $request->input('role'),
            startDate: $request->input('start_date'),
            endDate: $request->input('end_date'),
            isCurrent: $request->boolean('is_current', false),
            description: $request->input('description')
        );
    }

    public function toArray(): array
    {
        return [
            'company' => $this->company,
            'role' => $this->role,
            'start_date' => $this->startDate,
            'end_date' => $this->isCurrent ? null : $this->endDate,
            'is_current' => $this->isCurrent,
            'description' => $this->description,
        ];
    }
}
