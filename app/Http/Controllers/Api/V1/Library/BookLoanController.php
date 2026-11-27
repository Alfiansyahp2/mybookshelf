<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Library\BorrowBookRequest;
use App\Http\Resources\Api\V1\Library\BookResource;
use App\Models\Book;
use App\Services\Library\BookLoanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class BookLoanController extends Controller
{
    public function __construct(
        private BookLoanService $bookLoanService
    ) {}

    /**
     * Mark a book as borrowed to someone.
     */
    public function borrow(BorrowBookRequest $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $data = $request->validated();
        $updatedBook = $this->bookLoanService->borrow(
            $book,
            $data['borrowed_by'],
            $data['due_date']
        );

        return response()->success(new BookResource($updatedBook), 'Book borrowed successfully');
    }

    /**
     * Mark a borrowed book as returned.
     */
    public function returnBook(Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        $updatedBook = $this->bookLoanService->returnBook($book);

        return response()->success(new BookResource($updatedBook), 'Book returned successfully');
    }
}
