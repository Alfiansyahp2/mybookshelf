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
        Schema::create('timeline_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('book_id');
            $table->foreign('book_id')->references('id')->on('books')->cascadeOnDelete();

            $table->enum('type', ['added', 'started', 'progress', 'finished', 'favorited', 'loaned', 'returned']);
            $table->timestamp('date');
            $table->string('description', 500);

            // JSONB metadata for flexible event-specific data
            $table->jsonb('metadata')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('book_id');
            $table->index('date');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timeline_events');
    }
};
