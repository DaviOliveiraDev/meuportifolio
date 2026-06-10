<?php

namespace App\Application\DTOs\Education;

use Illuminate\Http\Request;

class UpdateEducationDTO
{
    public function __construct(
        public readonly string $institution,
        public readonly string $course,
        public readonly string $startDate,
        public readonly ?string $endDate = null,
        public readonly bool $isCurrent = false,
        public readonly ?array $technologies = null
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            institution: $request->input('institution'),
            course: $request->input('course'),
            startDate: $request->input('start_date'),
            endDate: $request->input('end_date'),
            isCurrent: $request->boolean('is_current', false),
            technologies: $request->input('technologies')
        );
    }

    public function toArray(): array
    {
        return [
            'institution' => $this->institution,
            'course' => $this->course,
            'start_date' => $this->startDate,
            'end_date' => $this->isCurrent ? null : $this->endDate,
            'is_current' => $this->isCurrent,
        ];
    }
}
