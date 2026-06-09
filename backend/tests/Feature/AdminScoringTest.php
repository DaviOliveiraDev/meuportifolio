<?php

namespace Tests\Feature;

use App\Infrastructure\Models\User;
use App\Infrastructure\Models\ScoringConfig;
use App\Infrastructure\Models\ScoringConfigHistory;
use App\Infrastructure\Models\AdminAudit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminScoringTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->user = User::factory()->create(['is_admin' => false]);
    }

    public function test_non_admin_cannot_access_scoring_config()
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/admin/scoring');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_scoring_config()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/scoring');
        $response->assertStatus(200)
            ->assertJsonStructure(['active_config', 'default_weights', 'history']);
    }

    public function test_admin_cannot_save_scoring_config_with_invalid_weights_sum()
    {
        $payload = [
            'weights' => [
                'experience' => 40,
                'projects' => 25,
                'skills_badges' => 15,
                'github' => 15,
                'education' => 10,
                'completeness' => 5, // Sum = 110
            ],
            'reason' => 'Invalid sum'
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/v1/admin/scoring', $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['weights']);
    }

    public function test_admin_can_save_scoring_config_and_logs_audit()
    {
        // Seed default config
        $oldConfig = ScoringConfig::create([
            'weights' => [
                'experience' => 30,
                'projects' => 25,
                'skills_badges' => 15,
                'github' => 15,
                'education' => 10,
                'completeness' => 5,
            ],
            'is_active' => true
        ]);

        $payload = [
            'weights' => [
                'experience' => 40,
                'projects' => 20,
                'skills_badges' => 15,
                'github' => 10,
                'education' => 10,
                'completeness' => 5, // Sum = 100
            ],
            'reason' => 'Novos pesos para testes'
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/v1/admin/scoring', $payload);
        
        $response->assertStatus(200);

        // Verifica banco de dados
        $this->assertDatabaseHas('scoring_configs', [
            'is_active' => true,
        ]);
        
        // O antigo deve estar inativo
        $this->assertDatabaseHas('scoring_configs', [
            'id' => $oldConfig->id,
            'is_active' => false,
        ]);

        // Verifica histórico
        $this->assertDatabaseHas('scoring_config_history', [
            'updated_by_user_id' => $this->admin->id,
            'reason' => 'Novos pesos para testes',
        ]);

        // Verifica auditoria
        $this->assertDatabaseHas('admin_audits', [
            'user_id' => $this->admin->id,
            'action' => 'update_scoring_weights',
        ]);
    }
}
