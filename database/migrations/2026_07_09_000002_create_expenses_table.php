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
        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->uuid('book_id')->nullable();
            $table->foreign('book_id')->references('id')->on('books')->nullOnDelete();

            // Expense details
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('IDR');
            $table->decimal('amount_base_currency', 10, 2); // Converted to IDR
            $table->decimal('exchange_rate', 10, 6)->default(1); // Rate used for conversion

            // Categorization
            $table->uuid('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('expense_categories')->nullOnDelete();
            $table->string('payment_method', 50)->default('cash'); // cash, transfer, e-wallet, credit_card

            // Dates & recurring
            $table->timestamp('expense_date');
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_period', 20)->nullable(); // daily, weekly, monthly, yearly
            $table->uuid('parent_expense_id')->nullable(); // For recurring expense series
            $table->foreign('parent_expense_id')->references('id')->on('expenses')->nullOnDelete();

            // Location & vendor
            $table->string('vendor', 255)->nullable();
            $table->string('location', 255)->nullable();

            // Attachments (base64 encoded)
            $table->text('receipt_data')->nullable(); // Base64 encoded receipt
            $table->string('receipt_mime_type', 100)->nullable();
            $table->string('receipt_filename', 255)->nullable();

            // Reminders
            $table->boolean('has_reminder')->default(false);
            $table->timestamp('reminder_date')->nullable();
            $table->boolean('reminder_sent')->default(false);

            // Status
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('completed');

            // Metadata
            $table->json('metadata')->nullable(); // Additional data

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('book_id');
            $table->index('category_id');
            $table->index('expense_date');
            $table->index('payment_method');
            $table->index('status');
            $table->index('is_recurring');
            $table->index(['user_id', 'expense_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};