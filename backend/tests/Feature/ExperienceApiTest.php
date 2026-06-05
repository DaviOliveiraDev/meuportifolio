<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Experience;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExperienceApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_experiences(): void
    {
        $response = $this->getJson('/api/v1/experiences');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_experience(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'company' => 'Google',
            'role' => 'Software Engineer',
            'start_date' => '2023-01-01',
            'end_date' => '2024-01-01',
            'is_current' => false,
            'description' => 'Developed high scalability systems.',
        ];

        $response = $this->postJson('/api/v1/experiences', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('experience.company', 'Google')
            ->assertJsonPath('experience.role', 'Software Engineer')
            ->assertJsonPath('experience.is_current', false);

        $this->assertDatabaseHas('experiences', [
            'profile_id' => $profile->id,
            'company' => 'Google',
            'role' => 'Software Engineer',
            'is_current' => false,
        ]);
    }

    public function test_authenticated_user_can_list_their_experiences(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        Experience::factory()->count(2)->create([
            'profile_id' => $profile->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/experiences');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'experiences');
    }

    public function test_user_cannot_view_someone_elses_experience(): void
    {
        $user1 = User::factory()->create();
        $profile1 = Profile::factory()->create([
            'user_id' => $user1->id,
        ]);
        $experience = Experience::factory()->create([
            'profile_id' => $profile1->id,
        ]);

        $user2 = User::factory()->create();
        $profile2 = Profile::factory()->create([
            'user_id' => $user2->id,
        ]);

        Sanctum::actingAs($user2);

        $response = $this->getJson("/api/v1/experiences/{$experience->id}");
        $response->assertStatus(403);
    }

    public function test_user_can_update_their_experience(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);
        $experience = Experience::factory()->create([
            'profile_id' => $profile->id,
            'company' => 'Old Company',
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'company' => 'New Company',
            'role' => 'Senior Engineer',
            'start_date' => '2023-01-01',
            'is_current' => true,
        ];

        $response = $this->putJson("/api/v1/experiences/{$experience->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('experience.company', 'New Company')
            ->assertJsonPath('experience.is_current', true);

        $this->assertDatabaseHas('experiences', [
            'id' => $experience->id,
            'company' => 'New Company',
            'is_current' => true,
            'end_date' => null, // end_date should be reset to null when is_current is true
        ]);
    }

    public function test_user_can_delete_their_experience(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);
        $experience = Experience::factory()->create([
            'profile_id' => $profile->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/v1/experiences/{$experience->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('experiences', [
            'id' => $experience->id,
        ]);
    }
}
