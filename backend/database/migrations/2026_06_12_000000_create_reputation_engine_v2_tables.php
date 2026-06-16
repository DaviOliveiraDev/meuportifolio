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
        // 1. tech_domains
        Schema::create('tech_domains', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->string('color', 7)->nullable();
            $table->text('description')->nullable();
            $table->smallInteger('order_index')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. tech_competencies
        Schema::create('tech_competencies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('domain_id')->constrained('tech_domains')->onDelete('cascade');
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('weight_in_domain', 3, 2)->default(1.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Modificações na tabela technologies
        Schema::table('technologies', function (Blueprint $table) {
            $table->foreignUuid('category_id')->nullable()->change();
            $table->string('category', 50)->default('other');
            $table->string('status', 20)->default('active');
            $table->jsonb('aliases')->nullable();
            $table->decimal('market_demand_score', 3, 2)->default(1.00);
            $table->timestamp('deprecated_at')->nullable();
            $table->uuid('replacement_id')->nullable();
            $table->foreign('replacement_id')->references('id')->on('technologies')->onDelete('set null');
        });

        // 4. tech_competency_mappings
        Schema::create('tech_competency_mappings', function (Blueprint $table) {
            $table->foreignUuid('technology_id')->constrained('technologies')->onDelete('cascade');
            $table->foreignUuid('competency_id')->constrained('tech_competencies')->onDelete('cascade');
            $table->boolean('is_primary')->default(false);
            $table->decimal('contribution_weight', 3, 2)->default(1.00);
            $table->primary(['technology_id', 'competency_id']);
        });

        // 5. evidences (base polymorph table)
        Schema::create('evidences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('evidence_type', 50);
            $table->string('verification_level', 20)->default('self_declared');
            $table->string('verification_source', 50)->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->decimal('quality_score', 5, 2)->nullable();
            $table->decimal('recency_factor', 3, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('user_id');
            $table->index(['user_id', 'evidence_type']);
        });

        // 6. evidence_projects
        Schema::create('evidence_projects', function (Blueprint $table) {
            $table->uuid('evidence_id')->primary();
            $table->foreign('evidence_id')->references('id')->on('evidences')->onDelete('cascade');
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->string('url', 500)->nullable();
            $table->string('repository_url', 500)->nullable();
            $table->boolean('is_production')->default(false);
            $table->string('user_scale', 20)->default('personal');
            $table->integer('github_stars')->nullable();
            $table->integer('github_forks')->nullable();
            $table->integer('npm_downloads')->nullable();
            $table->integer('pypi_downloads')->nullable();
            $table->boolean('is_open_source')->default(false);
            $table->string('license_spdx', 50)->nullable();
        });

        // 7. evidence_experiences
        Schema::create('evidence_experiences', function (Blueprint $table) {
            $table->uuid('evidence_id')->primary();
            $table->foreign('evidence_id')->references('id')->on('evidences')->onDelete('cascade');
            $table->string('company_name', 200);
            $table->string('role_title', 200);
            $table->text('description')->nullable();
            $table->string('employment_type', 30)->default('full_time');
            $table->string('company_tier', 30)->default('company');
            $table->string('company_size', 20)->nullable();
            $table->string('linkedin_url', 500)->nullable();
        });

        // 8. evidence_education
        Schema::create('evidence_education', function (Blueprint $table) {
            $table->uuid('evidence_id')->primary();
            $table->foreign('evidence_id')->references('id')->on('evidences')->onDelete('cascade');
            $table->string('institution_name', 200);
            $table->string('degree_type', 30)->nullable();
            $table->string('field_of_study', 200)->nullable();
            $table->string('grade', 50)->nullable();
            $table->string('institution_tier', 20)->default('other');
        });

        // 9. evidence_certifications
        Schema::create('evidence_certifications', function (Blueprint $table) {
            $table->uuid('evidence_id')->primary();
            $table->foreign('evidence_id')->references('id')->on('evidences')->onDelete('cascade');
            $table->string('cert_name', 200);
            $table->string('issuer', 200);
            $table->string('credential_url', 500)->nullable();
            $table->string('external_id', 200)->nullable();
            $table->string('badge_image_url', 500)->nullable();
            $table->boolean('is_verified')->default(false);
            $table->string('verified_via', 50)->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->string('issuer_tier', 20)->default('other');
        });

        // 10. evidence_github
        Schema::create('evidence_github', function (Blueprint $table) {
            $table->uuid('evidence_id')->primary();
            $table->foreign('evidence_id')->references('id')->on('evidences')->onDelete('cascade');
            $table->bigInteger('github_repo_id')->nullable();
            $table->string('repo_full_name', 300)->nullable();
            $table->string('repo_url', 500)->nullable();
            $table->integer('stars')->default(0);
            $table->integer('forks')->default(0);
            $table->integer('open_issues')->default(0);
            $table->integer('subscribers')->default(0);
            $table->boolean('has_readme')->default(false);
            $table->boolean('has_tests')->default(false);
            $table->boolean('has_ci')->default(false);
            $table->string('license_spdx', 50)->nullable();
            $table->integer('npm_dependents')->default(0);
            $table->integer('pypi_dependents')->default(0);
            $table->integer('commits_count')->default(0);
            $table->integer('prs_merged')->default(0);
            $table->integer('issues_opened')->default(0);
            $table->boolean('is_owner')->default(true);
            $table->jsonb('languages')->nullable();
            $table->timestamp('last_commit_at')->nullable();
            $table->timestamp('synced_at')->useCurrent();
        });

        // 11. evidence_technologies
        Schema::create('evidence_technologies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('evidence_id')->constrained('evidences')->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained('technologies')->onDelete('cascade');
            $table->string('usage_depth', 20)->default('used');
            $table->boolean('is_primary')->default(false);
            $table->unique(['evidence_id', 'technology_id']);
        });

        // 12. user_skill_scores
        Schema::create('user_skill_scores', function (Blueprint $table) {
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained('technologies')->onDelete('cascade');
            $table->decimal('score', 5, 2)->default(0.00);
            $table->integer('evidence_count')->default(0);
            $table->jsonb('score_breakdown')->nullable();
            $table->string('engine_version', 20)->default('1.0');
            $table->timestamp('computed_at')->useCurrent();
            $table->timestamps();

            $table->primary(['user_id', 'technology_id']);
        });

        // 13. user_competency_scores
        Schema::create('user_competency_scores', function (Blueprint $table) {
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('competency_id')->constrained('tech_competencies')->onDelete('cascade');
            $table->decimal('score', 5, 2)->default(0.00);
            $table->decimal('percentile_rank', 5, 2)->nullable();
            $table->jsonb('top_technologies')->nullable();
            $table->string('engine_version', 20)->default('1.0');
            $table->timestamp('computed_at')->useCurrent();
            $table->timestamps();

            $table->primary(['user_id', 'competency_id']);
        });

        // 14. user_domain_scores
        Schema::create('user_domain_scores', function (Blueprint $table) {
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('domain_id')->constrained('tech_domains')->onDelete('cascade');
            $table->decimal('score', 5, 2)->default(0.00);
            $table->decimal('percentile_rank', 5, 2)->nullable();
            $table->jsonb('top_technologies')->nullable();
            $table->jsonb('competency_breakdown')->nullable();
            $table->string('engine_version', 20)->default('1.0');
            $table->timestamp('computed_at')->useCurrent();
            $table->timestamps();

            $table->primary(['user_id', 'domain_id']);
        });

        // 15. user_reputation_scores
        Schema::create('user_reputation_scores', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->decimal('ovr', 5, 2)->default(0.00);
            $table->decimal('recruiter_score', 5, 2)->default(0.00);
            $table->decimal('technical_depth', 5, 2)->default(0.00);
            $table->decimal('delivery_impact', 5, 2)->default(0.00);
            $table->decimal('scope_influence', 5, 2)->default(0.00);
            $table->decimal('breadth_adaptability', 5, 2)->default(0.00);
            $table->decimal('community_visibility', 5, 2)->default(0.00);
            $table->uuid('primary_domain_id')->nullable();
            $table->uuid('secondary_domain_id')->nullable();
            $table->string('profile_label', 100)->nullable();
            $table->jsonb('top_technologies')->nullable();
            $table->jsonb('domain_scores_snapshot')->nullable();
            $table->timestamp('last_significant_change')->nullable();
            $table->integer('change_count_this_month')->default(0);
            $table->jsonb('anomaly_flags')->nullable();
            $table->string('engine_version', 20)->default('1.0');
            $table->timestamp('computed_at')->useCurrent();
            $table->decimal('previous_ovr', 5, 2)->nullable();
            $table->timestamp('previous_computed_at')->nullable();
            $table->timestamps();

            $table->foreign('primary_domain_id')->references('id')->on('tech_domains')->onDelete('set null');
            $table->foreign('secondary_domain_id')->references('id')->on('tech_domains')->onDelete('set null');
        });

        // 16. user_score_history
        Schema::create('user_score_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('ovr', 5, 2)->nullable();
            $table->decimal('recruiter_score', 5, 2)->nullable();
            $table->string('trigger_event', 50)->nullable();
            $table->uuid('trigger_entity_id')->nullable();
            $table->jsonb('full_snapshot')->nullable();
            $table->timestamp('recorded_at')->useCurrent();

            $table->index(['user_id', 'recorded_at']);
        });

        // 17. evidence_flags
        Schema::create('evidence_flags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('evidence_id')->constrained('evidences')->onDelete('cascade');
            $table->string('flag_type', 50);
            $table->string('severity', 20)->default('warning');
            $table->jsonb('details')->nullable();
            $table->boolean('auto_detected')->default(true);
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->string('resolution', 20)->nullable();
            $table->timestamps();
        });

        // 18. score_change_rate_limits
        Schema::create('score_change_rate_limits', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('ovr_changes_7d')->default(0);
            $table->integer('ovr_changes_30d')->default(0);
            $table->timestamp('last_change_at')->nullable();
            $table->integer('recompute_count_today')->default(0);
            $table->timestamp('last_recompute_at')->nullable();
        });

        // 19. technology_suggestions
        Schema::create('technology_suggestions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('suggested_by')->constrained('users')->onDelete('cascade');
            $table->string('name', 100);
            $table->string('slug_suggestion', 100)->nullable();
            $table->string('category', 50)->nullable();
            $table->jsonb('competency_ids')->nullable(); // Guardado como jsonb de UUIDs
            $table->text('reason')->nullable();
            $table->integer('vote_count')->default(0);
            $table->string('status', 20)->default('pending');
            $table->uuid('duplicate_of')->nullable();
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->foreign('duplicate_of')->references('id')->on('technologies')->onDelete('set null');
        });

        // 20. seasons (Alterações na tabela existente)
        Schema::table('seasons', function (Blueprint $table) {
            $table->string('slug', 50)->nullable()->unique();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->jsonb('scoring_weights')->nullable();
            $table->jsonb('featured_domains')->nullable();
        });

        // 21. season_scores
        Schema::create('season_scores', function (Blueprint $table) {
            $table->foreignUuid('season_id')->constrained('seasons')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('season_ovr', 5, 2)->nullable();
            $table->integer('rank')->nullable();
            $table->decimal('percentile', 5, 2)->nullable();
            $table->jsonb('badges_earned')->nullable();
            $table->jsonb('final_snapshot')->nullable();
            $table->timestamps();

            $table->primary(['season_id', 'user_id']);
        });

        // 22. hall_of_fame
        Schema::create('hall_of_fame', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('category', 50);
            $table->string('period', 20)->nullable();
            $table->integer('rank_position')->nullable();
            $table->jsonb('criteria_met')->nullable();
            $table->timestamp('awarded_at')->useCurrent();
        });

        // 23. verified_achievements
        Schema::create('verified_achievements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('achievement_type', 50);
            $table->foreignUuid('evidence_id')->nullable()->constrained('evidences')->onDelete('set null');
            $table->string('verification_hash', 64)->nullable();
            $table->timestamp('issued_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
        });

        // 24. Acopla link de evidências a tabelas existentes
        Schema::table('projects', function (Blueprint $table) {
            $table->uuid('evidence_id')->nullable();
            $table->foreign('evidence_id')->references('id')->on('evidences')->onDelete('set null');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->uuid('evidence_id')->nullable();
            $table->foreign('evidence_id')->references('id')->on('evidences')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->dropForeign(['evidence_id']);
            $table->dropColumn('evidence_id');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['evidence_id']);
            $table->dropColumn('evidence_id');
        });

        Schema::dropIfExists('verified_achievements');
        Schema::dropIfExists('hall_of_fame');
        Schema::dropIfExists('season_scores');

        Schema::table('seasons', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'starts_at',
                'ends_at',
                'scoring_weights',
                'featured_domains'
            ]);
        });

        Schema::dropIfExists('technology_suggestions');
        Schema::dropIfExists('score_change_rate_limits');
        Schema::dropIfExists('evidence_flags');
        Schema::dropIfExists('user_score_history');
        Schema::dropIfExists('user_reputation_scores');
        Schema::dropIfExists('user_domain_scores');
        Schema::dropIfExists('user_competency_scores');
        Schema::dropIfExists('user_skill_scores');
        Schema::dropIfExists('evidence_technologies');
        Schema::dropIfExists('evidence_github');
        Schema::dropIfExists('evidence_certifications');
        Schema::dropIfExists('evidence_education');
        Schema::dropIfExists('evidence_experiences');
        Schema::dropIfExists('evidence_projects');
        Schema::dropIfExists('evidences');
        Schema::dropIfExists('tech_competency_mappings');

        Schema::table('technologies', function (Blueprint $table) {
            $table->dropForeign(['replacement_id']);
            $table->dropColumn([
                'category',
                'status',
                'aliases',
                'market_demand_score',
                'deprecated_at',
                'replacement_id'
            ]);
            $table->foreignUuid('category_id')->nullable(false)->change();
        });

        Schema::dropIfExists('tech_competencies');
        Schema::dropIfExists('tech_domains');
    }
};
