<?php

namespace Tests\Feature;

use App\Domain\Gamification\Services\Reputation\ScorePipeline;
use App\Infrastructure\Models\User;
use App\Infrastructure\Models\Technology;
use App\Infrastructure\Services\FeatureFlag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReputationEngineV2Test extends TestCase
{
    use RefreshDatabase;

    /**
     * Testa que as feature flags estão definidas e desativadas por padrão.
     */
    public function test_feature_flags_are_defined_and_false_by_default(): void
    {
        $this->assertFalse(FeatureFlag::isEnabled('reputation_v2'));
        $this->assertFalse(FeatureFlag::isEnabled('recruiter_score'));
        $this->assertFalse(FeatureFlag::isEnabled('satori_og_card'));
    }

    /**
     * Testa que o autocomplete retorna lista vazia quando nenhuma query é fornecida.
     */
    public function test_technology_autocomplete_returns_empty_when_no_query(): void
    {
        $response = $this->getJson('/api/v1/technologies/autocomplete');
        $response->assertStatus(200)
                 ->assertJson([]);
    }

    /**
     * Testa que o autocomplete busca tecnologias ativas pelo nome ou aliases.
     */
    public function test_technology_autocomplete_finds_active_technologies(): void
    {
        // Cria tecnologia ativa
        $tech = Technology::create([
            'name' => 'Laravel Framework',
            'slug' => 'laravel-framework',
            'category' => 'framework',
            'status' => 'active',
            'aliases' => ['laravel', 'php framework'],
        ]);

        // Cria tecnologia inativa/depreciada
        Technology::create([
            'name' => 'Old Tech',
            'slug' => 'old-tech',
            'category' => 'framework',
            'status' => 'deprecated',
            'aliases' => ['old'],
        ]);

        // 1. Busca por nome exato / parcial
        $response = $this->getJson('/api/v1/technologies/autocomplete?q=Laravel');
        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.slug', 'laravel-framework');

        // 2. Busca por alias
        $responseAlias = $this->getJson('/api/v1/technologies/autocomplete?q=php framework');
        $responseAlias->assertStatus(200)
                      ->assertJsonCount(1)
                      ->assertJsonPath('0.slug', 'laravel-framework');

        // 3. Tecnologias depreciadas/inativas não devem retornar no autocomplete
        $responseInactive = $this->getJson('/api/v1/technologies/autocomplete?q=Old');
        $responseInactive->assertStatus(200)
                         ->assertJsonCount(0);
    }

    /**
     * Testa a execução básica do ScorePipeline.
     */
    public function test_score_pipeline_executes_successfully_for_user(): void
    {
        $user = User::factory()->create();

        $pipeline = app(ScorePipeline::class);
        $result = $pipeline->execute($user->id);

        $this->assertEquals($user->id, $result->userId);
        $this->assertEquals(0.0, $result->ovr);
        $this->assertEquals(0.0, $result->recruiterScore);

        $this->assertDatabaseHas('user_reputation_scores', [
            'user_id' => $user->id,
            'ovr' => 0.0,
            'recruiter_score' => 0.0,
            'profile_label' => 'Generalist Engineer',
            'engine_version' => '2.0',
        ]);
    }
}
