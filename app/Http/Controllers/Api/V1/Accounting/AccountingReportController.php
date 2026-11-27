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
use App\Jobs\ExportAccountingReportJob;
use App\Services\Accounting\AccountingReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

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
     * Dispatch asynchronous report export job and return status endpoint metadata.
     */
    public function export(ExportReportRequest $request): JsonResponse
    {
        try {
            $userId = $request->user()->id;
            $exportId = Str::uuid()->toString();
            $validated = $request->validated();
            $cacheKey = ExportAccountingReportJob::cacheKey($userId, $exportId);

            Cache::put($cacheKey, [
                'export_id' => $exportId,
                'status' => 'queued',
                'report_type' => $validated['report_type'],
                'format' => $validated['format'],
            ], now()->addHours(2));

            ExportAccountingReportJob::dispatch($userId, $exportId, $validated);

            $statusPayload = Cache::get($cacheKey);

            return response()->success(array_merge([
                'export_id' => $exportId,
                'status_url' => "/api/v1/accounting/reports/exports/{$exportId}",
            ], is_array($statusPayload) ? $statusPayload : ['status' => 'queued']), 'Export queued successfully', 202);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::export failed');
        }
    }

    /**
     * Retrieve export status and temporary signed download URL.
     */
    public function exportStatus(string $exportId): JsonResponse
    {
        $payload = Cache::get(ExportAccountingReportJob::cacheKey((string) Auth::id(), $exportId));

        if (! is_array($payload)) {
            return $this->notFoundResponse('Export job not found or expired');
        }

        return response()->success($payload, 'Export status retrieved successfully');
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
