<?php

namespace App\Services\Accounting;

use App\Http\Resources\Api\V1\Accounting\BudgetResource;
use App\Http\Resources\Api\V1\Accounting\ExpenseResource;
use App\Models\Expense;

class AccountingReportService
{
    public function __construct(
        private ExpenseService $expenseService,
        private BudgetService $budgetService
    ) {}

    /**
     * Build the accounting dashboard overview metrics for a user.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getOverview(string $userId, array $filters): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($filters);

        $totalExpenses = $this->expenseService->getTotalExpenses($userId, $startDate, $endDate);
        $budgetSummary = $this->budgetService->getBudgetSummary($userId);
        $expensesByCategory = $this->expenseService->getExpensesByCategory($userId, $startDate, $endDate);

        $recentExpenses = Expense::forUser($userId)
            ->with(['category', 'book'])
            ->completed()
            ->when($startDate && $endDate, fn ($query) => $query->inPeriod($startDate, $endDate))
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
            ->inPeriod(now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth())
            ->sum('amount_base_currency');

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'period_type' => $filters['period'] ?? 'custom',
            ],
            'summary' => [
                'total_expenses' => $totalExpenses,
                'formatted_total' => 'Rp '.number_format($totalExpenses, 2, ',', '.'),
                'pending_expenses' => $pendingExpenses,
                'this_month_expenses' => $thisMonthExpenses,
                'last_month_expenses' => $lastMonthExpenses,
                'month_over_month_change' => $lastMonthExpenses > 0
                    ? (($thisMonthExpenses - $lastMonthExpenses) / $lastMonthExpenses) * 100
                    : 0,
            ],
            'budget' => $budgetSummary,
            'expenses_by_category' => $expensesByCategory,
            'top_spending_categories' => $topCategories,
            'recent_expenses' => ExpenseResource::collection($recentExpenses)->resolve(),
        ];
    }

    /**
     * Get expenses breakdown grouped by category, optionally filtered to one category.
     *
     * @param  array<string, mixed>  $filters
     * @return array<int, array<string, mixed>>
     */
    public function getExpensesByCategory(string $userId, array $filters): array
    {
        $expenses = $this->expenseService->getExpensesByCategory(
            $userId,
            $filters['start_date'] ?? null,
            $filters['end_date'] ?? null
        );

        if (isset($filters['category_id'])) {
            $expenses = array_values(array_filter(
                $expenses,
                fn (array $expense): bool => $expense['category_id'] === $filters['category_id']
            ));
        }

        return $expenses;
    }

    /**
     * Get expenses aggregated by time bucket (day, week, month, or year).
     *
     * @param  array<string, mixed>  $filters
     * @return array<int, array<string, mixed>>
     */
    public function getExpensesByPeriod(string $userId, array $filters): array
    {
        $groupBy = $filters['group_by'] ?? 'day';

        $query = Expense::forUser($userId)
            ->with('category')
            ->completed()
            ->whereBetween('expense_date', [$filters['start_date'], $filters['end_date']]);

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        $groupedExpenses = $query->get()->groupBy(function (Expense $expense) use ($groupBy): string {
            return match ($groupBy) {
                'week' => $expense->expense_date->format('Y-W'),
                'month' => $expense->expense_date->format('Y-m'),
                'year' => $expense->expense_date->format('Y'),
                default => $expense->expense_date->format('Y-m-d'),
            };
        });

        return $groupedExpenses->map(function ($periodExpenses, string $period): array {
            return [
                'period' => $period,
                'total_amount' => $periodExpenses->sum('amount_base_currency'),
                'expense_count' => $periodExpenses->count(),
                'average_expense' => $periodExpenses->avg('amount_base_currency'),
                'categories' => $periodExpenses->groupBy('category_id')->map(function ($catExpenses): array {
                    $first = $catExpenses->first();
                    $category = $first?->category;

                    return [
                        'category_id' => $first?->category_id,
                        'category_name' => $category !== null ? $category->name : 'Uncategorized',
                        'category_color' => $category !== null ? $category->color : '#6B7280',
                        'total_amount' => $catExpenses->sum('amount_base_currency'),
                        'expense_count' => $catExpenses->count(),
                    ];
                })->values()->toArray(),
            ];
        })->values()->sortBy('period')->toArray();
    }

