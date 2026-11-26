<?php

namespace App\Services\Reading;

use App\Models\Book;
use App\Models\ReadingSession;
use App\Services\Library\BookService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ReadingSessionService
{
    /**
     * List all reading sessions for a user, optionally filtered by book_id.
     */
    public function listForUser(string $userId, ?string $bookId = null): Collection
    {
        return ReadingSession::where('user_id', $userId)
            ->with('book')
            ->when($bookId, fn ($query) => $query->where('book_id', $bookId))
            ->orderBy('start_time', 'desc')
            ->get();
    }

    /**
     * Create a standalone manual reading session record.
     */
    public function createManualSession(string $userId, array $data): ReadingSession
    {
        return ReadingSession::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'book_id' => $data['book_id'],
            'start_time' => $data['start_time'],
            'start_page' => $data['start_page'],
            'mood' => $data['mood'] ?? null,
            'location' => $data['location'] ?? null,
        ])->load('book');
    }

    /**
     * End and finalize a manual reading session using an explicit end timestamp.
     */
    public function updateManualSession(ReadingSession $session, array $data): ReadingSession
    {
        $endTime = Carbon::parse($data['end_time']);

        if ($session->is_paused && $session->last_paused_at) {
            $session->paused_seconds += Carbon::parse($session->last_paused_at)->diffInSeconds($endTime);
            $session->is_paused = false;
        }

        $startTime = Carbon::parse($session->start_time);
        $duration = max(0, (int) $startTime->diffInSeconds($endTime) - $session->paused_seconds);

        $session->update([
            'end_time' => $data['end_time'],
            'end_page' => $data['end_page'],
            'notes' => $data['notes'] ?? null,
            'duration' => $duration,
        ]);

        return $session->load('book');
    }

    /**
     * Start a new reading session for a book.
     */
    public function startSession(Book $book, string $userId, int $startPage, ?string $mood = null, ?string $location = null): ReadingSession
    {
        return ReadingSession::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'book_id' => $book->id,
            'start_time' => now(),
            'start_page' => $startPage,
            'mood' => $mood,
            'location' => $location,
        ]);
    }

    /**
     * Pause or resume the active reading session.
     */
    public function togglePause(ReadingSession $session, bool $isPaused): ReadingSession
    {
        if ($session->end_time) {
            throw new \InvalidArgumentException('Cannot pause an already ended session');
        }

        if ($isPaused) {
            if (! $session->is_paused) {
                $session->is_paused = true;
                $session->last_paused_at = now();
            }
        } else {
            if ($session->is_paused) {
                $session->is_paused = false;
                if ($session->last_paused_at) {
                    $pausedDuration = (int) Carbon::parse($session->last_paused_at)->diffInSeconds(now());
                    $session->paused_seconds = (int) $session->paused_seconds + $pausedDuration;
                }
            }
        }

        $session->save();

        return $session->fresh();
    }

    /**
     * End a reading session with page data.
     */
    public function endSession(ReadingSession $session, int $endPage, ?string $notes = null): ReadingSession
    {
        $endTime = now();

        // Calculate any unrecorded paused time if it was paused when ending
        if ($session->is_paused && $session->last_paused_at) {
            $pausedDuration = (int) Carbon::parse($session->last_paused_at)->diffInSeconds($endTime);
            $session->paused_seconds = (int) $session->paused_seconds + $pausedDuration;
            $session->is_paused = false;
        }

        $startTime = Carbon::parse($session->start_time);
        $duration = max(0, (int) $startTime->diffInSeconds($endTime) - $session->paused_seconds);

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
    public function getBookSessions(Book $book, string $userId): Collection
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
            $readDates = $book->read_dates ?? [];
            $today = now()->toDateString();
            if (! in_array($today, $readDates)) {
                $readDates[] = $today;
                usort($readDates, function ($a, $b) {
                    return strtotime($b) - strtotime($a);
                });
            }

            $book->update([
                'status' => 'finished',
                'finished_date' => now(),
                'read_dates' => $readDates,
            ]);

            // Create timeline event for finishing
            if (class_exists(BookService::class)) {
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
            $parts[] = $hours.'h';
        }
        if ($minutes > 0 || $hours > 0) {
            $parts[] = $minutes.'m';
        }
        if ($secs > 0 || empty($parts)) {
            $parts[] = $secs.'s';
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
