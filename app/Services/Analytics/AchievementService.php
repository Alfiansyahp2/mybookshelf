<?php

namespace App\Services\Analytics;

use App\Models\Achievement;
use App\Models\Shelf;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AchievementService
{
    /**
     * Retrieve all achievements with live server-computed user progress and persisted unlock state.
     *
     * @return Collection<int, Achievement>
     */
    public function listForUser(User $user): Collection
    {
        $achievements = Achievement::with(['users' => function ($query) use ($user): void {
            $query->where('users.id', $user->id);
        }])->get();

        $metrics = $this->computeMetricsForUser($user->id);

        return $achievements->each(function (Achievement $achievement) use ($metrics): void {
            $computed = $this->resolveMetricForAchievement($achievement, $metrics);
            $achievement->setAttribute('computed_current', $computed);
        });
    }

    /**
     * Retrieve a single achievement with the given user's pivot progress loaded.
     */
    public function findForUser(User $user, string $achievementId): Achievement
    {
        $achievement = Achievement::with(['users' => function ($query) use ($user): void {
            $query->where('users.id', $user->id);
        }])->findOrFail($achievementId);

        $metrics = $this->computeMetricsForUser($user->id);
        $achievement->setAttribute(
            'computed_current',
            $this->resolveMetricForAchievement($achievement, $metrics)
        );

        return $achievement;
    }

    /**
     * Evaluate and persist all achievements earned by a user on the server.
     *
     * @return array<int, string> Newly unlocked achievement IDs
     */
    public function evaluateForUser(string $userId): array
    {
        $user = User::find($userId);
        if (! $user) {
            return [];
        }

        $achievements = Achievement::with(['users' => function ($query) use ($userId): void {
            $query->where('users.id', $userId);
        }])->get();

        if ($achievements->isEmpty()) {
            return [];
        }

        $metrics = $this->computeMetricsForUser($userId);
        $newlyUnlocked = [];

        foreach ($achievements as $achievement) {
            $pivotUser = $achievement->users->first();
            /** @var \Illuminate\Database\Eloquent\Relations\Pivot|null $pivot */
            $pivot = $pivotUser?->getRelationValue('pivot');
            $alreadyUnlocked = (bool) ($pivot?->getAttribute('unlocked') ?? false);
            $current = $this->resolveMetricForAchievement($achievement, $metrics);
            $met = $current >= $achievement->requirement;

            if ($alreadyUnlocked) {
                continue;
            }

            if ($met) {
                $user->achievements()->syncWithoutDetaching([
                    $achievement->id => [
                        'current' => $current,
                        'unlocked' => true,
                        'unlocked_date' => now(),
                    ],
                ]);
                $newlyUnlocked[] = $achievement->id;
            } else {
                $user->achievements()->syncWithoutDetaching([
                    $achievement->id => [
                        'current' => $current,
                        'unlocked' => false,
                    ],
                ]);
            }
        }

        return $newlyUnlocked;
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
        /** @var \Illuminate\Database\Eloquent\Relations\Pivot|null $pivot */
        $pivot = $existingPivot?->getRelationValue('pivot');
        if ($pivot !== null && $pivot->getAttribute('unlocked')) {
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
        $metrics = $this->computeMetricsForUser($userId);

        return $this->resolveMetricForAchievement($achievement, $metrics);
    }

    /**
     * @return array<string, int>
     */
    public function computeMetricsForUser(string $userId): array
    {
        $agg = DB::table('books')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->selectRaw("
                COUNT(*)::int AS total_books,
                COUNT(*) FILTER (WHERE status = 'finished')::int AS finished_books,
                COALESCE(SUM(CASE WHEN status = 'finished' THEN COALESCE(pages, 0) ELSE 0 END), 0)::int AS finished_pages,
                COUNT(*) FILTER (WHERE status = 'wishlist')::int AS wishlist_books,
                COUNT(*) FILTER (WHERE favorite = true)::int AS favorite_books,
                COUNT(*) FILTER (WHERE personal_rating > 0)::int AS rated_books,
                COUNT(*) FILTER (WHERE personal_rating >= 5)::int AS five_star_books
            ")
            ->first();

        $distinctGenres = DB::selectOne("
            SELECT COUNT(DISTINCT TRIM(g))::int AS cnt
            FROM books, LATERAL regexp_split_to_table(genre, ',') AS g
            WHERE user_id = ?
              AND deleted_at IS NULL
              AND genre IS NOT NULL
              AND genre <> ''
              AND TRIM(g) <> ''
        ", [$userId]);

        $shelvesCount = (int) Shelf::where('user_id', $userId)->count();

        return [
            'total_books' => (int) ($agg->total_books ?? 0),
            'finished_books' => (int) ($agg->finished_books ?? 0),
            'finished_pages' => (int) ($agg->finished_pages ?? 0),
            'wishlist_books' => (int) ($agg->wishlist_books ?? 0),
            'favorite_books' => (int) ($agg->favorite_books ?? 0),
            'rated_books' => (int) ($agg->rated_books ?? 0),
            'five_star_books' => (int) ($agg->five_star_books ?? 0),
            'distinct_genres' => (int) ($distinctGenres->cnt ?? 0),
            'shelves_count' => $shelvesCount,
        ];
    }

    /**
     * @param  array<string, int>  $metrics
     */
    private function resolveMetricForAchievement(Achievement $achievement, array $metrics): int
    {
        $title = $achievement->title;

        return match (true) {
            $achievement->category === 'reading' && str_contains($title, 'Marathon') => $metrics['finished_pages'],
            $achievement->category === 'reading' => $metrics['finished_books'],
            $achievement->category === 'collections' && str_contains($title, 'Rak') => $metrics['shelves_count'],
            str_contains($title, 'Genre') => $metrics['distinct_genres'],
            str_contains($title, 'Bintang') || str_contains($title, 'Sempurna') => $metrics['five_star_books'],
            str_contains($title, 'Kritikus') => $metrics['rated_books'],
            str_contains($title, 'Favorit') || str_contains($title, 'Setia') => $metrics['favorite_books'],
            str_contains($title, 'Wishlist') || str_contains($title, 'Pemimpi') => $metrics['wishlist_books'],
            default => $metrics['total_books'],
        };
    }
}
