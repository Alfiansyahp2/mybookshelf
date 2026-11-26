<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Accounting\StoreExpenseCategoryRequest;
use App\Http\Requests\Api\V1\Accounting\UpdateExpenseCategoryRequest;
use App\Models\ExpenseCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class ExpenseCategoryController extends Controller
{
    /**
     * Display a listing of expense categories.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = ExpenseCategory::forUser(Auth::id())
                ->with('expenses');

            if ($request->has('is_default')) {
                if ($request->boolean('is_default')) {
                    $query->default();
                } else {
                    $query->custom();
                }
            }

            $sortBy = $request->input('sort_by', 'name');
            $sortOrder = $request->input('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            $categories = $query->get();

            $categories->each(function ($category) {
                $category->total_expenses = $category->getTotalExpensesAttribute();
                $category->budget_usage_percentage = $category->getBudgetUsagePercentageAttribute();
                $category->is_budget_exceeded = $category->isBudgetExceeded();
                $category->is_near_threshold = $category->isNearThreshold();
            });

            return response()->success($categories, 'Expense categories retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::index failed');
        }
    }

    /**
     * Store a newly created expense category.
     */
    public function store(StoreExpenseCategoryRequest $request): JsonResponse
    {
        Gate::authorize('create', ExpenseCategory::class);

        try {
            $validated = $request->validated();

            $category = ExpenseCategory::create([
                'id' => Str::uuid()->toString(),
                'user_id' => $request->user()->id,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'color' => $validated['color'] ?? '#3B82F6',
                'icon' => $validated['icon'] ?? null,
                'is_default' => false,
                'monthly_budget' => $validated['monthly_budget'] ?? null,
                'budget_currency' => $validated['budget_currency'] ?? 'IDR',
            ]);

            return response()->success($category, 'Expense category created successfully', 201);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::store failed');
        }
    }

    /**
     * Display the specified expense category.
     */
    public function show(ExpenseCategory $category): JsonResponse
    {
        Gate::authorize('view', $category);

        try {
            $category->load(['expenses', 'budgets']);
            $category->total_expenses = $category->getTotalExpensesAttribute();
            $category->budget_usage_percentage = $category->getBudgetUsagePercentageAttribute();
            $category->is_budget_exceeded = $category->isBudgetExceeded();
            $category->is_near_threshold = $category->isNearThreshold();
            $category->formatted_budget = $category->getFormattedBudgetAttribute();

            return response()->success($category, 'Expense category retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::show failed');
        }
    }

    /**
     * Update the specified expense category.
     */
    public function update(UpdateExpenseCategoryRequest $request, ExpenseCategory $category): JsonResponse
    {
        Gate::authorize('update', $category);

        try {
            $validated = $request->validated();

            if ($category->is_default) {
                $validated['is_default'] = true;
            }

            $category->update($validated);

            return response()->success($category->fresh(), 'Expense category updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::update failed');
        }
    }

    /**
     * Remove the specified expense category.
     */
    public function destroy(ExpenseCategory $category): JsonResponse
    {
        Gate::authorize('delete', $category);

        try {
            if ($category->expenses()->count() > 0) {
                return response()->error('Cannot delete expense category with existing expenses', null, 422);
            }

            $category->delete();

            return response()->success(null, 'Expense category deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::destroy failed');
        }
    }

    /**
     * Build the canonical default expense category definitions.
     */
    private function defaultCategoryDefinitions(): array
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
     * Get default expense categories.
     */
    public function getDefaultCategories(): JsonResponse
    {
        try {
            return response()->success($this->defaultCategoryDefinitions(), 'Default expense categories retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::getDefaultCategories failed');
        }
    }

    /**
     * Initialize default categories for user (if they don't have any).
     */
    public function initializeDefaults(): JsonResponse
    {
        try {
            $userId = Auth::id();

            $existingCategories = ExpenseCategory::forUser($userId)->count();
            if ($existingCategories > 0) {
                return response()->error('User already has expense categories', null, 422);
            }

            foreach ($this->defaultCategoryDefinitions() as $definition) {
                ExpenseCategory::create(array_merge($definition, [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'is_default' => true,
                ]));
            }

            $categories = ExpenseCategory::forUser($userId)->get();

            return response()->success($categories, 'Default expense categories initialized successfully', 201);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::initializeDefaults failed');
        }
    }

    /**
     * Get category statistics.
     */
    public function getStatistics(ExpenseCategory $category): JsonResponse
    {
        Gate::authorize('view', $category);

        try {
            $expenses = $category->expenses()->completed()->get();

            $statistics = [
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

            return response()->success($statistics, 'Category statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::getStatistics failed');
        }
    }
}
