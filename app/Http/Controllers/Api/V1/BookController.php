<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Library\BookIndexRequest;
use App\Http\Requests\Api\V1\Library\BorrowBookRequest;
use App\Http\Requests\Api\V1\Library\MoveBookToShelfRequest;
use App\Http\Requests\Api\V1\Library\StoreBookRequest;
use App\Http\Requests\Api\V1\Library\UpdateBookNotesRequest;
use App\Http\Requests\Api\V1\Library\UpdateBookRatingRequest;
use App\Http\Requests\Api\V1\Library\UpdateBookRequest;
use App\Http\Requests\Api\V1\Library\UploadBookCoverRequest;
use App\Http\Requests\Api\V1\Reading\EndBookReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\PauseReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\StartBookReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\UpdateBookProgressRequest;
use App\Models\Book;
use App\Models\ReadingSession;
use App\Services\BookService;
use App\Services\ReadingSessionService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

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
    public function index(BookIndexRequest $request)
    {
        $filters = [
            'status' => $request->query('status'),
            'favorite' => $request->query('favorite'),
            'search' => $request->query('search'),
        ];

        $books = $this->bookService->getAllBooks($filters, false, $request->user()->id);

        return response()->success($books, 'Books retrieved successfully');
    }

    /**
     * Store a newly created book.
     */
    public function store(StoreBookRequest $request)
    {
        Gate::authorize('create', Book::class);

        $book = $this->bookService->createBook($request->validated(), $request->user()->id);

        return response()->success($book, 'Book created successfully', Response::HTTP_CREATED);
    }

    /**
     * Display the specified book.
     */
    public function show(Book $book)
    {
        Gate::authorize('view', $book);

        return response()->success($book->load(['shelf', 'collections']), 'Book retrieved successfully');
    }

    /**
     * Update the specified book.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->updateBook(
            $book->id,
            $request->normalizedPayload(),
            $request->user()->id
        );

        return response()->success($updatedBook, 'Book updated successfully');
    }

    /**
     * Upload or replace book cover image.
     */
    public function uploadCover(UploadBookCoverRequest $request, Book $book)
    {
        Gate::authorize('update', $book);

        // Delete old cover from public disk if exists
        if ($book->cover_image) {
            $filename = basename(parse_url($book->cover_image, PHP_URL_PATH) ?: '');
            if ($filename && $filename !== 'book-covers') {
                $oldPath = 'book-covers/'.$filename;
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
        }

        // Store new cover in book-covers folder on public disk
        $file = $request->file('cover');
        // SECURITY: Use extension() which guesses based on MIME type rather than getClientOriginalExtension()
        $extension = $file->extension() ?: 'jpg';
        $filename = 'book_'.$book->id.'_'.time().'.'.$extension;
        $file->storeAs('book-covers', $filename, 'public');

        $url = request()->getSchemeAndHttpHost().'/storage/book-covers/'.$filename;
        $book->update(['cover_image' => $url]);

        return response()->success(['cover_image' => $url], 'Cover uploaded successfully');
    }

    /**
     * Remove the specified book (soft delete).
     */
    public function destroy(Request $request, Book $book)
    {
        Gate::authorize('delete', $book);

        $this->bookService->deleteBook($book->id, $request->user()->id);

        return response()->success(null, 'Book deleted successfully');
    }

    /**
     * Start reading a book.
     */
    public function start(Request $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->startReading($book->id, $request->user()->id);

        return response()->success($updatedBook, 'Started reading book');
    }

    /**
     * Finish reading a book.
     */
    public function finish(Request $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->finishReading($book->id, $request->user()->id);

        return response()->success($updatedBook, 'Finished reading book');
    }

    /**
     * Update reading progress.
     */
    public function updateProgress(UpdateBookProgressRequest $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->updateProgress(
            $book->id,
            $request->validated('current_page'),
            $request->user()->id
        );

        return response()->success($updatedBook, 'Progress updated successfully');
    }

    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(Request $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->toggleFavorite($book->id, $request->user()->id);

        return response()->success($updatedBook, 'Favorite status updated');
    }

    /**
     * Update personal notes.
     */
    public function updateNotes(UpdateBookNotesRequest $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->updateNotes(
            $book->id,
            $request->validated('notes'),
            $request->user()->id
        );

        return response()->success($updatedBook, 'Notes updated successfully');
    }

    /**
     * Update personal rating.
     */
    public function updateRating(UpdateBookRatingRequest $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->updateRating(
            $book->id,
            $request->validated('rating'),
            $request->user()->id
        );

        return response()->success($updatedBook, 'Rating updated successfully');
    }

    /**
     * Move book to different shelf.
     */
    public function moveToShelf(MoveBookToShelfRequest $request, Book $book)
    {
        Gate::authorize('update', $book);

        $data = $request->validated();
        $updatedBook = $this->bookService->moveToShelf(
            $book->id,
            $data['shelf_id'],
            $data['position'] ?? null,
            $request->user()->id
        );

        return response()->success($updatedBook, 'Book moved to shelf successfully');
    }

    /**
     * Borrow book to someone.
     */
    public function borrow(BorrowBookRequest $request, Book $book)
    {
        Gate::authorize('update', $book);

        $data = $request->validated();
        $updatedBook = $this->bookService->borrowBook(
            $book->id,
            $data['borrowed_by'],
            $data['due_date'],
            $request->user()->id
        );

        return response()->success($updatedBook, 'Book borrowed successfully');
    }

    /**
     * Return borrowed book.
     */
    public function returnBook(Request $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->returnBook($book->id, $request->user()->id);

        return response()->success($updatedBook, 'Book returned successfully');
    }

    /**
     * Start a reading session for a book.
     */
    public function startReadingSession(StartBookReadingSessionRequest $request, Book $book)
    {
        Gate::authorize('update', $book);

        $userId = $request->user()->id;
        $data = $request->validated();

        if ($this->readingSessionService->hasActiveSession($book, $userId)) {
            return response()->error('You have an active reading session for this book', null, Response::HTTP_CONFLICT);
        }

        $session = $this->readingSessionService->startSession(
            $book,
            $userId,
            $data['start_page'],
            $data['mood'] ?? null,
            $data['location'] ?? null
        );

        return response()->success($session->load('book'), 'Reading session started successfully', Response::HTTP_CREATED);
    }

    /**
     * Pause or resume the active reading session.
     */
    public function pauseReadingSession(PauseReadingSessionRequest $request, Book $book, ReadingSession $session)
    {
        Gate::authorize('update', $book);
        Gate::authorize('update', $session);

        abort_unless($session->book_id === $book->id, 404);

        try {
            $updatedSession = $this->readingSessionService->togglePause(
                $session,
                $request->validated('is_paused')
            );
        } catch (\InvalidArgumentException $e) {
            return response()->error($e->getMessage(), null, 400);
        }

        return response()->success($updatedSession->load('book'), 'Reading session pause status updated');
    }

    /**
     * End a reading session.
     */
    public function endReadingSession(EndBookReadingSessionRequest $request, Book $book, ReadingSession $session)
    {
        Gate::authorize('update', $book);
        Gate::authorize('update', $session);

        abort_unless($session->book_id === $book->id, 404);

        $data = $request->validated();

        try {
            $updatedSession = $this->readingSessionService->endSession(
                $session,
                $data['end_page'],
                $data['notes'] ?? null
            );
        } catch (\InvalidArgumentException $e) {
            return response()->error($e->getMessage(), null, 400);
        }

        $this->bookService->syncProgressFromSessions($book->id, $request->user()->id);

        return response()->success($updatedSession->load('book'), 'Reading session ended successfully');
    }

    /**
     * Get reading sessions for a book.
     */
    public function getBookReadingSessions(Request $request, Book $book)
    {
        Gate::authorize('view', $book);

        $userId = $request->user()->id;
        $sessions = $this->readingSessionService->getBookSessions($book, $userId);
        $statistics = $this->readingSessionService->getBookStatistics($book, $userId);

        return response()->success([
            'sessions' => $sessions,
            'statistics' => $statistics,
        ], 'Reading sessions retrieved successfully');
    }

    /**
     * Read Again - Restart a finished book.
     */
    public function readAgain(Request $request, Book $book)
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->readAgain($book->id, $request->user()->id);

        return response()->success($updatedBook, 'Book restarted successfully');
    }

    /**
     * Get expenses for a specific book.
     */
    public function getExpenses(Book $book)
    {
        Gate::authorize('view', $book);

        try {
            $expenses = $book->expenses()->with(['category'])->get();

            return response()->success($expenses, 'Book expenses retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BookController::getExpenses failed');
        }
    }

    /**
     * Get cost breakdown for a specific book.
     */
    public function getCostBreakdown(Book $book)
    {
        Gate::authorize('view', $book);

        try {
            $breakdown = [
                'book_id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'purchase_price' => $book->purchase_price,
                'purchase_currency' => $book->purchase_currency,
                'purchase_date' => $book->purchase_date,
                'is_gift' => $book->is_gift,
                'purchase_location' => $book->purchase_location,
                'additional_expenses' => $book->getAdditionalExpenses(),
                'total_investment' => $book->getTotalInvestment(),
                'expense_count' => $book->expenses->count(),
                'expenses' => $book->expenses()->with(['category'])->get(),
                'formatted' => [
                    'purchase_price' => $book->purchase_price ? 'Rp '.number_format($book->purchase_price, 2, ',', '.') : 'Not set',
                    'additional_expenses' => 'Rp '.number_format($book->getAdditionalExpenses(), 2, ',', '.'),
                    'total_investment' => $book->getFormattedTotalInvestment(),
                ],
            ];

            return response()->success($breakdown, 'Book cost breakdown retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BookController::getCostBreakdown failed');
        }
    }

    /**
     * Get purchase history grouped by month.
     */
    public function getPurchaseHistory(Request $request)
    {
        try {
            $months = $request->query('months', 12);
            $userId = $request->user()->id;

            $books = Book::query()->where('user_id', $userId)
                ->whereNotNull('purchase_date')
                ->whereNotNull('purchase_price')
                ->orderBy('purchase_date', 'desc')
                ->get(['id', 'purchase_date', 'purchase_price', 'purchase_currency', 'title']);

            if ($books->isEmpty()) {
                return response()->success([], 'No purchase data available');
            }

            $purchaseHistory = [];
            $indonesianMonths = [
                'January' => 'Januari', 'February' => 'Februari', 'March' => 'Maret',
                'April' => 'April', 'May' => 'Mei', 'June' => 'Juni',
                'July' => 'Juli', 'August' => 'Agustus', 'September' => 'September',
                'October' => 'Oktober', 'November' => 'November', 'December' => 'Desember',
            ];

            foreach ($books as $book) {
                $monthKey = Carbon::parse($book->purchase_date)->format('Y-m');
                $englishMonthName = Carbon::parse($book->purchase_date)->format('F Y');
                $monthName = strtr($englishMonthName, $indonesianMonths);

                if (! isset($purchaseHistory[$monthKey])) {
                    $purchaseHistory[$monthKey] = [
                        'month' => $monthKey,
                        'month_name' => $monthName,
                        'total_amount' => 0,
                        'formatted_amount' => 'Rp 0',
                        'book_count' => 0,
                        'average_price' => 0,
                        'books' => [],
                    ];
                }

                $purchaseHistory[$monthKey]['book_count']++;
                $purchaseHistory[$monthKey]['books'][] = [
                    'id' => $book->id,
                    'title' => $book->title,
                    'purchase_price' => $book->purchase_price,
                    'purchase_currency' => $book->purchase_currency,
                    'purchase_date' => $book->purchase_date,
                ];

                $amountInIdr = $book->purchase_price;
                if ($book->purchase_currency === 'USD') {
                    $amountInIdr = $book->purchase_price * 15000;
                }

                $purchaseHistory[$monthKey]['total_amount'] += $amountInIdr;
            }

            foreach ($purchaseHistory as &$month) {
                if ($month['book_count'] > 0) {
                    $month['average_price'] = $month['total_amount'] / $month['book_count'];
                    $month['formatted_amount'] = 'Rp '.number_format($month['total_amount'], 0, ',', '.');
                }
            }

            ksort($purchaseHistory);

            $result = array_slice(array_values($purchaseHistory), -$months, $months);

            return response()->success($result, 'Purchase history retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BookController::getPurchaseHistory failed');
        }
    }
}
