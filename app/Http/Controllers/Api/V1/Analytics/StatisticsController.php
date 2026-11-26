<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Analytics\StatisticsResource;
use App\Services\Analytics\StatisticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function __construct(
        private StatisticsService $statisticsService
    ) {}

    /**
     * Get comprehensive user reading, activity, and financial statistics.
     */
    public function index(Request $request): JsonResponse
    {
        $statistics = $this->statisticsService->getUserStatistics($request->user());

        return response()->success(
            new StatisticsResource($statistics),
            'Statistics retrieved successfully'
        );
    }
}
