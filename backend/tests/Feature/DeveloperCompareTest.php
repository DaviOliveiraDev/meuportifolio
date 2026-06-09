<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeveloperCompareTest extends TestCase
{
    use RefreshDatabase;

    protected User $user1;
    protected User $user2;
    protected Profile $profile1;
    protected Profile $profile2;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup user 1 and profile
        $this->user1 = User::factory()->create();
        $this->profile1 = Profile::create([
            'user_id' => $this->user1->id,
            'username' => 'davi',
            'name' => 'Davi Oliveira',
            'role' => 'Fullstack Developer',
            'location' => 'Curitiba',
            'is_active' => true,
            'ovr' => 80,
            'level' => 3,
            'xp' => 450,
        ]);

        // 2. Setup user 2 and profile
        $this->user2 = User::factory()->create();
        $this->profile2 = Profile::create([
            'user_id' => $this->user2->id,
            'username' => 'joao',
            'name' => 'Joao DevOps',
            'role' => 'DevOps Specialist',
            'location' => 'Florianopolis',
            'is_active' => true,
            'ovr' => 75,
            'level' => 2,
            'xp' => 280,
        ]);
    }

    public function test_compare_requires_users_param()
    {
        $response = $this->getJson('/api/v1/compare');
        $response->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'Please provide the "users" query parameter (e.g. ?users=davi,joao)'
            ]);
    }

    public function test_compare_requires_exactly_two_users()
    {
        $response = $this->getJson('/api/v1/compare?users=davi');
        $response->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'Comparison requires exactly two usernames.'
            ]);

        $response3 = $this->getJson('/api/v1/compare?users=davi,joao,maria');
        $response3->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'Comparison requires exactly two usernames.'
            ]);
    }

    public function test_compare_returns_404_if_profile_not_found_or_inactive()
    {
        // 1. Perfil inexistente
        $response = $this->getJson('/api/v1/compare?users=davi,nonexistent');
        $response->assertStatus(404)
            ->assertJsonFragment([
                'message' => 'Profile not found or inactive: nonexistent'
            ]);

        // 2. Perfil inativo
        $this->profile2->update(['is_active' => false]);
        $response2 = $this->getJson('/api/v1/compare?users=davi,joao');
        $response2->assertStatus(404)
            ->assertJsonFragment([
                'message' => 'Profile not found or inactive: joao'
            ]);
    }

    public function test_compare_returns_data_successfully()
    {
        $response = $this->getJson('/api/v1/compare?users=davi,joao');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user1' => [
                    'id', 'name', 'username', 'avatar_url', 'role', 'ovr', 'level', 'xp', 'badges_count', 'breakdown'
                ],
                'user2' => [
                    'id', 'name', 'username', 'avatar_url', 'role', 'ovr', 'level', 'xp', 'badges_count', 'breakdown'
                ]
            ])
            ->assertJsonPath('user1.username', 'davi')
            ->assertJsonPath('user1.ovr', 80)
            ->assertJsonPath('user2.username', 'joao')
            ->assertJsonPath('user2.ovr', 75);
    }
}
