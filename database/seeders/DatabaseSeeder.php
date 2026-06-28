<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call specific seeders in order
        $this->call([
            UserSeeder::class,
            AchievementSeeder::class,
            RoomSeeder::class,
            ShelfSeeder::class,
            BookDetailSeeder::class,  // Detailed book seeder with ratings and notes
            CollectionSeeder::class,
            UserAchievementSeeder::class,
        ]);
    }
}
