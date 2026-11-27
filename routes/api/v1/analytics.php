<?php

use App\Http\Controllers\Api\V1\Analytics\AchievementController;
use App\Http\Controllers\Api\V1\Analytics\AnalyticsDashboardController;
use App\Http\Controllers\Api\V1\Analytics\StatisticsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::get('analytics/dashboard', AnalyticsDashboardController::class);
    Route::get('statistics', [StatisticsController::class, 'index']);

    Route::apiResource('achievements', AchievementController::class)
        ->only(['index', 'show'])
        ->whereUuid('achievement');
    Route::post('achievements/{achievement}/unlock', [AchievementController::class, 'unlock'])
        ->whereUuid('achievement');
});
