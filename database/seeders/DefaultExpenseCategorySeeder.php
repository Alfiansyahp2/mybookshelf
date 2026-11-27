<?php

namespace Database\Seeders;

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
                'name' => 'Book Purchases',
                'description' => 'Pembelian buku baru dan bekas',
                'icon' => '📚',
                'color' => '#3B82F6',
                'monthly_budget' => 500000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
            [
                'name' => 'Shipping & Handling',
                'description' => 'Biaya pengiriman dan penanganan',
                'icon' => '📦',
                'color' => '#F59E0B',
                'monthly_budget' => 100000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
            [
                'name' => 'Book Maintenance',
                'description' => 'Perawatan, repair, dan aksesori buku',
                'icon' => '🔧',
                'color' => '#10B981',
                'monthly_budget' => 50000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
            [
                'name' => 'Gifts & Donations',
                'description' => 'Buku sebagai hadiah atau donasi',
                'icon' => '🎁',
                'color' => '#EC4899',
                'monthly_budget' => 200000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
            [
                'name' => 'Other Expenses',
                'description' => 'Pengeluaran lain terkait buku',
                'icon' => '📝',
                'color' => '#6B7280',
                'monthly_budget' => 100000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ],
        ];

        $users = DB::table('users')->select('id')->get();

        foreach ($users as $user) {
            foreach ($categories as $category) {
                $exists = DB::table('expense_categories')
                    ->where('user_id', $user->id)
                    ->where('name', $category['name'])
                    ->exists();

                if (! $exists) {
                    DB::table('expense_categories')->insert([
                        ...$category,
                        'id' => Str::uuid()->toString(),
                        'user_id' => $user->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
