<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This migration creates sample accounting data for testing purposes
        // Only runs if there are users in the system

        $users = DB::table('users')->select('id')->get();

        if ($users->isEmpty()) {
            return; // No users, skip sample data
        }

        $firstUserId = $users->first()->id;

        // Sample expenses
        $sampleExpenses = [
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $firstUserId,
                'title' => 'Buku "Laskar Pelangi"',
                'description' => 'Pembelian novel bestseller karya Andrea Hirata',
                'amount' => 125000,
                'currency' => 'IDR',
                'amount_base_currency' => 125000,
                'exchange_rate' => 1,
                'category_id' => null, // Will be set after categories are created
                'payment_method' => 'transfer',
                'expense_date' => now()->subDays(15),
                'is_recurring' => false,
                'vendor' => 'Gramedia Bookstore',
                'location' => 'Grand Indonesia Mall',
                'status' => 'completed',
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $firstUserId,
                'title' => 'Ongkos Kirim Buku dari Jakarta',
                'description' => 'Pengiriman 3 buku via JNE',
                'amount' => 35000,
                'currency' => 'IDR',
                'amount_base_currency' => 35000,
                'exchange_rate' => 1,
                'category_id' => null,
                'payment_method' => 'e-wallet',
                'expense_date' => now()->subDays(15),
                'is_recurring' => false,
                'vendor' => 'JNE',
                'location' => 'Jakarta',
                'status' => 'completed',
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $firstUserId,
                'title' => 'Buku "Atomic Habits" (Hardcover)',
                'description' => 'Self-help book dari James Clear',
                'amount' => 450000,
                'currency' => 'IDR',
                'amount_base_currency' => 450000,
                'exchange_rate' => 1,
                'category_id' => null,
                'payment_method' => 'cash',
                'expense_date' => now()->subDays(8),
                'is_recurring' => false,
                'vendor' => 'Kinokuniya Bookstore',
                'location' => 'Senayan City',
                'status' => 'completed',
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $firstUserId,
                'title' => 'Cleaning Kit Koleksi Buku',
                'description' => 'Microfiber cloth, bookmark, dan book duster',
                'amount' => 75000,
                'currency' => 'IDR',
                'amount_base_currency' => 75000,
                'exchange_rate' => 1,
                'category_id' => null,
                'payment_method' => 'transfer',
                'expense_date' => now()->subDays(5),
                'is_recurring' => false,
                'vendor' => 'Tokopedia',
                'location' => 'Online Store',
                'status' => 'completed',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $firstUserId,
                'title' => 'Buku Hadiah untuk Ulang Tahun Teman',
                'description' => 'Novel grafis "Persepolis"',
                'amount' => 180000,
                'currency' => 'IDR',
                'amount_base_currency' => 180000,
                'exchange_rate' => 1,
                'category_id' => null,
                'payment_method' => 'e-wallet',
                'expense_date' => now()->subDays(2),
                'is_recurring' => false,
                'vendor' => 'Periplus Bookstore',
                'location' => 'Soehat Hall',
                'status' => 'completed',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
        ];

        // Sample budgets
        $sampleBudgets = [
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $firstUserId,
                'category_id' => null, // Will be set after categories
                'name' => 'Budget Pembelian Buku Bulan Juli',
                'description' => 'Budget untuk pembelian buku baru dan novel',
                'amount' => 500000,
                'currency' => 'IDR',
                'amount_base_currency' => 500000,
                'period' => 'monthly',
                'start_date' => now()->startOfMonth(),
                'end_date' => now()->endOfMonth(),
                'alert_threshold' => 80.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $firstUserId,
                'category_id' => null,
                'name' => 'Budget Shipping & Handling',
                'description' => 'Budget khusus ongkos kirim buku',
                'amount' => 150000,
                'currency' => 'IDR',
                'amount_base_currency' => 150000,
                'period' => 'monthly',
                'start_date' => now()->startOfMonth(),
                'end_date' => now()->endOfMonth(),
                'alert_threshold' => 75.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Sample currency rates (common ones)
        $sampleCurrencyRates = [
            [
                'id' => Str::uuid()->toString(),
                'from_currency' => 'USD',
                'to_currency' => 'IDR',
                'rate' => 15000.50,
                'effective_date' => now(),
                'expires_at' => now()->endOfDay(),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'from_currency' => 'EUR',
                'to_currency' => 'IDR',
                'rate' => 16500.00,
                'effective_date' => now(),
                'expires_at' => now()->endOfDay(),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'from_currency' => 'SGD',
                'to_currency' => 'IDR',
                'rate' => 11000.25,
                'effective_date' => now(),
                'expires_at' => now()->endOfDay(),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert sample data
        DB::table('currency_rates')->insert($sampleCurrencyRates);
        DB::table('expenses')->insert($sampleExpenses);
        DB::table('budgets')->insert($sampleBudgets);

        // Update expenses and budgets with category IDs after default categories are created
        $categories = DB::table('expense_categories')->where('user_id', $firstUserId)->get();

        if ($categories->isNotEmpty()) {
            $categoryMap = [];
            foreach ($categories as $category) {
                if (str_contains(strtolower($category->name), 'book')) {
                    $categoryMap['book_purchases'] = $category->id;
                } elseif (str_contains(strtolower($category->name), 'shipping')) {
                    $categoryMap['shipping'] = $category->id;
                } elseif (str_contains(strtolower($category->name), 'maintenance')) {
                    $categoryMap['maintenance'] = $category->id;
                } elseif (str_contains(strtolower($category->name), 'gift')) {
                    $categoryMap['gifts'] = $category->id;
                }
            }

            // Update expenses with category IDs
            if (isset($categoryMap['book_purchases'])) {
                DB::table('expenses')
                    ->where('title', 'like', '%Laskar Pelangi%')
                    ->update(['category_id' => $categoryMap['book_purchases']]);

                DB::table('expenses')
                    ->where('title', 'like', '%Atomic Habits%')
                    ->update(['category_id' => $categoryMap['book_purchases']]);
            }

            if (isset($categoryMap['shipping'])) {
                DB::table('expenses')
                    ->where('title', 'like', '%Ongkos Kirim%')
                    ->update(['category_id' => $categoryMap['shipping']]);
            }

            if (isset($categoryMap['maintenance'])) {
                DB::table('expenses')
                    ->where('title', 'like', '%Cleaning Kit%')
                    ->update(['category_id' => $categoryMap['maintenance']]);
            }

            if (isset($categoryMap['gifts'])) {
                DB::table('expenses')
                    ->where('title', 'like', '%Hadiah%')
                    ->update(['category_id' => $categoryMap['gifts']]);
            }

            // Update budgets with category IDs
            if (isset($categoryMap['book_purchases'])) {
                DB::table('budgets')
                    ->where('name', 'like', '%Pembelian Buku%')
                    ->update(['category_id' => $categoryMap['book_purchases']]);
            }

            if (isset($categoryMap['shipping'])) {
                DB::table('budgets')
                    ->where('name', 'like', '%Shipping%')
                    ->update(['category_id' => $categoryMap['shipping']]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove sample data (only removes data that matches our sample)
        DB::table('expenses')->where('title', 'like', '%Laskar Pelangi%')->delete();
        DB::table('expenses')->where('title', 'like', '%Ongkos Kirim%')->delete();
        DB::table('expenses')->where('title', 'like', '%Atomic Habits%')->delete();
        DB::table('expenses')->where('title', 'like', '%Cleaning Kit%')->delete();
        DB::table('expenses')->where('title', 'like', '%Hadiah%')->delete();

        DB::table('budgets')->where('name', 'like', '%Budget Pembelian Buku%')->delete();
        DB::table('budgets')->where('name', 'like', '%Budget Shipping%')->delete();

        DB::table('currency_rates')->where('from_currency', 'USD')->delete();
        DB::table('currency_rates')->where('from_currency', 'EUR')->delete();
        DB::table('currency_rates')->where('from_currency', 'SGD')->delete();
    }
};
