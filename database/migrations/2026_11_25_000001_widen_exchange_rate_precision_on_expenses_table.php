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
        Schema::table('expenses', function (Blueprint $table) {
            $table->decimal('amount', 14, 2)->change();
            $table->decimal('amount_base_currency', 14, 2)->change();
            $table->decimal('exchange_rate', 14, 6)->default(1)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->change();
            $table->decimal('amount_base_currency', 10, 2)->change();
            $table->decimal('exchange_rate', 10, 6)->default(1)->change();
        });
    }
};
