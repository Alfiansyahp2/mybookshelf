<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        Room::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'name' => 'Main Library',
            'description' => 'My primary reading room',
            'order' => 0,
            'unlocked' => true,
        ]);
    }
}
