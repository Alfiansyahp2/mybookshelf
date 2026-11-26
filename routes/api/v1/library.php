<?php

use App\Http\Controllers\Api\V1\Library\BookController;
use App\Http\Controllers\Api\V1\Library\BookCostController;
use App\Http\Controllers\Api\V1\Library\BookCoverController;
use App\Http\Controllers\Api\V1\Library\BookLoanController;
use App\Http\Controllers\Api\V1\Library\BookTimelineController;
use App\Http\Controllers\Api\V1\Library\CollectionController;
use App\Http\Controllers\Api\V1\Library\ShelfController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    // Must stay before apiResource('books') to avoid matching {book}
    Route::get('books/purchase-history', [BookCostController::class, 'purchaseHistory']);

    Route::apiResource('books', BookController::class)->whereUuid('book');

    Route::prefix('books/{book}')->whereUuid('book')->group(function () {
        Route::post('borrow', [BookLoanController::class, 'borrow']);
        Route::post('return', [BookLoanController::class, 'returnBook']);
        Route::patch('favorite', [BookController::class, 'toggleFavorite']);
        Route::patch('notes', [BookController::class, 'updateNotes']);
        Route::patch('rating', [BookController::class, 'updateRating']);
        Route::patch('shelf', [BookController::class, 'moveToShelf']);
        Route::post('cover', BookCoverController::class);
        Route::get('timeline', BookTimelineController::class);
        Route::get('expenses', [BookCostController::class, 'expenses']);
        Route::get('cost-breakdown', [BookCostController::class, 'costBreakdown']);
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
