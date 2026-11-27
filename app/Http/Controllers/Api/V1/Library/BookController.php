<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\DataTransferObjects\Library\BookFilterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Library\BookIndexRequest;
use App\Http\Requests\Api\V1\Library\MoveBookToShelfRequest;
use App\Http\Requests\Api\V1\Library\StoreBookRequest;
use App\Http\Requests\Api\V1\Library\UpdateBookNotesRequest;
use App\Http\Requests\Api\V1\Library\UpdateBookRatingRequest;
use App\Http\Requests\Api\V1\Library\UpdateBookRequest;
use App\Http\Resources\Api\V1\Library\BookCollection;
use App\Http\Resources\Api\V1\Library\BookResource;
use App\Models\Book;
use App\Services\Library\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class BookController extends Controller
{
    public function __construct(
        private BookService $bookService
    ) {}

    /**
     * Display a listing of books.
     */
    public function index(BookIndexRequest $request): JsonResponse
    {
        $filters = BookFilterData::fromRequest($request);

        $books = $this->bookService->getAllBooks($filters, true, $request->user()->id);

        return response()->success(new BookCollection($books), 'Books retrieved successfully');
    }

    /**
     * Store a newly created book.
     */
    public function store(StoreBookRequest $request): JsonResponse
    {
        Gate::authorize('create', Book::class);

        $book = $this->bookService->createBook($request->validated(), $request->user()->id);

        return response()->success(new BookResource($book), 'Book created successfully', Response::HTTP_CREATED);
    }

    /**
     * Display the specified book.
     */
    public function show(Book $book): JsonResponse
    {
        Gate::authorize('view', $book);

        return response()->success(
            new BookResource($book->load(['shelf', 'collections'])),
            'Book retrieved successfully'
        );
    }

    /**
     * Update the specified book.
     */
    public function update(UpdateBookRequest $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->updateBook(
            $book->id,
            $request->normalizedPayload(),
            $request->user()->id
        );

        return response()->success(new BookResource($updatedBook), 'Book updated successfully');
    }

    /**
     * Remove the specified book (soft delete).
     */
    public function destroy(Request $request, Book $book): JsonResponse
    {
        Gate::authorize('delete', $book);

        $this->bookService->deleteBook($book->id, $request->user()->id);

        return response()->success(null, 'Book deleted successfully');
    }

    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(Request $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->toggleFavorite($book->id, $request->user()->id);

        return response()->success(new BookResource($updatedBook), 'Favorite status updated');
    }

    /**
     * Update personal notes.
     */
    public function updateNotes(UpdateBookNotesRequest $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->updateNotes(
            $book->id,
            $request->validated('notes'),
            $request->user()->id
        );

        return response()->success(new BookResource($updatedBook), 'Notes updated successfully');
    }

    /**
     * Update personal rating.
     */
    public function updateRating(UpdateBookRatingRequest $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookService->updateRating(
            $book->id,
            $request->validated('rating'),
            $request->user()->id
        );

        return response()->success(new BookResource($updatedBook), 'Rating updated successfully');
    }

    /**
     * Move book to a different shelf.
     */
    public function moveToShelf(MoveBookToShelfRequest $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $data = $request->validated();
        $updatedBook = $this->bookService->moveToShelf(
            $book->id,
            $data['shelf_id'],
            $data['position'] ?? null,
            $request->user()->id
        );

        return response()->success(new BookResource($updatedBook), 'Book moved to shelf successfully');
    }
}
