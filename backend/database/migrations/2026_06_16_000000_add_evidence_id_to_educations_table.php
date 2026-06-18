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
        Schema::table('educations', function (Blueprint $table) {
            $table->uuid('evidence_id')->nullable();
            $table->foreign('evidence_id')->references('id')->on('evidences')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('educations', function (Blueprint $table) {
            $table->dropForeign(['evidence_id']);
            $table->dropColumn('evidence_id');
        });
    }
};
