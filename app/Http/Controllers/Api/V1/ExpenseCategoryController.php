<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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

            // Filter by type
            if ($request->has('is_default')) {
                if ($request->boolean('is_default')) {
                    $query->default();
                } else {
                    $query->custom();
                }
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'name');
            $sortOrder = $request->input('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            $categories = $query->get();

            // Add calculated fields
            $categories->each(function ($category) {
                $category->total_expenses = $category->getTotalExpensesAttribute();
                $category->budget_usage_percentage = $category->getBudgetUsagePercentageAttribute();
                $category->is_budget_exceeded = $category->isBudgetExceeded();
                $category->is_near_threshold = $category->isNearThreshold();
            });

            return response()->success($categories, 'Expense categories retrieved successfully');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created expense category.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'description' => 'nullable|string',
                'color' => 'nullable|string|max:7',
                'icon' => 'nullable|string|max:50',
                'monthly_budget' => 'nullable|numeric|min:0',
                'budget_currency' => 'nullable|string|size:3',
            ]);

            $category = ExpenseCategory::create([
                'id' => Str::uuid()->toString(),
                'user_id' => Auth::id(),
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'color' => $validated['color'] ?? '#3B82F6',
                'icon' => $validated['icon'] ?? null,
                'is_default' => false,
                'monthly_budget' => $validated['monthly_budget'] ?? null,
                'budget_currency' => $validated['budget_currency'] ?? 'IDR',
            ]);

            return response()->success($category, 'Expense category created successfully', 201);
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified expense category.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $category = ExpenseCategory::with(['expenses', 'budgets'])
                                       ->forUser(Auth::id())
                                       ->findOrFail($id);

            // Add calculated fields
            $category->total_expenses = $category->getTotalExpensesAttribute();
            $category->budget_usage_percentage = $category->getBudgetUsagePercentageAttribute();
            $category->is_budget_exceeded = $category->isBudgetExceeded();
            $category->is_near_threshold = $category->isNearThreshold();
            $category->formatted_budget = $category->getFormattedBudgetAttribute();

            return response()->success($category, 'Expense category retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense category not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Update the specified expense category.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:100',
                'description' => 'nullable|string',
                'color' => 'nullable|string|max:7',
                'icon' => 'nullable|string|max:50',
                'monthly_budget' => 'nullable|numeric|min:0',
                'budget_currency' => 'nullable|string|size:3',
            ]);

            $category = ExpenseCategory::forUser(Auth::id())->findOrFail($id);

            // Don't allow modifying default category name/is_default status
            if ($category->is_default) {
                $validated['is_default'] = true;
            }

            $category->update($validated);

            return response()->success($category->fresh(), 'Expense category updated successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense category not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified expense category.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $category = ExpenseCategory::forUser(Auth::id())->findOrFail($id);

            // Don't allow deleting default categories
            if ($category->is_default) {
                return response()->error('Cannot delete default expense categories', 403);
            }

            // Check if category has expenses
            if ($category->expenses()->count() > 0) {
                return response()->error('Cannot delete expense category with existing expenses', 422);
            }

            $category->delete();

            return response()->success(null, 'Expense category deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense category not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get default expense categories.
     */
    public function getDefaultCategories(): JsonResponse
    {
        try {
            // Get the default categories structure
            $defaultCategories = [
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

            return response()->success($defaultCategories, 'Default expense categories retrieved successfully');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Initialize default categories for user (if they don't have any).
     */
    public function initializeDefaults(): JsonResponse
    {
        try {
            $userId = Auth::id();

            // Check if user already has categories
            $existingCategories = ExpenseCategory::forUser($userId)->count();
            if ($existingCategories > 0) {
                return response()->error('User already has expense categories', 422);
            }

            // Create default categories for user
            $defaultCategories = [
                [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'name' => 'Book Purchases',
                    'description' => 'Pembelian buku baru dan bekas',
                    'icon' => '📚',
                    'color' => '#3B82F6',
                    'monthly_budget' => 500000,
                    'budget_currency' => 'IDR',
                    'is_default' => true,
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'name' => 'Shipping & Handling',
                    'description' => 'Biaya pengiriman dan penanganan',
                    'icon' => '📦',
                    'color' => '#F59E0B',
                    'monthly_budget' => 100000,
                    'budget_currency' => 'IDR',
                    'is_default' => true,
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'name' => 'Book Maintenance',
                    'description' => 'Perawatan, repair, dan aksesori buku',
                    'icon' => '🔧',
                    'color' => '#10B981',
                    'monthly_budget' => 50000,
                    'budget_currency' => 'IDR',
                    'is_default' => true,
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'name' => 'Gifts & Donations',
                    'description' => 'Buku sebagai hadiah atau donasi',
                    'icon' => '🎁',
                    'color' => '#EC4899',
                    'monthly_budget' => 200000,
                    'budget_currency' => 'IDR',
                    'is_default' => true,
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'name' => 'Other Expenses',
                    'description' => 'Pengeluaran lain terkait buku',
                    'icon' => '📝',
                    'color' => '#6B7280',
                    'monthly_budget' => 100000,
                    'budget_currency' => 'IDR',
                    'is_default' => true,
                ],
            ];

            foreach ($defaultCategories as $category) {
                ExpenseCategory::create($category);
            }

            $categories = ExpenseCategory::forUser($userId)->get();

            return response()->success($categories, 'Default expense categories initialized successfully', 201);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get category statistics.
     */
    public function getStatistics(string $id): JsonResponse
    {
        try {
            $category = ExpenseCategory::forUser(Auth::id())->findOrFail($id);

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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense category not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}