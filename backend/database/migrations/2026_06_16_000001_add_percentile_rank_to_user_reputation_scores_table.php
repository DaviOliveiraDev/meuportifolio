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
        Schema::table('user_reputation_scores', function (Blueprint $table) {
            $table->decimal('percentile_rank', 5, 2)->nullable()->after('recruiter_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_reputation_scores', function (Blueprint $table) {
            $table->dropColumn('percentile_rank');
        });
    }
};
