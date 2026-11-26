<?php

namespace App\Http\Controllers\Api\V1\Accounting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Accounting\AccountingOverviewRequest;
use App\Http\Requests\Api\V1\Accounting\BudgetTrackingRequest;
use App\Http\Requests\Api\V1\Accounting\DateRangeRequest;
use App\Http\Requests\Api\V1\Accounting\ExpensesByPeriodRequest;
use App\Http\Requests\Api\V1\Accounting\ExportReportRequest;
use App\Http\Requests\Api\V1\Accounting\MonthlyComparisonRequest;
use App\Http\Requests\Api\V1\Accounting\ReportCategoryFilterRequest;
use App\Services\Accounting\AccountingReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AccountingReportController extends Controller
{
    public function __construct(
        private AccountingReportService $accountingReportService
    ) {}

    /**
     * Get accounting overview/dashboard data.
     */
    public function overview(AccountingOverviewRequest $request): JsonResponse
    {
        try {
            $overview = $this->accountingReportService->getOverview(
                $request->user()->id,
                $request->validated()
            );

            return response()->success($overview, 'Accounting overview retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::overview failed');
        }
    }

    /**
     * Get expenses breakdown by category.
     */
    public function expensesByCategory(ReportCategoryFilterRequest $request): JsonResponse
    {
        try {
            $expenses = $this->accountingReportService->getExpensesByCategory(
                $request->user()->id,
                $request->validated()
            );

            return response()->success($expenses, 'Expenses by category retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::expensesByCategory failed');
        }
    }

    /**
     * Get expenses breakdown by period.
     */
    public function expensesByPeriod(ExpensesByPeriodRequest $request): JsonResponse
    {
        try {
            $periodData = $this->accountingReportService->getExpensesByPeriod(
                $request->user()->id,
                $request->validated()
            );

            return response()->success($periodData, 'Expenses by period retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::expensesByPeriod failed');
        }
    }

    /**
     * Get budget tracking information.
     */
    public function budgetTracking(BudgetTrackingRequest $request): JsonResponse
    {
        try {
            $budgetTracking = $this->accountingReportService->getBudgetTracking(
                $request->user()->id,
                $request->validated()
            );

            return response()->success($budgetTracking, 'Budget tracking retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::budgetTracking failed');
        }
    }

    /**
     * Get payment methods analysis.
     */
    public function paymentMethodsAnalysis(DateRangeRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $analysis = $this->accountingReportService->getPaymentMethodsAnalysis(
                $request->user()->id,
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null
            );

            return response()->success($analysis, 'Payment methods analysis retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::paymentMethodsAnalysis failed');
        }
    }

    /**
     * Get monthly comparison data.
     */
    public function monthlyComparison(MonthlyComparisonRequest $request): JsonResponse
    {
        try {
            $months = $request->validated('months') ?? 6;
            $comparison = $this->accountingReportService->getMonthlyComparison($request->user()->id, $months);

            return response()->success($comparison, 'Monthly comparison retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::monthlyComparison failed');
        }
    }

    /**
     * Export report data placeholder.
     */
    public function export(ExportReportRequest $request): JsonResponse
    {
        try {
            $payload = $this->accountingReportService->prepareExport($request->validated());

            return response()->success($payload, 'Export data prepared successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::export failed');
        }
    }

    /**
     * Get year-to-date summary.
     */
    public function yearToDateSummary(): JsonResponse
    {
        try {
            $summary = $this->accountingReportService->getYearToDateSummary(Auth::id());

            return response()->success($summary, 'Year-to-date summary retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::yearToDateSummary failed');
        }
    }
}
