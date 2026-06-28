<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
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
        $achievementsWithProgress = $achievements->map(function ($achievement) use ($user) {
            $userAchievement = $achievement->users->first();

            return [
                'id' => $achievement->id,
                'title' => $achievement->title,
                'description' => $achievement->description,
                'icon' => $achievement->icon,
                'requirement' => $achievement->requirement,
                'category' => $achievement->category,
                'rarity' => $achievement->rarity,
                'user_progress' => [
                    'current' => $userAchievement?->pivot->current ?? 0,
                    'unlocked' => (bool) ($userAchievement?->pivot->unlocked ?? false),
                    'unlocked_date' => $userAchievement?->pivot->unlocked_date?->toIso8601String(),
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

        $achievementData = [
            'id' => $achievement->id,
            'title' => $achievement->title,
            'description' => $achievement->description,
            'icon' => $achievement->icon,
            'requirement' => $achievement->requirement,
            'category' => $achievement->category,
            'rarity' => $achievement->rarity,
            'user_progress' => [
                'current' => $userAchievement?->pivot->current ?? 0,
                'unlocked' => (bool) ($userAchievement?->pivot->unlocked ?? false),
                'unlocked_date' => $userAchievement?->pivot->unlocked_date?->toIso8601String(),
            ],
        ];

        return response()->success($achievementData, 'Achievement retrieved successfully');
    }

    /**
     * Unlock an achievement (if requirements are met).
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

        // In a real implementation, this would check if requirements are met
        // For now, we'll just unlock it
        $user->achievements()->syncWithoutDetaching([$id => [
            'current' => $achievement->requirement,
            'unlocked' => true,
            'unlocked_date' => now(),
        ]]);

        return response()->success(null, 'Achievement unlocked successfully');
    }
}
