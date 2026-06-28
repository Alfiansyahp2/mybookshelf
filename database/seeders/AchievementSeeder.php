<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            [
                'id' => Str::uuid()->toString(),
                'title' => 'First Book',
                'description' => 'Add your first book to the library',
                'icon' => '📚',
                'requirement' => 1,
                'category' => 'books',
                'rarity' => 'common',
            ],
            [
                'id' => Str::uuid()->toString(),
                'title' => 'Bookworm',
                'description' => 'Read 10 books',
                'icon' => '🐛',
                'requirement' => 10,
                'category' => 'reading',
                'rarity' => 'rare',
            ],
            [
                'id' => Str::uuid()->toString(),
                'title' => 'Library Builder',
                'description' => 'Own 25 books',
                'icon' => '🏗️',
                'requirement' => 25,
                'category' => 'books',
                'rarity' => 'epic',
            ],
            [
                'id' => Str::uuid()->toString(),
                'title' => '7-Day Streak',
                'description' => 'Read for 7 consecutive days',
                'icon' => '🔥',
                'requirement' => 7,
                'category' => 'streaks',
                'rarity' => 'rare',
            ],
            [
                'id' => Str::uuid()->toString(),
                'title' => 'First Favorite',
                'description' => 'Mark your first book as favorite',
                'icon' => '⭐',
                'requirement' => 1,
                'category' => 'books',
                'rarity' => 'common',
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::create($achievement);
        }
    }
}
