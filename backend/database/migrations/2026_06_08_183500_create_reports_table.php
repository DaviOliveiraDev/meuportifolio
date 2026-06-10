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
        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reporter_profile_id')->nullable()->constrained('profiles')->onDelete('set null');
            $table->foreignUuid('reported_profile_id')->constrained('profiles')->onDelete('cascade');
            $table->string('reported_type'); // profile, project, etc.
            $table->uuid('reported_item_id')->nullable();
            $table->string('reason');
            $table->string('status')->default('pending'); // pending, resolved, dismissed
            $table->text('resolution_notes')->nullable();
            $table->foreignUuid('resolved_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
