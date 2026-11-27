<?php

namespace App\Services\Analytics;

use App\DataTransferObjects\Analytics\DashboardSummaryData;
use App\Models\User;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardAnalyticsService
{
    public const CACHE_TTL_MINUTES = 15;

    public static function cacheKey(string $userId): string
    {
        return "analytics:dashboard:{$userId}";
    }

    public static function forgetForUser(string $userId): void
    {
        Cache::forget(self::cacheKey($userId));
    }

    public function getSummaryForUser(User $user): DashboardSummaryData
    {
        /** @var DashboardSummaryData $summary */
        $summary = Cache::remember(
            self::cacheKey($user->id),
            now()->addMinutes(self::CACHE_TTL_MINUTES),
            fn (): DashboardSummaryData => $this->buildSummary($user->id)
        );

        return $summary;
    }

    private function buildSummary(string $userId): DashboardSummaryData
    {
        $now = now();
        $currentYear = (int) $now->year;
        $monthStart = $now->copy()->startOfMonth()->toDateTimeString();
        $monthEnd = $now->copy()->endOfMonth()->toDateTimeString();
        $todayStart = $now->copy()->startOfDay()->toDateTimeString();

        $agg = DB::table('books')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->selectRaw("
                COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'reading')::int AS reading,
                COUNT(*) FILTER (WHERE status = 'finished')::int AS finished,
                COUNT(*) FILTER (WHERE status = 'unread')::int AS unread,
                COUNT(*) FILTER (WHERE status = 'wishlist')::int AS wishlist,
                COUNT(*) FILTER (WHERE status = 'borrowed')::int AS borrowed,
                COUNT(*) FILTER (WHERE favorite = true)::int AS favorites,
                COUNT(*) FILTER (WHERE personal_notes IS NOT NULL AND personal_notes <> '')::int AS noted_count,
                COUNT(*) FILTER (WHERE status = 'borrowed' AND due_date IS NOT NULL AND due_date < ?)::int AS overdue_count,
                COUNT(*) FILTER (WHERE status NOT IN ('borrowed', 'wishlist'))::int AS available_to_loan_count,
                COUNT(*) FILTER (WHERE date_added >= ? AND date_added <= ?)::int AS added_this_month,
                COALESCE(ROUND(AVG(NULLIF(personal_rating, 0))::numeric, 1), 0) AS avg_rating,
                COALESCE(SUM(CASE WHEN status = 'reading' THEN COALESCE(current_page, 0) ELSE 0 END), 0)::int AS reading_pages_read,
                COALESCE(SUM(CASE WHEN status = 'reading' THEN COALESCE(pages, 0) ELSE 0 END), 0)::int AS reading_total_pages
            ", [$todayStart, $monthStart, $monthEnd])
            ->first();

        $shelvesCount = (int) DB::table('shelves')
            ->where('user_id', $userId)
            ->count();

        $yearlyStats = $this->buildYearlyStatsSql($userId);
        $currentYearStat = collect($yearlyStats)->firstWhere('year', $currentYear);

        $genreRows = DB::select("
            SELECT TRIM(g) AS name, COUNT(*)::int AS count
            FROM books, LATERAL regexp_split_to_table(genre, ',') AS g
            WHERE user_id = ?
              AND deleted_at IS NULL
              AND genre IS NOT NULL
              AND genre <> ''
              AND TRIM(g) <> ''
            GROUP BY TRIM(g)
            ORDER BY count DESC
        ", [$userId]);

        $genreChart = array_map(fn (object $row): array => [
            'name' => (string) $row->name,
            'count' => (int) $row->count,
        ], $genreRows);

        $authorRows = DB::table('books')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->whereNotNull('author')
            ->where('author', '!=', '')
            ->selectRaw('author AS name, COUNT(*)::int AS count')
            ->groupBy('author')
            ->orderByDesc('count')
            ->limit(20)
            ->get();

        $authorChart = $authorRows->map(fn (object $row): array => [
            'name' => strlen($row->name) > 15 ? substr($row->name, 0, 15).'…' : $row->name,
            'count' => (int) $row->count,
        ])->all();

        $currentlyReadingRows = DB::table('books')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->whereIn('status', ['reading', 'unread'])
            ->orderByRaw("CASE WHEN status = 'reading' THEN 0 ELSE 1 END")
            ->orderByDesc('last_modified')
            ->limit(50)
            ->get(['id', 'title', 'author', 'pages', 'current_page', 'spine_color_light', 'status']);

        $currentlyReading = $currentlyReadingRows->map(fn (object $row): array => [
            'id' => $row->id,
            'title' => $row->title,
            'author' => $row->author,
            'pages' => $row->status === 'reading' ? max(1, (int) $row->pages) : (int) $row->pages,
            'currentPage' => $row->status === 'reading' ? (int) ($row->current_page ?? 0) : 0,
            'color' => $row->spine_color_light ?: '#7A5C42',
            'status' => $row->status,
        ])->all();

        $topReadRows = DB::select("
            SELECT
                id,
                title,
                author,
                cover_image,
                personal_rating,
                genre,
                spine_color_light,
                CASE
                    WHEN read_dates IS NOT NULL AND json_array_length(read_dates) > 0 THEN json_array_length(read_dates)
                    WHEN status = 'finished' THEN 1
                    ELSE 0
                END AS read_count
            FROM books
            WHERE user_id = ?
              AND deleted_at IS NULL
              AND ((read_dates IS NOT NULL AND json_array_length(read_dates) > 0) OR status = 'finished')
            ORDER BY read_count DESC, last_modified DESC
            LIMIT 5
        ", [$userId]);

        $topReadBooks = array_map(fn (object $row): array => [
            'id' => $row->id,
            'name' => $row->title ?: 'Unknown Book',
            'author' => $row->author ?: 'Unknown Author',
            'coverImage' => $row->cover_image,
            'personalRating' => $row->personal_rating !== null ? (float) $row->personal_rating : null,
            'genre' => $row->genre,
            'value' => (int) $row->read_count,
            'color' => $row->spine_color_light ?: '#7A5C42',
        ], $topReadRows);

        $recentBooks = $this->fetchLightBooks(
            $userId,
            fn ($q) => $q->orderByDesc('date_added')->limit(3)
        );

        $recentlyFinished = $this->fetchLightBooks(
            $userId,
            fn ($q) => $q->where('status', 'finished')
                ->orderByRaw('COALESCE(finished_date, last_modified) DESC')
                ->limit(4)
        );

        $bookColors = DB::table('books')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->orderByDesc('date_added')
            ->limit(12)
            ->pluck('spine_color_light')
            ->map(fn (?string $c): string => $c ?: '#8B7355')
            ->all();

        $fourYearsAgo = $now->copy()->subYears(4)->startOfYear()->toDateTimeString();
        $activityBooks = $this->fetchLightBooks(
            $userId,
            fn ($q) => $q->where(function ($sub) use ($fourYearsAgo): void {
                $sub->whereNotNull('finished_date')
                    ->orWhereRaw('(read_dates IS NOT NULL AND json_array_length(read_dates) > 0)')
                    ->orWhere('date_added', '>=', $fourYearsAgo);
            })->orderByRaw('COALESCE(finished_date, date_added) DESC')
        );

        $dailyActivity = app(StatisticsService::class)->getDailyActivityRows($userId);

        $overview = [
            'total' => (int) ($agg->total ?? 0),
            'reading' => (int) ($agg->reading ?? 0),
            'finished' => (int) ($agg->finished ?? 0),
            'unread' => (int) ($agg->unread ?? 0),
            'wishlist' => (int) ($agg->wishlist ?? 0),
            'borrowed' => (int) ($agg->borrowed ?? 0),
            'favorites' => (int) ($agg->favorites ?? 0),
            'noted_count' => (int) ($agg->noted_count ?? 0),
            'overdue_count' => (int) ($agg->overdue_count ?? 0),
            'available_to_loan_count' => (int) ($agg->available_to_loan_count ?? 0),
            'added_this_month' => (int) ($agg->added_this_month ?? 0),
            'finished_this_year' => (int) ($currentYearStat['finished'] ?? 0),
            'current_year' => $currentYear,
            'target' => 12,
            'total_pages' => (int) ($currentYearStat['total_pages'] ?? 0),
            'pages_read' => (int) ($currentYearStat['pages_read'] ?? 0),
            'reading_pages_read' => (int) ($agg->reading_pages_read ?? 0),
            'reading_total_pages' => (int) ($agg->reading_total_pages ?? 0),
            'avg_rating' => (float) ($agg->avg_rating ?? 0),
            'top_genre' => $genreChart[0]['name'] ?? '—',
            'shelves_count' => $shelvesCount,
        ];

        $statusCounts = [
            'reading' => $overview['reading'],
            'finished' => $overview['finished'],
            'unread' => $overview['unread'],
            'wishlist' => $overview['wishlist'],
            'borrowed' => $overview['borrowed'],
        ];

        return new DashboardSummaryData(
            overview: $overview,
            yearlyStats: $yearlyStats,
            genreChart: $genreChart,
            authorChart: $authorChart,
            statusCounts: $statusCounts,
            currentlyReading: $currentlyReading,
            topReadBooks: $topReadBooks,
            recentBooks: $recentBooks,
            recentlyFinished: $recentlyFinished,
            bookColors: $bookColors,
            dailyActivity: $dailyActivity,
            activityBooks: $activityBooks,
            generatedAt: now()->toIso8601String(),
        );
    }

    /**
     * @return array<int, array{year: int, finished: int, total_pages: int, pages_read: int, read_pct: int, goal_pct: float}>
     */
    private function buildYearlyStatsSql(string $userId): array
    {
        $rows = DB::select("
            WITH raw_year_sources AS (
                SELECT b.id, b.status, b.pages, b.current_page,
                       EXTRACT(YEAR FROM b.finished_date)::int AS year_num,
                       (b.status = 'finished') AS finished_in_year
                FROM books b
                WHERE b.user_id = ? AND b.deleted_at IS NULL AND b.finished_date IS NOT NULL
                UNION ALL
                SELECT b.id, b.status, b.pages, b.current_page,
                       EXTRACT(YEAR FROM b.started_date)::int AS year_num,
                       false AS finished_in_year
                FROM books b
                WHERE b.user_id = ? AND b.deleted_at IS NULL AND b.started_date IS NOT NULL
                UNION ALL
                SELECT b.id, b.status, b.pages, b.current_page,
                       SUBSTRING(elem#>>'{}' FROM 1 FOR 4)::int AS year_num,
                       (b.status = 'finished' AND b.finished_date IS NULL) AS finished_in_year
                FROM books b, json_array_elements(COALESCE(b.read_dates, '[]'::json)) AS elem
                WHERE b.user_id = ? AND b.deleted_at IS NULL AND (elem#>>'{}') ~ '^\\d{4}'
                UNION ALL
                SELECT b.id, b.status, b.pages, b.current_page,
                       EXTRACT(YEAR FROM COALESCE(b.last_modified, b.date_added))::int AS year_num,
                       (b.status = 'finished') AS finished_in_year
                FROM books b
                WHERE b.user_id = ? AND b.deleted_at IS NULL
                  AND b.finished_date IS NULL
                  AND b.started_date IS NULL
                  AND (b.read_dates IS NULL OR json_array_length(b.read_dates) = 0)
                  AND b.status IN ('reading', 'finished')
                  AND COALESCE(b.last_modified, b.date_added) IS NOT NULL
            ),
            dedup_book_years AS (
                SELECT
                    id,
                    year_num,
                    MAX(COALESCE(pages, 0)) AS pages,
                    MAX(CASE WHEN status = 'finished' THEN COALESCE(pages, 0) ELSE COALESCE(current_page, 0) END) AS pages_read,
                    BOOL_OR(finished_in_year) AS is_finished
                FROM raw_year_sources
                GROUP BY id, year_num
            )
            SELECT
                year_num AS year,
                COUNT(*) FILTER (WHERE is_finished)::int AS finished,
                COALESCE(SUM(pages), 0)::int AS total_pages,
                COALESCE(SUM(pages_read), 0)::int AS pages_read
            FROM dedup_book_years
            GROUP BY year_num
            ORDER BY year_num DESC
        ", [$userId, $userId, $userId, $userId]);

        return array_map(function (object $row): array {
            $finished = (int) $row->finished;
            $totalPages = (int) $row->total_pages;
            $pagesRead = (int) $row->pages_read;

            return [
                'year' => (int) $row->year,
                'finished' => $finished,
                'total_pages' => $totalPages,
                'pages_read' => $pagesRead,
                'read_pct' => $totalPages > 0 ? (int) round(($pagesRead / $totalPages) * 100) : 0,
                'goal_pct' => (float) min(($finished / 12) * 100, 100),
            ];
        }, $rows);
    }

    /**
     * @param  callable(Builder): mixed  $applyQuery
     * @return array<int, array<string, mixed>>
     */
    private function fetchLightBooks(string $userId, callable $applyQuery): array
    {
        $query = DB::table('books')
            ->where('user_id', $userId)
            ->whereNull('deleted_at');

        $applyQuery($query);

        return $query->get([
            'id',
            'title',
            'author',
            'genre',
            'pages',
            'status',
            'cover_image',
            'spine_color_light',
            'spine_color_medium',
            'spine_color_dark',
            'current_page',
            'progress',
            'personal_rating',
            'finished_date',
            'started_date',
            'read_dates',
            'date_added',
            'last_modified',
        ])->map(fn (object $row): array => [
            'id' => $row->id,
            'title' => $row->title,
            'author' => $row->author,
            'genre' => $row->genre ?? '',
            'pages' => (int) ($row->pages ?? 0),
            'status' => $row->status,
            'coverImage' => $row->cover_image,
            'spineColors' => [
                $row->spine_color_light ?: '#8B7355',
                $row->spine_color_medium ?: '#6B5344',
                $row->spine_color_dark ?: '#5C4532',
            ],
            'currentPage' => $row->current_page !== null ? (int) $row->current_page : null,
            'progress' => (float) ($row->progress ?? 0),
            'personalRating' => $row->personal_rating !== null ? (float) $row->personal_rating : null,
            'finishedDate' => $row->finished_date,
            'startedDate' => $row->started_date,
            'readDates' => is_string($row->read_dates) ? (json_decode($row->read_dates, true) ?: []) : [],
            'dateAdded' => $row->date_added,
            'lastModified' => $row->last_modified,
        ])->all();
    }
}
