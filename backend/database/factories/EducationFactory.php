<?php

namespace Database\Factories;

use App\Infrastructure\Models\Education;
use App\Infrastructure\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Education>
 */
class EducationFactory extends Factory
{
    protected $model = Education::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isCurrent = fake()->boolean(10);
        $startDate = fake()->dateTimeBetween('-6 years', '-2 years');
        $endDate = $isCurrent ? null : fake()->dateTimeBetween($startDate, 'now');

        return [
            'profile_id' => Profile::factory(),
            'institution' => fake()->company() . ' University',
            'course' => fake()->randomElement([
                'Bacharelado em Ciência da Computação',
                'Engenharia de Software',
                'Tecnologia em Análise e Desenvolvimento de Sistemas',
                'MBA em Arquitetura de Software',
                'Bootcamp Web Developer Full Stack'
            ]),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate ? $endDate->format('Y-m-d') : null,
            'is_current' => $isCurrent,
        ];
    }
}
