<?php

use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\ReadingSessionController;
use App\Http\Controllers\Api\V1\ShelfController;
use App\Http\Controllers\Api\V1\StatisticsController;
use App\Http\Controllers\Api\V1\TimelineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Authentication routes (public for development)
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// Reading session routes
Route::middleware('auth:sanctum')->prefix('v1/books')->group(function () {
    // Reading session management
    Route::post('{book}/reading-sessions/start', [BookController::class, 'startReadingSession']);
    Route::patch('{book}/reading-sessions/{session}/pause', [BookController::class, 'pauseReadingSession']);
    Route::put('{book}/reading-sessions/{session}/end', [BookController::class, 'endReadingSession']);
    Route::get('{book}/reading-sessions', [BookController::class, 'getBookReadingSessions']);
    Route::post('{book}/read-again', [BookController::class, 'readAgain']);
});

// API routes (protected - require authentication)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {

    // Books - Core CRUD with sub-resources
    Route::apiResource('books', BookController::class);

    // Book advanced operations
    Route::prefix('books/{book}')->group(function () {
        Route::post('start', [BookController::class, 'start']);
        Route::post('finish', [BookController::class, 'finish']);
        Route::post('borrow', [BookController::class, 'borrow']);
        Route::post('return', [BookController::class, 'returnBook']);
        Route::patch('progress', [BookController::class, 'updateProgress']);
        Route::patch('favorite', [BookController::class, 'toggleFavorite']);
        Route::patch('notes', [BookController::class, 'updateNotes']);
        Route::patch('rating', [BookController::class, 'updateRating']);
        Route::patch('shelf', [BookController::class, 'moveToShelf']);
        Route::post('cover', [BookController::class, 'uploadCover']);
        Route::get('timeline', [TimelineController::class, 'bookTimeline']);
    });

    // Shelves - Full CRUD with occupancy
    Route::put('shelves/layout', [ShelfController::class, 'updateLayout']);
    Route::apiResource('shelves', ShelfController::class);
    Route::get('shelves/{shelf}/occupancy', [ShelfController::class, 'occupancy']);

    // Collections - Full CRUD with book management
    Route::apiResource('collections', CollectionController::class);
    Route::prefix('collections/{collection}')->group(function () {
        Route::post('books', [CollectionController::class, 'addBook']);
        Route::delete('books/{book}', [CollectionController::class, 'removeBook']);
        Route::patch('books/{book}/order', [CollectionController::class, 'reorderBook']);
    });

    // Reading Sessions
    Route::apiResource('reading-sessions', ReadingSessionController::class)->only(['index', 'show', 'store', 'update']);

    // Statistics - Read-only
    Route::get('statistics', [StatisticsController::class, 'index']);

    // Achievements - Read-only with unlock action
    Route::apiResource('achievements', AchievementController::class)->only(['index', 'show']);
    Route::post('achievements/{achievement}/unlock', [AchievementController::class, 'unlock']);
});

// Fallback for unmatched routes
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint not found',
    ], 404);
});
