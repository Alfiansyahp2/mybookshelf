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
        Schema::create('accounting_timeline_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->uuid('expense_id')->nullable();
            $table->foreign('expense_id')->references('id')->on('expenses')->nullOnDelete();
            $table->uuid('budget_id')->nullable();

            $table->enum('type', [
                'expense_created',
                'expense_updated',
                'budget_exceeded',
                'budget_alert',
                'payment_reminder',
                'currency_rate_updated'
            ]);
            $table->timestamp('event_date');
            $table->string('description', 500);
            $table->json('metadata')->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('expense_id');
            $table->index('event_date');
            $table->index('type');
            $table->index(['user_id', 'event_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting_timeline_events');
    }
};