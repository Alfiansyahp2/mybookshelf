<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccountingDemoSeeder extends Seeder
{
    /**
     * Seed baseline currency rates and optional demo accounting records.
     */
    public function run(): void
    {
        $this->seedCurrencyRates();

        $demoUser = DB::table('users')
            ->where('email', 'test@example.com')
            ->first() ?? DB::table('users')->first();

        if (! $demoUser) {
            return;
        }

        if (DB::table('expenses')->where('user_id', $demoUser->id)->exists()) {
            return;
        }

        $categories = DB::table('expense_categories')
            ->where('user_id', $demoUser->id)
            ->get()
            ->keyBy('name');

        $now = now();

        DB::table('expenses')->insert([
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $demoUser->id,
                'title' => 'Buku "Laskar Pelangi"',
                'description' => 'Pembelian novel bestseller karya Andrea Hirata',
                'amount' => 125000,
                'currency' => 'IDR',
                'amount_base_currency' => 125000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Book Purchases')?->id,
                'payment_method' => 'transfer',
                'expense_date' => $now->copy()->subDays(15)->format('Y-m-d'),
                'is_recurring' => false,
                'vendor' => 'Gramedia Bookstore',
                'location' => 'Grand Indonesia Mall',
                'status' => 'completed',
                'created_at' => $now->copy()->subDays(15),
                'updated_at' => $now->copy()->subDays(15),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $demoUser->id,
                'title' => 'Ongkos Kirim Buku dari Jakarta',
                'description' => 'Pengiriman 3 buku via JNE',
                'amount' => 35000,
                'currency' => 'IDR',
                'amount_base_currency' => 35000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Shipping & Handling')?->id,
                'payment_method' => 'e-wallet',
                'expense_date' => $now->copy()->subDays(15)->format('Y-m-d'),
                'is_recurring' => false,
                'vendor' => 'JNE',
                'location' => 'Jakarta',
                'status' => 'completed',
                'created_at' => $now->copy()->subDays(15),
                'updated_at' => $now->copy()->subDays(15),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $demoUser->id,
                'title' => 'Buku "Atomic Habits" (Hardcover)',
                'description' => 'Self-help book dari James Clear',
                'amount' => 450000,
                'currency' => 'IDR',
                'amount_base_currency' => 450000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Book Purchases')?->id,
                'payment_method' => 'cash',
                'expense_date' => $now->copy()->subDays(8)->format('Y-m-d'),
                'is_recurring' => false,
                'vendor' => 'Kinokuniya Bookstore',
                'location' => 'Senayan City',
                'status' => 'completed',
                'created_at' => $now->copy()->subDays(8),
                'updated_at' => $now->copy()->subDays(8),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $demoUser->id,
                'title' => 'Cleaning Kit Koleksi Buku',
                'description' => 'Microfiber cloth, bookmark, dan book duster',
                'amount' => 75000,
                'currency' => 'IDR',
                'amount_base_currency' => 75000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Book Maintenance')?->id,
                'payment_method' => 'transfer',
                'expense_date' => $now->copy()->subDays(5)->format('Y-m-d'),
                'is_recurring' => false,
                'vendor' => 'Tokopedia',
                'location' => 'Online Store',
                'status' => 'completed',
                'created_at' => $now->copy()->subDays(5),
                'updated_at' => $now->copy()->subDays(5),
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $demoUser->id,
                'title' => 'Buku Hadiah untuk Ulang Tahun Teman',
                'description' => 'Novel grafis "Persepolis"',
                'amount' => 180000,
                'currency' => 'IDR',
                'amount_base_currency' => 180000,
                'exchange_rate' => 1,
                'category_id' => $categories->get('Gifts & Donations')?->id,
                'payment_method' => 'e-wallet',
                'expense_date' => $now->copy()->subDays(2)->format('Y-m-d'),
                'is_recurring' => false,
                'vendor' => 'Periplus Bookstore',
                'location' => 'Soehat Hall',
                'status' => 'completed',
                'created_at' => $now->copy()->subDays(2),
                'updated_at' => $now->copy()->subDays(2),
            ],
        ]);

        if (DB::table('budgets')->where('user_id', $demoUser->id)->exists()) {
            return;
        }

        DB::table('budgets')->insert([
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $demoUser->id,
                'category_id' => $categories->get('Book Purchases')?->id,
                'name' => 'Budget Pembelian Buku Bulanan',
                'description' => 'Budget untuk pembelian buku baru dan novel',
                'amount' => 500000,
                'currency' => 'IDR',
                'amount_base_currency' => 500000,
                'period' => 'monthly',
                'start_date' => $now->copy()->startOfMonth()->format('Y-m-d'),
                'end_date' => $now->copy()->endOfMonth()->format('Y-m-d'),
                'alert_threshold' => 80.00,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $demoUser->id,
                'category_id' => $categories->get('Shipping & Handling')?->id,
                'name' => 'Budget Shipping & Handling',
                'description' => 'Budget khusus ongkos kirim buku',
                'amount' => 150000,
                'currency' => 'IDR',
                'amount_base_currency' => 150000,
                'period' => 'monthly',
                'start_date' => $now->copy()->startOfMonth()->format('Y-m-d'),
                'end_date' => $now->copy()->endOfMonth()->format('Y-m-d'),
                'alert_threshold' => 75.00,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    private function seedCurrencyRates(): void
    {
        $rates = [
            ['from_currency' => 'USD', 'to_currency' => 'IDR', 'rate' => 15000.50],
            ['from_currency' => 'EUR', 'to_currency' => 'IDR', 'rate' => 16500.00],
            ['from_currency' => 'SGD', 'to_currency' => 'IDR', 'rate' => 11000.25],
        ];

        $now = now();

        foreach ($rates as $rate) {
            $exists = DB::table('currency_rates')
                ->where('from_currency', $rate['from_currency'])
                ->where('to_currency', $rate['to_currency'])
                ->where('is_active', true)
                ->exists();

            if (! $exists) {
                DB::table('currency_rates')->insert([
                    'id' => Str::uuid()->toString(),
                    'from_currency' => $rate['from_currency'],
                    'to_currency' => $rate['to_currency'],
                    'rate' => $rate['rate'],
                    'effective_date' => $now,
                    'expires_at' => $now->copy()->endOfDay(),
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }
}
