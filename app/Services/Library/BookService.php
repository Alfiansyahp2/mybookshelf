<?php

namespace App\Services\Library;

use App\DataTransferObjects\Library\BookFilterData;
use App\Events\BookFinished;
use App\Models\Book;
use App\Models\TimelineEvent;
use App\Services\Analytics\AchievementService;
use App\Services\Reading\ReadingSessionService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BookService
{
    /**
     * Get all books with filtering and pagination
     *
     * @param  array<string, mixed>|BookFilterData  $filters
     */
    public function getAllBooks(array|BookFilterData $filters = [], bool $withPagination = true, ?string $userId = null)
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
     */
    public function createBook(array $data, $userId)
    {
        DB::beginTransaction();
        try {
            // Generate UUID
            $data['id'] = Str::uuid()->toString();
            $data['user_id'] = $userId;

            // Set default values
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
    public function getBook($id, $userId = null)
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
     */
    public function updateBook($id, array $data, $userId = null)
    {
        $book = $this->findOwnedBook($id, $userId);

        // Update last_modified timestamp
        $data['last_modified'] = now();

        // Recalculate progress if pages or current_page changed
        if (isset($data['current_page']) && isset($data['pages'])) {
            $data['progress'] = $this->calculateProgress($data['current_page'], $data['pages']);
        }

        $book->update($data);

        return $book->fresh()->load(['shelf', 'collections']);
    }

    /**
     * Delete book (soft delete)
     */
    public function deleteBook($id, $userId = null)
    {
        $book = $this->findOwnedBook($id, $userId);
        $book->delete();

        return true;
    }

    /**
     * Start reading a book
     */
    public function startReading($id, $userId = null)
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
    public function finishReading($id, $userId = null)
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
    public function updateProgress($id, $currentPage, $userId = null)
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
    public function toggleFavorite($id, $userId = null)
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
    public function updateNotes($id, $notes, $userId = null)
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
    public function updateRating($id, $rating, $userId = null)
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
    public function moveToShelf($id, $shelfId, $position = null, $userId = null)
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
     * Store or replace a book cover image on the public disk and update cover_image URL.
     */
    public function uploadCover(Book $book, UploadedFile $file, string $baseUrl): string
    {
        if ($book->cover_image) {
            $filename = basename(parse_url($book->cover_image, PHP_URL_PATH) ?: '');
            if ($filename && $filename !== 'book-covers') {
                $oldPath = 'book-covers/'.$filename;
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
        }

        // SECURITY: Use extension() which guesses based on MIME type rather than client filename.
        $extension = $file->extension() ?: 'jpg';
        $filename = 'book_'.$book->id.'_'.time().'.'.$extension;
        $file->storeAs('book-covers', $filename, 'public');

        $url = rtrim($baseUrl, '/').'/storage/book-covers/'.$filename;
        $book->update(['cover_image' => $url]);

        return $url;
    }

    /**
     * Calculate progress percentage
     */
    protected function calculateProgress($currentPage, $totalPages)
    {
        if ($totalPages <= 0) {
            return 0;
        }

        return round(($currentPage / $totalPages) * 100, 2);
    }

    /**
     * Create timeline event
     */
    public function createTimelineEvent(Book $book, $type, $description)
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
    protected function checkProgressMilestones(Book $book, $newProgress)
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
    protected function updateRelatedCollectionProgress(Book $book)
    {
        foreach ($book->collections as $collection) {
            $collection->updateProgress();
        }
    }

    /**
     * Read Again - Restart a finished book
     */
    public function readAgain($id, $userId = null)
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
    public function syncProgressFromSessions($bookId, $userId)
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
    public function getBookWithSessionStats($bookId, $userId)
    {
        $book = $this->getBook($bookId, $userId);

        $readingSessionService = app(ReadingSessionService::class);
        $sessionStats = $readingSessionService->getBookStatistics($book, $userId);

        // Add session statistics to book data
        $book->session_stats = $sessionStats;

        return $book;
    }
}
