<?php

namespace App\Http\Controllers\Api\V1\Accounting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Accounting\StoreExpenseCategoryRequest;
use App\Http\Requests\Api\V1\Accounting\UpdateExpenseCategoryRequest;
use App\Http\Resources\Api\V1\Accounting\ExpenseCategoryResource;
use App\Http\Resources\Api\V1\Accounting\ExpenseResource;
use App\Models\ExpenseCategory;
use App\Services\Accounting\ExpenseCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ExpenseCategoryController extends Controller
{
    public function __construct(
        private ExpenseCategoryService $expenseCategoryService
    ) {}

    /**
     * Display a listing of expense categories.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $categories = $this->expenseCategoryService->listForUser(Auth::id(), [
                'is_default' => $request->has('is_default') ? $request->input('is_default') : null,
                'sort_by' => $request->input('sort_by', 'name'),
                'sort_order' => $request->input('sort_order', 'asc'),
            ]);

            return response()->success(
                ExpenseCategoryResource::collection($categories),
                'Expense categories retrieved successfully'
            );
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
            $category = $this->expenseCategoryService->createForUser(
                $request->user()->id,
                $request->validated()
            );

            return response()->success(
                new ExpenseCategoryResource($category),
                'Expense category created successfully',
                201
            );
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
            return response()->success(
                new ExpenseCategoryResource($category->load(['expenses', 'budgets'])),
                'Expense category retrieved successfully'
            );
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
            $updated = $this->expenseCategoryService->updateCategory($category, $request->validated());

            return response()->success(
                new ExpenseCategoryResource($updated),
                'Expense category updated successfully'
            );
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
            $this->expenseCategoryService->deleteCategory($category);

            return response()->success(null, 'Expense category deleted successfully');
        } catch (\InvalidArgumentException $e) {
            return response()->error($e->getMessage(), null, 422);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::destroy failed');
        }
    }

    /**
     * Get default expense category definitions.
     */
    public function getDefaultCategories(): JsonResponse
    {
        try {
            return response()->success(
                $this->expenseCategoryService->getDefaultDefinitions(),
                'Default expense categories retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::getDefaultCategories failed');
        }
    }

    /**
     * Initialize default categories for user when none exist yet.
     */
    public function initializeDefaults(): JsonResponse
    {
        try {
            $categories = $this->expenseCategoryService->initializeDefaultsForUser(Auth::id());

            return response()->success(
                ExpenseCategoryResource::collection($categories),
                'Default expense categories initialized successfully',
                201
            );
        } catch (\InvalidArgumentException $e) {
            return response()->error($e->getMessage(), null, 422);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::initializeDefaults failed');
        }
    }

    /**
     * Get spending statistics for an expense category.
     */
    public function getStatistics(ExpenseCategory $category): JsonResponse
    {
        Gate::authorize('view', $category);

        try {
            $statistics = $this->expenseCategoryService->getStatistics($category);
            $statistics['recent_expenses'] = ExpenseResource::collection($statistics['recent_expenses'])->resolve(request());

            return response()->success($statistics, 'Category statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseCategoryController::getStatistics failed');
        }
    }
}
