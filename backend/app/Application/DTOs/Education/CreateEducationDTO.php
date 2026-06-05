<?php

namespace App\Application\DTOs\Education;

use Illuminate\Http\Request;

class CreateEducationDTO
{
    public function __construct(
        public readonly string $profileId,
        public readonly string $institution,
        public readonly string $course,
        public readonly string $startDate,
        public readonly ?string $endDate = null,
        public readonly bool $isCurrent = false
    ) {}

    public static function fromRequest(Request $request, string $profileId): self
    {
        return new self(
            profileId: $profileId,
            institution: $request->input('institution'),
            course: $request->input('course'),
            startDate: $request->input('start_date'),
            endDate: $request->input('end_date'),
            isCurrent: $request->boolean('is_current', false)
        );
    }

    public function toArray(): array
    {
        return [
            'profile_id' => $this->profileId,
            'institution' => $this->institution,
            'course' => $this->course,
            'start_date' => $this->startDate,
            'end_date' => $this->isCurrent ? null : $this->endDate,
            'is_current' => $this->isCurrent,
        ];
    }
}
