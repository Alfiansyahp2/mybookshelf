<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\BudgetService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class BudgetController extends Controller
{
    protected $budgetService;

    public function __construct(BudgetService $budgetService)
    {
        $this->budgetService = $budgetService;
    }

    /**
     * Display a listing of budgets.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = [
                'is_active' => $request->input('is_active'),
                'period' => $request->input('period'),
                'category_id' => $request->input('category_id'),
                'sort_by' => $request->input('sort_by', 'created_at'),
                'sort_order' => $request->input('sort_order', 'desc'),
                'per_page' => $request->input('per_page', 15),
            ];

            $budgets = $this->budgetService->getAllBudgets(Auth::id(), $filters);

            return response()->success($budgets, 'Budgets retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::index failed');
        }
    }

    /**
     * Store a newly created budget.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'amount' => 'required|numeric|min:0',
                'currency' => 'nullable|string|size:3',
                'period' => 'nullable|in:daily,weekly,monthly,yearly',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'category_id' => ['nullable', 'uuid', $this->ownedRule('expense_categories', $userId)],
                'alert_threshold' => 'nullable|numeric|min:1|max:100',
                'is_active' => 'nullable|boolean',
            ]);

            $budget = $this->budgetService->createBudget($validated, $userId);

            return response()->success($budget, 'Budget created successfully', 201);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::store failed');
        }
    }

    /**
     * Display the specified budget.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $budget = $this->budgetService->getBudget($id, Auth::id());

            return response()->success($budget, 'Budget retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Budget not found');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::show failed');
        }
    }

    /**
     * Update the specified budget.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $userId = Auth::id();

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'amount' => 'sometimes|required|numeric|min:0',
                'currency' => 'nullable|string|size:3',
                'period' => 'nullable|in:daily,weekly,monthly,yearly',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'category_id' => ['nullable', 'uuid', $this->ownedRule('expense_categories', $userId)],
                'alert_threshold' => 'nullable|numeric|min:1|max:100',
                'is_active' => 'nullable|boolean',
            ]);

            $budget = $this->budgetService->updateBudget($id, $validated, $userId);

            return response()->success($budget, 'Budget updated successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Budget not found');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::update failed');
        }
    }

    /**
     * Remove the specified budget.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->budgetService->deleteBudget($id, Auth::id());

            return response()->success(null, 'Budget deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Budget not found');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::destroy failed');
        }
    }

    /**
     * Get budget progress information.
     */
    public function getProgress(string $id): JsonResponse
    {
        try {
            $progress = $this->budgetService->getBudgetProgress($id, Auth::id());

            return response()->success($progress, 'Budget progress retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Budget not found');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::getProgress failed');
        }
    }

    /**
     * Get expenses for a budget.
     */
    public function getExpenses(Request $request, string $id): JsonResponse
    {
        try {
            $filters = [
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'sort_by' => $request->input('sort_by', 'expense_date'),
                'sort_order' => $request->input('sort_order', 'desc'),
                'per_page' => $request->input('per_page', 15),
            ];

            $expenses = $this->budgetService->getExpensesForBudget($id, Auth::id(), $filters);

            return response()->success($expenses, 'Budget expenses retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Budget not found');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::getExpenses failed');
        }
    }

    /**
     * Reset budget period.
     */
    public function resetPeriod(string $id): JsonResponse
    {
        try {
            $budget = $this->budgetService->resetBudgetPeriod($id, Auth::id());

            return response()->success($budget, 'Budget period reset successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Budget not found');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::resetPeriod failed');
        }
    }

    /**
     * Check all budget alerts for user.
     */
    public function checkAlerts(): JsonResponse
    {
        try {
            $alerts = $this->budgetService->checkBudgetAlerts(Auth::id());

            return response()->success($alerts, 'Budget alerts checked successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::checkAlerts failed');
        }
    }

    /**
     * Get budget summary for dashboard.
     */
    public function getSummary(): JsonResponse
    {
        try {
            $summary = $this->budgetService->getBudgetSummary(Auth::id());

            return response()->success($summary, 'Budget summary retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::getSummary failed');
        }
    }

    /**
     * Get top spending categories.
     */
    public function getTopSpendingCategories(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'limit' => 'nullable|integer|min:1|max:20',
            ]);

            $topCategories = $this->budgetService->getTopSpendingCategories(
                Auth::id(),
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null,
                $validated['limit'] ?? 5
            );

            return response()->success($topCategories, 'Top spending categories retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::getTopSpendingCategories failed');
        }
    }

    /**
     * Get budget performance trends.
     */
    public function getPerformanceTrends(string $id): JsonResponse
    {
        try {
            $trends = $this->budgetService->getBudgetPerformanceTrends($id, Auth::id());

            return response()->success($trends, 'Budget performance trends retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Budget not found');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BudgetController::getPerformanceTrends failed');
        }
    }
}