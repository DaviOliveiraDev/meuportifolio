<?php

namespace Tests\Feature;

use App\Domain\Services\GithubServiceInterface;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\User;
use App\Jobs\SyncGithubRepositoriesJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Mockery;
use Tests\TestCase;

class GithubSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_trigger_sync(): void
    {
        $response = $this->postJson('/api/v1/github/sync');
        $response->assertStatus(401);
    }

    public function test_user_without_profile_cannot_trigger_sync(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/github/sync');
        $response->assertStatus(422)
            ->assertJsonFragment(['message' => 'Perfil profissional não encontrado. Por favor, crie seu perfil primeiro.']);
    }

    public function test_user_without_github_url_cannot_trigger_sync(): void
    {
        $user = User::factory()->create();
        Profile::factory()->create([
            'user_id' => $user->id,
            'github_url' => null
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/github/sync');
        $response->assertStatus(422)
            ->assertJsonFragment(['message' => 'Por favor, preencha a URL do GitHub em seu perfil antes de realizar a sincronização.']);
    }

    public function test_successful_sync_request_dispatches_job_and_sets_cache(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'github_url' => 'https://github.com/davioliveiradev'
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/github/sync');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Sincronização iniciada com sucesso em segundo plano.',
                'status' => 'pending'
            ]);

        $this->assertEquals('pending', Cache::get("github_sync_{$profile->id}"));

        Queue::assertPushed(SyncGithubRepositoriesJob::class, function ($job) use ($profile) {
            return $job->profile->id === $profile->id && $job->queue === 'github';
        });
    }

    public function test_cannot_trigger_sync_if_sync_is_already_running(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'github_url' => 'https://github.com/davioliveiradev'
        ]);

        Cache::put("github_sync_{$profile->id}", 'processing');

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/github/sync');

        $response->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'Uma sincronização já está em andamento.',
                'status' => 'processing'
            ]);
    }

    public function test_get_sync_status(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        Sanctum::actingAs($user);

        // Caso 1: Status inicial
        $response = $this->getJson('/api/v1/github/sync/status');
        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'idle']);

        // Caso 2: Em andamento
        Cache::put("github_sync_{$profile->id}", 'processing');
        $response = $this->getJson('/api/v1/github/sync/status');
        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'processing']);
    }

    public function test_sync_job_imports_repositories(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'github_url' => 'https://github.com/davioliveiradev'
        ]);

        // Mock do GithubService
        $mockRepos = [
            [
                'name' => 'first-repo',
                'description' => 'First repo description',
                'html_url' => 'https://github.com/davioliveiradev/first-repo',
                'homepage' => 'https://first-demo.com',
                'private' => false,
            ],
            [
                'name' => 'second-repo',
                'description' => null, // Sem descrição, deve usar o padrão
                'html_url' => 'https://github.com/davioliveiradev/second-repo',
                'homepage' => null,
                'private' => false,
            ],
            [
                'name' => 'third-repo',
                'description' => str_repeat('A', 2500), // Descrição longa, deve truncar
                'html_url' => 'https://github.com/davioliveiradev/third-repo',
                'homepage' => null,
                'private' => false,
            ],
        ];

        $githubServiceMock = Mockery::mock(GithubServiceInterface::class);
        $githubServiceMock->shouldReceive('fetchUserRepositories')
            ->once()
            ->with('davioliveiradev')
            ->andReturn($mockRepos);

        // Executa o Job diretamente
        $job = new SyncGithubRepositoriesJob($profile);
        $job->handle($githubServiceMock);

        // Verifica se os projetos foram inseridos
        $this->assertDatabaseHas('projects', [
            'profile_id' => $profile->id,
            'title' => 'first-repo',
            'repository_url' => 'https://github.com/davioliveiradev/first-repo',
            'demo_url' => 'https://first-demo.com',
        ]);

        $this->assertDatabaseHas('projects', [
            'profile_id' => $profile->id,
            'title' => 'second-repo',
            'description' => 'Projeto importado do GitHub.',
        ]);

        // Verifica o truncamento da descrição longa
        $thirdProject = Project::where('title', 'third-repo')->first();
        $this->assertNotNull($thirdProject);
        $this->assertEquals(2000, strlen($thirdProject->description));
        $this->assertTrue(str_ends_with($thirdProject->description, '...'));

        // Verifica estados do Cache
        $this->assertEquals('completed', Cache::get("github_sync_{$profile->id}"));
        $this->assertNotNull(Cache::get("github_sync_last_{$profile->id}"));
    }
}
