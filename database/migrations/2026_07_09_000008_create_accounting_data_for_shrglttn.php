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
        // This migration creates sample accounting data for user shrglttn
        // to ensure they have data when the frontend makes authenticated API calls

        $shrglttnUserId = '019f21d5-ef05-731a-98ff-4713b284ea7f';

        // Check if user exists
        $user = DB::table('users')->where('id', $shrglttnUserId)->first();
        if (!$user) {
            return; // User doesn't exist, skip
        }

        // Check if data already exists for this user
        $existingBudgets = DB::table('budgets')->where('user_id', $shrglttnUserId)->count();
        if ($existingBudgets > 0) {
            return; // Data already exists, skip
        }

        // Get existing categories for shrglttn
        $categories = DB::table('expense_categories')
            ->where('user_id', $shrglttnUserId)
            ->get()
            ->keyBy('name');

        // Create sample expenses for shrglttn with proper dates within July budget period
        $sampleExpenses = [
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $shrglttnUserId,
                'title' => 'Buku "Laskar Pelangi"',
                'description' => 'Pembelian novel bestseller karya Andrea Hirata',
                'amount' => 125000,
                'currency' => 'IDR',
                'amount_base_currency' => 125000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Book Purchases')?->id,
                'payment_method' => 'transfer',
                'expense_date' => now()->startOfMonth()->addDays(4)->format('Y-m-d'), // July 5th
                'is_recurring' => false,
                'vendor' => 'Gramedia Bookstore',
                'location' => 'Grand Indonesia Mall',
                'status' => 'completed',
                'created_at' => now()->startOfMonth()->addDays(4),
                'updated_at' => now()->startOfMonth()->addDays(4),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $shrglttnUserId,
                'title' => 'Ongkos Kirim Buku dari Jakarta',
                'description' => 'Pengiriman 3 buku via JNE',
                'amount' => 35000,
                'currency' => 'IDR',
                'amount_base_currency' => 35000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Shipping & Handling')?->id,
                'payment_method' => 'e-wallet',
                'expense_date' => now()->startOfMonth()->addDays(4)->format('Y-m-d'), // July 5th
                'is_recurring' => false,
                'vendor' => 'JNE',
                'location' => 'Jakarta',
                'status' => 'completed',
                'created_at' => now()->startOfMonth()->addDays(4),
                'updated_at' => now()->startOfMonth()->addDays(4),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $shrglttnUserId,
                'title' => 'Buku "Atomic Habits" (Hardcover)',
                'description' => 'Self-help book dari James Clear',
                'amount' => 450000,
                'currency' => 'IDR',
                'amount_base_currency' => 450000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Book Purchases')?->id,
                'payment_method' => 'cash',
                'expense_date' => now()->startOfMonth()->addDays(11)->format('Y-m-d'), // July 12th
                'is_recurring' => false,
                'vendor' => 'Kinokuniya Bookstore',
                'location' => 'Senayan City',
                'status' => 'completed',
                'created_at' => now()->startOfMonth()->addDays(11),
                'updated_at' => now()->startOfMonth()->addDays(11),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $shrglttnUserId,
                'title' => 'Cleaning Kit Koleksi Buku',
                'description' => 'Microfiber cloth, bookmark, dan book duster',
                'amount' => 75000,
                'currency' => 'IDR',
                'amount_base_currency' => 75000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Book Maintenance')?->id,
                'payment_method' => 'transfer',
                'expense_date' => now()->startOfMonth()->addDays(19)->format('Y-m-d'), // July 20th
                'is_recurring' => false,
                'vendor' => 'Tokopedia',
                'location' => 'Online Store',
                'status' => 'completed',
                'created_at' => now()->startOfMonth()->addDays(19),
                'updated_at' => now()->startOfMonth()->addDays(19),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $shrglttnUserId,
                'title' => 'Buku Hadiah untuk Ulang Tahun Teman',
                'description' => 'Novel grafis "Persepolis"',
                'amount' => 180000,
                'currency' => 'IDR',
                'amount_base_currency' => 180000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Gifts & Donations')?->id,
                'payment_method' => 'e-wallet',
                'expense_date' => now()->startOfMonth()->addDays(24)->format('Y-m-d'), // July 25th
                'is_recurring' => false,
                'vendor' => 'Periplus Bookstore',
                'location' => 'Soehat Hall',
                'status' => 'completed',
                'created_at' => now()->startOfMonth()->addDays(24),
                'updated_at' => now()->startOfMonth()->addDays(24),
            ],
        ];

        // Create sample budgets for shrglttn
        $sampleBudgets = [
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $shrglttnUserId,
                'category_id' => $categories->get('Book Purchases')?->id,
                'name' => 'Budget Pembelian Buku Bulan Juli',
                'description' => 'Budget untuk pembelian buku baru dan novel',
                'amount' => 500000,
                'currency' => 'IDR',
                'amount_base_currency' => 500000,
                'period' => 'monthly',
                'start_date' => now()->startOfMonth()->format('Y-m-d'),
                'end_date' => now()->endOfMonth()->format('Y-m-d'),
                'alert_threshold' => 80.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $shrglttnUserId,
                'category_id' => $categories->get('Shipping & Handling')?->id,
                'name' => 'Budget Shipping & Handling',
                'description' => 'Budget khusus ongkos kirim buku',
                'amount' => 150000,
                'currency' => 'IDR',
                'amount_base_currency' => 150000,
                'period' => 'monthly',
                'start_date' => now()->startOfMonth()->format('Y-m-d'),
                'end_date' => now()->endOfMonth()->format('Y-m-d'),
                'alert_threshold' => 75.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert sample data
        DB::table('expenses')->insert($sampleExpenses);
        DB::table('budgets')->insert($sampleBudgets);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $shrglttnUserId = '019f21d5-ef05-731a-98ff-4713b284ea7f';

        // Remove sample data for shrglttn user
        DB::table('expenses')->where('user_id', $shrglttnUserId)->delete();
        DB::table('budgets')->where('user_id', $shrglttnUserId)->delete();
    }
};