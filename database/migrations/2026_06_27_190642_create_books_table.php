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
        Schema::create('books', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->uuid('shelf_id')->nullable();
            $table->foreign('shelf_id')->references('id')->on('shelves')->nullOnDelete();

            // Basic Information
            $table->string('title', 255);
            $table->string('author', 255);
            $table->string('isbn', 20)->unique();
            $table->string('genre', 100)->default('Fiction');
            $table->string('language', 50)->default('English');
            $table->string('publisher', 255)->nullable();
            $table->integer('publish_year')->nullable();
            $table->integer('pages')->default(0);

            // Enums using PostgreSQL ENUM type
            $table->enum('format', ['hardcover', 'paperback', 'ebook', 'audiobook'])->default('paperback');
            $table->enum('height', ['short', 'medium', 'tall'])->default('medium');
            $table->enum('thickness', ['thin', 'regular', 'thick'])->default('regular');
            $table->enum('status', ['unread', 'reading', 'finished', 'wishlist', 'borrowed'])->default('unread');

            // Visual Properties - Spine colors split into 3 columns for PostgreSQL compatibility
            $table->string('spine_color_light', 7)->default('#CCCCCC');
            $table->string('spine_color_medium', 7)->default('#999999');
            $table->string('spine_color_dark', 7)->default('#666666');
            $table->string('cover_image', 500)->nullable();

            // Position on shelf
            $table->integer('position')->default(0);

            // Status & Progress
            $table->boolean('favorite')->default(false);
            $table->integer('current_page')->nullable();
            $table->decimal('progress', 5, 2)->default(0); // 0.00 to 100.00

            // Reading Dates
            $table->timestamp('started_date')->nullable();
            $table->timestamp('finished_date')->nullable();
            $table->timestamp('estimated_start_date')->nullable();

            // Borrowing Information
            $table->string('borrowed_by', 255)->nullable();
            $table->timestamp('borrowed_date')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->boolean('is_returned')->default(false);

            // Personal notes and rating
            $table->text('personal_notes')->nullable();
            $table->decimal('personal_rating', 2, 1)->nullable(); // 0.0 to 5.0

            // Purchase Information
            $table->timestamp('purchase_date')->nullable();
            $table->decimal('purchase_price', 8, 2)->nullable();
            $table->string('purchase_location', 255)->nullable();

            // Metadata
            $table->timestamp('date_added')->useCurrent();
            $table->timestamp('last_modified')->useCurrent()->useCurrentOnUpdate();

            // Soft Deletes
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('shelf_id');
            $table->index('status');
            $table->index('favorite');
            $table->index('genre');
            $table->index('format');
            $table->index('author');
            $table->index('title');
            $table->index('date_added');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
