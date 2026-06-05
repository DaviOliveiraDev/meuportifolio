<?php

namespace Database\Factories;

use App\Infrastructure\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Skill>
 */
class SkillFactory extends Factory
{
    protected $model = Skill::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $skills = [
            'PHP', 'Laravel', 'TypeScript', 'Next.js', 'React', 'TailwindCSS', 
            'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Node.js', 'Docker Compose', 
            'Git', 'GitHub Actions', 'Sentry', 'Nginx', 'Vue.js', 'MySQL', 
            'Python', 'Django', 'Go', 'Kubernetes', 'CI/CD', 'GraphQL'
        ];

        return [
            'name' => fake()->unique()->randomElement($skills) ?? fake()->unique()->word(),
            'category' => fake()->randomElement(['Frontend', 'Backend', 'DevOps', 'Database', 'Mobile', 'Outros']),
        ];
    }
}
