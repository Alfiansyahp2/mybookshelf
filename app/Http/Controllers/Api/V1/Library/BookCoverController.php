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

        $url = $this->bookService->uploadCover(
            $book,
            $request->file('cover'),
            $request->getSchemeAndHttpHost()
        );

        return response()->success(['cover_image' => $url], 'Cover uploaded successfully');
    }
}
