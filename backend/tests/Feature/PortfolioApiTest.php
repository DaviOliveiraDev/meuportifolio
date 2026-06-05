<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_retrieve_public_portfolio_by_username(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'username' => 'davipublic',
            'name' => 'Davi Public',
        ]);

        $response = $this->getJson('/api/v1/portfolios/davipublic');

        $response->assertStatus(200)
            ->assertJsonPath('profile.name', 'Davi Public')
            ->assertJsonPath('profile.username', 'davipublic');
    }

    public function test_returns_404_if_public_portfolio_not_found(): void
    {
        $response = $this->getJson('/api/v1/portfolios/nonexistentuser');

        $response->assertStatus(404);
    }
}
