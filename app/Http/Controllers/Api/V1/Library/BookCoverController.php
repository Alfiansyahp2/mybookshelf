<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Library\UploadBookCoverRequest;
use App\Models\Book;
use App\Services\Library\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class BookCoverController extends Controller
{
    public function __construct(
        private BookService $bookService
    ) {}

    /**
     * Upload or replace book cover image.
     */
    public function __invoke(UploadBookCoverRequest $request, Book $book): JsonResponse
    {
        Gate::authorize('update', $book);

        try {
            $url = $this->bookService->uploadCover($book, $request->file('cover'));
        } catch (\InvalidArgumentException $e) {
            return response()->error($e->getMessage(), ['cover' => [$e->getMessage()]], 422);
        }

        return response()->success([
            'cover_image' => $url,
            'cover_key' => $book->fresh()?->cover_image,
        ], 'Cover uploaded successfully');
    }
}
