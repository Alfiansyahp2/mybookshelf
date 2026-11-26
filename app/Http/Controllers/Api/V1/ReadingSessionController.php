<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Reading\PauseReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\StoreReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\UpdateReadingSessionRequest;
use App\Models\ReadingSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class ReadingSessionController extends Controller
{
    /**
     * Display a listing of reading sessions.
     */
    public function index(Request $request)
    {
        $sessions = ReadingSession::where('user_id', $request->user()->id)
            ->with('book')
            ->when($request->query('book_id'), fn ($q) => $q->where('book_id', $request->query('book_id')))
            ->orderBy('start_time', 'desc')
            ->get();

        return response()->success($sessions, 'Reading sessions retrieved successfully');
    }

    /**
     * Store a newly created reading session.
     */
    public function store(StoreReadingSessionRequest $request)
    {
        Gate::authorize('create', ReadingSession::class);

        $data = $request->validated();

        $session = ReadingSession::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $request->user()->id,
            'book_id' => $data['book_id'],
            'start_time' => $data['start_time'],
            'start_page' => $data['start_page'],
            'mood' => $data['mood'] ?? null,
            'location' => $data['location'] ?? null,
        ]);

        return response()->success($session->load('book'), 'Reading session created successfully', 201);
    }

    /**
     * Display the specified reading session.
     */
    public function show(ReadingSession $readingSession)
    {
        Gate::authorize('view', $readingSession);

        return response()->success($readingSession->load('book'), 'Reading session retrieved successfully');
    }

    /**
     * Pause the active reading session.
     */
    public function pause(PauseReadingSessionRequest $request, ReadingSession $readingSession)
    {
        Gate::authorize('update', $readingSession);

        if ($readingSession->end_time) {
            return response()->error('Cannot pause an already ended session', null, 400);
        }

        if ($request->validated('is_paused')) {
            if (! $readingSession->is_paused) {
                $readingSession->is_paused = true;
                $readingSession->last_paused_at = now();
            }
        } elseif ($readingSession->is_paused) {
            $readingSession->is_paused = false;
            if ($readingSession->last_paused_at) {
                $readingSession->paused_seconds += Carbon::parse($readingSession->last_paused_at)->diffInSeconds(now());
            }
        }

        $readingSession->save();

        return response()->success($readingSession->load('book'), 'Reading session pause status updated');
    }

    /**
     * Update the specified reading session (typically to end it).
     */
    public function update(UpdateReadingSessionRequest $request, ReadingSession $readingSession)
    {
        Gate::authorize('update', $readingSession);

        $data = $request->validated();
        $endTime = Carbon::parse($data['end_time']);

        if ($readingSession->is_paused && $readingSession->last_paused_at) {
            $readingSession->paused_seconds += Carbon::parse($readingSession->last_paused_at)->diffInSeconds($endTime);
            $readingSession->is_paused = false;
        }

        $startTime = Carbon::parse($readingSession->start_time);
        $duration = max(0, (int) $startTime->diffInSeconds($endTime) - $readingSession->paused_seconds);

        $readingSession->update([
            'end_time' => $data['end_time'],
            'end_page' => $data['end_page'],
            'notes' => $data['notes'] ?? null,
            'duration' => $duration,
        ]);

        return response()->success($readingSession->load('book'), 'Reading session updated successfully');
    }
}
