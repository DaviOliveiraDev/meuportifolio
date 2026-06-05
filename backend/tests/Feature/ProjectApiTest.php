<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_projects(): void
    {
        $response = $this->getJson('/api/v1/projects');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_project(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'title' => 'My Cool Project',
            'description' => 'This is a description of my project.',
            'cover_image_url' => 'https://example.com/cover.webp',
            'repository_url' => 'https://github.com/user/repo',
            'demo_url' => 'https://demo.example.com',
            'is_featured' => true,
            'order_weight' => 1,
        ];

        $response = $this->postJson('/api/v1/projects', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('project.title', 'My Cool Project')
            ->assertJsonPath('project.is_featured', true);

        $this->assertDatabaseHas('projects', [
            'profile_id' => $profile->id,
            'title' => 'My Cool Project',
            'is_featured' => true,
        ]);
    }

    public function test_authenticated_user_can_list_their_projects(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        Project::factory()->count(3)->create([
            'profile_id' => $profile->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'projects');
    }

    public function test_user_cannot_view_someone_elses_project(): void
    {
        $user1 = User::factory()->create();
        $profile1 = Profile::factory()->create([
            'user_id' => $user1->id,
        ]);
        $project = Project::factory()->create([
            'profile_id' => $profile1->id,
        ]);

        $user2 = User::factory()->create();
        $profile2 = Profile::factory()->create([
            'user_id' => $user2->id,
        ]);

        Sanctum::actingAs($user2);

        $response = $this->getJson("/api/v1/projects/{$project->id}");
        $response->assertStatus(403);
    }

    public function test_user_can_update_their_project(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);
        $project = Project::factory()->create([
            'profile_id' => $profile->id,
            'title' => 'Old Title',
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'title' => 'New Title',
            'description' => 'Updated description.',
            'is_featured' => false,
        ];

        $response = $this->putJson("/api/v1/projects/{$project->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('project.title', 'New Title');

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'New Title',
        ]);
    }

    public function test_user_can_delete_their_project(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);
        $project = Project::factory()->create([
            'profile_id' => $profile->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/v1/projects/{$project->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    public function test_user_cannot_feature_more_than_three_projects(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        // Create 3 featured projects
        Project::factory()->count(3)->create([
            'profile_id' => $profile->id,
            'is_featured' => true,
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'title' => 'Fourth Featured Project',
            'description' => 'Trying to feature a 4th project.',
            'is_featured' => true,
        ];

        $response = $this->postJson('/api/v1/projects', $payload);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Você pode ter no máximo 3 projetos destacados em seu perfil. Desmarque algum projeto destacado atual para destacar este.');
    }
}
