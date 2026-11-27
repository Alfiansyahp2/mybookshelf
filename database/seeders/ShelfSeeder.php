<?php

namespace Database\Seeders;

use App\Models\Shelf;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ShelfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        if (! $user) {
            return;
        }

        $shelves = [
            ['id' => Str::uuid()->toString(), 'name' => 'Shelf A', 'capacity' => 10, 'order' => 0],
            ['id' => Str::uuid()->toString(), 'name' => 'Shelf B', 'capacity' => 12, 'order' => 1],
            ['id' => Str::uuid()->toString(), 'name' => 'Shelf C', 'capacity' => 8, 'order' => 2],
        ];

        foreach ($shelves as $shelf) {
            Shelf::create(array_merge($shelf, [
                'user_id' => $user->id,
            ]));
        }
    }
}
