<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use App\Jobs\GenerateResumePdfJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class PdfGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_request_pdf_generation(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'username' => 'davitest',
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/v1/profile/pdf');

        $response->assertStatus(202)
            ->assertJsonPath('status', 'pending');

        Queue::assertPushed(GenerateResumePdfJob::class, function ($job) use ($profile) {
            return $job->profile->id === $profile->id;
        });

        $this->assertEquals('pending', Cache::get("pdf_resume_{$profile->id}")['status']);
    }

    public function test_returns_status_and_url_correctly(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'username' => 'davitest',
        ]);

        // Testa status inicial (idle)
        $response = $this->actingAs($user)
            ->getJson('/api/v1/profile/pdf/status');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'idle')
            ->assertJsonPath('url', null);

        // Define status no cache como completed
        Cache::put("pdf_resume_{$profile->id}", [
            'status' => 'completed',
            'url' => 'https://s3.amazonaws.com/bucket/resumes/test.pdf',
            'updated_at' => now()->toIso8601String()
        ], 3600);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/profile/pdf/status');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'completed')
            ->assertJsonPath('url', 'https://s3.amazonaws.com/bucket/resumes/test.pdf');
    }
}
