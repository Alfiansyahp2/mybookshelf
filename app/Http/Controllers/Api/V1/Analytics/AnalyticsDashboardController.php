<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Controller;
use App\Services\Analytics\DashboardAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsDashboardController extends Controller
{
    public function __construct(
        private DashboardAnalyticsService $dashboardAnalyticsService
    ) {}

    /**
     * Retrieve pre-aggregated dashboard analytics summary cached per user.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $summary = $this->dashboardAnalyticsService->getSummaryForUser($request->user());

        return response()->success($summary->toArray(), 'Dashboard analytics retrieved successfully');
    }
}
