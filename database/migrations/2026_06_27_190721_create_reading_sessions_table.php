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
        Schema::create('reading_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('book_id');
            $table->foreign('book_id')->references('id')->on('books')->cascadeOnDelete();

            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->integer('start_page')->default(0);
            $table->integer('end_page')->nullable();
            $table->integer('duration')->nullable(); // Duration in seconds

            $table->enum('mood', ['great', 'good', 'okay', 'difficult'])->nullable();
            $table->string('location', 255)->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('book_id');
            $table->index('start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reading_sessions');
    }
};
