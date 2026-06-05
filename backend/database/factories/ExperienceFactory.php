<?php

namespace Database\Factories;

use App\Infrastructure\Models\Experience;
use App\Infrastructure\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Experience>
 */
class ExperienceFactory extends Factory
{
    protected $model = Experience::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isCurrent = fake()->boolean(30);
        $startDate = fake()->dateTimeBetween('-8 years', '-1 years');
        $endDate = $isCurrent ? null : fake()->dateTimeBetween($startDate, 'now');

        return [
            'profile_id' => Profile::factory(),
            'company' => fake()->company(),
            'role' => fake()->jobTitle(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate ? $endDate->format('Y-m-d') : null,
            'is_current' => $isCurrent,
            'description' => fake()->paragraph(),
        ];
    }
}
