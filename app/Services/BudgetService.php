<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\Expense;
use App\Models\AccountingTimelineEvent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class BudgetService
{
    /**
     * Get all budgets for a user.
     */
    public function getAllBudgets(string $userId, array $filters = [])
    {
        $query = Budget::with(['category', 'user'])
                      ->forUser($userId);

        // Apply filters
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['period'])) {
            $query->byPeriod($filters['period']);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    /**
     * Get a single budget by ID with progress info.
     */
    public function getBudget(string $budgetId, string $userId): Budget
    {
        return Budget::with(['category', 'user'])
                    ->forUser($userId)
                    ->findOrFail($budgetId);
    }

    /**
     * Get budget progress information.
     */
    public function getBudgetProgress(string $budgetId, string $userId): array
    {
        $budget = $this->getBudget($budgetId, $userId);

        $totalSpent = $budget->total_spent;
        $remainingAmount = $budget->remaining_amount;
        $usagePercentage = $budget->usage_percentage;
        $status = $budget->status;

        return [
            'budget_id' => $budget->id,
            'budget_name' => $budget->name,
            'budget_amount' => $budget->formatted_amount,
            'total_spent' => $budget->formatted_spent,
            'remaining_amount' => $budget->formatted_remaining,
            'usage_percentage' => round($usagePercentage, 2),
            'status' => $status,
            'is_exceeded' => $budget->isExceeded(),
            'is_at_threshold' => $budget->isAtAlertThreshold(),
            'alert_threshold' => $budget->alert_threshold,
            'period' => $budget->period,
            'start_date' => $budget->start_date->format('Y-m-d'),
            'end_date' => $budget->end_date?->format('Y-m-d'),
            'category' => $budget->category?->name,
        ];
    }

    /**
     * Create a new budget.
     */
    public function createBudget(array $data, string $userId): Budget
    {
        DB::beginTransaction();

        try {
            // Convert currency to base currency
            $baseCurrencyAmount = $this->convertToBaseCurrency(
                $data['amount'],
                $data['currency'] ?? 'IDR'
            );

            $budget = Budget::create([
                'id' => Str::uuid()->toString(),
                'user_id' => $userId,
                'category_id' => $data['category_id'] ?? null,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'IDR',
                'amount_base_currency' => $baseCurrencyAmount,
                'period' => $data['period'] ?? 'monthly',
                'start_date' => $data['start_date'] ?? now()->startOfMonth(),
                'end_date' => $data['end_date'] ?? null,
                'alert_threshold' => $data['alert_threshold'] ?? 80.00,
                'is_active' => $data['is_active'] ?? true,
            ]);

            DB::commit();

            return $budget->load(['category', 'user']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing budget.
     */
    public function updateBudget(string $budgetId, array $data, string $userId): Budget
    {
        DB::beginTransaction();

        try {
            $budget = $this->getBudget($budgetId, $userId);

            // Update currency conversion if amount changed
            if (isset($data['amount']) || isset($data['currency'])) {
                $amount = $data['amount'] ?? $budget->amount;
                $currency = $data['currency'] ?? $budget->currency;

                $data['amount_base_currency'] = $this->convertToBaseCurrency($amount, $currency);
            }

            $budget->update($data);

            // Check if budget alerts need to be triggered
            $this->checkSingleBudgetAlert($budget);

            DB::commit();

            return $budget->fresh(['category', 'user']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a budget.
     */
    public function deleteBudget(string $budgetId, string $userId): bool
    {
        DB::beginTransaction();

        try {
            $budget = $this->getBudget($budgetId, $userId);

            // Check if budget has associated alerts in timeline
            $hasEvents = AccountingTimelineEvent::where('budget_id', $budgetId)->exists();

            if ($hasEvents) {
                // Soft delete will preserve the timeline events
                $budget->delete();
            } else {
                $budget->forceDelete();
            }

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get expenses for a budget.
     */
    public function getExpensesForBudget(string $budgetId, string $userId, array $filters = [])
    {
        $budget = $this->getBudget($budgetId, $userId);

        $query = Expense::with(['category', 'book'])
                       ->forUser($userId)
                       ->completed()
                       ->whereBetween('expense_date', [$budget->start_date, $budget->end_date ?? now()]);

        // If budget is for a specific category, filter by it
        if ($budget->category_id) {
            $query->where('category_id', $budget->category_id);
        }

        // Apply additional filters
        if (isset($filters['start_date']) && isset($filters['end_date'])) {
            $query->inPeriod($filters['start_date'], $filters['end_date']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'expense_date';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    /**
     * Check all budget alerts for a user.
     */
    public function checkBudgetAlerts(string $userId): array
    {
        $budgets = Budget::forUser($userId)
                        ->active()
                        ->current()
                        ->get();

        $alerts = [];

        foreach ($budgets as $budget) {
            $alert = $this->checkSingleBudgetAlert($budget);
            if ($alert) {
                $alerts[] = $alert;
            }
        }

        return $alerts;
    }

    /**
     * Check if a single budget needs alerts.
     */
    public function checkSingleBudgetAlert(Budget $budget): ?array
    {
        $usage = $budget->usage_percentage;

        // Check if budget exceeded
        if ($usage > 100) {
            // Check if we haven't already created an exceeded event recently
            $recentExceededEvent = AccountingTimelineEvent::where('budget_id', $budget->id)
                                                          ->where('type', 'budget_exceeded')
                                                          ->where('event_date', '>=', now()->subDay())
                                                          ->exists();

            if (!$recentExceededEvent) {
                AccountingTimelineEvent::budgetExceeded($budget->id, $budget->user_id);

                return [
                    'budget_id' => $budget->id,
                    'budget_name' => $budget->name,
                    'type' => 'exceeded',
                    'usage_percentage' => round($usage, 2),
                    'amount' => $budget->formatted_amount,
                    'spent' => $budget->formatted_spent,
                    'message' => "Budget '{$budget->name}' has been exceeded by " . round($usage - 100, 2) . "%",
                ];
            }
        }

        // Check if budget at warning threshold
        elseif ($usage >= $budget->alert_threshold && $usage <= 100) {
            // Check if we haven't already created an alert event recently
            $recentAlertEvent = AccountingTimelineEvent::where('budget_id', $budget->id)
                                                      ->where('type', 'budget_alert')
                                                      ->where('event_date', '>=', now()->subDay())
                                                      ->exists();

            if (!$recentAlertEvent) {
                AccountingTimelineEvent::budgetAlert($budget->id, $budget->user_id);

                return [
                    'budget_id' => $budget->id,
                    'budget_name' => $budget->name,
                    'type' => 'warning',
                    'usage_percentage' => round($usage, 2),
                    'amount' => $budget->formatted_amount,
                    'spent' => $budget->formatted_spent,
                    'threshold' => $budget->alert_threshold,
                    'message' => "Budget '{$budget->name}' is at " . round($usage, 2) . "% capacity (threshold: {$budget->alert_threshold}%)",
                ];
            }
        }

        return null;
    }

    /**
     * Reset budget period (for recurring budgets).
     */
    public function resetBudgetPeriod(string $budgetId, string $userId): Budget
    {
        DB::beginTransaction();

        try {
            $budget = $this->getBudget($budgetId, $userId);

            // Calculate new start and end dates based on period
            $newStartDate = $this->calculateNextPeriodStartDate($budget);
            $newEndDate = $this->calculateNextPeriodEndDate($budget, $newStartDate);

            $budget->update([
                'start_date' => $newStartDate,
                'end_date' => $newEndDate,
            ]);

            DB::commit();

            return $budget->fresh(['category', 'user']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Calculate next period start date.
     */
    protected function calculateNextPeriodStartDate(Budget $budget): string
    {
        $currentStart = $budget->start_date;

        switch($budget->period) {
            case 'daily':
                return $currentStart->addDay()->format('Y-m-d');
            case 'weekly':
                return $currentStart->addWeek()->format('Y-m-d');
            case 'monthly':
                return $currentStart->addMonth()->format('Y-m-d');
            case 'yearly':
                return $currentStart->addYear()->format('Y-m-d');
            default:
                return $currentStart->addMonth()->format('Y-m-d');
        }
    }

    /**
     * Calculate next period end date.
     */
    protected function calculateNextPeriodEndDate(Budget $budget, string $startDate): ?string
    {
        if (!$budget->end_date) {
            return null;
        }

        $start = \Carbon\Carbon::parse($startDate);
        $duration = $budget->end_date->diffInDays($budget->start_date);

        return $start->addDays($duration)->format('Y-m-d');
    }

    /**
     * Convert amount to base currency (IDR).
     */
    protected function convertToBaseCurrency(float $amount, string $currency): float
    {
        if ($currency === 'IDR') {
            return $amount;
        }

        $currencyRateService = new CurrencyRateService();
        return $currencyRateService->convertAmount($amount, $currency)['converted_amount'];
    }

    /**
     * Get budget summary for dashboard.
     */
    public function getBudgetSummary(?string $userId): array
    {
        // Handle empty or invalid user ID
        if (empty($userId)) {
            return $this->getEmptyBudgetSummary();
        }

        try {
            $activeBudgets = Budget::forUser($userId)
                                  ->active()
                                  ->current()
                                  ->get();

            $totalBudget = $activeBudgets->sum('amount_base_currency');
            $totalSpent = 0;
            $exceededCount = 0;
            $warningCount = 0;

            foreach ($activeBudgets as $budget) {
                $totalSpent += $budget->total_spent;

                if ($budget->isExceeded()) {
                    $exceededCount++;
                } elseif ($budget->isAtAlertThreshold()) {
                    $warningCount++;
                }
            }

            return [
                'total_budget' => $totalBudget,
                'total_spent' => $totalSpent,
                'total_remaining' => max(0, $totalBudget - $totalSpent),
                'overall_usage_percentage' => $totalBudget > 0 ? ($totalSpent / $totalBudget) * 100 : 0,
                'active_budgets_count' => $activeBudgets->count(),
                'exceeded_count' => $exceededCount,
                'warning_count' => $warningCount,
                'healthy_count' => $activeBudgets->count() - $exceededCount - $warningCount,
            ];
        } catch (\Exception $e) {
            // Return empty summary on any database errors
            return $this->getEmptyBudgetSummary();
        }
    }

    /**
     * Get empty budget summary when user is not authenticated or no data exists.
     */
    protected function getEmptyBudgetSummary(): array
    {
        return [
            'total_budget' => 0,
            'total_spent' => 0,
            'total_remaining' => 0,
            'overall_usage_percentage' => 0,
            'active_budgets_count' => 0,
            'exceeded_count' => 0,
            'warning_count' => 0,
            'healthy_count' => 0,
        ];
    }

    /**
     * Get top spending categories for a budget period.
     */
    public function getTopSpendingCategories(string $userId, ?string $startDate = null, ?string $endDate = null, int $limit = 5): array
    {
        $query = Expense::select('category_id')
                       ->selectRaw('SUM(amount_base_currency) as total_amount')
                       ->selectRaw('COUNT(*) as expense_count')
                       ->where('user_id', $userId)
                       ->completed()
                       ->whereNotNull('category_id')
                       ->groupBy('category_id')
                       ->orderBy('total_amount', 'desc')
                       ->limit($limit);

        if ($startDate && $endDate) {
            $query->whereBetween('expense_date', [$startDate, $endDate]);
        }

        $results = $query->get();

        return $results->map(function ($result) {
            $category = \App\Models\ExpenseCategory::find($result->category_id);

            return [
                'category_id' => $result->category_id,
                'category_name' => $category?->name ?? 'Unknown',
                'category_color' => $category?->color ?? '#6B7280',
                'category_icon' => $category?->icon ?? '📊',
                'total_amount' => $result->total_amount,
                'expense_count' => $result->expense_count,
            ];
        })->toArray();
    }

    /**
     * Deactivate expired budgets.
     */
    public function deactivateExpiredBudgets(): int
    {
        return Budget::where('end_date', '<', now())
                    ->where('is_active', true)
                    ->update(['is_active' => false]);
    }

    /**
     * Get budget performance trends.
     */
    public function getBudgetPerformanceTrends(string $budgetId, string $userId): array
    {
        $budget = $this->getBudget($budgetId, $userId);

        // Get expenses grouped by date
        $expenses = Expense::where('user_id', $userId)
                           ->where('category_id', $budget->category_id)
                           ->whereBetween('expense_date', [$budget->start_date, $budget->end_date ?? now()])
                           ->completed()
                           ->selectRaw('DATE(expense_date) as date, SUM(amount_base_currency) as daily_total')
                           ->groupBy('date')
                           ->orderBy('date')
                           ->get();

        return [
            'budget_id' => $budget->id,
            'budget_name' => $budget->name,
            'budget_amount' => $budget->amount_base_currency,
            'period_start' => $budget->start_date->format('Y-m-d'),
            'period_end' => $budget->end_date?->format('Y-m-d'),
            'daily_spending' => $expenses->map(function ($expense) {
                return [
                    'date' => $expense->date,
                    'amount' => $expense->daily_total,
                ];
            })->toArray(),
        ];
    }
}