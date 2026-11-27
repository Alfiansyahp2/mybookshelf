<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Analytics\AchievementResource;
use App\Services\Analytics\AchievementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function __construct(
        private AchievementService $achievementService
    ) {}

    /**
     * Display a listing of achievements with the authenticated user's progress.
     */
    public function index(Request $request): JsonResponse
    {
        $achievements = $this->achievementService->listForUser($request->user());

        return response()->success(
            AchievementResource::collection($achievements),
            'Achievements retrieved successfully'
        );
    }

    /**
     * Display a specific achievement with the authenticated user's progress.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $achievement = $this->achievementService->findForUser($request->user(), $id);

        return response()->success(
            new AchievementResource($achievement),
            'Achievement retrieved successfully'
        );
    }

    /**
     * Unlock an achievement after server-side requirement verification.
     */
    public function unlock(Request $request, string $id): JsonResponse
    {
        $result = $this->achievementService->unlock($request->user(), $id);

        if ($result['status'] === 'already_unlocked') {
            return response()->error('Achievement already unlocked', null, 400);
        }

        if ($result['status'] === 'not_met') {
            return response()->error('Achievement requirement not yet met', [
                'current' => $result['current'],
                'requirement' => $result['requirement'],
            ], 422);
        }

        return response()->success([
            'current' => $result['current'],
            'requirement' => $result['requirement'],
        ], 'Achievement unlocked successfully');
    }
}
