<?php

namespace Database\Factories;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Profile>
 */
class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'username' => fake()->unique()->slug(1),
            'name' => fake()->name(),
            'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=' . fake()->word(),
            'bio' => fake()->paragraph(),
            'role' => fake()->jobTitle(),
            'location' => fake()->city() . ', ' . fake()->country(),
            'linkedin_url' => 'https://linkedin.com/in/' . fake()->userName(),
            'github_url' => 'https://github.com/' . fake()->userName(),
            'website_url' => fake()->url(),
            'theme_name' => fake()->randomElement(['minimalist', 'modern', 'dark', 'light']),
            'custom_styles' => null,
        ];
    }
}
