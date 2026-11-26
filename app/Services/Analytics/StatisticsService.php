<?php

namespace App\Services\Analytics;

use App\Models\Book;
use App\Models\Budget;
use App\Models\Expense;
use App\Models\ReadingSession;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StatisticsService
{
    /**
     * Build comprehensive reading, activity, and financial statistics for a user.
     */
    public function getUserStatistics(User $user): array
    {
        $books = Book::where('user_id', $user->id)->get();
        $totalBooks = $books->count();

        $monthlyReading = $books
            ->filter(fn (Book $book) => $book->finished_date && $book->finished_date->year === now()->year)
            ->groupBy(fn (Book $book) => $book->finished_date->format('F'))
            ->map(fn (Collection $group) => $group->count());

        $yearlyReading = $books
            ->filter(fn (Book $book) => (bool) $book->finished_date)
            ->groupBy(fn (Book $book) => $book->finished_date->year)
            ->map(fn (Collection $group) => $group->count())
            ->sortKeysDesc();

        return [
            'overview' => $this->buildOverviewCounts($books),
            'reading_time' => $this->buildReadingTime($user->id),
            'genre_distribution' => $books->groupBy('genre')
                ->map(fn (Collection $group) => $group->count())
                ->sortDesc()
                ->take(5),
            'format_distribution' => $books->groupBy('format')
                ->map(fn (Collection $group) => $group->count()),
            'monthly_reading' => $monthlyReading,
            'yearly_reading' => $yearlyReading,
            'daily_activity' => $this->buildDailyActivity($user->id)->values(),
            'purchases' => $this->buildPurchaseSummary($user->id, $books, $totalBooks),
            'top_read_books' => $this->buildTopReadBooks($user->id),
            'generated_at' => now()->toIso8601String(),
        ];
    }

    /**
     * Aggregate headline book counts and pages read.
     */
    private function buildOverviewCounts(EloquentCollection $books): array
    {
        $pagesRead = $books->sum(function (Book $book): int {
            if ($book->status === 'finished') {
                return (int) $book->pages;
            }

            return (int) ($book->current_page ?? 0);
        });

        return [
            'total_books' => $books->count(),
            'finished_books' => $books->where('status', 'finished')->count(),
            'currently_reading' => $books->where('status', 'reading')->count(),
            'favorite_books' => $books->where('favorite', true)->count(),
            'pages_read' => $pagesRead,
            'total_pages' => $books->sum('pages'),
        ];
    }

    /**
     * Compute aggregate reading duration metrics across sessions.
     */
    private function buildReadingTime(string $userId): array
    {
        $totalReadingTime = (int) ReadingSession::where('user_id', $userId)->sum('duration');

        return [
            'total_seconds' => $totalReadingTime,
            'total_hours' => round($totalReadingTime / 3600, 2),
            'total_days' => round($totalReadingTime / 86400, 2),
        ];
    }

    /**
     * Compute daily reading activity heatmap rows over the trailing 365 days.
     */
    private function buildDailyActivity(string $userId): Collection
    {
        $lastYear = now()->subDays(365);

        $sessionsByDate = ReadingSession::where('user_id', $userId)
            ->whereNotNull('end_time')
            ->where('start_time', '>=', $lastYear)
            ->with('book:id,title')
            ->get()
            ->groupBy(fn (ReadingSession $session) => Carbon::parse($session->start_time)->format('Y-m-d'));

        $finishedByDate = Book::where('user_id', $userId)
            ->whereNotNull('finished_date')
            ->where('finished_date', '>=', $lastYear)
            ->get()
            ->groupBy(fn (Book $book) => Carbon::parse($book->finished_date)->format('Y-m-d'));

        $allDates = collect(array_keys($sessionsByDate->toArray()))
            ->merge(array_keys($finishedByDate->toArray()))
            ->unique();

        return $allDates->map(function (string $date) use ($sessionsByDate, $finishedByDate): array {
            $sessions = $sessionsByDate->get($date, collect());
            $finished = $finishedByDate->get($date, collect());

            $booksRead = $sessions
                ->map(fn (ReadingSession $session) => $session->book?->title)
                ->filter()
                ->unique()
                ->values();

            return [
                'date' => $date,
                'duration' => $sessions->sum('duration'),
                'pages' => $sessions->sum('end_page') - $sessions->sum('start_page'),
                'books_finished' => $finished->count(),
                'books_read' => $booksRead,
            ];
        });
    }

    /**
     * Compute book purchase totals combined with accounting expense/budget metrics.
     */
    private function buildPurchaseSummary(string $userId, EloquentCollection $books, int $totalBooks): array
    {
        $totalSpent = (float) $books->sum('purchase_price');

        return [
            'total_spent' => $totalSpent ? round($totalSpent, 2) : 0,
            'average_price' => $totalBooks > 0 ? round($totalSpent / $totalBooks, 2) : 0,
            'accounting' => [
                'total_expenses' => Expense::where('user_id', $userId)->count(),
                'total_invested' => Expense::where('user_id', $userId)->sum('amount_base_currency'),
                'active_budgets' => Budget::where('user_id', $userId)->where('is_active', true)->count(),
                'this_month_expenses' => Expense::where('user_id', $userId)
                    ->whereMonth('expense_date', now()->month)
                    ->whereYear('expense_date', now()->year)
                    ->sum('amount_base_currency') ?: 0,
            ],
        ];
    }

    /**
     * Fetch the top 5 most frequently read books from finished reading sessions.
     */
    private function buildTopReadBooks(string $userId): Collection
    {
        return ReadingSession::where('user_id', $userId)
            ->whereNotNull('end_time')
            ->select('book_id', DB::raw('count(*) as session_count'), DB::raw('sum(duration) as total_duration'))
            ->groupBy('book_id')
            ->orderByDesc('session_count')
            ->take(5)
            ->with('book:id,title,spine_color_light')
            ->get()
            ->map(function (ReadingSession $session): array {
                return [
                    'id' => $session->book_id,
                    'name' => $session->book ? $session->book->title : 'Unknown Book',
                    'value' => $session->session_count,
                    'duration' => $session->total_duration,
                    'color' => $session->book?->spine_color_light ?: '#8B7355',
                ];
            });
    }
}
