<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ReadingSession;
use Illuminate\Http\Request;
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
    public function store(Request $request)
    {
        $data = $request->validate([
            'book_id' => 'required|exists:books,id',
            'start_time' => 'required|date',
            'start_page' => 'required|integer|min:0',
            'mood' => 'nullable|in:great,good,okay,difficult',
            'location' => 'nullable|string|max:255',
        ]);

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
    public function show(Request $request, $id)
    {
        $session = ReadingSession::where('user_id', $request->user()->id)
            ->with('book')
            ->findOrFail($id);

        return response()->success($session, 'Reading session retrieved successfully');
    }

    /**
     * Update the specified reading session (typically to end it).
     */
    public function update(Request $request, $id)
    {
        // Add ownership check
        $session = ReadingSession::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $data = $request->validate([
            'end_time' => 'required|date',
            'end_page' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        // Calculate duration using actual end_time from request
        $startTime = \Carbon\Carbon::parse($session->start_time);
        $endTime = \Carbon\Carbon::parse($data['end_time']);
        $duration = (int) $startTime->diffInSeconds($endTime);

        $session->update([
            'end_time' => $data['end_time'],
            'end_page' => $data['end_page'],
            'notes' => $data['notes'] ?? null,
            'duration' => $duration,
        ]);

        return response()->success($session->load('book'), 'Reading session updated successfully');
    }
}
