<?php

namespace Database\Factories;

use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'profile_id' => Profile::factory(),
            'title' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'cover_image_url' => 'https://picsum.photos/seed/' . fake()->word() . '/800/600',
            'repository_url' => 'https://github.com/' . fake()->userName() . '/' . fake()->slug(2),
            'demo_url' => fake()->url(),
            'is_featured' => fake()->boolean(20),
            'order_weight' => fake()->numberBetween(0, 10),
        ];
    }
}
