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
        Schema::create('currency_rates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('from_currency', 3);
            $table->string('to_currency', 3)->default('IDR');
            $table->decimal('rate', 12, 6);
            $table->timestamp('effective_date');
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(['from_currency', 'to_currency', 'effective_date']);
            $table->index(['from_currency', 'to_currency']);
            $table->index('effective_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('currency_rates');
    }
};