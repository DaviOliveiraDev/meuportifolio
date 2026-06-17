<?php

namespace Tests\Feature;

use App\Domain\Gamification\Services\Reputation\ScorePipeline;
use App\Domain\Gamification\Services\Reputation\EvidenceNormalizer;
use App\Domain\Gamification\Services\Reputation\SkillScoreCalculator;
use App\Domain\Gamification\Services\Reputation\DomainAggregator;
use App\Domain\Gamification\Services\Reputation\OVRCalculator;
use App\Domain\Gamification\Services\Reputation\DNAProfileBuilder;
use App\Infrastructure\Models\User;
use App\Infrastructure\Models\Evidence;
use App\Infrastructure\Models\EvidenceProject;
use App\Infrastructure\Models\EvidenceExperience;
use App\Infrastructure\Models\EvidenceTechnology;
use App\Infrastructure\Models\Technology;
use App\Infrastructure\Models\TechDomain;
use App\Infrastructure\Models\TechCompetency;
use Database\Seeders\TaxonomySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class ReputationCalculationV2Test extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed taxonomy so that domains, competencies and technologies exist
        $this->seed(TaxonomySeeder::class);
    }

    /**
     * Test calculation logic for normalized weights, recency decay, and depth/verification factors.
     */
    public function test_evidence_normalization_factors(): void
    {
        $user = User::factory()->create();

        // 1. Create a primary technology experience
        $tech = Technology::where('slug', 'laravel')->first();
        if (!$tech) {
            $tech = Technology::create(['name' => 'Laravel', 'slug' => 'laravel', 'category' => 'framework']);
        }

        $evidence = Evidence::create([
            'user_id' => $user->id,
            'evidence_type' => 'experience',
            'verification_level' => 'auto_verified',
            'is_current' => true,
            'is_active' => true,
        ]);

        EvidenceExperience::create([
            'evidence_id' => $evidence->id,
            'company_name' => 'Acme Corp',
            'role_title' => 'Senior Developer',
            'company_tier' => 'tier1_global',
        ]);

        EvidenceTechnology::create([
            'evidence_id' => $evidence->id,
            'technology_id' => $tech->id,
            'usage_depth' => 'expert',
            'is_primary' => true,
        ]);

        $normalizer = app(EvidenceNormalizer::class);
        $normalized = $normalizer->normalize(collect([$evidence]));

        $this->assertCount(1, $normalized);
        $item = $normalized->first();

        // base_weight: primary experience (25) + tier1_global (15) = 40
        $this->assertEquals(40.0, $item->base_weight);
        // recency: is_current = 1.0
        $this->assertEquals(1.0, $item->recency_factor);
        // verification: auto_verified = 1.0
        $this->assertEquals(1.0, $item->verification_factor);
        // depth: expert = 1.0
        $this->assertEquals(1.0, $item->depth_factor);
    }

    /**
     * Test diversity multiplier and count capping in SkillScoreCalculator.
     */
    public function test_skill_score_capping_and_multipliers(): void
    {
        $user = User::factory()->create();
        $tech = Technology::first();

        // Let's mock normalized weights directly
        $weights = collect([
            (object) [
                'user_id' => $user->id,
                'technology_id' => $tech->id,
                'base_weight' => 20.0,
                'recency_factor' => 1.0,
                'verification_factor' => 1.0,
                'depth_factor' => 1.0,
                'evidence_type' => 'project',
            ],
            (object) [
                'user_id' => $user->id,
                'technology_id' => $tech->id,
                'base_weight' => 25.0,
                'recency_factor' => 1.0,
                'verification_factor' => 1.0,
                'depth_factor' => 1.0,
                'evidence_type' => 'experience',
            ],
        ]);

        $calculator = app(SkillScoreCalculator::class);
        $skillScores = $calculator->calculate($user->id, $weights);

        $this->assertCount(1, $skillScores);
        $scoreObj = $skillScores->first();

        // rawSum = 20.0 + 25.0 = 45.0
        // countMultiplier: log(1 + 2) / log(5) = log(3) / log(5) = ~0.6826
        // diversityFactor: log(1 + 2) / log(4) = log(3) / log(4) = ~0.7924
        // rawWithMultipliers = 45 * 0.6826 * 0.7924 = ~24.34
        // score = 99.0 * (1 - exp(-24.34 / 30.0)) = 99.0 * (1 - 0.4442) = ~55.0
        $this->assertTrue($scoreObj->score > 0);
        $this->assertEquals(2, $scoreObj->evidence_count);
    }

    /**
     * Test DomainAggregator competency aggregation and breadth bonus.
     */
    public function test_domain_aggregation_and_breadth_bonus(): void
    {
        $user = User::factory()->create();

        // Fetch backend domain
        $backendDomain = TechDomain::where('slug', 'backend')->first();
        $competencies = TechCompetency::where('domain_id', $backendDomain->id)->take(2)->get();

        $techs = Technology::take(2)->get();

        // Map technology to first competency
        $competencies[0]->technologies()->syncWithPivotValues([$techs[0]->id], ['contribution_weight' => 1.0, 'is_primary' => true]);
        // Map technology to second competency
        $competencies[1]->technologies()->syncWithPivotValues([$techs[1]->id], ['contribution_weight' => 1.0, 'is_primary' => true]);

        // Create skill scores
        $skillScores = collect([
            new \App\Infrastructure\Models\UserSkillScore([
                'user_id' => $user->id,
                'technology_id' => $techs[0]->id,
                'score' => 45.0,
            ]),
            new \App\Infrastructure\Models\UserSkillScore([
                'user_id' => $user->id,
                'technology_id' => $techs[1]->id,
                'score' => 50.0,
            ]),
        ]);

        $aggregator = app(DomainAggregator::class);
        $result = $aggregator->aggregate($user->id, $skillScores);

        $this->assertTrue($result->has('competencies'));
        $this->assertTrue($result->has('domains'));

        $backendScoreObj = $result->get('domains')->firstWhere('domain_id', $backendDomain->id);

        // Sob a taxonomia seedada do banco de dados, o score final agregando os pesos é 33.1
        $this->assertEquals(33.1, $backendScoreObj->score);
    }

    /**
     * Test full ScorePipeline execution and database persistence.
     */
    public function test_full_pipeline_persistence_and_redis(): void
    {
        // Mock Redis calls specifically for this test run
        Redis::shouldReceive('zadd')->andReturn(1);

        $user = User::factory()->create();

        // Laravel framework technology
        $tech = Technology::where('slug', 'laravel')->first();

        // 1. Create project evidence
        $evidence = Evidence::create([
            'user_id' => $user->id,
            'evidence_type' => 'project',
            'verification_level' => 'auto_verified',
            'is_current' => true,
            'is_active' => true,
        ]);

        EvidenceProject::create([
            'evidence_id' => $evidence->id,
            'title' => 'My Production Project',
            'is_production' => true,
            'user_scale' => 'large',
        ]);

        EvidenceTechnology::create([
            'evidence_id' => $evidence->id,
            'technology_id' => $tech->id,
            'usage_depth' => 'primary',
            'is_primary' => true,
        ]);

        // Run pipeline
        $pipeline = app(ScorePipeline::class);
        $result = $pipeline->execute($user->id);

        $this->assertEquals($user->id, $result->userId);
        $this->assertTrue($result->ovr > 0);

        // Assert database records
        $this->assertDatabaseHas('user_reputation_scores', [
            'user_id' => $user->id,
            'ovr' => $result->ovr,
            'engine_version' => '2.0',
        ]);

        $this->assertDatabaseHas('user_skill_scores', [
            'user_id' => $user->id,
            'technology_id' => $tech->id,
        ]);

        $this->assertDatabaseHas('user_score_history', [
            'user_id' => $user->id,
            'ovr' => $result->ovr,
        ]);
    }
}
