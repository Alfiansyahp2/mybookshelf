<?php

use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\StatisticsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::get('statistics', [StatisticsController::class, 'index']);

    Route::apiResource('achievements', AchievementController::class)
        ->only(['index', 'show'])
        ->whereUuid('achievement');
    Route::post('achievements/{achievement}/unlock', [AchievementController::class, 'unlock'])
        ->whereUuid('achievement');
});
