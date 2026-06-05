<?php

namespace App\Application\DTOs\Profile;

use Illuminate\Http\Request;

class UpdateProfileDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $username,
        public readonly ?string $avatarUrl = null,
        public readonly ?string $bio = null,
        public readonly ?string $role = null,
        public readonly ?string $location = null,
        public readonly ?string $linkedinUrl = null,
        public readonly ?string $githubUrl = null,
        public readonly ?string $websiteUrl = null,
        public readonly string $themeName = 'minimalist',
        public readonly ?array $customStyles = null,
        public readonly ?array $skills = null
    ) {}

    /**
     * Cria DTO a partir da request.
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->input('name'),
            username: strtolower($request->input('username')),
            avatarUrl: $request->input('avatar_url'),
            bio: $request->input('bio'),
            role: $request->input('role'),
            location: $request->input('location'),
            linkedinUrl: $request->input('linkedin_url'),
            githubUrl: $request->input('github_url'),
            websiteUrl: $request->input('website_url'),
            themeName: $request->input('theme_name', 'minimalist'),
            customStyles: $request->input('custom_styles'),
            skills: $request->input('skills')
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'username' => $this->username,
            'avatar_url' => $this->avatarUrl,
            'bio' => $this->bio,
            'role' => $this->role,
            'location' => $this->location,
            'linkedin_url' => $this->linkedinUrl,
            'github_url' => $this->githubUrl,
            'website_url' => $this->websiteUrl,
            'theme_name' => $this->themeName,
            'custom_styles' => $this->customStyles,
        ];
    }
}
