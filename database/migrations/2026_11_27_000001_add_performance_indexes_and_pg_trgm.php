<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->index(['user_id', 'status', 'date_added'], 'books_user_status_added_idx');
            $table->index(['user_id', 'shelf_id', 'position'], 'books_user_shelf_pos_idx');
            $table->index(['user_id', 'favorite'], 'books_user_favorite_idx');
            $table->index(['user_id', 'is_returned', 'due_date'], 'books_user_returned_due_idx');
        });

        Schema::table('reading_sessions', function (Blueprint $table) {
            $table->index(['user_id', 'start_time'], 'reading_sessions_user_start_idx');
            $table->index(['book_id', 'end_time'], 'reading_sessions_book_end_idx');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->index(['user_id', 'category_id', 'expense_date'], 'expenses_user_cat_date_idx');
            $table->index(['user_id', 'book_id'], 'expenses_user_book_idx');
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
            DB::statement('CREATE INDEX IF NOT EXISTS books_title_trgm_idx ON books USING gin (title gin_trgm_ops)');
            DB::statement('CREATE INDEX IF NOT EXISTS books_author_trgm_idx ON books USING gin (author gin_trgm_ops)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP INDEX IF EXISTS books_author_trgm_idx');
            DB::statement('DROP INDEX IF EXISTS books_title_trgm_idx');
        }

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropIndex('expenses_user_cat_date_idx');
            $table->dropIndex('expenses_user_book_idx');
        });

        Schema::table('reading_sessions', function (Blueprint $table) {
            $table->dropIndex('reading_sessions_user_start_idx');
            $table->dropIndex('reading_sessions_book_end_idx');
        });

        Schema::table('books', function (Blueprint $table) {
            $table->dropIndex('books_user_status_added_idx');
            $table->dropIndex('books_user_shelf_pos_idx');
            $table->dropIndex('books_user_favorite_idx');
            $table->dropIndex('books_user_returned_due_idx');
        });
    }
};
