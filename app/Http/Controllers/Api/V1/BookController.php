<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\BookService;
use App\Services\ReadingSessionService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BookController extends Controller
{
    protected BookService $bookService;
    protected ReadingSessionService $readingSessionService;

    public function __construct(BookService $bookService, ReadingSessionService $readingSessionService)
    {
        $this->bookService = $bookService;
        $this->readingSessionService = $readingSessionService;
    }

    /**
     * Display a listing of books.
     */
    public function index(Request $request)
    {
        $filters = [
            'status' => $request->query('status'),
            'favorite' => $request->query('favorite'),
            'search' => $request->query('search'),
        ];

        // SECURITY: Pass authenticated user ID to filter their books only
        $userId = $request->user()->id;
        $books = $this->bookService->getAllBooks($filters, true, $userId);

        return response()->success($books, 'Books retrieved successfully');
    }

    /**
     * Store a newly created book.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:50',
            'genre' => 'nullable|string|max:100',
            'language' => 'nullable|string|max:50',
            'publisher' => 'nullable|string|max:255',
            'publish_year' => 'nullable|integer|min:1000|max:2999',
            'pages' => 'nullable|integer|min:1',
            'format' => 'nullable|in:hardcover,paperback,ebook,audiobook',
            'spine_color_light' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'spine_color_medium' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'spine_color_dark' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'height' => 'nullable|in:short,medium,tall',
            'thickness' => 'nullable|in:thin,regular,thick',
            'status' => 'nullable|in:unread,reading,finished,wishlist,borrowed',
            'favorite' => 'nullable|boolean',
            'current_page' => 'nullable|integer|min:0',
            'progress' => 'nullable|numeric|between:0,100',
            'started_date' => 'nullable|date',
            'finished_date' => 'nullable|date|after:started_date',
            'personal_notes' => 'nullable|string',
            'personal_rating' => 'nullable|numeric|between:0,5',
            'read_dates' => 'nullable|array',
            'read_dates.*' => 'date',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric|min:0',
            'purchase_currency' => 'nullable|string|size:3',
            'is_gift' => 'nullable|boolean',
            'purchase_location' => 'nullable|string|max:255',
            'shelf_id' => 'nullable|exists:shelves,id',
            'position' => 'nullable|integer|min:0',
        ]);

        $book = $this->bookService->createBook($data, $request->user()->id);

        return response()->success($book, 'Book created successfully', Response::HTTP_CREATED);
    }

    /**
     * Display the specified book.
     */
    public function show(Request $request, $id)
    {
        // SECURITY: Pass user ID to service for filtering
        $book = $this->bookService->getBook($id, $request->user()->id);

        return response()->success($book, 'Book retrieved successfully');
    }

    /**
     * Update the specified book.
     */
    public function update(Request $request, $id)
    {
        // SECURITY: Pass user ID to service for filtering
        $book = $this->bookService->getBook($id, $request->user()->id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'author' => 'sometimes|string|max:255',
            'isbn' => 'sometimes|string|max:50',
            'genre' => 'nullable|string|max:100',
            'language' => 'nullable|string|max:50',
            'publisher' => 'nullable|string|max:255',
            'publish_year' => 'nullable|integer|min:1000|max:2999',
            'pages' => 'nullable|integer|min:1',
            'format' => 'nullable|in:hardcover,paperback,ebook,audiobook',
            'spine_color_light' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'spine_color_medium' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'spine_color_dark' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'height' => 'nullable|in:short,medium,tall',
            'thickness' => 'nullable|in:thin,regular,thick',
            'status' => 'nullable|in:unread,reading,finished,wishlist,borrowed',
            'favorite' => 'nullable|boolean',
            'current_page' => 'nullable|integer|min:0',
            'progress' => 'nullable|numeric|between:0,100',
            'started_date' => 'nullable|date',
            'finished_date' => 'nullable|date|after:started_date',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric|min:0',
            'purchase_currency' => 'nullable|string|size:3',
            'is_gift' => 'nullable|boolean',
            'purchase_location' => 'nullable|string|max:255',
            'personal_notes' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'notes' => 'nullable|string',
            'read_dates' => 'nullable|array',
            'read_dates.*' => 'date',
            'shelf_id' => 'nullable|exists:shelves,id',
        ]);

        // SECURITY: Pass user ID to service for filtering
        $book = $this->bookService->updateBook($id, $data, $request->user()->id);

        return response()->success($book, 'Book updated successfully');
    }

    /**
     * Remove the specified book (soft delete).
     */
    public function destroy($id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $this->bookService->deleteBook($id);

        return response()->success(null, 'Book deleted successfully');
    }

    /**
     * Start reading a book.
     */
    public function start($id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $updatedBook = $this->bookService->startReading($id);

        return response()->success($updatedBook, 'Started reading book');
    }

    /**
     * Finish reading a book.
     */
    public function finish($id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $updatedBook = $this->bookService->finishReading($id);

        return response()->success($updatedBook, 'Finished reading book');
    }

    /**
     * Update reading progress.
     */
    public function updateProgress(Request $request, $id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $data = $request->validate([
            'current_page' => 'required|integer|min:0',
        ]);

        $updatedBook = $this->bookService->updateProgress($id, $data['current_page']);

        return response()->success($updatedBook, 'Progress updated successfully');
    }

    /**
     * Toggle favorite status.
     */
    public function toggleFavorite($id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $updatedBook = $this->bookService->toggleFavorite($id);

        return response()->success($updatedBook, 'Favorite status updated');
    }

    /**
     * Update personal notes.
     */
    public function updateNotes(Request $request, $id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $data = $request->validate([
            'notes' => 'required|string',
        ]);

        $updatedBook = $this->bookService->updateNotes($id, $data['notes']);

        return response()->success($updatedBook, 'Notes updated successfully');
    }

    /**
     * Update personal rating.
     */
    public function updateRating(Request $request, $id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $data = $request->validate([
            'rating' => 'required|numeric|between:0,5',
        ]);

        $updatedBook = $this->bookService->updateRating($id, $data['rating']);

        return response()->success($updatedBook, 'Rating updated successfully');
    }

    /**
     * Move book to different shelf.
     */
    public function moveToShelf(Request $request, $id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $data = $request->validate([
            'shelf_id' => 'required|exists:shelves,id',
            'position' => 'nullable|integer|min:0',
        ]);

        $updatedBook = $this->bookService->moveToShelf($id, $data['shelf_id'], $data['position'] ?? null);

        return response()->success($updatedBook, 'Book moved to shelf successfully');
    }

    /**
     * Borrow book to someone.
     */
    public function borrow(Request $request, $id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $data = $request->validate([
            'borrowed_by' => 'required|string|max:255',
            'due_date' => 'required|date|after:today',
        ]);

        $updatedBook = $this->bookService->borrowBook($id, $data['borrowed_by'], $data['due_date']);

        return response()->success($updatedBook, 'Book borrowed successfully');
    }

    /**
     * Return borrowed book.
     */
    public function returnBook($id)
    {
        $book = $this->bookService->getBook($id);

        // Check ownership
        if ($book->user_id !== auth()->id()) {
            return response()->error('Unauthorized', null, Response::HTTP_FORBIDDEN);
        }

        $updatedBook = $this->bookService->returnBook($id);

        return response()->success($updatedBook, 'Book returned successfully');
    }

    /**
     * Start a reading session for a book.
     */
    public function startReadingSession(Request $request, $id)
    {
        $book = $this->bookService->getBook($id, $request->user()->id);

        $data = $request->validate([
            'start_page' => 'required|integer|min:0',
            'mood' => 'nullable|in:great,good,okay,difficult',
            'location' => 'nullable|string|max:255',
        ]);

        // Check if there's an active session
        if ($this->readingSessionService->hasActiveSession($book, $request->user()->id)) {
            return response()->error('You have an active reading session for this book', null, Response::HTTP_CONFLICT);
        }

        $session = $this->readingSessionService->startSession(
            $book,
            $request->user()->id,
            $data['start_page'],
            $data['mood'] ?? null,
            $data['location'] ?? null
        );

        return response()->success($session->load('book'), 'Reading session started successfully', Response::HTTP_CREATED);
    }

    /**
     * End a reading session.
     */
    public function endReadingSession(Request $request, $id, $sessionId)
    {
        $book = $this->bookService->getBook($id, $request->user()->id);

        $data = $request->validate([
            'end_page' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $session = $this->readingSessionService->getActiveSession($book, $request->user()->id);

        if (!$session) {
            return response()->error('No active reading session found', null, Response::HTTP_NOT_FOUND);
        }

        if ($session->id !== $sessionId) {
            return response()->error('Session ID mismatch', null, Response::HTTP_BAD_REQUEST);
        }

        $updatedSession = $this->readingSessionService->endSession(
            $session,
            $data['end_page'],
            $data['notes'] ?? null
        );

        // Sync book progress with the completed session
        $this->bookService->syncProgressFromSessions($book->id, $request->user()->id);

        return response()->success($updatedSession->load('book'), 'Reading session ended successfully');
    }

    /**
     * Get reading sessions for a book.
     */
    public function getBookReadingSessions(Request $request, $id)
    {
        $book = $this->bookService->getBook($id, $request->user()->id);

        $sessions = $this->readingSessionService->getBookSessions($book, $request->user()->id);
        $statistics = $this->readingSessionService->getBookStatistics($book, $request->user()->id);

        return response()->success([
            'sessions' => $sessions,
            'statistics' => $statistics,
        ], 'Reading sessions retrieved successfully');
    }

    /**
     * Read Again - Restart a finished book.
     */
    public function readAgain(Request $request, $id)
    {
        $updatedBook = $this->bookService->readAgain($id, $request->user()->id);

        return response()->success($updatedBook, 'Book restarted successfully');
    }
}
