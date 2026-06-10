<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Expand standard 'badges' table
        Schema::table('badges', function (Blueprint $table) {
            $table->string('category')->nullable()->after('description'); // Onboarding, Projects, GitHub, etc.
            $table->string('rarity')->nullable()->after('category'); // comum, rara, epica, lendaria, mitica
            $table->integer('xp_reward')->default(0)->after('rarity');
            $table->boolean('is_secret')->default(false)->after('xp_reward');
            $table->uuid('parent_badge_id')->nullable()->after('is_secret');

            $table->foreign('parent_badge_id')->references('id')->on('badges')->onDelete('set null');
        });

        // 2. Create 'seasons' table
        Schema::create('seasons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Create 'profile_season_stats' table
        Schema::create('profile_season_stats', function (Blueprint $table) {
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('season_id')->constrained()->onDelete('cascade');
            $table->integer('xp_earned')->default(0);
            $table->integer('ovr_reached')->default(0);
            $table->timestamp('joined_at')->useCurrent();

            $table->primary(['profile_id', 'season_id']);
        });

        // 4. Create 'profile_badge_progress' table
        Schema::create('profile_badge_progress', function (Blueprint $table) {
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('badge_id')->constrained()->onDelete('cascade');
            $table->integer('current_value')->default(0);
            $table->integer('target_value')->default(0);
            $table->timestamp('last_updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->primary(['profile_id', 'badge_id']);
        });

        // 5. Create 'titles' table
        Schema::create('titles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->foreignUuid('unlock_badge_id')->nullable()->constrained('badges')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 6. Create 'profile_titles' table
        Schema::create('profile_titles', function (Blueprint $table) {
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('title_id')->constrained()->onDelete('cascade');
            $table->boolean('is_equipped')->default(false);
            $table->timestamp('unlocked_at')->useCurrent();

            $table->primary(['profile_id', 'title_id']);
        });

        // 7. Create 'cosmetics' table
        Schema::create('cosmetics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('type'); // border, background, effect
            $table->string('value'); // Tailwind classes or Asset URL
            $table->foreignUuid('unlock_badge_id')->nullable()->constrained('badges')->onDelete('set null');
            $table->timestamps();
        });

        // 8. Create 'profile_cosmetics' table
        Schema::create('profile_cosmetics', function (Blueprint $table) {
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('cosmetic_id')->constrained()->onDelete('cascade');
            $table->boolean('is_equipped')->default(false);
            $table->timestamp('unlocked_at')->useCurrent();

            $table->primary(['profile_id', 'cosmetic_id']);
        });

        // 9. Create 'profile_stats' table
        Schema::create('profile_stats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->unique()->constrained()->onDelete('cascade');
            $table->integer('total_projects')->default(0);
            $table->integer('total_experiences')->default(0);
            $table->integer('total_educations')->default(0);
            $table->integer('total_skills')->default(0);
            $table->integer('total_badges')->default(0);
            $table->integer('total_titles')->default(0);
            $table->boolean('github_connected')->default(false);
            $table->integer('github_repositories')->default(0);
            $table->integer('github_commits')->default(0);
            $table->integer('github_stars')->default(0);
            $table->integer('profile_views')->default(0);
            $table->integer('profile_shares')->default(0);
            $table->integer('community_points')->default(0);
            $table->integer('streak_days')->default(0);
            $table->integer('current_xp')->default(0);
            $table->integer('current_level')->default(1);
            $table->integer('current_ovr')->default(0);
            $table->timestamps();

            $table->index('current_ovr');
            $table->index('current_xp');
            $table->index('current_level');
        });

        // 10. Create 'profile_xp_history' table
        Schema::create('profile_xp_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->string('action');
            $table->integer('amount');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['profile_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_xp_history');
        Schema::dropIfExists('profile_stats');
        Schema::dropIfExists('profile_cosmetics');
        Schema::dropIfExists('cosmetics');
        Schema::dropIfExists('profile_titles');
        Schema::dropIfExists('titles');
        Schema::dropIfExists('profile_badge_progress');
        Schema::dropIfExists('profile_season_stats');
        Schema::dropIfExists('seasons');

        Schema::table('badges', function (Blueprint $table) {
            $table->dropForeign(['parent_badge_id']);
            $table->dropColumn(['category', 'rarity', 'xp_reward', 'is_secret', 'parent_badge_id']);
        });
    }
};
