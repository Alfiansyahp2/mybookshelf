<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Book;
use App\Models\Shelf;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    /**
     * Display a listing of achievements with user progress.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $achievements = Achievement::with(['users' => function ($query) use ($user) {
            $query->where('users.id', $user->id);
        }])->get();

        // Transform to include user progress
        $achievementsWithProgress = $achievements->map(function ($achievement) {
            $userAchievement = $achievement->users->first();

            $unlockedDate = $userAchievement?->pivot->unlocked_date;
            $unlockedDateStr = null;
            if ($unlockedDate) {
                $unlockedDateStr = is_string($unlockedDate) ? $unlockedDate : $unlockedDate->toIso8601String();
            }

            return [
                'id' => $achievement->id,
                'title' => $achievement->title,
                'description' => $achievement->description,
                'icon' => $achievement->icon,
                'requirement' => $achievement->requirement,
                'category' => $achievement->category,
                'rarity' => $achievement->rarity,
                'user_progress' => [
                    'current' => (int) ($userAchievement?->pivot->current ?? 0),
                    'unlocked' => (bool) ($userAchievement?->pivot->unlocked ?? false),
                    'unlocked_date' => $unlockedDateStr,
                ],
            ];
        });

        return response()->success($achievementsWithProgress, 'Achievements retrieved successfully');
    }

    /**
     * Display the specified achievement.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $achievement = Achievement::with(['users' => function ($query) use ($user) {
            $query->where('users.id', $user->id);
        }])->findOrFail($id);

        $userAchievement = $achievement->users->first();

        $unlockedDate = $userAchievement?->pivot->unlocked_date;
        $unlockedDateStr = null;
        if ($unlockedDate) {
            $unlockedDateStr = is_string($unlockedDate) ? $unlockedDate : $unlockedDate->toIso8601String();
        }

        $achievementData = [
            'id' => $achievement->id,
            'title' => $achievement->title,
            'description' => $achievement->description,
            'icon' => $achievement->icon,
            'requirement' => $achievement->requirement,
            'category' => $achievement->category,
            'rarity' => $achievement->rarity,
            'user_progress' => [
                'current' => (int) ($userAchievement?->pivot->current ?? 0),
                'unlocked' => (bool) ($userAchievement?->pivot->unlocked ?? false),
                'unlocked_date' => $unlockedDateStr,
            ],
        ];

        return response()->success($achievementData, 'Achievement retrieved successfully');
    }

    /**
     * Unlock an achievement (only if requirements are verified server-side).
     */
    public function unlock(Request $request, $id)
    {
        $user = $request->user();

        $achievement = Achievement::findOrFail($id);

        // Check if already unlocked
        $existingPivot = $user->achievements()->where('achievements.id', $id)->first();
        if ($existingPivot && $existingPivot->pivot->unlocked) {
            return response()->error('Achievement already unlocked', null, 400);
        }

        $current = $this->calculateProgressForAchievement($achievement, $user->id);

        if ($current < $achievement->requirement) {
            return response()->error('Achievement requirement not yet met', [
                'current' => $current,
                'requirement' => $achievement->requirement,
            ], 422);
        }

        $user->achievements()->syncWithoutDetaching([$id => [
            'current' => $current,
            'unlocked' => true,
            'unlocked_date' => now(),
        ]]);

        return response()->success([
            'current' => $current,
            'requirement' => $achievement->requirement,
        ], 'Achievement unlocked successfully');
    }

    /**
     * Compute the user's current progress toward an achievement requirement.
     */
    private function calculateProgressForAchievement(Achievement $achievement, string $userId): int
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
