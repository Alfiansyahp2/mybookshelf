<?php

use App\Http\Controllers\Api\V1\Reading\BookReadingController;
use App\Http\Controllers\Api\V1\Reading\ReadingSessionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'throttle:api'])->prefix('v1')->group(function () {
    Route::prefix('books/{book}')->whereUuid('book')->group(function () {
        Route::post('start', [BookReadingController::class, 'start']);
        Route::post('finish', [BookReadingController::class, 'finish']);
        Route::post('read-again', [BookReadingController::class, 'readAgain']);
        Route::patch('progress', [BookReadingController::class, 'updateProgress']);

        Route::get('reading-sessions', [BookReadingController::class, 'getSessions']);
        Route::post('reading-sessions/start', [BookReadingController::class, 'startSession']);
        Route::patch('reading-sessions/{session}/pause', [BookReadingController::class, 'pauseSession'])->whereUuid('session');
        Route::put('reading-sessions/{session}/end', [BookReadingController::class, 'endSession'])->whereUuid('session');
    });

    Route::apiResource('reading-sessions', ReadingSessionController::class)
        ->only(['index', 'show', 'store', 'update'])
        ->whereUuid('reading_session');
});
