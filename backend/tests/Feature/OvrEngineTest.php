<?php

namespace Tests\Feature;

use App\Domain\Services\OvrEngineService;
use App\Infrastructure\Models\Education;
use App\Infrastructure\Models\Experience;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\User;
use App\Infrastructure\Models\ScoringConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OvrEngineTest extends TestCase
{
    use RefreshDatabase;

    protected OvrEngineService $ovrEngine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->ovrEngine = app(OvrEngineService::class);
    }

    public function test_calculate_ovr_with_empty_profile(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'avatar_url' => null,
            'bio' => null,
            'github_url' => null,
        ]);

        $ovr = $this->ovrEngine->calculateAndUpdateOvr($profile);

        // Um perfil completamente vazio deve ter OVR mínimo (1)
        $this->assertEquals(1, $ovr);
        $this->assertEquals(1, $profile->fresh()->ovr);
        $this->assertEquals(0, $profile->fresh()->profile_completeness);
    }

    public function test_calculate_ovr_with_partial_profile(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'avatar_url' => 'https://example.com/avatar.jpg', // +15%
            'bio' => 'Senior developer.', // +15%
            'github_url' => 'https://github.com/testdev', // +10%
        ]);

        // Adiciona 1 experiência de 3 anos (36 meses)
        Experience::factory()->create([
            'profile_id' => $profile->id,
            'start_date' => now()->subYears(3),
            'end_date' => now(),
            'is_current' => false,
        ]); // Completo: +15%. Score Exp: 36/60 = 60%.

        // Adiciona 1 formação
        Education::factory()->create([
            'profile_id' => $profile->id,
        ]); // Completo: +15%. Score Edu: 1 * 50 = 50%.

        // Adiciona 2 projetos (sem repos, is_featured = false)
        Project::factory(2)->create([
            'profile_id' => $profile->id,
            'repository_url' => null,
            'demo_url' => null,
            'cover_image_url' => null,
            'is_featured' => false,
        ]); // Completo: +15%. Score Proj: 2 * 10 = 20%.

        // Completude acumulada = 15 (avatar) + 15 (bio) + 10 (github) + 15 (exp) + 15 (edu) + 15 (proj) = 85%.
        // Score GitHub: conectado = 25%.
        // Sem skills: Score Skill = 0%.
        
        $ovr = $this->ovrEngine->calculateAndUpdateOvr($profile->fresh());

        fwrite(STDERR, "\nDEBUG - Calculated OVR: {$ovr}, Completeness: {$profile->fresh()->profile_completeness}, XP: {$profile->fresh()->xp}, Level: {$profile->fresh()->level}\n");

        $this->assertEquals(38, $ovr);
    }

    public function test_calculate_ovr_respects_custom_weights(): void
    {
        // Cria configuração customizada ativa onde projetos possuem peso 100%
        ScoringConfig::create([
            'weights' => [
                'experience' => 0,
                'projects' => 100,
                'skills_badges' => 0,
                'github' => 0,
                'education' => 0,
                'completeness' => 0,
            ],
            'xp_rules' => [],
            'is_active' => true,
        ]);

        $user = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $user->id]);

        // Adiciona 2 projetos completos (10 base + 10 featured + 10 repo + 10 demo + 10 cover = 50 cada)
        Project::factory(2)->create([
            'profile_id' => $profile->id,
            'is_featured' => true,
            'repository_url' => 'https://github.com/repo',
            'demo_url' => 'https://demo.com',
            'cover_image_url' => 'https://img.com',
        ]); // Score Proj = 100%.

        $ovr = $this->ovrEngine->calculateAndUpdateOvr($profile->fresh());

        // O OVR deve ser 99 (limite máximo, já que o score de projetos é 100, mas o limite superior é 99)
        $this->assertEquals(99, $ovr);
    }
}
