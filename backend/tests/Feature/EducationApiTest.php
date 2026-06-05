<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Education;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EducationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_educations(): void
    {
        $response = $this->getJson('/api/v1/educations');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_education(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'institution' => 'Harvard University',
            'course' => 'Computer Science',
            'start_date' => '2020-09-01',
            'end_date' => '2024-06-01',
            'is_current' => false,
        ];

        $response = $this->postJson('/api/v1/educations', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('education.institution', 'Harvard University')
            ->assertJsonPath('education.course', 'Computer Science')
            ->assertJsonPath('education.is_current', false);

        $this->assertDatabaseHas('educations', [
            'profile_id' => $profile->id,
            'institution' => 'Harvard University',
            'course' => 'Computer Science',
            'is_current' => false,
        ]);
    }

    public function test_authenticated_user_can_list_their_educations(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        Education::factory()->count(2)->create([
            'profile_id' => $profile->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/educations');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'educations');
    }

    public function test_user_cannot_view_someone_elses_education(): void
    {
        $user1 = User::factory()->create();
        $profile1 = Profile::factory()->create([
            'user_id' => $user1->id,
        ]);
        $education = Education::factory()->create([
            'profile_id' => $profile1->id,
        ]);

        $user2 = User::factory()->create();
        $profile2 = Profile::factory()->create([
            'user_id' => $user2->id,
        ]);

        Sanctum::actingAs($user2);

        $response = $this->getJson("/api/v1/educations/{$education->id}");
        $response->assertStatus(403);
    }

    public function test_user_can_update_their_education(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);
        $education = Education::factory()->create([
            'profile_id' => $profile->id,
            'institution' => 'Old University',
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'institution' => 'New University',
            'course' => 'Software Engineering',
            'start_date' => '2020-09-01',
            'is_current' => true,
        ];

        $response = $this->putJson("/api/v1/educations/{$education->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('education.institution', 'New University')
            ->assertJsonPath('education.is_current', true);

        $this->assertDatabaseHas('educations', [
            'id' => $education->id,
            'institution' => 'New University',
            'is_current' => true,
            'end_date' => null, // end_date should be null when is_current is true
        ]);
    }

    public function test_user_can_delete_their_education(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);
        $education = Education::factory()->create([
            'profile_id' => $profile->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/v1/educations/{$education->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('educations', [
            'id' => $education->id,
        ]);
    }
}
