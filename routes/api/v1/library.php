<?php

use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\ShelfController;
use App\Http\Controllers\Api\V1\TimelineController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    // Must stay before apiResource('books') to avoid matching {book}
    Route::get('books/purchase-history', [BookController::class, 'getPurchaseHistory']);

    Route::apiResource('books', BookController::class)->whereUuid('book');

    Route::prefix('books/{book}')->whereUuid('book')->group(function () {
        Route::post('borrow', [BookController::class, 'borrow']);
        Route::post('return', [BookController::class, 'returnBook']);
        Route::patch('favorite', [BookController::class, 'toggleFavorite']);
        Route::patch('notes', [BookController::class, 'updateNotes']);
        Route::patch('rating', [BookController::class, 'updateRating']);
        Route::patch('shelf', [BookController::class, 'moveToShelf']);
        Route::post('cover', [BookController::class, 'uploadCover']);
        Route::get('timeline', [TimelineController::class, 'bookTimeline']);
        Route::get('expenses', [BookController::class, 'getExpenses']);
        Route::get('cost-breakdown', [BookController::class, 'getCostBreakdown']);
    });

    Route::put('shelves/layout', [ShelfController::class, 'updateLayout']);
    Route::apiResource('shelves', ShelfController::class)->whereUuid('shelf');
    Route::get('shelves/{shelf}/occupancy', [ShelfController::class, 'occupancy'])->whereUuid('shelf');

    Route::apiResource('collections', CollectionController::class)->whereUuid('collection');
    Route::prefix('collections/{collection}')->whereUuid('collection')->group(function () {
        Route::post('books', [CollectionController::class, 'addBook']);
        Route::delete('books/{book}', [CollectionController::class, 'removeBook'])->whereUuid('book');
        Route::patch('books/{book}/order', [CollectionController::class, 'reorderBook'])->whereUuid('book');
    });
});
