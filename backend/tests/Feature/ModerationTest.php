<?php

namespace Tests\Feature;

use App\Infrastructure\Models\Profile;
use App\Infrastructure\Models\User;
use App\Infrastructure\Models\Report;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModerationTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $user1;
    protected User $user2;
    protected Profile $profile1;
    protected Profile $profile2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['is_admin' => true]);

        $this->user1 = User::factory()->create(['is_admin' => false]);
        $this->profile1 = Profile::create([
            'user_id' => $this->user1->id,
            'username' => 'reporter_dev',
            'name' => 'Reporter Dev',
            'is_active' => true,
        ]);

        $this->user2 = User::factory()->create(['is_admin' => false]);
        $this->profile2 = Profile::create([
            'user_id' => $this->user2->id,
            'username' => 'reported_dev',
            'name' => 'Reported Dev',
            'is_active' => true,
        ]);
    }

    public function test_authenticated_user_can_report_another_profile()
    {
        $payload = [
            'reported_username' => 'reported_dev',
            'reason' => 'Inappropriate content in biography.',
            'reported_type' => 'profile',
        ];

        $response = $this->actingAs($this->user1)->postJson('/api/v1/reports', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'message' => 'Report submitted successfully. We will review it shortly.'
            ]);

        $this->assertDatabaseHas('reports', [
            'reporter_profile_id' => $this->profile1->id,
            'reported_profile_id' => $this->profile2->id,
            'reason' => 'Inappropriate content in biography.',
            'status' => 'pending',
        ]);
    }

    public function test_user_cannot_report_own_profile()
    {
        $payload = [
            'reported_username' => 'reporter_dev',
            'reason' => 'Self reporting.',
        ];

        $response = $this->actingAs($this->user1)->postJson('/api/v1/reports', $payload);

        $response->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'You cannot report your own profile.'
            ]);
    }

    public function test_non_admin_cannot_access_reports_or_moderate()
    {
        // 1. Get reports
        $response1 = $this->actingAs($this->user1)->getJson('/api/v1/admin/reports');
        $response1->assertStatus(403);

        // 2. Update report
        $report = Report::create([
            'reporter_profile_id' => $this->profile1->id,
            'reported_profile_id' => $this->profile2->id,
            'reason' => 'Some violation',
            'status' => 'pending',
        ]);

        $payload = [
            'status' => 'resolved',
            'action' => 'hide_profile',
            'resolution_notes' => 'Resolved by moderator.',
        ];

        $response2 = $this->actingAs($this->user1)->putJson("/api/v1/admin/reports/{$report->id}", $payload);
        $response2->assertStatus(403);
    }

    public function test_admin_can_view_reports_and_resolve_by_suspending_profile()
    {
        $report = Report::create([
            'reporter_profile_id' => $this->profile1->id,
            'reported_profile_id' => $this->profile2->id,
            'reason' => 'Spam content',
            'status' => 'pending',
        ]);

        // 1. Admin lists reports
        $response1 = $this->actingAs($this->admin)->getJson('/api/v1/admin/reports');
        $response1->assertStatus(200)
            ->assertJsonCount(1, 'reports');

        // 2. Admin resolves and suspends profile (action: hide_profile)
        $payload = [
            'status' => 'resolved',
            'action' => 'hide_profile',
            'resolution_notes' => 'Suspended for spamming.',
        ];

        $response2 = $this->actingAs($this->admin)->putJson("/api/v1/admin/reports/{$report->id}", $payload);
        $response2->assertStatus(200);

        // Assert report is resolved
        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'resolved',
            'resolution_notes' => 'Suspended for spamming.',
            'resolved_by_user_id' => $this->admin->id,
        ]);

        // Assert profile is suspended (is_active = false)
        $this->assertDatabaseHas('profiles', [
            'id' => $this->profile2->id,
            'is_active' => false,
        ]);

        // Assert admin audit log is registered
        $this->assertDatabaseHas('admin_audits', [
            'user_id' => $this->admin->id,
            'action' => 'resolve_report',
        ]);
    }
}
