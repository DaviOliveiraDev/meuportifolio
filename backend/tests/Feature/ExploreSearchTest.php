<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use App\Infrastructure\Models\TechnologyCategory;
use App\Infrastructure\Models\Technology;
use App\Infrastructure\Models\TechnologyScore;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class ExploreSearchTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::clear();
    }

    public function test_explore_search_returns_only_active_profiles()
    {
        // 1. Cria perfil ativo
        $user1 = User::factory()->create();
        Profile::create([
            'user_id' => $user1->id,
            'username' => 'active_dev',
            'name' => 'Active Developer',
            'role' => 'Backend Engineer',
            'location' => 'São Paulo',
            'is_active' => true,
            'ovr' => 80,
        ]);

        // 2. Cria perfil inativo
        $user2 = User::factory()->create();
        Profile::create([
            'user_id' => $user2->id,
            'username' => 'inactive_dev',
            'name' => 'Inactive Developer',
            'role' => 'Frontend Engineer',
            'location' => 'Rio de Janeiro',
            'is_active' => false,
            'ovr' => 90,
        ]);

        $response = $this->getJson('/api/v1/explore');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.username', 'active_dev');
    }

    public function test_explore_search_filters_by_parameters()
    {
        $user1 = User::factory()->create();
        Profile::create([
            'user_id' => $user1->id,
            'username' => 'davi',
            'name' => 'Davi Oliveira',
            'role' => 'Fullstack Developer',
            'location' => 'Curitiba',
            'is_active' => true,
            'ovr' => 75,
        ]);

        $user2 = User::factory()->create();
        Profile::create([
            'user_id' => $user2->id,
            'username' => 'joao',
            'name' => 'Joao Silva',
            'role' => 'DevOps Specialist',
            'location' => 'Florianopolis',
            'is_active' => true,
            'ovr' => 88,
        ]);

        // Busca por query string q
        $response = $this->getJson('/api/v1/explore?q=Davi');
        $response->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.username', 'davi');

        // Busca por OVR mínimo
        $response = $this->getJson('/api/v1/explore?min_ovr=80');
        $response->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.username', 'joao');
    }

    public function test_explore_search_filters_by_technology_and_confidence()
    {
        // 1. Criar categoria e tecnologia de teste
        $category = TechnologyCategory::create([
            'name' => 'Languages',
            'slug' => 'languages',
        ]);
        $tech = Technology::create([
            'category_id' => $category->id,
            'name' => 'Laravel',
            'slug' => 'laravel',
        ]);

        // 2. Criar dois perfis ativos
        $user1 = User::factory()->create();
        $profile1 = Profile::create([
            'user_id' => $user1->id,
            'username' => 'laravel_expert',
            'name' => 'Laravel Expert',
            'is_active' => true,
            'ovr' => 85,
        ]);
        // Associa score técnico ao perfil 1
        TechnologyScore::create([
            'profile_id' => $profile1->id,
            'technology_id' => $tech->id,
            'score' => 90,
            'confidence_level' => 'Expert',
            'calculated_at' => now(),
        ]);

        $user2 = User::factory()->create();
        $profile2 = Profile::create([
            'user_id' => $user2->id,
            'username' => 'laravel_beginner',
            'name' => 'Laravel Beginner',
            'is_active' => true,
            'ovr' => 40,
        ]);
        // Associa score técnico ao perfil 2
        TechnologyScore::create([
            'profile_id' => $profile2->id,
            'technology_id' => $tech->id,
            'score' => 20,
            'confidence_level' => 'Verified',
            'calculated_at' => now(),
        ]);

        // 3. Busca apenas por tecnologia
        $response = $this->getJson('/api/v1/explore?technology=' . $tech->slug);
        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        // 4. Busca por tecnologia + nível de confiança "Expert"
        $response = $this->getJson('/api/v1/explore?technology=' . $tech->slug . '&confidence_level=Expert');
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.username', 'laravel_expert');
    }

    public function test_leaderboard_caches_results()
    {
        $user = User::factory()->create();
        $profile = Profile::create([
            'user_id' => $user->id,
            'username' => 'top_dev',
            'name' => 'Top Developer',
            'role' => 'Mobile Developer',
            'is_active' => true,
            'ovr' => 99,
        ]);

        // Configura mocks para o Redis Facade
        Redis::shouldReceive('exists')
            ->once()
            ->with('leaderboard:global')
            ->andReturn(false);

        Redis::shouldReceive('zadd')
            ->once();

        Redis::shouldReceive('expire')
            ->once();

        Redis::shouldReceive('zrevrange')
            ->once()
            ->with('leaderboard:global', 0, 99)
            ->andReturn([(string) $profile->id]);

        $response = $this->getJson('/api/v1/leaderboard');
        
        $response->assertStatus(200)
            ->assertJsonCount(1, 'leaderboard')
            ->assertJsonPath('leaderboard.0.username', 'top_dev');
    }
}
