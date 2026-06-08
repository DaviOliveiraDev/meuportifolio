<?php

namespace Tests\Feature;

use App\Domain\Services\XpManagerService;
use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class XpLevelSystemTest extends TestCase
{
    use RefreshDatabase;

    protected XpManagerService $xpManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->xpManager = app(XpManagerService::class);
    }

    public function test_determine_level_transitions(): void
    {
        // Level 1: 0 XP
        $levelData = $this->xpManager->determineLevel(0);
        $this->assertEquals(1, $levelData['level']);
        $this->assertEquals(0, $levelData['xp_in_level']);
        $this->assertEquals(100, $levelData['xp_required_for_next']);

        // Level 2: 100 XP
        $levelData = $this->xpManager->determineLevel(100);
        $this->assertEquals(2, $levelData['level']);
        $this->assertEquals(0, $levelData['xp_in_level']);

        // Level 2: 200 XP (needs 382 XP for Level 3)
        $levelData = $this->xpManager->determineLevel(200);
        $this->assertEquals(2, $levelData['level']);
        $this->assertEquals(100, $levelData['xp_in_level']);

        // Level 3: 382 XP
        $levelData = $this->xpManager->determineLevel(382);
        $this->assertEquals(3, $levelData['level']);
        $this->assertEquals(0, $levelData['xp_in_level']);
    }

    public function test_award_xp_increases_total_and_recalculates_level(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'xp' => 0,
            'level' => 1,
        ]);

        // Adiciona 50 XP
        $this->xpManager->addXp($profile, 50);
        $this->assertEquals(50, $profile->fresh()->xp);
        $this->assertEquals(1, $profile->fresh()->level);

        // Adiciona mais 100 XP -> Total 150 XP (deve subir para level 2)
        $this->xpManager->addXp($profile, 100);
        $this->assertEquals(150, $profile->fresh()->xp);
        $this->assertEquals(2, $profile->fresh()->level);
    }

    public function test_xp_action_limits_and_anti_abuse(): void
    {
        Cache::flush();
        $user = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $user->id, 'xp' => 0]);

        // 1. Limite de 5 projetos recompensados
        for ($i = 0; $i < 7; $i++) {
            $this->xpManager->awardXpForAction($profile, 'add_project');
        }
        // Cada projeto dá 200 XP. Capped em 5 projetos = 1000 XP.
        $this->assertEquals(1000, $profile->fresh()->xp);

        // 2. Limite de visualizações diárias de perfil (100 XP por dia)
        $profile->xp = 0;
        $profile->save();

        for ($i = 0; $i < 15; $i++) {
            $this->xpManager->awardXpForAction($profile, 'profile_view');
        }
        // Cada view dá 10 XP. Capped em 100 XP por dia.
        $this->assertEquals(100, $profile->fresh()->xp);
    }
}
