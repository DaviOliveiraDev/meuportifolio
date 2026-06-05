<?php

namespace App\Application\DTOs\Project;

use Illuminate\Http\Request;

class UpdateProjectDTO
{
    public function __construct(
        public readonly string $title,
        public readonly string $description,
        public readonly ?string $coverImageUrl = null,
        public readonly ?string $repositoryUrl = null,
        public readonly ?string $demoUrl = null,
        public readonly bool $isFeatured = false,
        public readonly int $orderWeight = 0
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            title: $request->input('title'),
            description: $request->input('description'),
            coverImageUrl: $request->input('cover_image_url'),
            repositoryUrl: $request->input('repository_url'),
            demoUrl: $request->input('demo_url'),
            isFeatured: $request->boolean('is_featured', false),
            orderWeight: $request->integer('order_weight', 0)
        );
    }

    public function toArray(): array
    {
        return [
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
