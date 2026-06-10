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
        // 1. technology_categories
        Schema::create('technology_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. technologies
        Schema::create('technologies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained('technology_categories')->onDelete('restrict');
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('logo_url')->nullable();
            $table->boolean('is_verified')->default(true);
            $table->timestamps();
        });

        // 3. profile_technologies (pivot - self-declared skills)
        Schema::create('profile_technologies', function (Blueprint $table) {
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained()->onDelete('cascade');
            $table->integer('self_proficiency')->default(1);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->primary(['profile_id', 'technology_id']);
        });

        // 4. project_technologies (pivot - projects evidence)
        Schema::create('project_technologies', function (Blueprint $table) {
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained()->onDelete('cascade');
            $table->string('usage_intensity')->default('medium'); // low, medium, high

            $table->primary(['project_id', 'technology_id']);
        });

        // 5. experience_technologies (pivot - experiences evidence)
        Schema::create('experience_technologies', function (Blueprint $table) {
            $table->foreignUuid('experience_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained()->onDelete('cascade');
            $table->boolean('is_primary')->default(true);

            $table->primary(['experience_id', 'technology_id']);
        });

        // 6. education_technologies (pivot - education/course evidence)
        Schema::create('education_technologies', function (Blueprint $table) {
            $table->foreignUuid('education_id')->constrained('educations')->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained()->onDelete('cascade');

            $table->primary(['education_id', 'technology_id']);
        });

        // 7. technology_evidence
        Schema::create('technology_evidence', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained()->onDelete('cascade');
            $table->string('source_type'); // project, experience, education, github, badge
            $table->uuid('source_id')->nullable();
            $table->decimal('points_awarded', 5, 2);
            $table->json('evidence_metadata')->nullable();
            $table->timestamp('verified_at')->useCurrent();
            $table->timestamps();

            $table->index(['profile_id', 'technology_id']);
            $table->index(['source_type', 'source_id']);
        });

        // 8. technology_scores
        Schema::create('technology_scores', function (Blueprint $table) {
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained()->onDelete('cascade');
            $table->integer('score')->default(0);
            $table->string('confidence_level')->default('Declared'); // Declared, Verified, Proven, Expert
            $table->integer('evidence_count')->default(0);
            $table->timestamp('calculated_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamps();

            $table->primary(['profile_id', 'technology_id']);
            $table->index(['technology_id', 'score']);
        });

        // 9. technology_score_history
        Schema::create('technology_score_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('technology_id')->constrained()->onDelete('cascade');
            $table->integer('score');
            $table->string('confidence_level');
            $table->date('recorded_at');
            $table->timestamps();

            $table->index(['profile_id', 'technology_id', 'recorded_at'], 'idx_tech_score_hist_lookup');
        });

        // 10. technology_rankings
        Schema::create('technology_rankings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('technology_id')->nullable()->constrained()->onDelete('cascade'); // null means global ranking
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->integer('rank_position');
            $table->decimal('percentile', 4, 2);
            $table->integer('previous_position')->nullable();
            $table->timestamps();

            $table->unique(['technology_id', 'rank_position'], 'idx_rank_tech_position');
            $table->index('profile_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technology_rankings');
        Schema::dropIfExists('technology_score_history');
        Schema::dropIfExists('technology_scores');
        Schema::dropIfExists('technology_evidence');
        Schema::dropIfExists('education_technologies');
        Schema::dropIfExists('experience_technologies');
        Schema::dropIfExists('project_technologies');
        Schema::dropIfExists('profile_technologies');
        Schema::dropIfExists('technologies');
        Schema::dropIfExists('technology_categories');
    }
};
