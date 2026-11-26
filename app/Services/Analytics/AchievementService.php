<?php

namespace App\Services\Analytics;

use App\Models\Achievement;
use App\Models\Book;
use App\Models\Shelf;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AchievementService
{
    /**
     * Retrieve all achievements with the given user's pivot progress loaded.
     */
    public function listForUser(User $user): Collection
    {
        return Achievement::with(['users' => function ($query) use ($user): void {
            $query->where('users.id', $user->id);
        }])->get();
    }

    /**
     * Retrieve a single achievement with the given user's pivot progress loaded.
     */
    public function findForUser(User $user, string $achievementId): Achievement
    {
        return Achievement::with(['users' => function ($query) use ($user): void {
            $query->where('users.id', $user->id);
        }])->findOrFail($achievementId);
    }

    /**
     * Attempt to unlock an achievement after verifying requirements server-side.
     *
     * @return array{status: string, current?: int, requirement?: int}
     */
    public function unlock(User $user, string $achievementId): array
    {
        $achievement = Achievement::findOrFail($achievementId);

        $existingPivot = $user->achievements()->where('achievements.id', $achievementId)->first();
        if ($existingPivot && $existingPivot->pivot->unlocked) {
            return ['status' => 'already_unlocked'];
        }

        $current = $this->calculateProgress($achievement, $user->id);

        if ($current < $achievement->requirement) {
            return [
                'status' => 'not_met',
                'current' => $current,
                'requirement' => $achievement->requirement,
            ];
        }

        $user->achievements()->syncWithoutDetaching([$achievementId => [
            'current' => $current,
            'unlocked' => true,
            'unlocked_date' => now(),
        ]]);

        return [
            'status' => 'unlocked',
            'current' => $current,
            'requirement' => $achievement->requirement,
        ];
    }

    /**
     * Compute the user's current progress toward an achievement requirement.
     */
    public function calculateProgress(Achievement $achievement, string $userId): int
    {
        $title = $achievement->title;

        return match (true) {
            $achievement->category === 'reading' && str_contains($title, 'Marathon') => (int) Book::where('user_id', $userId)
                ->where('status', 'finished')
                ->sum('pages'),
            $achievement->category === 'reading' => Book::where('user_id', $userId)
                ->where('status', 'finished')
                ->count(),
            $achievement->category === 'collections' && str_contains($title, 'Rak') => Shelf::where('user_id', $userId)
                ->count(),
            str_contains($title, 'Genre') => Book::where('user_id', $userId)
                ->whereNotNull('genre')
                ->where('genre', '!=', '')
                ->distinct('genre')
                ->count('genre'),
            str_contains($title, 'Bintang') || str_contains($title, 'Sempurna') => Book::where('user_id', $userId)
                ->where('personal_rating', 5)
                ->count(),
            str_contains($title, 'Kritikus') => Book::where('user_id', $userId)
                ->where('personal_rating', '>', 0)
                ->count(),
            str_contains($title, 'Favorit') || str_contains($title, 'Setia') => Book::where('user_id', $userId)
                ->where('favorite', true)
                ->count(),
            str_contains($title, 'Wishlist') || str_contains($title, 'Pemimpi') => Book::where('user_id', $userId)
                ->where('status', 'wishlist')
                ->count(),
            default => Book::where('user_id', $userId)->count(),
        };
    }
}
