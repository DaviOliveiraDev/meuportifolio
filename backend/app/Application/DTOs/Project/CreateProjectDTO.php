<?php

namespace App\Application\DTOs\Project;

use Illuminate\Http\Request;

class CreateProjectDTO
{
    public function __construct(
        public readonly string $profileId,
        public readonly string $title,
        public readonly string $description,
        public readonly ?string $coverImageUrl = null,
        public readonly ?string $repositoryUrl = null,
        public readonly ?string $demoUrl = null,
        public readonly bool $isFeatured = false,
        public readonly int $orderWeight = 0,
        public readonly ?array $technologies = null
    ) {}

    /**
     * Cria DTO a partir da request do Laravel, injetando o ID do perfil autenticado do usuário.
     */
    public static function fromRequest(Request $request, string $profileId): self
    {
        return new self(
            profileId: $profileId,
            title: $request->input('title'),
            description: $request->input('description'),
            coverImageUrl: $request->input('cover_image_url'),
            repositoryUrl: $request->input('repository_url'),
            demoUrl: $request->input('demo_url'),
            isFeatured: $request->boolean('is_featured', false),
            orderWeight: $request->integer('order_weight', 0),
            technologies: $request->input('technologies')
        );
    }

    public function toArray(): array
    {
        return [
            'profile_id' => $this->profileId,
            'title' => $this->title,
            'description' => $this->description,
            'cover_image_url' => $this->coverImageUrl,
            'repository_url' => $this->repositoryUrl,
            'demo_url' => $this->demoUrl,
            'is_featured' => $this->isFeatured,
            'order_weight' => $this->orderWeight,
        ];
    }
}
