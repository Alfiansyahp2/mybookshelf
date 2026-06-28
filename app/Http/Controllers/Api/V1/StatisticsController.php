<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\ReadingSession;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    /**
     * Get comprehensive user reading statistics.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get all user's books
        $books = Book::where('user_id', $user->id)->get();

        // Basic counts
        $totalBooks = $books->count();
        $finishedBooks = $books->where('status', 'finished')->count();
        $currentlyReading = $books->where('status', 'reading')->count();
        $favoriteBooks = $books->where('favorite', true)->count();

        // Pages read
        $totalPages = $books->sum('pages');
        $pagesRead = $books->sum(function ($book) {
            if ($book->status === 'finished') {
                return $book->pages;
            }
            return $book->current_page ?? 0;
        });

        // Reading time from sessions
        $totalReadingTime = ReadingSession::where('user_id', $user->id)
            ->sum('duration');

        // Genre distribution
        $genreDistribution = $books->groupBy('genre')
            ->map(fn ($group) => $group->count())
            ->sortDesc()
            ->take(5);

        // Format distribution
        $formatDistribution = $books->groupBy('format')
            ->map(fn ($group) => $group->count());

        // Monthly reading (this year)
        $monthlyReading = $books->filter(fn ($book) => $book->finished_date && $book->finished_date->year === now()->year)
            ->groupBy(fn ($book) => $book->finished_date->format('F'))
            ->map(fn ($group) => $group->count());

        // Purchase statistics
        $totalSpent = $books->sum('purchase_price');

        // Yearly reading
        $yearlyReading = $books->filter(fn ($book) => $book->finished_date)
            ->groupBy(fn ($book) => $book->finished_date->year)
            ->map(fn ($group) => $group->count())
            ->sortKeysDesc();

        $statistics = [
            'overview' => [
                'total_books' => $totalBooks,
                'finished_books' => $finishedBooks,
                'currently_reading' => $currentlyReading,
                'favorite_books' => $favoriteBooks,
                'pages_read' => $pagesRead,
                'total_pages' => $totalPages,
            ],
            'reading_time' => [
                'total_seconds' => $totalReadingTime,
                'total_hours' => round($totalReadingTime / 3600, 2),
                'total_days' => round($totalReadingTime / 86400, 2),
            ],
            'genre_distribution' => $genreDistribution,
            'format_distribution' => $formatDistribution,
            'monthly_reading' => $monthlyReading,
            'yearly_reading' => $yearlyReading,
            'purchases' => [
                'total_spent' => $totalSpent ? (float) number_format($totalSpent, 2) : 0,
                'average_price' => $totalBooks > 0 ? (float) number_format($totalSpent / $totalBooks, 2) : 0,
            ],
            'generated_at' => now()->toIso8601String(),
        ];

        return response()->success($statistics, 'Statistics retrieved successfully');
    }
}
