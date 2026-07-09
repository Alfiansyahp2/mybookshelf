<?php

use App\Http\Controllers\Api\V1\AccountingReportController;
use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\BudgetController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\CurrencyController;
use App\Http\Controllers\Api\V1\ExpenseCategoryController;
use App\Http\Controllers\Api\V1\ExpenseController;
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

// User settings routes
Route::middleware('auth:sanctum')->prefix('v1/user')->group(function () {
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'updatePassword']);
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
        Route::get('expenses', [BookController::class, 'getExpenses']);
        Route::get('cost-breakdown', [BookController::class, 'getCostBreakdown']);
    });

    // Books purchase history
    Route::get('books/purchase-history', [BookController::class, 'getPurchaseHistory']);

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

    // Accounting System - Complete expense tracking and budgeting
    Route::prefix('accounting')->group(function () {
        // Expenses - Custom routes
        Route::get('expenses/by-category', [ExpenseController::class, 'getByCategory']);
        Route::get('expenses/total', [ExpenseController::class, 'getTotalExpenses']);

        // Expenses - Full CRUD with advanced operations
        Route::apiResource('expenses', ExpenseController::class);
        Route::prefix('expenses/{expense}')->group(function () {
            Route::post('receipt', [ExpenseController::class, 'uploadReceipt']);
            Route::get('receipt', [ExpenseController::class, 'getReceipt']);
            Route::post('duplicate', [ExpenseController::class, 'duplicate']);
            Route::post('convert-currency', [ExpenseController::class, 'convertCurrency']);
            Route::post('mark-paid', [ExpenseController::class, 'markAsPaid']);
            Route::post('send-reminder', [ExpenseController::class, 'sendReminder']);
        });

        // Expense Categories - Custom routes
        Route::get('categories/default', [ExpenseCategoryController::class, 'getDefaultCategories']);
        Route::post('categories/initialize-defaults', [ExpenseCategoryController::class, 'initializeDefaults']);

        // Expense Categories - Full CRUD with defaults
        Route::apiResource('categories', ExpenseCategoryController::class);
        Route::get('categories/{category}/statistics', [ExpenseCategoryController::class, 'getStatistics']);

        Route::get('budgets/summary', [BudgetController::class, 'getSummary']);
        Route::get('budgets/check-alerts', [BudgetController::class, 'checkAlerts']);
        Route::get('budgets/top-spending-categories', [BudgetController::class, 'getTopSpendingCategories']);

        // Budgets - Full CRUD with progress tracking
        Route::apiResource('budgets', BudgetController::class);
        Route::prefix('budgets/{budget}')->group(function () {
            Route::get('progress', [BudgetController::class, 'getProgress']);
            Route::get('expenses', [BudgetController::class, 'getExpenses']);
            Route::post('reset-period', [BudgetController::class, 'resetPeriod']);
            Route::get('performance-trends', [BudgetController::class, 'getPerformanceTrends']);
        });

        // Currency Management - Rates and conversion
        Route::prefix('currency')->group(function () {
            Route::get('rates', [CurrencyController::class, 'getRates']);
            Route::get('rates/current', [CurrencyController::class, 'getRate']);
            Route::post('rates', [CurrencyController::class, 'setRate']);
            Route::post('rates/sync', [CurrencyController::class, 'syncRates']);
            Route::post('rates/bulk-upsert', [CurrencyController::class, 'bulkUpsertRates']);
            Route::get('rates/historical', [CurrencyController::class, 'getHistoricalRates']);
            Route::post('rates/deactivate-old', [CurrencyController::class, 'deactivateOldRates']);
            Route::post('convert', [CurrencyController::class, 'convert']);
            Route::get('supported', [CurrencyController::class, 'getSupportedCurrencies']);
            Route::get('validate', [CurrencyController::class, 'validateCurrency']);
            Route::get('info', [CurrencyController::class, 'getCurrencyInfo']);
        });

        // Reports & Analytics - Comprehensive reporting
        Route::prefix('reports')->group(function () {
            Route::get('overview', [AccountingReportController::class, 'overview']);
            Route::get('expenses-by-category', [AccountingReportController::class, 'expensesByCategory']);
            Route::get('expenses-by-period', [AccountingReportController::class, 'expensesByPeriod']);
            Route::get('budget-tracking', [AccountingReportController::class, 'budgetTracking']);
            Route::get('payment-methods', [AccountingReportController::class, 'paymentMethodsAnalysis']);
            Route::get('monthly-comparison', [AccountingReportController::class, 'monthlyComparison']);
            Route::get('year-to-date', [AccountingReportController::class, 'yearToDateSummary']);
            Route::post('export', [AccountingReportController::class, 'export']);
        });
    });
});

// Fallback for unmatched routes
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint not found',
    ], 404);
});
