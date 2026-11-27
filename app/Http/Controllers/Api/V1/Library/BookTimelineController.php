<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Library\TimelineEventResource;
use App\Models\Book;
use App\Models\TimelineEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class BookTimelineController extends Controller
{
    /**
     * Get timeline events for a specific book.
     */
    public function __invoke(Book $book): JsonResponse
    {
        Gate::authorize('view', $book);

        $events = TimelineEvent::where('book_id', $book->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->success(
            TimelineEventResource::collection($events),
            'Timeline events retrieved successfully'
        );
    }
}
