<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ExpenseService;
use App\Services\BudgetService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

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
    public function overview(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'period' => 'nullable|in:today,week,month,year,all',
            ]);

            $userId = Auth::id();

            // Determine date range based on period
            $startDate = $validated['start_date'] ?? null;
            $endDate = $validated['end_date'] ?? null;

            if (isset($validated['period'])) {
                $period = $validated['period'];
                $now = now();

                switch ($period) {
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

            // Get expense summary
            $totalExpenses = $this->expenseService->getTotalExpenses($userId, $startDate, $endDate);

            // Get budget summary
            $budgetSummary = $this->budgetService->getBudgetSummary($userId);

            // Get expenses by category
            $expensesByCategory = $this->expenseService->getExpensesByCategory($userId, $startDate, $endDate);

            // Get recent expenses
            $recentExpenses = \App\Models\Expense::forUser($userId)
                ->with(['category', 'book'])
                ->completed()
                ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                    return $query->inPeriod($startDate, $endDate);
                })
                ->orderBy('expense_date', 'desc')
                ->limit(10)
                ->get();

            // Get top spending categories
            $topCategories = $this->budgetService->getTopSpendingCategories($userId, $startDate, $endDate, 5);

            // Get pending expenses
            $pendingExpenses = \App\Models\Expense::forUser($userId)
                ->where('status', 'pending')
                ->count();

            // Get this month's expenses vs last month
            $thisMonthExpenses = \App\Models\Expense::forUser($userId)
                ->completed()
                ->whereBetween('expense_date', [now()->startOfMonth(), now()->endOfMonth()])
                ->sum('amount_base_currency');

            $lastMonthExpenses = \App\Models\Expense::forUser($userId)
                ->completed()
                ->whereBetween('expense_date', [
                    now()->subMonth()->startOfMonth(),
                    now()->subMonth()->endOfMonth()
                ])
                ->sum('amount_base_currency');

            $overview = [
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'period_type' => $validated['period'] ?? 'custom',
                ],
                'summary' => [
                    'total_expenses' => $totalExpenses,
                    'formatted_total' => 'Rp ' . number_format($totalExpenses, 2, ',', '.'),
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
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get expenses breakdown by category.
     */
    public function expensesByCategory(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'category_id' => 'nullable|uuid|exists:expense_categories,id',
            ]);

            $expenses = $this->expenseService->getExpensesByCategory(
                Auth::id(),
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null
            );

            // Filter by specific category if requested
            if (isset($validated['category_id'])) {
                $expenses = array_filter($expenses, function ($expense) use ($validated) {
                    return $expense['category_id'] === $validated['category_id'];
                });
                $expenses = array_values($expenses); // Re-index array
            }

            return response()->success($expenses, 'Expenses by category retrieved successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get expenses breakdown by period.
     */
    public function expensesByPeriod(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'group_by' => 'nullable|in:day,week,month,year',
                'category_id' => 'nullable|uuid|exists:expense_categories,id',
            ]);

            $userId = Auth::id();
            $groupBy = $validated['group_by'] ?? 'day';

            $query = \App\Models\Expense::forUser($userId)
                ->with('category')
                ->completed()
                ->whereBetween('expense_date', [$validated['start_date'], $validated['end_date']]);

            if (isset($validated['category_id'])) {
                $query->where('category_id', $validated['category_id']);
            }

            $expenses = $query->get();

            // Group expenses by period
            $groupedExpenses = $expenses->groupBy(function ($expense) use ($groupBy) {
                switch ($groupBy) {
                    case 'day':
                        return $expense->expense_date->format('Y-m-d');
                    case 'week':
                        return $expense->expense_date->format('Y-W');
                    case 'month':
                        return $expense->expense_date->format('Y-m');
                    case 'year':
                        return $expense->expense_date->format('Y');
                    default:
                        return $expense->expense_date->format('Y-m-d');
                }
            });

            // Calculate totals for each period
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
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get budget tracking information.
     */
    public function budgetTracking(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'is_active' => 'nullable|boolean',
                'period' => 'nullable|in:daily,weekly,monthly,yearly',
            ]);

            $userId = Auth::id();

            $filters = [
                'is_active' => $validated['is_active'] ?? true,
                'period' => $validated['period'] ?? null,
            ];

            $budgets = $this->budgetService->getAllBudgets($userId, $filters);

            // Get detailed progress for each budget
            $budgetTracking = collect($budgets->items())->map(function ($budget) {
                $progress = $this->budgetService->getBudgetProgress($budget->id, $userId);
                return array_merge($progress, [
                    'budget_details' => $budget,
                ]);
            })->toArray();

            return response()->success($budgetTracking, 'Budget tracking retrieved successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get payment methods analysis.
     */
    public function paymentMethodsAnalysis(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
            ]);

            $userId = Auth::id();
            $startDate = $validated['start_date'] ?? null;
            $endDate = $validated['end_date'] ?? null;

            $query = \App\Models\Expense::forUser($userId)
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
                    'formatted_amount' => 'Rp ' . number_format($method->total_amount, 2, ',', '.'),
                    'percentage' => round($percentage, 2),
                ];
            })->sortByDesc('total_amount')->values()->toArray();

            return response()->success($analysis, 'Payment methods analysis retrieved successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get monthly comparison data.
     */
    public function monthlyComparison(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'months' => 'nullable|integer|min:1|max:12',
            ]);

            $userId = Auth::id();
            $months = $validated['months'] ?? 6;

            $monthlyData = [];

            for ($i = 0; $i < $months; $i++) {
                $monthDate = now()->subMonths($i);
                $monthStart = $monthDate->copy()->startOfMonth();
                $monthEnd = $monthDate->copy()->endOfMonth();

                $totalExpenses = \App\Models\Expense::forUser($userId)
                    ->completed()
                    ->whereBetween('expense_date', [$monthStart, $monthEnd])
                    ->sum('amount_base_currency');

                $expenseCount = \App\Models\Expense::forUser($userId)
                    ->completed()
                    ->whereBetween('expense_date', [$monthStart, $monthEnd])
                    ->count();

                $monthlyData[] = [
                    'month' => $monthDate->format('Y-m'),
                    'month_name' => $monthDate->format('F Y'),
                    'total_expenses' => $totalExpenses,
                    'formatted_amount' => 'Rp ' . number_format($totalExpenses, 2, ',', '.'),
                    'expense_count' => $expenseCount,
                    'average_expense' => $expenseCount > 0 ? $totalExpenses / $expenseCount : 0,
                ];
            }

            // Reverse to show most recent first
            $monthlyData = array_reverse($monthlyData);

            return response()->success($monthlyData, 'Monthly comparison retrieved successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Export report data (placeholder for PDF/Excel export).
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'report_type' => 'required|in:overview,expenses,budgets,payment_methods',
                'format' => 'required|in:json,csv,excel,pdf',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
            ]);

            // This is a placeholder for export functionality
            // You would implement actual PDF/Excel generation here
            // using libraries like dompdf, PHPSpreadsheet, etc.

            return response()->success([
                'message' => 'Export functionality placeholder',
                'report_type' => $validated['report_type'],
                'format' => $validated['format'],
                'data' => [
                    'note' => 'This is a placeholder for export functionality',
                    'implementation_required' => 'Integrate with dompdf/PHPSpreadsheet libraries',
                ],
            ], 'Export data prepared successfully');

        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
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

            // Get YTD expenses
            $ytdExpenses = \App\Models\Expense::forUser($userId)
                ->completed()
                ->whereBetween('expense_date', [$yearStart, $yearEnd])
                ->sum('amount_base_currency');

            // Get monthly average
            $monthsPassed = now()->diffInMonths($yearStart) + 1;
            $monthlyAverage = $monthsPassed > 0 ? $ytdExpenses / $monthsPassed : 0;

            // Get projected yearly total
            $projectedYearlyTotal = $monthlyAverage * 12;

            // Compare with last year
            $lastYearStart = now()->subYear()->startOfYear();
            $lastYearEnd = now()->subYear()->endOfYear();

            $lastYearYtdExpenses = \App\Models\Expense::forUser($userId)
                ->completed()
                ->whereBetween('expense_date', [$lastYearStart, $lastYearEnd])
                ->sum('amount_base_currency');

            $yearOverYearGrowth = $lastYearYtdExpenses > 0 ?
                (($ytdExpenses - $lastYearYtdExpenses) / $lastYearYtdExpenses) * 100 : 0;

            $summary = [
                'year' => now()->year,
                'year_to_date_expenses' => $ytdExpenses,
                'formatted_ytd' => 'Rp ' . number_format($ytdExpenses, 2, ',', '.'),
                'monthly_average' => $monthlyAverage,
                'formatted_monthly_average' => 'Rp ' . number_format($monthlyAverage, 2, ',', '.'),
                'projected_yearly_total' => $projectedYearlyTotal,
                'formatted_projected' => 'Rp ' . number_format($projectedYearlyTotal, 2, ',', '.'),
                'last_year_total' => $lastYearYtdExpenses,
                'formatted_last_year' => 'Rp ' . number_format($lastYearYtdExpenses, 2, ',', '.'),
                'year_over_year_growth' => $yearOverYearGrowth,
                'months_passed' => $monthsPassed,
                'remaining_months' => 12 - $monthsPassed,
            ];

            return response()->success($summary, 'Year-to-date summary retrieved successfully');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}