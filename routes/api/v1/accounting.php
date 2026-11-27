<?php

use App\Http\Controllers\Api\V1\Accounting\AccountingReportController;
use App\Http\Controllers\Api\V1\Accounting\BudgetController;
use App\Http\Controllers\Api\V1\Accounting\CurrencyController;
use App\Http\Controllers\Api\V1\Accounting\ExpenseCategoryController;
use App\Http\Controllers\Api\V1\Accounting\ExpenseController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'throttle:api'])->prefix('v1/accounting')->group(function () {
    Route::get('expenses/by-category', [ExpenseController::class, 'getByCategory']);
    Route::get('expenses/total', [ExpenseController::class, 'getTotalExpenses']);
    Route::apiResource('expenses', ExpenseController::class)->whereUuid('expense');
    Route::prefix('expenses/{expense}')->whereUuid('expense')->group(function () {
        Route::post('receipt', [ExpenseController::class, 'uploadReceipt'])->middleware('throttle:uploads');
        Route::get('receipt', [ExpenseController::class, 'getReceipt']);
        Route::post('duplicate', [ExpenseController::class, 'duplicate']);
        Route::post('convert-currency', [ExpenseController::class, 'convertCurrency']);
        Route::post('mark-paid', [ExpenseController::class, 'markAsPaid']);
        Route::post('send-reminder', [ExpenseController::class, 'sendReminder']);
    });

    Route::get('categories/default', [ExpenseCategoryController::class, 'getDefaultCategories']);
    Route::post('categories/initialize-defaults', [ExpenseCategoryController::class, 'initializeDefaults']);
    Route::apiResource('categories', ExpenseCategoryController::class)->whereUuid('category');
    Route::get('categories/{category}/statistics', [ExpenseCategoryController::class, 'getStatistics'])
        ->whereUuid('category');

    Route::get('budgets/summary', [BudgetController::class, 'getSummary']);
    Route::get('budgets/check-alerts', [BudgetController::class, 'checkAlerts']);
    Route::get('budgets/top-spending-categories', [BudgetController::class, 'getTopSpendingCategories']);
    Route::apiResource('budgets', BudgetController::class)->whereUuid('budget');
    Route::prefix('budgets/{budget}')->whereUuid('budget')->group(function () {
        Route::get('progress', [BudgetController::class, 'getProgress']);
        Route::get('expenses', [BudgetController::class, 'getExpenses']);
        Route::post('reset-period', [BudgetController::class, 'resetPeriod']);
        Route::get('performance-trends', [BudgetController::class, 'getPerformanceTrends']);
    });

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

    Route::prefix('reports')->group(function () {
        Route::get('overview', [AccountingReportController::class, 'overview']);
        Route::get('expenses-by-category', [AccountingReportController::class, 'expensesByCategory']);
        Route::get('expenses-by-period', [AccountingReportController::class, 'expensesByPeriod']);
        Route::get('budget-tracking', [AccountingReportController::class, 'budgetTracking']);
        Route::get('payment-methods', [AccountingReportController::class, 'paymentMethodsAnalysis']);
        Route::get('monthly-comparison', [AccountingReportController::class, 'monthlyComparison']);
        Route::get('year-to-date', [AccountingReportController::class, 'yearToDateSummary']);
        Route::post('export', [AccountingReportController::class, 'export'])->middleware('throttle:exports');
        Route::get('exports/{exportId}', [AccountingReportController::class, 'exportStatus'])->whereUuid('exportId');
    });
});
