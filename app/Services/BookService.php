<?php

namespace App\Services;

use App\Models\Book;
use App\Models\TimelineEvent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookService
{
    /**
     * Get all books with filtering and pagination
     */
    public function getAllBooks($filters = [], $withPagination = true, $userId = null)
    {
        $query = Book::with(['shelf', 'shelf.room', 'collections']);

        // SECURITY: Filter by user_id - only show books belonging to authenticated user
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['favorite']) && $filters['favorite']) {
            $query->where('favorite', true);
        }

        if (isset($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'ilike', "%{$searchTerm}%")
                  ->orWhere('author', 'ilike', "%{$searchTerm}%")
                  ->orWhere('genre', 'ilike', "%{$searchTerm}%")
                  ->orWhere('isbn', 'ilike', "%{$searchTerm}%");
            });
        }

        // Order by latest modified first
        $query->orderBy('last_modified', 'desc');

        if ($withPagination) {
            return $query->paginate(15);
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
        $query = Book::with(['shelf', 'shelf.room', 'collections', 'readingSessions', 'timelineEvents']);

        // SECURITY: Filter by user_id if provided
        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->findOrFail($id);
    }

    /**
     * Update book
     */
    public function updateBook($id, array $data, $userId = null)
    {
        $query = Book::query();

        // SECURITY: Filter by user_id if provided
        if ($userId) {
            $query->where('user_id', $userId);
        }

        $book = $query->findOrFail($id);

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
    public function deleteBook($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();
        return true;
    }

    /**
     * Start reading a book
     */
    public function startReading($id)
    {
        $book = Book::findOrFail($id);

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
    public function finishReading($id)
    {
        $book = Book::findOrFail($id);

        $book->update([
            'status' => 'finished',
            'finished_date' => now(),
            'current_page' => $book->pages,
            'progress' => 100.0,
            'last_modified' => now(),
        ]);

        // Create timeline event
        $this->createTimelineEvent($book, 'finished', 'Finished reading');

        // Update collection progresses
        $this->updateRelatedCollectionProgress($book);

        return $book->fresh();
    }

    /**
     * Update reading progress
     */
    public function updateProgress($id, $currentPage)
    {
        $book = Book::findOrFail($id);

        $progress = $this->calculateProgress($currentPage, $book->pages);

        $book->update([
            'current_page' => $currentPage,
            'progress' => $progress,
            'last_modified' => now(),
        ]);

        // Create milestone timeline events
        $this->checkProgressMilestones($book, $progress);

        return $book->fresh();
    }

    /**
     * Toggle favorite status
     */
    public function toggleFavorite($id)
    {
        $book = Book::findOrFail($id);

        $book->update([
            'favorite' => !$book->favorite,
            'last_modified' => now(),
        ]);

        if ($book->favorite) {
            $this->createTimelineEvent($book, 'favorited', 'Marked as favorite');
        }

        return $book->fresh();
    }

    /**
     * Update personal notes
     */
    public function updateNotes($id, $notes)
    {
        $book = Book::findOrFail($id);

        $book->update([
            'personal_notes' => $notes,
            'last_modified' => now(),
        ]);

        return $book->fresh();
    }

    /**
     * Update personal rating
     */
    public function updateRating($id, $rating)
    {
        $book = Book::findOrFail($id);

        $book->update([
            'personal_rating' => $rating,
            'last_modified' => now(),
        ]);

        return $book->fresh();
    }

    /**
     * Move book to different shelf
     */
    public function moveToShelf($id, $shelfId, $position = null)
    {
        $book = Book::findOrFail($id);

        $data = ['shelf_id' => $shelfId];

        if ($position !== null) {
            $data['position'] = $position;
        }

        $book->update($data);

        return $book->fresh()->load('shelf');
    }

    /**
     * Borrow book to someone
     */
    public function borrowBook($id, $borrowedBy, $dueDate)
    {
        $book = Book::findOrFail($id);

        $book->update([
            'status' => 'borrowed',
            'borrowed_by' => $borrowedBy,
            'borrowed_date' => now(),
            'due_date' => $dueDate,
            'is_returned' => false,
            'last_modified' => now(),
        ]);

        // Create timeline event
        $this->createTimelineEvent($book, 'loaned', "Loaned to {$borrowedBy}");

        return $book->fresh();
    }

    /**
     * Return borrowed book
     */
    public function returnBook($id)
    {
        $book = Book::findOrFail($id);

        // Store previous status
        $previousStatus = 'unread'; // Default if not reading/finished
        if ($book->progress > 0 && $book->progress < 100) {
            $previousStatus = 'reading';
        } elseif ($book->progress >= 100) {
            $previousStatus = 'finished';
        }

        $book->update([
            'status' => $previousStatus,
            'borrowed_by' => null,
            'borrowed_date' => null,
            'due_date' => null,
            'is_returned' => true,
            'last_modified' => now(),
        ]);

        // Create timeline event
        $this->createTimelineEvent($book, 'returned', 'Book returned');

        return $book->fresh();
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

            // Create timeline event for restarting
            $this->createTimelineEvent($book, 'restarted', 'Started reading again');

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
        $book = Book::where('user_id', $userId)->findOrFail($bookId);

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
        if ($progress >= 100 && $book->status !== 'finished') {
            $book->update([
                'status' => 'finished',
                'finished_date' => now(),
            ]);

            // Create timeline event for finishing
            $this->createTimelineEvent($book, 'finished', 'Finished reading');
        }

        return $book->fresh();
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
