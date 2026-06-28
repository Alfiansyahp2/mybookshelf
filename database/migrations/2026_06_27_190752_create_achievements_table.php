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
        // Achievements table
        Schema::create('achievements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 255);
            $table->text('description');
            $table->string('icon', 50)->default('🏆');

            $table->integer('requirement')->default(1); // Goal to achieve
            $table->enum('category', ['books', 'reading', 'collections', 'streaks', 'special'])->default('books');
            $table->enum('rarity', ['common', 'rare', 'epic', 'legendary'])->default('common');

            $table->timestamps();

            // Indexes
            $table->index('category');
            $table->index('rarity');
        });

        // User achievements pivot table
        Schema::create('user_achievements', function (Blueprint $table) {
            $table->uuid('user_id');
            $table->uuid('achievement_id');
            $table->integer('current')->default(0); // Progress towards requirement
            $table->boolean('unlocked')->default(false);
            $table->timestamp('unlocked_date')->nullable();

            $table->primary(['user_id', 'achievement_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('achievement_id')->references('id')->on('achievements')->cascadeOnDelete();

            $table->index('user_id');
            $table->index('achievement_id');
            $table->index('unlocked');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_achievements');
        Schema::dropIfExists('achievements');
    }
};
