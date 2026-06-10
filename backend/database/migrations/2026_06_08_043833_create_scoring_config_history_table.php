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
        Schema::create('scoring_config_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('config_id')->constrained('scoring_configs')->onDelete('cascade');
            $table->foreignUuid('updated_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->json('old_weights')->nullable();
            $table->json('new_weights')->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scoring_config_history');
    }
};
