<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\TimelineEvent;
use Illuminate\Support\Facades\Gate;

class TimelineController extends Controller
{
    /**
     * Get timeline events for a specific book.
     */
    public function bookTimeline(Book $book)
    {
        Gate::authorize('view', $book);

        $events = TimelineEvent::where('book_id', $book->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->success($events, 'Timeline events retrieved successfully');
    }
}
