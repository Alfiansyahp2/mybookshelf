<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserAchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        $achievements = Achievement::all();

        foreach ($achievements as $achievement) {
            // Based on achievement requirements and current state
            if ($achievement->title === 'First Book') {
                // Unlocked - user has 16 books
                $achievement->users()->attach($user->id, [
                    'current' => 16,
                    'unlocked' => true,
                    'unlocked_date' => '2024-01-01 00:00:00',
                ]);
            } elseif ($achievement->title === 'Bookworm') {
                // Read 10 books, currently have 6 finished
                $achievement->users()->attach($user->id, [
                    'current' => 6,
                    'unlocked' => false,
                ]);
            } elseif ($achievement->title === 'Library Builder') {
                // Own 25 books, currently have 16
                $achievement->users()->attach($user->id, [
                    'current' => 16,
                    'unlocked' => false,
                ]);
            } elseif ($achievement->title === '7-Day Streak') {
                // 7-day streak, currently at 3
                $achievement->users()->attach($user->id, [
                    'current' => 3,
                    'unlocked' => false,
                ]);
            } elseif ($achievement->title === 'First Favorite') {
                // First favorite - user has 3 favorites
                $achievement->users()->attach($user->id, [
                    'current' => 3,
                    'unlocked' => true,
                    'unlocked_date' => '2024-03-15 00:00:00',
                ]);
            }
        }
    }
}