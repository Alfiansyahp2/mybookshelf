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
                'id' => '05b4b1a4-9226-44ea-8422-5a46ae9111fb',
                'title' => 'Langkah Pertama',
                'description' => 'Menambahkan buku pertama ke perpustakaan.',
                'icon' => 'BookOpen',
                'requirement' => 1,
                'category' => 'books',
                'rarity' => 'common',
            ],
            [
                'id' => '13c4b1a4-9226-44ea-8422-5a46ae9222fb',
                'title' => 'Kutu Buku Pemula',
                'description' => 'Menyelesaikan 5 buku.',
                'icon' => 'CheckCircle',
                'requirement' => 5,
                'category' => 'reading',
                'rarity' => 'rare',
            ],
            [
                'id' => '24d4b1a4-9226-44ea-8422-5a46ae9333fb',
                'title' => 'Kutu Buku Pro',
                'description' => 'Menyelesaikan 20 buku.',
                'icon' => 'Trophy',
                'requirement' => 20,
                'category' => 'reading',
                'rarity' => 'epic',
            ],
            [
                'id' => '35e4b1a4-9226-44ea-8422-5a46ae9444fb',
                'title' => 'Marathon Membaca',
                'description' => 'Membaca lebih dari 1.000 halaman.',
                'icon' => 'Flame',
                'requirement' => 1000,
                'category' => 'reading',
                'rarity' => 'epic',
            ],
            [
                'id' => '46f4b1a4-9226-44ea-8422-5a46ae9555fb',
                'title' => 'Ultra Marathon',
                'description' => 'Membaca lebih dari 5.000 halaman!',
                'icon' => 'Shield',
                'requirement' => 5000,
                'category' => 'reading',
                'rarity' => 'legendary',
            ],
            [
                'id' => '57a4b1a4-9226-44ea-8422-5a46ae9666fb',
                'title' => 'Kolektor',
                'description' => 'Perpustakaanmu memiliki 20 buku.',
                'icon' => 'Bookmark',
                'requirement' => 20,
                'category' => 'collections',
                'rarity' => 'rare',
            ],
            [
                'id' => '68b4b1a4-9226-44ea-8422-5a46ae9777fb',
                'title' => 'Master Kolektor',
                'description' => 'Luar biasa, kamu memiliki 50 buku!',
                'icon' => 'Crown',
                'requirement' => 50,
                'category' => 'collections',
                'rarity' => 'epic',
            ],
            [
                'id' => '79c4b1a4-9226-44ea-8422-5a46ae9888fb',
                'title' => 'Arsitek Rak',
                'description' => 'Membuat 3 rak berbeda untuk koleksimu.',
                'icon' => 'Layers',
                'requirement' => 3,
                'category' => 'collections',
                'rarity' => 'epic',
            ],
            [
                'id' => '8ad4b1a4-9226-44ea-8422-5a46ae9999fb',
                'title' => 'Eksplorator Genre',
                'description' => 'Membaca buku dari 3 genre berbeda.',
                'icon' => 'Map',
                'requirement' => 3,
                'category' => 'special',
                'rarity' => 'epic',
            ],
            [
                'id' => '9be4b1a4-9226-44ea-8422-5a46ae9aaafb',
                'title' => 'Kurator Sempurna',
                'description' => 'Memberikan rating bintang 5 pada sebuah buku.',
                'icon' => 'Star',
                'requirement' => 1,
                'category' => 'special',
                'rarity' => 'rare',
            ],
            [
                'id' => 'acf4b1a4-9226-44ea-8422-5a46ae9bbbfb',
                'title' => 'Penggemar Setia',
                'description' => 'Menandai 5 buku sebagai favorit.',
                'icon' => 'Heart',
                'requirement' => 5,
                'category' => 'special',
                'rarity' => 'rare',
            ],
            [
                'id' => 'bda4b1a4-9226-44ea-8422-5a46ae9cccfb',
                'title' => 'Sang Pemimpi',
                'description' => 'Menambahkan 5 buku ke Wishlist.',
                'icon' => 'Sparkles',
                'requirement' => 5,
                'category' => 'special',
                'rarity' => 'common',
            ]
        ];

        foreach ($achievements as $achievement) {
            $existing = Achievement::where('title', $achievement['title'])->first();
            if ($existing) {
                unset($achievement['id']);
                $existing->update($achievement);
            } else {
                Achievement::create($achievement);
            }
        }
    }
}
