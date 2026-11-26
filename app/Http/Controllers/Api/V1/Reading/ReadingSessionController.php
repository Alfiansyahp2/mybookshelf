<?php

namespace App\Http\Controllers\Api\V1\Reading;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Reading\PauseReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\StoreReadingSessionRequest;
use App\Http\Requests\Api\V1\Reading\UpdateReadingSessionRequest;
use App\Http\Resources\Api\V1\Reading\ReadingSessionResource;
use App\Models\ReadingSession;
use App\Services\Reading\ReadingSessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ReadingSessionController extends Controller
{
    public function __construct(
        private ReadingSessionService $readingSessionService
    ) {}

    /**
     * Display a listing of reading sessions.
     */
    public function index(Request $request): JsonResponse
    {
        $sessions = $this->readingSessionService->listForUser(
            $request->user()->id,
            $request->query('book_id')
        );

        return response()->success(
            ReadingSessionResource::collection($sessions),
            'Reading sessions retrieved successfully'
        );
    }

    /**
     * Store a newly created reading session.
     */
    public function store(StoreReadingSessionRequest $request): JsonResponse
    {
        Gate::authorize('create', ReadingSession::class);

        $session = $this->readingSessionService->createManualSession(
            $request->user()->id,
            $request->validated()
        );

        return response()->success(
            new ReadingSessionResource($session),
            'Reading session created successfully',
            201
        );
    }

    /**
     * Display the specified reading session.
     */
    public function show(ReadingSession $readingSession): JsonResponse
    {
        Gate::authorize('view', $readingSession);

        return response()->success(
            new ReadingSessionResource($readingSession->load('book')),
            'Reading session retrieved successfully'
        );
    }

    /**
     * Pause or resume an active reading session.
     */
    public function pause(PauseReadingSessionRequest $request, ReadingSession $readingSession): JsonResponse
    {
        Gate::authorize('update', $readingSession);

        try {
            $updatedSession = $this->readingSessionService->togglePause(
                $readingSession,
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
     * Update the specified reading session (typically to finalize it).
     */
    public function update(UpdateReadingSessionRequest $request, ReadingSession $readingSession): JsonResponse
    {
        Gate::authorize('update', $readingSession);

        $updatedSession = $this->readingSessionService->updateManualSession(
            $readingSession,
            $request->validated()
        );

        return response()->success(
            new ReadingSessionResource($updatedSession),
            'Reading session updated successfully'
        );
    }
}
