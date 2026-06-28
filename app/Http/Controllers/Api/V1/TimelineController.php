<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TimelineEvent;
use Illuminate\Http\Request;

class TimelineController extends Controller
{
    /**
     * Get timeline events for a specific book.
     */
    public function bookTimeline(Request $request, $book)
    {
        // SECURITY: Verify user owns the book before showing timeline
        $book = \App\Models\Book::where('id', $book)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $events = TimelineEvent::where('book_id', $book->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->success($events, 'Timeline events retrieved successfully');
    }
}
