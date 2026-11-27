<?php

namespace App\Services\Library;

use App\Contracts\Storage\MediaStorageInterface;
use App\DataTransferObjects\Library\BookFilterData;
use App\Events\BookFinished;
use App\Jobs\ProcessBookCoverJob;
use App\Models\Book;
use App\Models\TimelineEvent;
use App\Services\Analytics\AchievementService;
use App\Services\Reading\ReadingSessionService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookService
{
    /**
     * Get all books with filtering and pagination
     *
     * @param  array<string, mixed>|BookFilterData  $filters
     * @return Collection<int, Book>|LengthAwarePaginator<int, Book>
     */
    public function getAllBooks(array|BookFilterData $filters = [], bool $withPagination = true, ?string $userId = null): Collection|LengthAwarePaginator
    {
        $filterData = $filters instanceof BookFilterData
            ? $filters
            : BookFilterData::fromArray($filters);

        $query = Book::with(['shelf', 'collections']);

        // SECURITY: Filter by user_id - only show books belonging to authenticated user
        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($filterData->status !== null) {
            $query->where('status', $filterData->status);
        }

        if ($filterData->statuses !== []) {
            $query->whereIn('status', $filterData->statuses);
        }

        if ($filterData->excludeStatuses !== []) {
            $query->whereNotIn('status', $filterData->excludeStatuses);
        }

        if ($filterData->shelfId !== null) {
            $query->where('shelf_id', $filterData->shelfId);
        }

        if ($filterData->favorite !== null) {
            $query->where('favorite', $filterData->favorite);
        }

        if ($filterData->isReturned !== null) {
            $query->where('is_returned', $filterData->isReturned);
        }

        if ($filterData->overdue === true) {
            $query->where('status', 'borrowed')
                ->where('is_returned', false)
                ->whereNotNull('due_date')
                ->where('due_date', '<', now()->startOfDay()->toDateString());
        } elseif ($filterData->overdue === false) {
            $query->where(function ($q): void {
                $q->where('is_returned', true)
                    ->orWhereNull('due_date')
                    ->orWhere('due_date', '>=', now()->startOfDay()->toDateString());
            });
        }

        if ($filterData->borrowedBy !== null) {
            $query->where('borrowed_by', 'ilike', "%{$filterData->borrowedBy}%");
        }

        if ($filterData->hasNotes === true) {
            $query->whereNotNull('personal_notes')->where('personal_notes', '!=', '');
        } elseif ($filterData->hasNotes === false) {
            $query->where(function ($q): void {
                $q->whereNull('personal_notes')->orWhere('personal_notes', '');
            });
        }

        if ($filterData->genre !== null) {
            $query->where('genre', 'ilike', "%{$filterData->genre}%");
        }

        if ($filterData->year !== null) {
            $year = $filterData->year;
            $query->where(function ($q) use ($year): void {
                $q->whereRaw('EXTRACT(YEAR FROM finished_date) = ?', [$year])
                    ->orWhereRaw('EXTRACT(YEAR FROM started_date) = ?', [$year])
                    ->orWhereRaw(
                        "EXISTS (SELECT 1 FROM json_array_elements(COALESCE(books.read_dates, '[]'::json)) AS elem WHERE SUBSTRING(elem#>>'{}' FROM 1 FOR 4) ~ '^\\\\d{4}$' AND SUBSTRING(elem#>>'{}' FROM 1 FOR 4)::int = ?)",
                        [$year]
                    )
                    ->orWhere(function ($fallback) use ($year): void {
                        $fallback->whereNull('finished_date')
                            ->whereNull('started_date')
                            ->whereRaw('(read_dates IS NULL OR json_array_length(read_dates) = 0)')
                            ->whereIn('status', ['reading', 'finished'])
                            ->whereRaw('EXTRACT(YEAR FROM COALESCE(last_modified, date_added)) = ?', [$year]);
                    });
            });
        }

        if ($filterData->search !== null) {
            $searchTerm = $filterData->search;
            $query->where(function ($q) use ($searchTerm): void {
                $q->where('title', 'ilike', "%{$searchTerm}%")
                    ->orWhere('author', 'ilike', "%{$searchTerm}%")
                    ->orWhere('genre', 'ilike', "%{$searchTerm}%")
                    ->orWhere('isbn', 'ilike', "%{$searchTerm}%")
                    ->orWhere('borrowed_by', 'ilike', "%{$searchTerm}%")
                    ->orWhere('personal_notes', 'ilike', "%{$searchTerm}%");
            });
        }

        // Order by latest modified first
        $query->orderBy('last_modified', 'desc');

        if ($withPagination) {
            return $query->paginate($filterData->perPage, ['*'], 'page', $filterData->page);
        }

        return $query->get();
    }

    /**
     * Create new book
     *
     * @param  array<string, mixed>  $data
     */
    public function createBook(array $data, string $userId): Book
    {
        DB::beginTransaction();
        try {
            // Generate UUID
            $data['id'] = Str::uuid()->toString();
            $data['user_id'] = $userId;

            // Set default values
            $data['genre'] = (is_string($data['genre'] ?? null) && trim($data['genre']) !== '')
                ? $data['genre']
                : 'Fiction';
            $data['date_added'] = now();
            $data['last_modified'] = now();

            // Calculate progress if current_page provided
            if (isset($data['current_page']) && isset($data['pages'])) {
                $data['progress'] = $this->calculateProgress($data['current_page'], $data['pages']);
            }

            $book = Book::create($data);

            // Create timeline event
            $this->createTimelineEvent($book, 'added', 'Book added to library');

            DB::commit();

            if ($book->status === 'finished') {
                BookFinished::dispatch($book);
            } else {
                app(AchievementService::class)->evaluateForUser($book->user_id);
            }

            return $book->load(['shelf', 'collections']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get single book by ID
     */
    public function getBook(string $id, ?string $userId = null): Book
    {
        $query = Book::with(['shelf', 'collections', 'readingSessions', 'timelineEvents', 'expenses.category']);

        // SECURITY: Filter by user_id if provided
        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->findOrFail($id);
    }

    /**
     * Find a book optionally scoped to the given user ID.
     */
    private function findOwnedBook(string $id, ?string $userId = null): Book
    {
        return Book::query()
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->findOrFail($id);
    }

    /**
     * Update book
     *
     * @param  array<string, mixed>  $data
     */
    public function updateBook(string $id, array $data, ?string $userId = null): Book
    {
        $book = $this->findOwnedBook($id, $userId);

        // Update last_modified timestamp
        $data['last_modified'] = now();

        // Recalculate progress if pages or current_page changed
        if (isset($data['current_page']) && isset($data['pages'])) {
            $data['progress'] = $this->calculateProgress((int) $data['current_page'], (int) $data['pages']);
        }

        $book->update($data);

        return $book->fresh()->load(['shelf', 'collections']);
    }

    /**
     * Delete book (soft delete)
     */
    public function deleteBook(string $id, ?string $userId = null): bool
    {
        $book = $this->findOwnedBook($id, $userId);
        $book->delete();

        return true;
    }

    /**
     * Start reading a book
     */
    public function startReading(string $id, ?string $userId = null): Book
    {
        $book = $this->findOwnedBook($id, $userId);

        $book->update([
            'status' => 'reading',
            'started_date' => now(),
            'last_modified' => now(),
        ]);

        // Create timeline event
        $this->createTimelineEvent($book, 'started', 'Started reading');

        return $book->fresh();
    }

    /**
     * Finish reading a book
     */
    public function finishReading(string $id, ?string $userId = null): Book
    {
        $book = $this->findOwnedBook($id, $userId);

        $readDates = $book->read_dates ?? [];
        $today = now()->format('Y-m-d');
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
            'current_page' => $book->pages,
            'progress' => 100.0,
            'last_modified' => now(),
        ]);

        // Create timeline event
        $this->createTimelineEvent($book, 'finished', 'Finished reading');

        // Update collection progresses
        $this->updateRelatedCollectionProgress($book);

        $freshBook = $book->fresh();
        BookFinished::dispatch($freshBook);

        return $freshBook;
    }

    /**
     * Update reading progress
     */
    public function updateProgress(string $id, int $currentPage, ?string $userId = null): Book
    {
        $book = $this->findOwnedBook($id, $userId);

        $progress = $this->calculateProgress($currentPage, $book->pages);
        $autoFinished = false;

        $data = [
            'current_page' => $currentPage,
            'progress' => $progress,
            'last_modified' => now(),
        ];

        // Auto-finish if progress reaches 100%
        if ($progress >= 100 && $book->status !== 'finished') {
            $autoFinished = true;
            $data['status'] = 'finished';
            $data['finished_date'] = now();

            $readDates = $book->read_dates ?? [];
            $today = now()->toDateString();
            if (! in_array($today, $readDates)) {
                $readDates[] = $today;
                usort($readDates, function ($a, $b) {
                    return strtotime($b) - strtotime($a);
                });
            }
            $data['read_dates'] = $readDates;

            $this->createTimelineEvent($book, 'finished', 'Finished reading');
        }

        $book->update($data);

        // Create milestone timeline events
        $this->checkProgressMilestones($book, $progress);

        $freshBook = $book->fresh();

        if ($autoFinished) {
            BookFinished::dispatch($freshBook);
        }

        return $freshBook;
    }

    /**
     * Toggle favorite status
     */
    public function toggleFavorite(string $id, ?string $userId = null): Book
    {
        $book = $this->findOwnedBook($id, $userId);

        $book->update([
            'favorite' => ! $book->favorite,
            'last_modified' => now(),
        ]);

        if ($book->favorite) {
            $this->createTimelineEvent($book, 'favorited', 'Marked as favorite');
        }

        $freshBook = $book->fresh();
        if ($freshBook->favorite) {
            app(AchievementService::class)->evaluateForUser($freshBook->user_id);
        }

        return $freshBook;
    }

    /**
     * Update personal notes
     */
    public function updateNotes(string $id, ?string $notes, ?string $userId = null): Book
    {
        $book = $this->findOwnedBook($id, $userId);

        $book->update([
            'personal_notes' => $notes,
            'last_modified' => now(),
        ]);

        return $book->fresh();
    }

    /**
     * Update personal rating
     */
    public function updateRating(string $id, float|int|null $rating, ?string $userId = null): Book
    {
        $book = $this->findOwnedBook($id, $userId);

        $book->update([
            'personal_rating' => $rating,
            'last_modified' => now(),
        ]);

        $freshBook = $book->fresh();
        if ($rating !== null) {
            app(AchievementService::class)->evaluateForUser($freshBook->user_id);
        }

        return $freshBook;
    }

    /**
     * Move book to different shelf
     */
    public function moveToShelf(string $id, ?string $shelfId, ?int $position = null, ?string $userId = null): Book
    {
        $book = $this->findOwnedBook($id, $userId);

        $data = ['shelf_id' => $shelfId];

        if ($position !== null) {
            $data['position'] = $position;
        }

        $book->update($data);

        return $book->fresh()->load('shelf');
    }

    /**
     * Store or replace a book cover image on configured media storage and queue WebP optimization.
     */
    public function uploadCover(Book $book, UploadedFile $file, ?string $baseUrl = null): string
    {
        $realPath = $file->getRealPath();
        $rawBytes = $realPath ? file_get_contents($realPath) : false;
        if ($rawBytes === false || $rawBytes === '') {
            throw new \InvalidArgumentException('Uploaded cover image could not be read.');
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $detectedMime = (string) $finfo->buffer($rawBytes);
        $allowedMimes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

        if (! array_key_exists($detectedMime, $allowedMimes) || @getimagesizefromstring($rawBytes) === false) {
            throw new \InvalidArgumentException('Invalid image content. Only valid JPEG, PNG, or WebP images are allowed.');
        }

        $mediaStorage = app(MediaStorageInterface::class);
        $mediaStorage->delete($book->cover_image);

        $extension = $allowedMimes[$detectedMime];
        $rawKey = "book-covers/raw_{$book->id}_".time().'.'.$extension;
        $storedKey = $mediaStorage->put($rawKey, $rawBytes, $detectedMime, 'public');

        $book->update(['cover_image' => $storedKey]);

        ProcessBookCoverJob::dispatch($book->id, $storedKey);

        $latestKey = $book->fresh()?->cover_image ?: $storedKey;

        return $mediaStorage->publicUrl($latestKey) ?? $latestKey;
    }

    /**
     * Calculate progress percentage
     */
    protected function calculateProgress(int $currentPage, int $totalPages): float
    {
        if ($totalPages <= 0) {
            return 0.0;
        }

        return round(($currentPage / $totalPages) * 100, 2);
    }

    /**
     * Create timeline event
     *
     * @param  string|array<int|string, mixed>  $description
     */
    public function createTimelineEvent(Book $book, string $type, string|array $description): TimelineEvent
    {
        return TimelineEvent::create([
            'id' => Str::uuid()->toString(),
            'book_id' => $book->id,
            'type' => $type,
            'date' => now(),
            'description' => is_array($description) ? json_encode($description) : $description,
            'metadata' => [
                'page' => $book->current_page,
                'progress' => $book->progress,
            ],
        ]);
    }

    /**
     * Check progress milestones and create events
     */
    protected function checkProgressMilestones(Book $book, float $newProgress): void
    {
        $milestones = [25, 50, 75];

        foreach ($milestones as $milestone) {
            if ($newProgress >= $milestone && $newProgress < $milestone + 1) {
                $this->createTimelineEvent(
                    $book,
                    'progress',
                    "Reached {$milestone}% completion"
                );
            }
        }
    }

    /**
     * Update progress of all collections containing this book
     */
    protected function updateRelatedCollectionProgress(Book $book): void
    {
        foreach ($book->collections as $collection) {
            $collection->updateProgress();
        }
    }

    /**
     * Read Again - Restart a finished book
     */
    public function readAgain(string $id, ?string $userId = null): Book
    {
        $query = Book::query();

        // SECURITY: Filter by user_id if provided
        if ($userId) {
            $query->where('user_id', $userId);
        }

        $book = $query->findOrFail($id);

        // Only allow read again for finished books
        if ($book->status !== 'finished') {
            throw new \InvalidArgumentException('Can only restart finished books');
        }

        DB::beginTransaction();
        try {
            $book->update([
                'status' => 'reading',
                'finished_date' => null,
                'last_modified' => now(),
            ]);

            // Create timeline event for restarting ('started' matches timeline_events.type PostgreSQL ENUM)
            $this->createTimelineEvent($book, 'started', 'Started reading again');

            DB::commit();

            return $book->fresh()->load(['shelf', 'collections']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update book progress based on reading sessions
     */
    public function syncProgressFromSessions(string $bookId, string $userId): Book
    {
        $book = Book::query()->where('user_id', $userId)->findOrFail($bookId);

        $readingSessionService = app(ReadingSessionService::class);

        // Get current page and progress from sessions
        $currentPage = $readingSessionService->getCurrentPage($book, $userId);
        $progress = $readingSessionService->calculateProgressFromSessions($book, $userId);

        // Update book progress fields
        $book->update([
            'current_page' => $currentPage,
            'progress' => $progress,
            'last_modified' => now(),
        ]);

        // Auto-finish book if progress reaches 100%
        $autoFinished = false;
        if ($progress >= 100 && $book->status !== 'finished') {
            $autoFinished = true;
            $readDates = $book->read_dates ?? [];
            $today = now()->format('Y-m-d');
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
            $this->createTimelineEvent($book, 'finished', 'Finished reading');
        }

        $freshBook = $book->fresh();

        if ($autoFinished) {
            BookFinished::dispatch($freshBook);
        }

        return $freshBook;
    }

    /**
     * Get book with reading session statistics
     */
    public function getBookWithSessionStats(string $bookId, string $userId): Book
    {
        $book = $this->getBook($bookId, $userId);

        $readingSessionService = app(ReadingSessionService::class);
        $sessionStats = $readingSessionService->getBookStatistics($book, $userId);

        // Add session statistics to book data
        $book->setAttribute('session_stats', $sessionStats);

        return $book;
    }
}
