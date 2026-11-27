<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Expand step: detach shelves.room_id from retired rooms table without dropping column yet.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('shelves', 'room_id')) {
            return;
        }

        Schema::table('shelves', function (Blueprint $table) {
            $table->dropForeign(['room_id']);
            $table->uuid('room_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('shelves', 'room_id')) {
            return;
        }

        Schema::table('shelves', function (Blueprint $table) {
            $table->foreign('room_id')->references('id')->on('rooms')->cascadeOnDelete();
        });
    }
};
