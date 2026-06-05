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
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->string('event_type'); // view_profile, view_project, click_link
            $table->uuid('target_id')->nullable(); // ID do projeto, link etc
            $table->string('viewer_ip_hash')->nullable(); // Hash do IP (LGPD compliance)
            $table->text('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->timestamp('created_at')->nullable();

            // Índices para geração de relatórios eficientes
            $table->index(['profile_id', 'event_type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
