<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Accounting\AccountingOverviewRequest;
use App\Http\Requests\Api\V1\Accounting\BudgetTrackingRequest;
use App\Http\Requests\Api\V1\Accounting\DateRangeRequest;
use App\Http\Requests\Api\V1\Accounting\ExpensesByPeriodRequest;
use App\Http\Requests\Api\V1\Accounting\ExportReportRequest;
use App\Http\Requests\Api\V1\Accounting\MonthlyComparisonRequest;
use App\Http\Requests\Api\V1\Accounting\ReportCategoryFilterRequest;
use App\Models\Expense;
use App\Services\BudgetService;
use App\Services\ExpenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AccountingReportController extends Controller
{
    protected $expenseService;

    protected $budgetService;

    public function __construct(
        ExpenseService $expenseService,
        BudgetService $budgetService
    ) {
        $this->expenseService = $expenseService;
        $this->budgetService = $budgetService;
    }

    /**
     * Get accounting overview/dashboard data.
     */
    public function overview(AccountingOverviewRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $userId = $request->user()->id;

            $startDate = $validated['start_date'] ?? null;
            $endDate = $validated['end_date'] ?? null;

            if (isset($validated['period'])) {
                $now = now();

                switch ($validated['period']) {
                    case 'today':
                        $startDate = $now->copy()->startOfDay();
                        $endDate = $now->copy()->endOfDay();
                        break;
                    case 'week':
                        $startDate = $now->copy()->startOfWeek();
                        $endDate = $now->copy()->endOfWeek();
                        break;
                    case 'month':
                        $startDate = $now->copy()->startOfMonth();
                        $endDate = $now->copy()->endOfMonth();
                        break;
                    case 'year':
                        $startDate = $now->copy()->startOfYear();
                        $endDate = $now->copy()->endOfYear();
                        break;
                    case 'all':
                        $startDate = null;
                        $endDate = null;
                        break;
                }
            }

            $totalExpenses = $this->expenseService->getTotalExpenses($userId, $startDate, $endDate);
            $budgetSummary = $this->budgetService->getBudgetSummary($userId);
            $expensesByCategory = $this->expenseService->getExpensesByCategory($userId, $startDate, $endDate);

            $recentExpenses = Expense::forUser($userId)
                ->with(['category', 'book'])
                ->completed()
                ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                    return $query->inPeriod($startDate, $endDate);
                })
                ->orderBy('expense_date', 'desc')
                ->limit(10)
                ->get();

            $topCategories = $this->budgetService->getTopSpendingCategories($userId, $startDate, $endDate, 5);
            $pendingExpenses = Expense::forUser($userId)->where('status', 'pending')->count();

            $thisMonthExpenses = Expense::forUser($userId)
                ->completed()
                ->inPeriod(now()->startOfMonth(), now()->endOfMonth())
                ->sum('amount_base_currency');

            $lastMonthExpenses = Expense::forUser($userId)
                ->completed()
                ->inPeriod(
                    now()->subMonth()->startOfMonth(),
                    now()->subMonth()->endOfMonth()
                )
                ->sum('amount_base_currency');

            $overview = [
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'period_type' => $validated['period'] ?? 'custom',
                ],
                'summary' => [
                    'total_expenses' => $totalExpenses,
                    'formatted_total' => 'Rp '.number_format($totalExpenses, 2, ',', '.'),
                    'pending_expenses' => $pendingExpenses,
                    'this_month_expenses' => $thisMonthExpenses,
                    'last_month_expenses' => $lastMonthExpenses,
                    'month_over_month_change' => $lastMonthExpenses > 0 ?
                        (($thisMonthExpenses - $lastMonthExpenses) / $lastMonthExpenses) * 100 : 0,
                ],
                'budget' => $budgetSummary,
                'expenses_by_category' => $expensesByCategory,
                'top_spending_categories' => $topCategories,
                'recent_expenses' => $recentExpenses,
            ];

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
            $validated = $request->validated();

            $expenses = $this->expenseService->getExpensesByCategory(
                $request->user()->id,
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null
            );

            if (isset($validated['category_id'])) {
                $expenses = array_values(array_filter(
                    $expenses,
                    fn ($expense) => $expense['category_id'] === $validated['category_id']
                ));
            }

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
            $validated = $request->validated();
            $groupBy = $validated['group_by'] ?? 'day';

            $query = Expense::forUser($request->user()->id)
                ->with('category')
                ->completed()
                ->whereBetween('expense_date', [$validated['start_date'], $validated['end_date']]);

            if (isset($validated['category_id'])) {
                $query->where('category_id', $validated['category_id']);
            }

            $expenses = $query->get();

            $groupedExpenses = $expenses->groupBy(function ($expense) use ($groupBy) {
                return match ($groupBy) {
                    'week' => $expense->expense_date->format('Y-W'),
                    'month' => $expense->expense_date->format('Y-m'),
                    'year' => $expense->expense_date->format('Y'),
                    default => $expense->expense_date->format('Y-m-d'),
                };
            });

            $periodData = $groupedExpenses->map(function ($periodExpenses, $period) {
                return [
                    'period' => $period,
                    'total_amount' => $periodExpenses->sum('amount_base_currency'),
                    'expense_count' => $periodExpenses->count(),
                    'average_expense' => $periodExpenses->avg('amount_base_currency'),
                    'categories' => $periodExpenses->groupBy('category_id')->map(function ($catExpenses) {
                        return [
                            'category_id' => $catExpenses->first()->category_id,
                            'category_name' => $catExpenses->first()->category?->name ?? 'Uncategorized',
                            'category_color' => $catExpenses->first()->category?->color ?? '#6B7280',
                            'total_amount' => $catExpenses->sum('amount_base_currency'),
                            'expense_count' => $catExpenses->count(),
                        ];
                    })->values()->toArray(),
                ];
            })->values()->sortBy('period')->toArray();

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
            $validated = $request->validated();
            $userId = $request->user()->id;

            $filters = [
                'is_active' => $validated['is_active'] ?? true,
                'period' => $validated['period'] ?? null,
            ];

            $budgets = $this->budgetService->getAllBudgets($userId, $filters);

            $budgetTracking = collect($budgets->items())->map(function ($budget) use ($userId) {
                $progress = $this->budgetService->getBudgetProgress($budget->id, $userId);

                return array_merge($progress, [
                    'budget_details' => $budget,
                ]);
            })->toArray();

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
            $startDate = $validated['start_date'] ?? null;
            $endDate = $validated['end_date'] ?? null;

            $query = Expense::forUser($request->user()->id)
                ->completed()
                ->selectRaw('payment_method, COUNT(*) as expense_count, SUM(amount_base_currency) as total_amount')
                ->groupBy('payment_method');

            if ($startDate && $endDate) {
                $query->whereBetween('expense_date', [$startDate, $endDate]);
            }

            $paymentMethods = $query->get();
            $totalAmount = $paymentMethods->sum('total_amount');

            $analysis = $paymentMethods->map(function ($method) use ($totalAmount) {
                $percentage = $totalAmount > 0 ? ($method->total_amount / $totalAmount) * 100 : 0;

                return [
                    'payment_method' => $method->payment_method,
                    'label' => ucfirst(str_replace('_', ' ', $method->payment_method)),
                    'expense_count' => $method->expense_count,
                    'total_amount' => $method->total_amount,
                    'formatted_amount' => 'Rp '.number_format($method->total_amount, 2, ',', '.'),
                    'percentage' => round($percentage, 2),
                ];
            })->sortByDesc('total_amount')->values()->toArray();

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
            $userId = $request->user()->id;
            $months = $request->validated('months') ?? 6;
            $monthlyData = [];

            for ($i = 0; $i < $months; $i++) {
                $monthDate = now()->subMonths($i);
                $monthStart = $monthDate->copy()->startOfMonth();
                $monthEnd = $monthDate->copy()->endOfMonth();

                $totalExpenses = Expense::forUser($userId)
                    ->completed()
                    ->whereBetween('expense_date', [$monthStart, $monthEnd])
                    ->sum('amount_base_currency');

                $expenseCount = Expense::forUser($userId)
                    ->completed()
                    ->whereBetween('expense_date', [$monthStart, $monthEnd])
                    ->count();

                $monthlyData[] = [
                    'month' => $monthDate->format('Y-m'),
                    'month_name' => $monthDate->format('F Y'),
                    'total_expenses' => $totalExpenses,
                    'formatted_amount' => 'Rp '.number_format($totalExpenses, 2, ',', '.'),
                    'expense_count' => $expenseCount,
                    'average_expense' => $expenseCount > 0 ? $totalExpenses / $expenseCount : 0,
                ];
            }

            return response()->success(array_reverse($monthlyData), 'Monthly comparison retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::monthlyComparison failed');
        }
    }

    /**
     * Export report data (placeholder for PDF/Excel export).
     */
    public function export(ExportReportRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            return response()->success([
                'message' => 'Export functionality placeholder',
                'report_type' => $validated['report_type'],
                'format' => $validated['format'],
                'data' => [
                    'note' => 'This is a placeholder for export functionality',
                    'implementation_required' => 'Integrate with dompdf/PHPSpreadsheet libraries',
                ],
            ], 'Export data prepared successfully');
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
            $userId = Auth::id();
            $yearStart = now()->startOfYear();
            $yearEnd = now()->endOfYear();

            $ytdExpenses = Expense::forUser($userId)
                ->completed()
                ->whereBetween('expense_date', [$yearStart, $yearEnd])
                ->sum('amount_base_currency');

            $monthsPassed = now()->diffInMonths($yearStart) + 1;
            $monthlyAverage = $monthsPassed > 0 ? $ytdExpenses / $monthsPassed : 0;
            $projectedYearlyTotal = $monthlyAverage * 12;

            $lastYearYtdExpenses = Expense::forUser($userId)
                ->completed()
                ->whereBetween('expense_date', [
                    now()->subYear()->startOfYear(),
                    now()->subYear()->endOfYear(),
                ])
                ->sum('amount_base_currency');

            $yearOverYearGrowth = $lastYearYtdExpenses > 0 ?
                (($ytdExpenses - $lastYearYtdExpenses) / $lastYearYtdExpenses) * 100 : 0;

            $summary = [
                'year' => now()->year,
                'year_to_date_expenses' => $ytdExpenses,
                'formatted_ytd' => 'Rp '.number_format($ytdExpenses, 2, ',', '.'),
                'monthly_average' => $monthlyAverage,
                'formatted_monthly_average' => 'Rp '.number_format($monthlyAverage, 2, ',', '.'),
                'projected_yearly_total' => $projectedYearlyTotal,
                'formatted_projected' => 'Rp '.number_format($projectedYearlyTotal, 2, ',', '.'),
                'last_year_total' => $lastYearYtdExpenses,
                'formatted_last_year' => 'Rp '.number_format($lastYearYtdExpenses, 2, ',', '.'),
                'year_over_year_growth' => $yearOverYearGrowth,
                'months_passed' => $monthsPassed,
                'remaining_months' => 12 - $monthsPassed,
            ];

            return response()->success($summary, 'Year-to-date summary retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'AccountingReportController::yearToDateSummary failed');
        }
    }
}
