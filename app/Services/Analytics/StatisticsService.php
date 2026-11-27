<?php

namespace App\Services\Analytics;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatisticsService
{
    public const CACHE_TTL_MINUTES = 15;

    public static function cacheKey(string $userId): string
    {
        return "analytics:statistics:{$userId}";
    }

    public static function forgetForUser(string $userId): void
    {
        Cache::forget(self::cacheKey($userId));
    }

    /**
     * Build comprehensive reading, activity, and financial statistics for a user via SQL aggregation.
     *
     * @return array<string, mixed>
     */
    public function getUserStatistics(User $user): array
    {
        return Cache::remember(
            self::cacheKey($user->id),
            now()->addMinutes(self::CACHE_TTL_MINUTES),
            fn (): array => [
                'overview' => $this->buildOverviewCounts($user->id),
                'reading_time' => $this->buildReadingTime($user->id),
                'genre_distribution' => $this->buildGenreDistribution($user->id),
                'format_distribution' => $this->buildFormatDistribution($user->id),
                'monthly_reading' => $this->buildMonthlyReading($user->id),
                'yearly_reading' => $this->buildYearlyReading($user->id),
                'daily_activity' => $this->getDailyActivityRows($user->id),
                'purchases' => $this->buildPurchaseSummary($user->id),
                'top_read_books' => $this->buildTopReadBooks($user->id),
                'generated_at' => now()->toIso8601String(),
            ]
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getDailyActivityRows(string $userId): array
    {
        $lastYear = now()->subDays(365)->toDateTimeString();

        $sessionRows = DB::select("
            SELECT
                TO_CHAR(rs.start_time, 'YYYY-MM-DD') AS date,
                COALESCE(SUM(rs.duration), 0)::int AS duration,
                COALESCE(SUM(GREATEST(0, COALESCE(rs.end_page, rs.start_page) - rs.start_page)), 0)::int AS pages,
                COALESCE(JSON_AGG(DISTINCT b.title) FILTER (WHERE b.title IS NOT NULL), '[]') AS books_read
            FROM reading_sessions rs
            LEFT JOIN books b ON b.id = rs.book_id
            WHERE rs.user_id = ?
              AND rs.end_time IS NOT NULL
              AND rs.start_time >= ?
            GROUP BY TO_CHAR(rs.start_time, 'YYYY-MM-DD')
        ", [$userId, $lastYear]);

        $finishedRows = DB::select("
            SELECT
                TO_CHAR(finished_date, 'YYYY-MM-DD') AS date,
                COUNT(*)::int AS books_finished
            FROM books
            WHERE user_id = ?
              AND deleted_at IS NULL
              AND finished_date IS NOT NULL
              AND finished_date >= ?
            GROUP BY TO_CHAR(finished_date, 'YYYY-MM-DD')
        ", [$userId, $lastYear]);

        $byDate = [];
        foreach ($sessionRows as $row) {
            $booksRead = is_string($row->books_read) ? (json_decode($row->books_read, true) ?: []) : [];
            $byDate[$row->date] = [
                'date' => $row->date,
                'duration' => (int) $row->duration,
                'pages' => (int) $row->pages,
                'books_finished' => 0,
                'books_read' => array_values($booksRead),
            ];
        }

        foreach ($finishedRows as $row) {
            if (! isset($byDate[$row->date])) {
                $byDate[$row->date] = [
                    'date' => $row->date,
                    'duration' => 0,
                    'pages' => 0,
                    'books_finished' => (int) $row->books_finished,
                    'books_read' => [],
                ];
            } else {
                $byDate[$row->date]['books_finished'] = (int) $row->books_finished;
            }
        }

        ksort($byDate);

        return array_values($byDate);
    }

    /**
     * @return array<string, int>
     */
    private function buildOverviewCounts(string $userId): array
    {
        $row = DB::table('books')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->selectRaw("
                COUNT(*)::int AS total_books,
                COUNT(*) FILTER (WHERE status = 'finished')::int AS finished_books,
                COUNT(*) FILTER (WHERE status = 'reading')::int AS currently_reading,
                COUNT(*) FILTER (WHERE favorite = true)::int AS favorite_books,
                COALESCE(SUM(CASE WHEN status = 'finished' THEN COALESCE(pages, 0) ELSE COALESCE(current_page, 0) END), 0)::int AS pages_read,
                COALESCE(SUM(COALESCE(pages, 0)), 0)::int AS total_pages
            ")
            ->first();

        return [
            'total_books' => (int) ($row->total_books ?? 0),
            'finished_books' => (int) ($row->finished_books ?? 0),
            'currently_reading' => (int) ($row->currently_reading ?? 0),
            'favorite_books' => (int) ($row->favorite_books ?? 0),
            'pages_read' => (int) ($row->pages_read ?? 0),
            'total_pages' => (int) ($row->total_pages ?? 0),
        ];
    }

    /**
     * @return array<string, float|int>
     */
    private function buildReadingTime(string $userId): array
    {
        $totalReadingTime = (int) DB::table('reading_sessions')
            ->where('user_id', $userId)
            ->sum('duration');

        return [
            'total_seconds' => $totalReadingTime,
            'total_hours' => round($totalReadingTime / 3600, 2),
            'total_days' => round($totalReadingTime / 86400, 2),
        ];
    }

    /**
     * @return Collection<string, int>
     */
    private function buildGenreDistribution(string $userId): Collection
    {
        $rows = DB::select("
            SELECT COALESCE(genre, '') AS label, COUNT(*)::int AS cnt
            FROM books
            WHERE user_id = ? AND deleted_at IS NULL
            GROUP BY COALESCE(genre, '')
            ORDER BY cnt DESC
            LIMIT 5
        ", [$userId]);

        return collect($rows)->mapWithKeys(fn (object $r): array => [$r->label => (int) $r->cnt]);
    }

    /**
     * @return Collection<string, int>
     */
    private function buildFormatDistribution(string $userId): Collection
    {
        $rows = DB::select("
            SELECT COALESCE(format::text, '') AS label, COUNT(*)::int AS cnt
            FROM books
            WHERE user_id = ? AND deleted_at IS NULL
            GROUP BY COALESCE(format::text, '')
        ", [$userId]);

        return collect($rows)->mapWithKeys(fn (object $r): array => [$r->label => (int) $r->cnt]);
    }

    /**
     * @return Collection<string, int>
     */
    private function buildMonthlyReading(string $userId): Collection
    {
        $yearStart = now()->startOfYear()->toDateTimeString();
        $yearEnd = now()->endOfYear()->toDateTimeString();

        $rows = DB::select("
            SELECT TO_CHAR(finished_date, 'Month') AS month_name, COUNT(*)::int AS cnt
            FROM books
            WHERE user_id = ?
              AND deleted_at IS NULL
              AND finished_date IS NOT NULL
              AND finished_date >= ?
              AND finished_date <= ?
            GROUP BY TO_CHAR(finished_date, 'Month'), EXTRACT(MONTH FROM finished_date)
            ORDER BY EXTRACT(MONTH FROM finished_date) ASC
        ", [$userId, $yearStart, $yearEnd]);

        return collect($rows)->mapWithKeys(fn (object $r): array => [trim($r->month_name) => (int) $r->cnt]);
    }

    /**
     * @return Collection<int, int>
     */
    private function buildYearlyReading(string $userId): Collection
    {
        $rows = DB::select('
            SELECT EXTRACT(YEAR FROM finished_date)::int AS yr, COUNT(*)::int AS cnt
            FROM books
            WHERE user_id = ? AND deleted_at IS NULL AND finished_date IS NOT NULL
            GROUP BY EXTRACT(YEAR FROM finished_date)::int
            ORDER BY yr DESC
        ', [$userId]);

        return collect($rows)->mapWithKeys(fn (object $r): array => [(int) $r->yr => (int) $r->cnt]);
    }

    /**
     * @return array<string, mixed>
     */
    private function buildPurchaseSummary(string $userId): array
    {
        $bookAgg = DB::table('books')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->selectRaw('COUNT(*)::int AS total_books, COALESCE(SUM(purchase_price), 0) AS total_spent')
            ->first();

        $totalBooks = (int) ($bookAgg->total_books ?? 0);
        $totalSpent = (float) ($bookAgg->total_spent ?? 0);

        $monthStart = now()->startOfMonth()->toDateTimeString();
        $monthEnd = now()->endOfMonth()->toDateTimeString();

        $expenseAgg = DB::table('expenses')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->selectRaw('
                COUNT(*)::int AS total_expenses,
                COALESCE(SUM(amount_base_currency), 0) AS total_invested,
                COALESCE(SUM(CASE WHEN expense_date >= ? AND expense_date <= ? THEN amount_base_currency ELSE 0 END), 0) AS this_month_expenses
            ', [$monthStart, $monthEnd])
            ->first();

        $activeBudgets = (int) DB::table('budgets')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->where('is_active', true)
            ->count();

        return [
            'total_spent' => $totalSpent > 0 ? round($totalSpent, 2) : 0,
            'average_price' => $totalBooks > 0 ? round($totalSpent / $totalBooks, 2) : 0,
            'accounting' => [
                'total_expenses' => (int) ($expenseAgg->total_expenses ?? 0),
                'total_invested' => (float) ($expenseAgg->total_invested ?? 0),
                'active_budgets' => $activeBudgets,
                'this_month_expenses' => (float) ($expenseAgg->this_month_expenses ?? 0),
            ],
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function buildTopReadBooks(string $userId): Collection
    {
        $rows = DB::select("
            SELECT
                rs.book_id AS id,
                COALESCE(b.title, 'Unknown Book') AS name,
                COUNT(*)::int AS session_count,
                COALESCE(SUM(rs.duration), 0)::int AS total_duration,
                COALESCE(b.spine_color_light, '#8B7355') AS color
            FROM reading_sessions rs
            LEFT JOIN books b ON b.id = rs.book_id
            WHERE rs.user_id = ?
              AND rs.end_time IS NOT NULL
            GROUP BY rs.book_id, b.title, b.spine_color_light
            ORDER BY session_count DESC
            LIMIT 5
        ", [$userId]);

        return collect($rows)->map(fn (object $r): array => [
            'id' => $r->id,
            'name' => $r->name,
            'value' => (int) $r->session_count,
            'duration' => (int) $r->total_duration,
            'color' => $r->color ?: '#8B7355',
        ]);
    }
}