    /**
     * Build budget progress tracking entries paired with budget details.
     *
     * @param  array<string, mixed>  $filters
     * @return list<array<string, mixed>>
     */
    public function getBudgetTracking(string $userId, array $filters): array
    {
        $budgets = $this->budgetService->getAllBudgets($userId, [
            'is_active' => $filters['is_active'] ?? true,
            'period' => $filters['period'] ?? null,
        ]);

        return collect($budgets->items())->map(function ($budget) use ($userId): array {
            $progress = $this->budgetService->getBudgetProgress($budget->id, $userId);

            return array_merge($progress, [
                'budget_details' => (new BudgetResource($budget))->resolve(),
            ]);
        })->values()->all();
    }

    /**
     * Analyze completed expenses grouped by payment method.
     *
     * @return list<array<string, mixed>>
     */
    public function getPaymentMethodsAnalysis(string $userId, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = Expense::forUser($userId)
            ->completed()
            ->selectRaw('payment_method, COUNT(*) as expense_count, SUM(amount_base_currency) as total_amount')
            ->groupBy('payment_method');

        if ($startDate && $endDate) {
            $query->whereBetween('expense_date', [$startDate, $endDate]);
        }

        $paymentMethods = $query->get();
        $totalAmount = (float) $paymentMethods->sum(fn (Expense $item): float => (float) $item->getAttribute('total_amount'));

        return $paymentMethods->map(function (Expense $method) use ($totalAmount): array {
            $methodTotal = (float) $method->getAttribute('total_amount');
            $expenseCount = (int) $method->getAttribute('expense_count');
            $percentage = $totalAmount > 0 ? ($methodTotal / $totalAmount) * 100 : 0;

            return [
                'payment_method' => $method->payment_method,
                'label' => ucfirst(str_replace('_', ' ', (string) $method->payment_method)),
                'expense_count' => $expenseCount,
                'total_amount' => $methodTotal,
                'formatted_amount' => 'Rp '.number_format($methodTotal, 2, ',', '.'),
                'percentage' => round($percentage, 2),
            ];
        })->sortByDesc('total_amount')->values()->all();
    }

    /**
     * Build month-over-month expense comparison series.
     *
     * @return list<array<string, mixed>>
     */
    public function getMonthlyComparison(string $userId, int $months = 6): array
    {
        $monthlyData = [];

        for ($i = 0; $i < $months; $i++) {
            $monthDate = now()->subMonths($i);
            $monthStart = $monthDate->copy()->startOfMonth();
            $monthEnd = $monthDate->copy()->endOfMonth();

            $baseQuery = Expense::forUser($userId)
                ->completed()
                ->whereBetween('expense_date', [$monthStart, $monthEnd]);

            $totalExpenses = (clone $baseQuery)->sum('amount_base_currency');
            $expenseCount = (clone $baseQuery)->count();

            $monthlyData[] = [
                'month' => $monthDate->format('Y-m'),
                'month_name' => $monthDate->format('F Y'),
                'total_expenses' => $totalExpenses,
                'formatted_amount' => 'Rp '.number_format($totalExpenses, 2, ',', '.'),
                'expense_count' => $expenseCount,
                'average_expense' => $expenseCount > 0 ? $totalExpenses / $expenseCount : 0,
            ];
        }

        return array_reverse($monthlyData);
    }

