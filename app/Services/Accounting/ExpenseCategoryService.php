<?php

namespace App\Services\Accounting;

use App\Models\ExpenseCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ExpenseCategoryService
{
    /**
     * List expense categories for a user with optional default/custom filtering and sorting.
     */
    public function listForUser(string $userId, array $filters = []): Collection
    {
        $query = ExpenseCategory::forUser($userId)->with('expenses');

        if (array_key_exists('is_default', $filters) && $filters['is_default'] !== null) {
            if (filter_var($filters['is_default'], FILTER_VALIDATE_BOOLEAN)) {
                $query->default();
            } else {
                $query->custom();
            }
        }

        $sortBy = $filters['sort_by'] ?? 'name';
        $sortOrder = $filters['sort_order'] ?? 'asc';

        return $query->orderBy($sortBy, $sortOrder)->get();
    }

    /**
     * Create a new custom expense category for a user.
     */
    public function createForUser(string $userId, array $data): ExpenseCategory
    {
        return ExpenseCategory::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'color' => $data['color'] ?? '#3B82F6',
            'icon' => $data['icon'] ?? null,
            'is_default' => false,
            'monthly_budget' => $data['monthly_budget'] ?? null,
            'budget_currency' => $data['budget_currency'] ?? 'IDR',
        ]);
    }

    /**
     * Update an existing expense category while preserving is_default on built-in categories.
     */
    public function updateCategory(ExpenseCategory $category, array $data): ExpenseCategory
    {
        if ($category->is_default) {
            $data['is_default'] = true;
        }

        $category->update($data);

        return $category->fresh();
    }

    /**
     * Delete an expense category once verified it has no attached expenses.
     *
     * @throws \InvalidArgumentException
     */
    public function deleteCategory(ExpenseCategory $category): void
    {
        if ($category->expenses()->count() > 0) {
            throw new \InvalidArgumentException('Cannot delete expense category with existing expenses');
        }

        $category->delete();
    }

    /**
     * Canonical default expense category definitions for new users.
     */
    public function getDefaultDefinitions(): array
    {
        return [
            [
                'name' => 'Book Purchases',
                'description' => 'Pembelian buku baru dan bekas',
                'icon' => '📚',
                'color' => '#3B82F6',
                'monthly_budget' => 500000,
                'budget_currency' => 'IDR',
            ],
            [
                'name' => 'Shipping & Handling',
                'description' => 'Biaya pengiriman dan penanganan',
                'icon' => '📦',
                'color' => '#F59E0B',
                'monthly_budget' => 100000,
                'budget_currency' => 'IDR',
            ],
            [
                'name' => 'Book Maintenance',
                'description' => 'Perawatan, repair, dan aksesori buku',
                'icon' => '🔧',
                'color' => '#10B981',
                'monthly_budget' => 50000,
                'budget_currency' => 'IDR',
            ],
            [
                'name' => 'Gifts & Donations',
                'description' => 'Buku sebagai hadiah atau donasi',
                'icon' => '🎁',
                'color' => '#EC4899',
                'monthly_budget' => 200000,
                'budget_currency' => 'IDR',
            ],
            [
                'name' => 'Other Expenses',
                'description' => 'Pengeluaran lain terkait buku',
                'icon' => '📝',
                'color' => '#6B7280',
                'monthly_budget' => 100000,
                'budget_currency' => 'IDR',
            ],
        ];
    }

    /**
     * Seed default expense categories for a user who does not yet have any.
     *
     * @throws \InvalidArgumentException
     */
    public function initializeDefaultsForUser(string $userId): Collection
    {
        if (ExpenseCategory::forUser($userId)->count() > 0) {
            throw new \InvalidArgumentException('User already has expense categories');
        }

        foreach ($this->getDefaultDefinitions() as $definition) {
            ExpenseCategory::create(array_merge($definition, [
                'id' => Str::uuid()->toString(),
                'user_id' => $userId,
                'is_default' => true,
            ]));
        }

        return ExpenseCategory::forUser($userId)->get();
    }

    /**
     * Build statistics and recent completed expenses for a category.
     */
    public function getStatistics(ExpenseCategory $category): array
    {
        $expenses = $category->expenses()->completed()->get();

        return [
            'category_id' => $category->id,
            'category_name' => $category->name,
            'total_expenses' => $expenses->count(),
            'total_amount' => $expenses->sum('amount_base_currency'),
            'average_expense' => $expenses->avg('amount_base_currency'),
            'highest_expense' => $expenses->max('amount_base_currency'),
            'lowest_expense' => $expenses->min('amount_base_currency'),
            'monthly_budget' => $category->monthly_budget,
            'budget_usage' => $category->getBudgetUsagePercentageAttribute(),
            'budget_remaining' => max(0, $category->monthly_budget - $expenses->sum('amount_base_currency')),
            'recent_expenses' => $category->expenses()
                ->completed()
                ->orderBy('expense_date', 'desc')
                ->limit(5)
                ->get(),
        ];
    }
}
