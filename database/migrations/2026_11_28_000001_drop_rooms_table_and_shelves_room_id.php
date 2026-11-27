<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Contract step: remove deprecated room_id column on shelves and drop the retired rooms table.
     */
    public function up(): void
    {
        if (Schema::hasTable('shelves') && Schema::hasColumn('shelves', 'room_id')) {
            Schema::table('shelves', function (Blueprint $table) {
                $table->dropIndex(['room_id']);
                $table->dropColumn('room_id');
            });
        }

        Schema::dropIfExists('rooms');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('rooms')) {
            Schema::create('rooms', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('name');
                $table->text('description')->nullable();
                $table->integer('order')->default(0);
                $table->boolean('unlocked')->default(true);
                $table->timestamps();
            });
        }

        if (Schema::hasTable('shelves') && ! Schema::hasColumn('shelves', 'room_id')) {
            Schema::table('shelves', function (Blueprint $table) {
                $table->uuid('room_id')->nullable();
                $table->index('room_id');
            });
        }
    }
};
