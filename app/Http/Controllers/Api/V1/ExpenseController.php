<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

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
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created expense.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'amount' => 'required|numeric|min:0',
                'currency' => 'nullable|string|size:3',
                'category_id' => 'nullable|uuid|exists:expense_categories,id',
                'payment_method' => 'nullable|in:cash,transfer,e-wallet,credit_card',
                'expense_date' => 'nullable|date',
                'is_recurring' => 'nullable|boolean',
                'recurring_period' => 'nullable|in:daily,weekly,monthly,yearly',
                'book_id' => 'nullable|uuid|exists:books,id',
                'vendor' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'has_reminder' => 'nullable|boolean',
                'reminder_date' => 'nullable|date',
                'status' => 'nullable|in:pending,completed,cancelled',
                'metadata' => 'nullable|array',
            ]);

            $expense = $this->expenseService->createExpense($validated, Auth::id());

            return response()->success($expense, 'Expense created successfully', 201);
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified expense.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $expense = $this->expenseService->getExpense($id, Auth::id());

            return response()->success($expense, 'Expense retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Update the specified expense.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'amount' => 'sometimes|required|numeric|min:0',
                'currency' => 'nullable|string|size:3',
                'category_id' => 'nullable|uuid|exists:expense_categories,id',
                'payment_method' => 'nullable|in:cash,transfer,e-wallet,credit_card',
                'expense_date' => 'nullable|date',
                'is_recurring' => 'nullable|boolean',
                'recurring_period' => 'nullable|in:daily,weekly,monthly,yearly',
                'book_id' => 'nullable|uuid|exists:books,id',
                'vendor' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'has_reminder' => 'nullable|boolean',
                'reminder_date' => 'nullable|date',
                'status' => 'nullable|in:pending,completed,cancelled',
                'metadata' => 'nullable|array',
            ]);

            $expense = $this->expenseService->updateExpense($id, $validated, Auth::id());

            return response()->success($expense, 'Expense updated successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified expense.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->expenseService->deleteExpense($id, Auth::id());

            return response()->success(null, 'Expense deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Upload receipt for expense.
     */
    public function uploadReceipt(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'data' => 'required|string', // Base64 encoded image
                'mime_type' => 'nullable|string|max:100',
                'filename' => 'nullable|string|max:255',
            ]);

            $expense = $this->expenseService->uploadReceipt($id, $validated, Auth::id());

            return response()->success($expense, 'Receipt uploaded successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get receipt for expense.
     */
    public function getReceipt(string $id): JsonResponse
    {
        try {
            $receipt = $this->expenseService->getReceipt($id, Auth::id());

            return response()->success($receipt, 'Receipt retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Duplicate an expense.
     */
    public function duplicate(string $id): JsonResponse
    {
        try {
            $expense = $this->expenseService->duplicateExpense($id, Auth::id());

            return response()->success($expense, 'Expense duplicated successfully', 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Convert currency for expense.
     */
    public function convertCurrency(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'target_currency' => 'required|string|size:3',
            ]);

            $expense = $this->expenseService->getExpense($id, Auth::id());
            $currencyRateService = new \App\Services\CurrencyRateService();

            $conversion = $currencyRateService->convertAmount(
                $expense->amount,
                $expense->currency,
                $validated['target_currency']
            );

            return response()->success($conversion, 'Currency converted successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get expenses by category.
     */
    public function getByCategory(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
            ]);

            $expenses = $this->expenseService->getExpensesByCategory(
                Auth::id(),
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null
            );

            return response()->success($expenses, 'Expenses by category retrieved successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Get total expenses summary.
     */
    public function getTotalExpenses(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
            ]);

            $total = $this->expenseService->getTotalExpenses(
                Auth::id(),
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null
            );

            return response()->success([
                'total_expenses' => $total,
                'formatted' => 'Rp ' . number_format($total, 2, ',', '.'),
                'period' => [
                    'start_date' => $validated['start_date'] ?? null,
                    'end_date' => $validated['end_date'] ?? null,
                ],
            ], 'Total expenses retrieved successfully');
        } catch (ValidationException $e) {
            return response()->error($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Mark expense as paid.
     */
    public function markAsPaid(Request $request, string $id): JsonResponse
    {
        try {
            $expense = $this->expenseService->updateExpense($id, [
                'status' => 'completed',
            ], Auth::id());

            return response()->success($expense, 'Expense marked as paid successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Send payment reminder for expense.
     */
    public function sendReminder(string $id): JsonResponse
    {
        try {
            $expense = $this->expenseService->getExpense($id, Auth::id());

            // Create timeline event as reminder
            \App\Models\AccountingTimelineEvent::paymentReminder($id, Auth::id());

            // Update reminder sent status
            $expense->update(['reminder_sent' => true]);

            return response()->success($expense, 'Payment reminder sent successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->error('Expense not found', 404);
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}