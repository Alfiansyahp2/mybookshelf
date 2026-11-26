<?php

use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\ReadingSessionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::prefix('books/{book}')->whereUuid('book')->group(function () {
        Route::post('start', [BookController::class, 'start']);
        Route::post('finish', [BookController::class, 'finish']);
        Route::post('read-again', [BookController::class, 'readAgain']);
        Route::patch('progress', [BookController::class, 'updateProgress']);

        Route::get('reading-sessions', [BookController::class, 'getBookReadingSessions']);
        Route::post('reading-sessions/start', [BookController::class, 'startReadingSession']);
        Route::patch('reading-sessions/{session}/pause', [BookController::class, 'pauseReadingSession'])->whereUuid('session');
        Route::put('reading-sessions/{session}/end', [BookController::class, 'endReadingSession'])->whereUuid('session');
    });

    Route::apiResource('reading-sessions', ReadingSessionController::class)
        ->only(['index', 'show', 'store', 'update'])
        ->whereUuid('reading_session');
});
