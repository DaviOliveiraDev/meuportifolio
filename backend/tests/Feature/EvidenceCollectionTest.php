<?php

namespace Tests\Feature;

use App\Application\Actions\Project\CreateProjectAction;
use App\Application\DTOs\Project\CreateProjectDTO;
use App\Domain\Services\GithubServiceInterface;
use App\Infrastructure\Models\User;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\Experience;
use App\Infrastructure\Models\Education;
use App\Infrastructure\Models\Technology;
use App\Jobs\SyncGithubRepositoriesJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Mockery;
use Tests\TestCase;

class EvidenceCollectionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test if creating a project correctly synchronizes V2 evidence.
     */
    public function test_creating_project_syncs_v2_evidence(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        $tech = Technology::create([
            'name' => 'Laravel',
            'slug' => 'laravel',
            'category' => 'framework',
            'status' => 'active',
        ]);

        $dto = new CreateProjectDTO(
            profileId: $profile->id,
            title: 'My Project',
            description: 'My Description',
            coverImageUrl: null,
            repositoryUrl: 'https://github.com/my/project',
            demoUrl: 'https://demo.com',
            isFeatured: true,
            orderWeight: 1,
            technologies: [
                [
                    'id' => $tech->id,
                    'usage_depth' => 'primary',
                    'is_primary' => true,
                ]
            ]
        );

        $action = app(CreateProjectAction::class);
        $project = $action->execute($dto);

        $this->assertNotNull($project->evidence_id);

        $this->assertDatabaseHas('evidences', [
            'id' => $project->evidence_id,
            'user_id' => $user->id,
            'evidence_type' => 'project',
            'verification_level' => 'self_declared',
        ]);

        $this->assertDatabaseHas('evidence_projects', [
            'evidence_id' => $project->evidence_id,
            'title' => 'My Project',
            'url' => 'https://demo.com',
            'repository_url' => 'https://github.com/my/project',
            'is_production' => true,
        ]);

        $this->assertDatabaseHas('evidence_technologies', [
            'evidence_id' => $project->evidence_id,
            'technology_id' => $tech->id,
            'usage_depth' => 'primary',
            'is_primary' => true,
        ]);
    }

    /**
     * Test if the extended GitHub sync job collects languages and creates V2 evidence.
     */
    public function test_github_sync_job_collects_languages_and_creates_v2_evidence(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'github_url' => 'https://github.com/testuser',
        ]);

        $tech = Technology::create([
            'name' => 'TypeScript',
            'slug' => 'typescript',
            'category' => 'language',
            'status' => 'active',
        ]);

        // Mock GitHub service
        $githubServiceMock = Mockery::mock(GithubServiceInterface::class);
        $githubServiceMock->shouldReceive('fetchUserRepositories')
            ->with('testuser')
            ->once()
            ->andReturn([
                [
                    'id' => 123456,
                    'name' => 'test-repo',
                    'full_name' => 'testuser/test-repo',
                    'html_url' => 'https://github.com/testuser/test-repo',
                    'description' => 'A test repo description',
                    'homepage' => 'https://testrepo.com',
                    'private' => false,
                    'stargazers_count' => 10,
                    'forks_count' => 2,
                    'open_issues_count' => 1,
                    'watchers_count' => 10,
                    'language' => 'TypeScript',
                    'pushed_at' => '2026-06-16T12:00:00Z',
                ]
            ]);

        $githubServiceMock->shouldReceive('fetchRepositoryLanguages')
            ->with('testuser', 'test-repo')
            ->once()
            ->andReturn([
                'TypeScript' => 5000,
                'CSS' => 200,
            ]);

        $this->app->instance(GithubServiceInterface::class, $githubServiceMock);

        SyncGithubRepositoriesJob::dispatchSync($profile);

        $project = Project::where('profile_id', $profile->id)->first();
        $this->assertNotNull($project);
        $this->assertNotNull($project->evidence_id);

        $this->assertDatabaseHas('evidences', [
            'id' => $project->evidence_id,
            'user_id' => $user->id,
            'evidence_type' => 'github',
            'verification_level' => 'auto_verified',
            'verification_source' => 'github_oauth',
        ]);

        $this->assertDatabaseHas('evidence_github', [
            'evidence_id' => $project->evidence_id,
            'github_repo_id' => 123456,
            'repo_full_name' => 'testuser/test-repo',
            'stars' => 10,
            'forks' => 2,
        ]);

        $this->assertDatabaseHas('evidence_technologies', [
            'evidence_id' => $project->evidence_id,
            'technology_id' => $tech->id,
            'usage_depth' => 'primary',
            'is_primary' => true,
        ]);
    }

    /**
     * Test if the backfill command successfully migrates legacy records.
     */
    public function test_backfill_artisan_command_migrates_legacy_records(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
        ]);

        $tech = Technology::create([
            'name' => 'PHP',
            'slug' => 'php',
            'category' => 'language',
            'status' => 'active',
        ]);

        // Create legacy models without evidence_id
        $project = Project::create([
            'profile_id' => $profile->id,
            'title' => 'Legacy Project',
            'description' => 'Legacy Description',
            'is_featured' => false,
            'order_weight' => 0,
        ]);
        $project->technologies()->sync([$tech->id]);

        $experience = Experience::create([
            'profile_id' => $profile->id,
            'company' => 'Legacy Company',
            'role' => 'Legacy Role',
            'start_date' => '2025-01-01',
            'is_current' => true,
            'description' => 'Legacy Exp description',
        ]);
        $experience->technologies()->sync([$tech->id]);

        $education = Education::create([
            'profile_id' => $profile->id,
            'institution' => 'Legacy University',
            'course' => 'Legacy Course',
            'start_date' => '2020-01-01',
            'is_current' => false,
        ]);
        $education->technologies()->sync([$tech->id]);

        // Run the backfill command
        $exitCode = Artisan::call('devfolio:backfill-legacy-evidences');
        $this->assertEquals(0, $exitCode);

        // Assert evidence_id was filled
        $this->assertNotNull($project->fresh()->evidence_id);
        $this->assertNotNull($experience->fresh()->evidence_id);
        $this->assertNotNull($education->fresh()->evidence_id);

        $this->assertDatabaseHas('evidence_projects', [
            'evidence_id' => $project->fresh()->evidence_id,
            'title' => 'Legacy Project',
        ]);

        $this->assertDatabaseHas('evidence_experiences', [
            'evidence_id' => $experience->fresh()->evidence_id,
            'company_name' => 'Legacy Company',
        ]);

        $this->assertDatabaseHas('evidence_education', [
            'evidence_id' => $education->fresh()->evidence_id,
            'institution_name' => 'Legacy University',
        ]);

        $this->assertDatabaseHas('evidence_technologies', [
            'evidence_id' => $project->fresh()->evidence_id,
            'technology_id' => $tech->id,
        ]);
    }
}
