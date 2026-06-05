<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_profile(): void
    {
        $response = $this->getJson('/api/v1/profile');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_retrieve_their_profile(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'name' => 'John Doe',
            'username' => 'johndoe',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/profile');

        $response->assertStatus(200)
            ->assertJsonPath('profile.name', 'John Doe')
            ->assertJsonPath('profile.username', 'johndoe');
    }

    public function test_authenticated_user_can_update_their_profile(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'name' => 'John Doe',
            'username' => 'johndoe',
            'theme_name' => 'minimalist',
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'name' => 'John Updated',
            'username' => 'johnupdated',
            'bio' => 'New biography.',
            'theme_name' => 'modern',
        ];

        $response = $this->putJson('/api/v1/profile', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('profile.name', 'John Updated')
            ->assertJsonPath('profile.username', 'johnupdated')
            ->assertJsonPath('profile.bio', 'New biography.')
            ->assertJsonPath('profile.theme_name', 'modern');

        $this->assertDatabaseHas('profiles', [
            'id' => $profile->id,
            'name' => 'John Updated',
            'username' => 'johnupdated',
            'bio' => 'New biography.',
            'theme_name' => 'modern',
        ]);
    }

    public function test_profile_update_validation_fails_on_duplicate_username(): void
    {
        $user1 = User::factory()->create();
        $profile1 = Profile::factory()->create([
            'user_id' => $user1->id,
            'username' => 'userone',
        ]);

        $user2 = User::factory()->create();
        $profile2 = Profile::factory()->create([
            'user_id' => $user2->id,
            'username' => 'usertwo',
        ]);

        Sanctum::actingAs($user2);

        $payload = [
            'name' => 'User Two Updated',
            'username' => 'userone', // exists on user 1
            'theme_name' => 'minimalist',
        ];

        $response = $this->putJson('/api/v1/profile', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username']);
    }

    public function test_authenticated_user_can_update_profile_skills(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'name' => 'John Doe',
            'username' => 'johndoe',
            'theme_name' => 'minimalist',
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'name' => 'John Doe',
            'username' => 'johndoe',
            'theme_name' => 'minimalist',
            'skills' => ['Laravel', 'Vue.js', 'PostgreSQL'],
        ];

        $response = $this->putJson('/api/v1/profile', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('skills', ['name' => 'Laravel']);
        $this->assertDatabaseHas('skills', ['name' => 'Vue.js']);
        $this->assertDatabaseHas('skills', ['name' => 'PostgreSQL']);

        // Check relationship
        $this->assertCount(3, $profile->fresh()->skills);
        $this->assertEquals(['Laravel', 'Vue.js', 'PostgreSQL'], $profile->fresh()->skills->pluck('name')->toArray());
    }
}
