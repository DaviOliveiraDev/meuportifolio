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
        Schema::create('profile_skills', function (Blueprint $table) {
            $table->foreignUuid('profile_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('skill_id')->constrained()->onDelete('cascade');
            $table->integer('proficiency_level')->nullable(); // Ex: 1 a 5 ou percentual

            $table->primary(['profile_id', 'skill_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_skills');
    }
};
