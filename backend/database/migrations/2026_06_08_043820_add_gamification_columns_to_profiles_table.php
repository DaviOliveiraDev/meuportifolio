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
        Schema::table('profiles', function (Blueprint $table) {
            $table->integer('profile_completeness')->default(0)->after('theme_name');
            $table->integer('xp')->default(0)->after('profile_completeness');
            $table->integer('level')->default(1)->after('xp');
            $table->integer('ovr')->default(0)->after('level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn(['profile_completeness', 'xp', 'level', 'ovr']);
        });
    }
};
