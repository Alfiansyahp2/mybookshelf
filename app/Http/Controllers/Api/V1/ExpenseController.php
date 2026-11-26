<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Accounting\ConvertExpenseCurrencyRequest;
use App\Http\Requests\Api\V1\Accounting\DateRangeRequest;
use App\Http\Requests\Api\V1\Accounting\StoreExpenseRequest;
use App\Http\Requests\Api\V1\Accounting\UpdateExpenseRequest;
use App\Http\Requests\Api\V1\Accounting\UploadExpenseReceiptRequest;
use App\Models\AccountingTimelineEvent;
use App\Models\Expense;
use App\Services\CurrencyRateService;
use App\Services\ExpenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ExpenseController extends Controller
{
    protected $expenseService;

    public function __construct(ExpenseService $expenseService)
    {
        $this->expenseService = $expenseService;
    }

    /**
     * Display a listing of expenses.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = [
                'category_id' => $request->input('category_id'),
                'payment_method' => $request->input('payment_method'),
                'status' => $request->input('status'),
                'book_id' => $request->input('book_id'),
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'is_recurring' => $request->input('is_recurring'),
                'sort_by' => $request->input('sort_by', 'expense_date'),
                'sort_order' => $request->input('sort_order', 'desc'),
                'per_page' => $request->input('per_page', 15),
            ];

            $expenses = $this->expenseService->getAllExpenses($filters, Auth::id());

            return response()->success($expenses, 'Expenses retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::index failed');
        }
    }

    /**
     * Store a newly created expense.
     */
    public function store(StoreExpenseRequest $request): JsonResponse
    {
        Gate::authorize('create', Expense::class);

        try {
            $expense = $this->expenseService->createExpense($request->validated(), $request->user()->id);

            return response()->success($expense, 'Expense created successfully', 201);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::store failed');
        }
    }

    /**
     * Display the specified expense.
     */
    public function show(Expense $expense): JsonResponse
    {
        Gate::authorize('view', $expense);

        return response()->success($expense->load(['category', 'book']), 'Expense retrieved successfully');
    }

    /**
     * Update the specified expense.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense): JsonResponse
    {
        Gate::authorize('update', $expense);

        try {
            $updated = $this->expenseService->updateExpense($expense->id, $request->validated(), $request->user()->id);

            return response()->success($updated, 'Expense updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::update failed');
        }
    }

    /**
     * Remove the specified expense.
     */
    public function destroy(Expense $expense): JsonResponse
    {
        Gate::authorize('delete', $expense);

        try {
            $this->expenseService->deleteExpense($expense->id, Auth::id());

            return response()->success(null, 'Expense deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::destroy failed');
        }
    }

    /**
     * Upload receipt for expense.
     */
    public function uploadReceipt(UploadExpenseReceiptRequest $request, Expense $expense): JsonResponse
    {
        Gate::authorize('update', $expense);

        try {
            $updated = $this->expenseService->uploadReceipt($expense->id, $request->validated(), $request->user()->id);

            return response()->success($updated, 'Receipt uploaded successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::uploadReceipt failed');
        }
    }

    /**
     * Get receipt for expense.
     */
    public function getReceipt(Expense $expense): JsonResponse
    {
        Gate::authorize('view', $expense);

        try {
            $receipt = $this->expenseService->getReceipt($expense->id, Auth::id());

            return response()->success($receipt, 'Receipt retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::getReceipt failed');
        }
    }

    /**
     * Duplicate an expense.
     */
    public function duplicate(Expense $expense): JsonResponse
    {
        Gate::authorize('update', $expense);

        try {
            $duplicated = $this->expenseService->duplicateExpense($expense->id, Auth::id());

            return response()->success($duplicated, 'Expense duplicated successfully', 201);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::duplicate failed');
        }
    }

    /**
     * Convert currency for expense.
     */
    public function convertCurrency(ConvertExpenseCurrencyRequest $request, Expense $expense): JsonResponse
    {
        Gate::authorize('view', $expense);

        try {
            $currencyRateService = new CurrencyRateService;

            $conversion = $currencyRateService->convertAmount(
                $expense->amount,
                $expense->currency,
                $request->validated('target_currency')
            );

            return response()->success($conversion, 'Currency converted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::convertCurrency failed');
        }
    }

    /**
     * Get expenses by category.
     */
    public function getByCategory(DateRangeRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $expenses = $this->expenseService->getExpensesByCategory(
                $request->user()->id,
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null
            );

            return response()->success($expenses, 'Expenses by category retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::getByCategory failed');
        }
    }

    /**
     * Get total expenses summary.
     */
    public function getTotalExpenses(DateRangeRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $total = $this->expenseService->getTotalExpenses(
                $request->user()->id,
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null
            );

            return response()->success([
                'total_expenses' => $total,
                'formatted' => 'Rp '.number_format($total, 2, ',', '.'),
                'period' => [
                    'start_date' => $validated['start_date'] ?? null,
                    'end_date' => $validated['end_date'] ?? null,
                ],
            ], 'Total expenses retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::getTotalExpenses failed');
        }
    }

    /**
     * Mark expense as paid.
     */
    public function markAsPaid(Expense $expense): JsonResponse
    {
        Gate::authorize('update', $expense);

        try {
            $updated = $this->expenseService->updateExpense($expense->id, [
                'status' => 'completed',
            ], Auth::id());

            return response()->success($updated, 'Expense marked as paid successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::markAsPaid failed');
        }
    }

    /**
     * Send payment reminder for expense.
     */
    public function sendReminder(Expense $expense): JsonResponse
    {
        Gate::authorize('update', $expense);

        try {
            AccountingTimelineEvent::paymentReminder($expense->id, Auth::id());
            $expense->update(['reminder_sent' => true]);

            return response()->success($expense, 'Payment reminder sent successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'ExpenseController::sendReminder failed');
        }
    }
}
