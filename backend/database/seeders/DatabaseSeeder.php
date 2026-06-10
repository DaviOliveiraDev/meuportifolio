<?php

namespace Database\Seeders;

use App\Infrastructure\Models\User;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\Experience;
use App\Infrastructure\Models\Education;
use App\Infrastructure\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 0. Registrar módulo de gamificação
        $this->call(GamificationSeeder::class);

        // 1. Criar habilidades globais
        $skillsList = [
            ['name' => 'PHP', 'category' => 'Backend'],
            ['name' => 'Laravel', 'category' => 'Backend'],
            ['name' => 'TypeScript', 'category' => 'Frontend'],
            ['name' => 'Next.js', 'category' => 'Frontend'],
            ['name' => 'React', 'category' => 'Frontend'],
            ['name' => 'TailwindCSS', 'category' => 'Frontend'],
            ['name' => 'PostgreSQL', 'category' => 'Database'],
            ['name' => 'Redis', 'category' => 'Database'],
            ['name' => 'Docker', 'category' => 'DevOps'],
            ['name' => 'AWS', 'category' => 'DevOps'],
            ['name' => 'GitHub Actions', 'category' => 'DevOps'],
            ['name' => 'Nginx', 'category' => 'DevOps'],
        ];

        $createdSkills = collect($skillsList)->map(function ($skill) {
            return Skill::firstOrCreate(['name' => $skill['name']], $skill);
        });

        // 2. Criar Usuário e Perfil de Teste (Admin / Davi)
        $testUser = User::create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $testProfile = Profile::create([
            'user_id' => $testUser->id,
            'username' => 'davi',
            'name' => 'Davi Oliveira',
            'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=davi',
            'bio' => 'Arquiteto de Software Sênior & Tech Lead focado no ecossistema PHP/Laravel, Next.js e Cloud Computing AWS. Apaixonado por performance, escalabilidade e arquiteturas limpas.',
            'role' => 'Software Architect & Tech Lead',
            'location' => 'São Paulo, Brasil',
            'linkedin_url' => 'https://linkedin.com/in/davi-oliveira-dev',
            'github_url' => 'https://github.com/davi-dev',
            'website_url' => 'https://davi.dev',
            'theme_name' => 'modern',
        ]);

        // Adicionar habilidades ao perfil de teste
        $testProfile->skills()->sync(
            $createdSkills->pluck('id')->mapWithKeys(function ($id) {
                return [$id => ['proficiency_level' => rand(80, 100)]];
            })
        );

        // Criar projetos para o perfil de teste
        Project::factory()->create([
            'profile_id' => $testProfile->id,
            'title' => 'DevFolio SaaS Platform',
            'description' => 'Plataforma completa para criação e hospedagem de portfólios profissionais automatizados para desenvolvedores, com integração com GitHub e Analytics integrado.',
            'is_featured' => true,
            'order_weight' => 1,
        ]);

        Project::factory(3)->create([
            'profile_id' => $testProfile->id,
        ]);

        // Criar histórico do perfil de teste
        Experience::factory()->create([
            'profile_id' => $testProfile->id,
            'company' => 'Google DeepMind',
            'role' => 'Senior Tech Lead',
            'start_date' => '2023-01-01',
            'is_current' => true,
            'description' => 'Liderança técnica na arquitetura de sistemas baseados em inteligência artificial e agentes autônomos para desenvolvimento de software.',
        ]);

        Experience::factory()->create([
            'profile_id' => $testProfile->id,
            'company' => 'SaaS Global Corp',
            'role' => 'Full Stack Developer Sênior',
            'start_date' => '2020-05-10',
            'end_date' => '2022-12-31',
            'is_current' => false,
            'description' => 'Desenvolvimento de microserviços escaláveis com Laravel, PHP 8, PostgreSQL e infraestrutura AWS ECS Fargate.',
        ]);

        Education::factory()->create([
            'profile_id' => $testProfile->id,
            'institution' => 'USP - Universidade de São Paulo',
            'course' => 'Mestrado em Engenharia de Computação / Software',
            'start_date' => '2018-01-01',
            'end_date' => '2020-03-15',
            'is_current' => false,
        ]);

        // 3. Criar outros 5 usuários aleatórios completos para popular o sistema
        User::factory(5)->create()->each(function ($user) use ($createdSkills) {
            $profile = Profile::factory()->create(['user_id' => $user->id]);

            // Projetos aleatórios
            Project::factory(rand(2, 4))->create(['profile_id' => $profile->id]);

            // Experiências aleatórias
            Experience::factory(rand(1, 2))->create(['profile_id' => $profile->id]);

            // Formação aleatória
            Education::factory(rand(1, 2))->create(['profile_id' => $profile->id]);

            // Associar algumas habilidades aleatórias
            $randomSkills = $createdSkills->random(rand(3, 6))->pluck('id');
            $profile->skills()->sync(
                $randomSkills->mapWithKeys(fn ($id) => [$id => ['proficiency_level' => rand(40, 100)]])
            );
        });
    }
}
