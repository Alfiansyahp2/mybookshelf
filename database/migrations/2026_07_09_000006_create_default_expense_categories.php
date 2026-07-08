<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This will be called by a seeder, but we create the migration for consistency
        // The actual seeder will be run separately
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove default categories
        DB::table('expense_categories')
            ->where('is_default', true)
            ->delete();
    }
};