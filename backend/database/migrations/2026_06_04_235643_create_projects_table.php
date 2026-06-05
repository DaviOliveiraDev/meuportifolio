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
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('cover_image_url')->nullable();
            $table->string('repository_url')->nullable();
            $table->string('demo_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('order_weight')->default(0);
            $table->timestamps();

            // Índice composto de ordenação otimizado
            $table->index(['profile_id', 'is_featured', 'order_weight']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
