<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use App\Infrastructure\Models\AnalyticsEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_portfolio_view_tracks_event_in_redis_buffer(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'username' => 'davitest',
            'name' => 'Davi Test',
        ]);

        Cache::shouldReceive('has')->once()->andReturn(false);
        Cache::shouldReceive('put')->once();

        Redis::shouldReceive('rpush')
            ->once()
            ->with('devfolio_analytics_events_buffer', \Mockery::on(function ($json) use ($profile) {
                $data = json_decode($json, true);
                return $data['profile_id'] === $profile->id && $data['event_type'] === 'view_profile';
            }));

        $response = $this->getJson('/api/v1/portfolios/davitest');

        $response->assertStatus(200);
    }

    public function test_portfolio_track_endpoint_adds_event_to_redis_buffer(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'username' => 'davitest',
        ]);

        Cache::shouldReceive('has')->once()->andReturn(false);
        Cache::shouldReceive('put')->once();

        Redis::shouldReceive('rpush')
            ->once()
            ->with('devfolio_analytics_events_buffer', \Mockery::on(function ($json) use ($profile) {
                $data = json_decode($json, true);
                return $data['profile_id'] === $profile->id && $data['event_type'] === 'view_project' && $data['target_id'] === 'project-123';
            }));

        $response = $this->postJson("/api/v1/portfolios/davitest/track", [
            'event_type' => 'view_project',
            'target_id' => 'project-123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Evento de monitoramento registrado com sucesso.');
    }

    public function test_flush_analytics_buffer_command_persists_to_postgres(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'username' => 'davitest',
        ]);

        $payload = [
            'profile_id' => $profile->id,
            'event_type' => 'view_profile',
            'target_id' => null,
            'viewer_ip_hash' => hash('sha256', '127.0.0.1'),
            'user_agent' => 'Mozilla/5.0',
            'referer' => null,
            'created_at' => now()->toIso8601String(),
        ];

        // Mock do Redis para retornar um evento e depois retornar null (fim do loop)
        Redis::shouldReceive('lpop')
            ->once()
            ->with('devfolio_analytics_events_buffer')
            ->andReturn(json_encode($payload));

        Redis::shouldReceive('lpop')
            ->once()
            ->with('devfolio_analytics_events_buffer')
            ->andReturn(null);

        $this->artisan('devfolio:flush-analytics')
            ->expectsOutputToContain('eventos de analytics foram salvos no PostgreSQL')
            ->assertExitCode(0);

        $this->assertDatabaseHas('analytics_events', [
            'profile_id' => $profile->id,
            'event_type' => 'view_profile',
        ]);
    }
}
