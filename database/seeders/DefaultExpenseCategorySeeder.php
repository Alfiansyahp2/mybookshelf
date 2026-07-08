<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DefaultExpenseCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Book Purchases',
                'description' => 'Pembelian buku baru dan bekas',
                'icon' => '📚',
                'color' => '#3B82F6',
                'monthly_budget' => 500000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Shipping & Handling',
                'description' => 'Biaya pengiriman dan penanganan',
                'icon' => '📦',
                'color' => '#F59E0B',
                'monthly_budget' => 100000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Book Maintenance',
                'description' => 'Perawatan, repair, dan aksesori buku',
                'icon' => '🔧',
                'color' => '#10B981',
                'monthly_budget' => 50000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Gifts & Donations',
                'description' => 'Buku sebagai hadiah atau donasi',
                'icon' => '🎁',
                'color' => '#EC4899',
                'monthly_budget' => 200000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Other Expenses',
                'description' => 'Pengeluaran lain terkait buku',
                'icon' => '📝',
                'color' => '#6B7280',
                'monthly_budget' => 100000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
        ];

        // These will be inserted per user when they register, not globally
        // This seeder is for testing purposes
        $testUserId = DB::table('users')->first()?->id;

        if ($testUserId) {
            foreach ($categories as $category) {
                DB::table('expense_categories')->insert([
                    ...$category,
                    'user_id' => $testUserId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}