    /**
     * Prepare report export payload metadata.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function prepareExport(array $filters): array
    {
        return [
            'message' => 'Export queued cleanly via buildExportArtifact',
            'report_type' => $filters['report_type'],
            'format' => $filters['format'],
        ];
    }

    /**
     * Render formatted export content and metadata for queued report generation.
     *
     * @param  array<string, mixed>  $filters
     * @return array{filename: string, mime_type: string, content: string}
     */
    public function buildExportArtifact(string $userId, array $filters): array
    {
        $reportType = (string) ($filters['report_type'] ?? 'overview');
        $format = strtolower((string) ($filters['format'] ?? 'csv'));
        $startDate = $filters['start_date'] ?? null;
        $endDate = $filters['end_date'] ?? null;

        $payload = match ($reportType) {
            'expenses' => $this->getExpensesByCategory($userId, ['start_date' => $startDate, 'end_date' => $endDate]),
            'budgets' => $this->getBudgetTracking($userId, []),
            'payment_methods' => $this->getPaymentMethodsAnalysis($userId, $startDate, $endDate),
            default => $this->getOverview($userId, ['start_date' => $startDate, 'end_date' => $endDate, 'period' => $filters['period'] ?? 'month']),
        };

        $timestamp = now()->format('Ymd_His');

        if ($format === 'json') {
            return [
                'filename' => "accounting_{$reportType}_{$timestamp}.json",
                'mime_type' => 'application/json',
                'content' => (string) json_encode([
                    'report_type' => $reportType,
                    'generated_at' => now()->toIso8601String(),
                    'data' => $payload,
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
            ];
        }

        $rows = $this->flattenReportRows($reportType, $payload);
        $handle = fopen('php://temp', 'r+');
        fwrite($handle, "\xEF\xBB\xBF");
        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }
        rewind($handle);
        $csv = (string) stream_get_contents($handle);
        fclose($handle);

        $ext = $format === 'excel' ? 'csv' : 'csv';

        return [
            'filename' => "accounting_{$reportType}_{$timestamp}.{$ext}",
            'mime_type' => 'text/csv; charset=UTF-8',
            'content' => $csv,
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<int, array<int, string|int|float|null>>
     */
    private function flattenReportRows(string $reportType, array $payload): array
    {
        $rows = [['report_type', 'key', 'value']];

        if ($reportType === 'overview') {
            $summary = $payload['summary'] ?? [];
            foreach ($summary as $key => $value) {
                $rows[] = ['overview', (string) $key, is_scalar($value) ? $value : json_encode($value)];
            }

            return $rows;
        }

        $isFirst = true;
        foreach ($payload as $index => $item) {
            if (is_array($item)) {
                if ($isFirst) {
                    $rows = [array_map('strval', array_keys($item))];
                    $isFirst = false;
                }
                $rows[] = array_map(
                    fn ($v) => is_scalar($v) || $v === null ? $v : json_encode($v),
                    array_values($item)
                );
            } else {
                $rows[] = [$reportType, (string) $index, is_scalar($item) ? $item : json_encode($item)];
            }
        }

        return $rows;
    }

    /**
     * Compute year-to-date expense totals and linear annual projection.
     *
     * @return array<string, mixed>
     */
    public function getYearToDateSummary(string $userId): array
    {
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

        $yearOverYearGrowth = $lastYearYtdExpenses > 0
            ? (($ytdExpenses - $lastYearYtdExpenses) / $lastYearYtdExpenses) * 100
            : 0;

        return [
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
    }

    /**
     * Resolve start and end date bounds from named period presets or explicit dates.
     *
     * @param  array<string, mixed>  $filters
     * @return array{0: ?string, 1: ?string}
     */
    private function resolveDateRange(array $filters): array
    {
        $startDate = $filters['start_date'] ?? null;
        $endDate = $filters['end_date'] ?? null;

        if (! isset($filters['period'])) {
            return [$startDate, $endDate];
        }

        $now = now();

        return match ($filters['period']) {
            'today' => [$now->copy()->startOfDay()->toDateTimeString(), $now->copy()->endOfDay()->toDateTimeString()],
            'week' => [$now->copy()->startOfWeek()->toDateTimeString(), $now->copy()->endOfWeek()->toDateTimeString()],
            'month' => [$now->copy()->startOfMonth()->toDateTimeString(), $now->copy()->endOfMonth()->toDateTimeString()],
            'year' => [$now->copy()->startOfYear()->toDateTimeString(), $now->copy()->endOfYear()->toDateTimeString()],
            'all' => [null, null],
            default => [$startDate, $endDate],
        };
    }
}
