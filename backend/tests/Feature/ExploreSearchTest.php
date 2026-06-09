<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
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

    public function test_leaderboard_caches_results()
    {
        $user = User::factory()->create();
        Profile::create([
            'user_id' => $user->id,
            'username' => 'top_dev',
            'name' => 'Top Developer',
            'role' => 'Mobile Developer',
            'is_active' => true,
            'ovr' => 99,
        ]);

        $response = $this->getJson('/api/v1/leaderboard');
        $response->assertStatus(200)
            ->assertJsonCount(1, 'leaderboard');

        // Verifica que o leaderboard está em cache
        $this->assertTrue(Cache::has('leaderboard:global'));
    }
}
