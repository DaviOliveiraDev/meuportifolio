<?php

namespace Tests\Feature;

use App\Domain\Gamification\Services\XpManagerService;
use App\Domain\Gamification\Services\OvrEngineService;
use App\Domain\Gamification\Services\BadgeEvaluatorService;
use App\Domain\Gamification\Services\TitleEvaluatorService;
use App\Domain\Gamification\Services\CosmeticEvaluatorService;
use App\Infrastructure\Models\Badge;
use App\Infrastructure\Models\Cosmetic;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\Title;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GamificationEngineTest extends TestCase
{
    use RefreshDatabase;

    protected XpManagerService $xpManager;
    protected OvrEngineService $ovrEngine;
    protected BadgeEvaluatorService $badgeEvaluator;
    protected TitleEvaluatorService $titleEvaluator;
    protected CosmeticEvaluatorService $cosmeticEvaluator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->xpManager = app(XpManagerService::class);
        $this->ovrEngine = app(OvrEngineService::class);
        $this->badgeEvaluator = app(BadgeEvaluatorService::class);
        $this->titleEvaluator = app(TitleEvaluatorService::class);
        $this->cosmeticEvaluator = app(CosmeticEvaluatorService::class);
    }

    /**
     * Test mapping of XP to Levels based on: XP = 100 * (Level ^ 1.5).
     */
    public function test_determine_level_progression(): void
    {
        // Level 1: 0 XP
        $levelData = $this->xpManager->determineLevel(0);
        $this->assertEquals(1, $levelData['level']);
        $this->assertEquals(0, $levelData['xp_in_level']);
        $this->assertEquals(100, $levelData['xp_required_for_next']);

        // Level 2: 100 XP (Required: floor(100 * 1^1.5) = 100)
        $levelData = $this->xpManager->determineLevel(100);
        $this->assertEquals(2, $levelData['level']);
        $this->assertEquals(0, $levelData['xp_in_level']);

        // Level 3: 382 XP (Accumulated: 100 + floor(100 * 2^1.5) = 100 + 282 = 382)
        $levelData = $this->xpManager->determineLevel(382);
        $this->assertEquals(3, $levelData['level']);
        $this->assertEquals(0, $levelData['xp_in_level']);
    }

    /**
     * Test OVR card calculation and metadata mapping.
     */
    public function test_ovr_engine_attributes_and_metadata(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $user->id]);
        $stats = $profile->stats()->firstOrCreate([]);

        // Configura telemetria fictícia para teste
        $stats->update([
            'total_projects' => 3,
            'github_connected' => true,
            'github_commits' => 120, // +12 pts no OSS
            'github_stars' => 10,   // +20 pts no OSS
            'profile_views' => 150, // +10 pts no COM
            'total_skills' => 5,
        ]);

        $ovr = $this->ovrEngine->calculateAndUpdateOvr($profile);
        $this->assertGreaterThan(0, $ovr);

        $metadata = $this->ovrEngine->getCardMetadata($ovr);
        $this->assertArrayHasKey('tier', $metadata);
        $this->assertArrayHasKey('gradient', $metadata);
        $this->assertArrayHasKey('glow', $metadata);
    }

    /**
     * Test unlock criteria and progressive achievement updates.
     */
    public function test_badge_title_and_cosmetic_unlocks(): void
    {
        // 1. Criar Badge, Title, e Cosmetic de teste
        $badge = Badge::create([
            'name' => 'Conquistador de Teste',
            'description' => 'Badge para testar a engine.',
            'rarity' => 'rara',
            'xp_reward' => 250,
            'rules_criteria' => ['type' => 'projects_count', 'value' => 3],
            'is_active' => true,
        ]);

        $title = Title::create([
            'name' => 'Test Alchemist',
            'unlock_badge_id' => $badge->id,
            'is_active' => true,
        ]);

        $cosmetic = Cosmetic::create([
            'name' => 'Test Border',
            'type' => 'border',
            'value' => 'border-test-glow',
            'unlock_badge_id' => $badge->id,
        ]);

        $user = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $user->id]);
        $stats = $profile->stats()->firstOrCreate([]);

        // 2. Definir 2 projetos (ainda não desbloqueia, target é 3)
        $stats->update(['total_projects' => 2]);

        $this->badgeEvaluator->evaluateAndAwardBadges($profile);
        $this->titleEvaluator->evaluateAndAwardTitles($profile);
        $this->cosmeticEvaluator->evaluateAndAwardCosmetics($profile);

        // Verifica que o progresso intermediário foi gravado no banco (2/3)
        $progress = $profile->badgeProgress()->where('badge_id', $badge->id)->first();
        $this->assertNotNull($progress);
        $this->assertEquals(2, $progress->current_value);
        $this->assertEquals(3, $progress->target_value);

        // Verifica que não foi desbloqueado
        $this->assertFalse($profile->badges()->where('badge_id', $badge->id)->exists());
        $this->assertFalse($profile->titles()->where('title_id', $title->id)->exists());
        $this->assertFalse($profile->cosmetics()->where('cosmetic_id', $cosmetic->id)->exists());

        // 3. Eleva projetos para 3 (deve desbloquear a badge, o título e o cosmético)
        $stats->update(['total_projects' => 3]);

        $this->badgeEvaluator->evaluateAndAwardBadges($profile);
        $this->titleEvaluator->evaluateAndAwardTitles($profile);
        $this->cosmeticEvaluator->evaluateAndAwardCosmetics($profile);

        // Verifica os desbloqueios e o XP adicionado
        $this->assertTrue($profile->badges()->where('badge_id', $badge->id)->exists());
        $this->assertTrue($profile->titles()->where('title_id', $title->id)->exists());
        $this->assertTrue($profile->cosmetics()->where('cosmetic_id', $cosmetic->id)->exists());
        $this->assertEquals(350, $profile->fresh()->xp); // 250 XP (badge de teste) + 100 XP (badge padrão Portfólio Ativo)
    }
}
