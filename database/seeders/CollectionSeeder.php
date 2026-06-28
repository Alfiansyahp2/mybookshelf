<?php

namespace Database\Seeders;

use App\Models\Collection;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        $collections = [
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'name' => 'Harry Potter',
                'description' => 'The complete wizarding world collection',
                'color' => '#7C3AED',
                'icon' => '🧙',
                'progress' => 0,
                'created_at' => '2024-01-01 00:00:00',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'name' => 'Personal Development',
                'description' => 'Books for growth and self-improvement',
                'color' => '#059669',
                'icon' => '📈',
                'progress' => 50,
                'created_at' => '2024-02-01 00:00:00',
            ],
        ];

        foreach ($collections as $collection) {
            $coll = Collection::create($collection);

            // Attach books to Personal Development collection
            // Note: We'll need to attach by UUID after books are created
            if ($coll->name === 'Personal Development') {
                // Get the books that match Personal Development genre
                $pdBooks = \App\Models\Book::whereIn('genre', ['Self-Help', 'Finance', 'Productivity', 'Business'])
                    ->get();

                foreach ($pdBooks as $book) {
                    $coll->books()->attach($book->id, ['order' => rand(0, 10), 'added_at' => now()]);
                }

                // Update progress
                $coll->updateProgress();
            }
        }
    }
}