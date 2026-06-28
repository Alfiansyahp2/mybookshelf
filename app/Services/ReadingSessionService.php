<?php

namespace App\Services;

use App\Models\Book;
use App\Models\ReadingSession;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReadingSessionService
{
    /**
     * Start a new reading session for a book.
     */
    public function startSession(Book $book, string $userId, int $startPage, ?string $mood = null, ?string $location = null): ReadingSession
    {
        return ReadingSession::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'user_id' => $userId,
            'book_id' => $book->id,
            'start_time' => now(),
            'start_page' => $startPage,
            'mood' => $mood,
            'location' => $location,
        ]);
    }

    /**
     * End a reading session with page data.
     */
    public function endSession(ReadingSession $session, int $endPage, ?string $notes = null): ReadingSession
    {
        $endTime = now();
        $startTime = Carbon::parse($session->start_time);
        $duration = (int) $startTime->diffInSeconds($endTime);

        // Validate that end page is not less than start page
        if ($endPage < $session->start_page) {
            throw new \InvalidArgumentException('End page cannot be less than start page');
        }

        $session->update([
            'end_time' => $endTime,
            'end_page' => $endPage,
            'duration' => $duration,
            'notes' => $notes,
        ]);

        return $session->fresh();
    }

    /**
     * Get all reading sessions for a specific book.
     */
    public function getBookSessions(Book $book, string $userId): \Illuminate\Database\Eloquent\Collection
    {
        return ReadingSession::where('user_id', $userId)
            ->where('book_id', $book->id)
            ->with('book')
            ->orderBy('start_time', 'desc')
            ->get();
    }

    /**
     * Get reading statistics for a specific book.
     */
    public function getBookStatistics(Book $book, string $userId): array
    {
        $sessions = ReadingSession::where('user_id', $userId)
            ->where('book_id', $book->id)
            ->whereNotNull('end_time')
            ->get();

        $totalSessions = $sessions->count();
        $totalDuration = $sessions->sum('duration');
        $totalPagesRead = $sessions->sum('end_page') - $sessions->sum('start_page');

        // Calculate average reading speed (pages per hour)
        $avgSpeed = $totalDuration > 0
            ? ($totalPagesRead / ($totalDuration / 3600))
            : 0;

        return [
            'total_sessions' => $totalSessions,
            'total_duration_seconds' => $totalDuration,
            'total_duration_formatted' => $this->formatDuration($totalDuration),
            'total_pages_read' => $totalPagesRead,
            'average_reading_speed_pages_per_hour' => round($avgSpeed, 2),
        ];
    }

    /**
     * Calculate progress based on reading sessions.
     */
    public function calculateProgressFromSessions(Book $book, string $userId): float
    {
        if ($book->pages <= 0) {
            return 0;
        }

        // Get the highest end page from all completed sessions
        $highestPage = ReadingSession::where('user_id', $userId)
            ->where('book_id', $book->id)
            ->whereNotNull('end_page')
            ->max('end_page') ?? 0;

        return round(($highestPage / $book->pages) * 100, 2);
    }

    /**
     * Get current page based on latest completed session.
     */
    public function getCurrentPage(Book $book, string $userId): int
    {
        $latestSession = ReadingSession::where('user_id', $userId)
            ->where('book_id', $book->id)
            ->whereNotNull('end_page')
            ->orderBy('end_time', 'desc')
            ->first();

        return $latestSession ? $latestSession->end_page : 0;
    }

    /**
     * Sync book progress with reading sessions.
     */
    public function syncBookProgress(Book $book, string $userId): void
    {
        $currentPage = $this->getCurrentPage($book, $userId);
        $progress = $this->calculateProgressFromSessions($book, $userId);

        // Update book progress fields
        $book->update([
            'current_page' => $currentPage,
            'progress' => $progress,
        ]);

        // Auto-finish book if progress reaches 100%
        if ($progress >= 100 && $book->status !== 'finished') {
            $book->update([
                'status' => 'finished',
                'finished_date' => now(),
            ]);

            // Create timeline event for finishing
            if (class_exists('App\Services\BookService')) {
                $bookService = app(BookService::class);
                $bookService->createTimelineEvent($book, 'finished', [
                    'page' => $currentPage,
                    'progress' => $progress,
                ]);
            }
        }
    }

    /**
     * Format duration in seconds to human-readable format.
     */
    private function formatDuration(int $seconds): string
    {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;

        $parts = [];
        if ($hours > 0) {
            $parts[] = $hours . 'h';
        }
        if ($minutes > 0 || $hours > 0) {
            $parts[] = $minutes . 'm';
        }
        if ($secs > 0 || empty($parts)) {
            $parts[] = $secs . 's';
        }

        return implode(' ', $parts);
    }

    /**
     * Get active session (session that hasn't ended yet).
     */
    public function getActiveSession(Book $book, string $userId): ?ReadingSession
    {
        return ReadingSession::where('user_id', $userId)
            ->where('book_id', $book->id)
            ->whereNull('end_time')
            ->first();
    }

    /**
     * Check if user has an active session for a book.
     */
    public function hasActiveSession(Book $book, string $userId): bool
    {
        return $this->getActiveSession($book, $userId) !== null;
    }
}