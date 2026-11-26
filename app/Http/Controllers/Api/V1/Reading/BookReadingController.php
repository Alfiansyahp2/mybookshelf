<?php

namespace App\Http\Controllers\Api\V1\Reading;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Reading\EndBookReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\PauseReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\StartBookReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\UpdateBookProgressRequest;
use App\Http\Resources\Api\V1\Library\BookResource;
use App\Http\Resources\Api\V1\Reading\ReadingSessionResource;
use App\Models\Book;
use App\Models\ReadingSession;
use App\Services\Library\BookService;
use App\Services\Reading\ReadingSessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class BookReadingController extends Controller
{
    public function __construct(
        private BookService $bookService,
        private ReadingSessionService $readingSessionService
    ) {}

    /**
     * Start reading a book.
     */
    public function start(Request $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->startReading($book->id, $request->user()->id);

        return response()->success(new BookResource($updatedBook), 'Started reading book');
    }

    /**
     * Finish reading a book.
     */
    public function finish(Request $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->finishReading($book->id, $request->user()->id);

        return response()->success(new BookResource($updatedBook), 'Finished reading book');
    }

    /**
     * Update reading progress by current page.
     */
    public function updateProgress(UpdateBookProgressRequest $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->updateProgress(
            $book->id,
            $request->validated('current_page'),
            $request->user()->id
        );

        return response()->success(new BookResource($updatedBook), 'Progress updated successfully');
    }

    /**
     * Restart a finished book cleanly while preserving read history.
     */
    public function readAgain(Request $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->readAgain($book->id, $request->user()->id);

        return response()->success(new BookResource($updatedBook), 'Book restarted successfully');
    }

    /**
     * Start a timed reading session for a book.
     */
    public function startSession(StartBookReadingSessionRequest $request, Book $book): JsonResponse
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

        return response()->success(
            new ReadingSessionResource($session->load('book')),
            'Reading session started successfully',
            Response::HTTP_CREATED
        );
    }

    /**
     * Pause or resume an active reading session for a book.
     */
    public function pauseSession(PauseReadingSessionRequest $request, Book $book, ReadingSession $session): JsonResponse
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

        return response()->success(
            new ReadingSessionResource($updatedSession->load('book')),
            'Reading session pause status updated'
        );
    }

    /**
     * End an active reading session for a book and sync book progress.
     */
    public function endSession(EndBookReadingSessionRequest $request, Book $book, ReadingSession $session): JsonResponse
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

        return response()->success(
            new ReadingSessionResource($updatedSession->load('book')),
            'Reading session ended successfully'
        );
    }

    /**
     * Get reading sessions and reading statistics for a book.
     */
    public function getSessions(Request $request, Book $book): JsonResponse
    {
        Gate::authorize('view', $book);

        $userId = $request->user()->id;
        $sessions = $this->readingSessionService->getBookSessions($book, $userId);
        $statistics = $this->readingSessionService->getBookStatistics($book, $userId);

        return response()->success([
            'sessions' => ReadingSessionResource::collection($sessions),
            'statistics' => $statistics,
        ], 'Reading sessions retrieved successfully');
    }
}
