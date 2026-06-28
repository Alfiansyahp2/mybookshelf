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
        // Collections table
        Schema::create('collections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#3B82F6'); // Hex color
            $table->string('icon', 50)->nullable()->default('📚');
            $table->decimal('progress', 5, 2)->default(0); // Percentage 0-100
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('name');
        });

        // Pivot table for collection-book many-to-many relationship
        Schema::create('collection_book', function (Blueprint $table) {
            $table->uuid('collection_id');
            $table->uuid('book_id');
            $table->integer('order')->default(0);
            $table->timestamp('added_at')->useCurrent();

            $table->primary(['collection_id', 'book_id']);
            $table->foreign('collection_id')->references('id')->on('collections')->cascadeOnDelete();
            $table->foreign('book_id')->references('id')->on('books')->cascadeOnDelete();

            $table->index('collection_id');
            $table->index('book_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_book');
        Schema::dropIfExists('collections');
    }
};
