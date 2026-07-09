<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\CurrencyRate;
use App\Models\AccountingTimelineEvent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class ExpenseService
{
    /**
     * Get all expenses for a user with optional filters.
     */
    public function getAllExpenses(array $filters, string $userId)
    {
        $query = Expense::with(['category', 'book'])
                       ->forUser($userId);

        // Apply filters
        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['book_id'])) {
            $query->where('book_id', $filters['book_id']);
        }

        if (isset($filters['start_date']) && isset($filters['end_date'])) {
            $query->inPeriod($filters['start_date'], $filters['end_date']);
        }

        if (isset($filters['is_recurring'])) {
            $query->where('is_recurring', $filters['is_recurring']);
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
     * Get a single expense by ID.
     */
    public function getExpense(string $expenseId, string $userId): Expense
    {
        return Expense::with(['category', 'book', 'user'])
                     ->forUser($userId)
                     ->findOrFail($expenseId);
    }

    /**
     * Create a new expense.
     */
    public function createExpense(array $data, string $userId): Expense
    {
        DB::beginTransaction();

        try {
            // Convert currency to base currency
            $baseCurrencyAmount = $this->convertToBaseCurrency(
                $data['amount'],
                $data['currency'] ?? 'IDR'
            );

            $expense = Expense::create([
                'id' => Str::uuid()->toString(),
                'user_id' => $userId,
                'book_id' => $data['book_id'] ?? null,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'IDR',
                'amount_base_currency' => $baseCurrencyAmount,
                'exchange_rate' => $data['exchange_rate'] ?? $this->getExchangeRate($data['currency'] ?? 'IDR'),
                'category_id' => $data['category_id'] ?? null,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'expense_date' => $data['expense_date'] ?? now(),
                'is_recurring' => $data['is_recurring'] ?? false,
                'recurring_period' => $data['recurring_period'] ?? null,
                'parent_expense_id' => $data['parent_expense_id'] ?? null,
                'vendor' => $data['vendor'] ?? null,
                'location' => $data['location'] ?? null,
                'receipt_data' => $data['receipt_data'] ?? null,
                'receipt_mime_type' => $data['receipt_mime_type'] ?? null,
                'receipt_filename' => $data['receipt_filename'] ?? null,
                'has_reminder' => $data['has_reminder'] ?? false,
                'reminder_date' => $data['reminder_date'] ?? null,
                'status' => $data['status'] ?? 'completed',
                'metadata' => $data['metadata'] ?? null,
            ]);

            // Create timeline event
            AccountingTimelineEvent::expenseCreated($expense->id, $userId);

            // Check if this expense affects any budget alerts
            $this->checkBudgetAlertsAfterExpense($userId, $expense->expense_date);

            DB::commit();

            return $expense->load(['category', 'book']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing expense.
     */
    public function updateExpense(string $expenseId, array $data, string $userId): Expense
    {
        DB::beginTransaction();

        try {
            $expense = $this->getExpense($expenseId, $userId);

            // Update currency conversion if amount or currency changed
            if (isset($data['amount']) || isset($data['currency'])) {
                $amount = $data['amount'] ?? $expense->amount;
                $currency = $data['currency'] ?? $expense->currency;

                $data['amount_base_currency'] = $this->convertToBaseCurrency($amount, $currency);
                $data['exchange_rate'] = $this->getExchangeRate($currency);
            }

            $expense->update($data);

            // Create timeline event for expense update
            AccountingTimelineEvent::create([
                'id' => Str::uuid()->toString(),
                'user_id' => $userId,
                'expense_id' => $expenseId,
                'type' => 'expense_updated',
                'event_date' => now(),
                'description' => "Expense '{$expense->title}' updated",
                'metadata' => [
                    'old_amount' => $expense->amount,
                    'new_amount' => $data['amount'] ?? $expense->amount,
                ],
            ]);

            // Check budget alerts
            $this->checkBudgetAlertsAfterExpense($userId, $expense->expense_date);

            DB::commit();

            return $expense->fresh(['category', 'book']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete an expense.
     */
    public function deleteExpense(string $expenseId, string $userId): bool
    {
        DB::beginTransaction();

        try {
            $expense = $this->getExpense($expenseId, $userId);

            // Check if this is a recurring expense parent
            if ($expense->recurringExpenses()->count() > 0) {
                throw new Exception('Cannot delete expense with recurring expenses. Delete individual recurring expenses first.');
            }

            $expense->delete();

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Upload or update receipt for an expense.
     */
    public function uploadReceipt(string $expenseId, array $receiptData, string $userId): Expense
    {
        $expense = $this->getExpense($expenseId, $userId);

        $expense->update([
            'receipt_data' => $receiptData['data'],
            'receipt_mime_type' => $receiptData['mime_type'] ?? 'image/jpeg',
            'receipt_filename' => $receiptData['filename'] ?? 'receipt.jpg',
        ]);

        return $expense->fresh();
    }

    /**
     * Get receipt data for an expense.
     */
    public function getReceipt(string $expenseId, string $userId): array
    {
        $expense = $this->getExpense($expenseId, $userId);

        if (!$expense->hasReceipt()) {
            throw new Exception('No receipt found for this expense');
        }

        return [
            'data' => $expense->receipt_data,
            'mime_type' => $expense->receipt_mime_type,
            'filename' => $expense->receipt_filename,
        ];
    }

    /**
     * Convert amount to base currency (IDR).
     */
    public function convertToBaseCurrency(float $amount, string $currency): float
    {
        if ($currency === 'IDR') {
            return $amount;
        }

        $rate = CurrencyRate::getLatestRate($currency, 'IDR');

        if (!$rate) {
            // If no rate available, assume 1:1 (should be handled better)
            return $amount;
        }

        return $amount * $rate->rate;
    }

    /**
     * Get exchange rate for a currency.
     */
    public function getExchangeRate(string $currency): float
    {
        if ($currency === 'IDR') {
            return 1.0;
        }

        $rate = CurrencyRate::getLatestRate($currency, 'IDR');

        return $rate ? $rate->rate : 1.0;
    }

    /**
     * Duplicate an expense.
     */
    public function duplicateExpense(string $expenseId, string $userId): Expense
    {
        $originalExpense = $this->getExpense($expenseId, $userId);

        $newExpense = $originalExpense->replicate();
        $newExpense->id = Str::uuid()->toString();
        $newExpense->title = $originalExpense->title . ' (Copy)';
        $newExpense->created_at = now();
        $newExpense->updated_at = now();
        $newExpense->save();

        // Create timeline event
        AccountingTimelineEvent::expenseCreated($newExpense->id, $userId);

        return $newExpense->load(['category', 'book']);
    }

    /**
     * Process recurring expenses.
     */
    public function processRecurringExpenses(): void
    {
        $today = now()->startOfDay();

        // Get parent recurring expenses that need to generate new instances
        $recurringExpenses = Expense::where('is_recurring', true)
                                   ->where('status', 'completed')
                                   ->where('reminder_date', '<=', $today)
                                   ->get();

        foreach ($recurringExpenses as $parentExpense) {
            $this->generateRecurringExpense($parentExpense);
        }
    }

    /**
     * Generate a new recurring expense instance.
     */
    protected function generateRecurringExpense(Expense $parentExpense): Expense
    {
        $nextDate = $this->calculateNextRecurringDate($parentExpense);

        $newExpense = Expense::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $parentExpense->user_id,
            'book_id' => $parentExpense->book_id,
            'title' => $parentExpense->title,
            'description' => $parentExpense->description,
            'amount' => $parentExpense->amount,
            'currency' => $parentExpense->currency,
            'amount_base_currency' => $parentExpense->amount_base_currency,
            'exchange_rate' => $parentExpense->exchange_rate,
            'category_id' => $parentExpense->category_id,
            'payment_method' => $parentExpense->payment_method,
            'expense_date' => $nextDate,
            'is_recurring' => true,
            'recurring_period' => $parentExpense->recurring_period,
            'parent_expense_id' => $parentExpense->id,
            'vendor' => $parentExpense->vendor,
            'location' => $parentExpense->location,
            'has_reminder' => $parentExpense->has_reminder,
            'status' => 'pending',
            'metadata' => $parentExpense->metadata,
        ]);

        // Update parent expense reminder date
        $parentExpense->update(['reminder_date' => $this->calculateNextReminderDate($parentExpense)]);

        // Create timeline event
        AccountingTimelineEvent::paymentReminder($newExpense->id, $parentExpense->user_id);

        return $newExpense;
    }

    /**
     * Calculate next recurring date based on period.
     */
    protected function calculateNextRecurringDate(Expense $expense): string
    {
        $lastDate = $expense->expense_date;

        switch($expense->recurring_period) {
            case 'daily':
                return $lastDate->addDay()->format('Y-m-d');
            case 'weekly':
                return $lastDate->addWeek()->format('Y-m-d');
            case 'monthly':
                return $lastDate->addMonth()->format('Y-m-d');
            case 'yearly':
                return $lastDate->addYear()->format('Y-m-d');
            default:
                return $lastDate->addMonth()->format('Y-m-d');
        }
    }

    /**
     * Calculate next reminder date for recurring expense.
     */
    protected function calculateNextReminderDate(Expense $expense): string
    {
        $reminderDate = $expense->reminder_date ?? $expense->expense_date;

        switch($expense->recurring_period) {
            case 'daily':
                return $reminderDate->addDay()->format('Y-m-d');
            case 'weekly':
                return $reminderDate->addWeek()->format('Y-m-d');
            case 'monthly':
                return $reminderDate->addMonth()->format('Y-m-d');
            case 'yearly':
                return $reminderDate->addYear()->format('Y-m-d');
            default:
                return $reminderDate->addMonth()->format('Y-m-d');
        }
    }

    /**
     * Check budget alerts after expense creation/update.
     */
    protected function checkBudgetAlertsAfterExpense(string $userId, $expenseDate): void
    {
        $budgets = \App\Models\Budget::forUser($userId)
                                    ->active()
                                    ->current()
                                    ->get();

        foreach ($budgets as $budget) {
            $this->checkSingleBudgetAlert($budget);
        }
    }

    /**
     * Check if a budget needs alerts.
     */
    public function checkSingleBudgetAlert(\App\Models\Budget $budget): void
    {
        $usage = $budget->usage_percentage;

        if ($usage > 100 && $budget->status !== 'exceeded') {
            // Budget exceeded
            AccountingTimelineEvent::budgetExceeded($budget->id, $budget->user_id);
        } elseif ($usage >= $budget->alert_threshold && $budget->status === 'healthy') {
            // Budget at warning threshold
            AccountingTimelineEvent::budgetAlert($budget->id, $budget->user_id);
        }
    }

    /**
     * Get expenses by category for a user.
     */
    public function getExpensesByCategory(string $userId, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = Expense::forUser($userId)->completed();

        if ($startDate && $endDate) {
            $query->inPeriod($startDate, $endDate);
        }

        $expenses = $query->get()->groupBy('category_id');

        $result = [];
        foreach ($expenses as $categoryId => $categoryExpenses) {
            $category = $categoryExpenses->first()->category;
            $result[] = [
                'category_id' => $categoryId,
                'category_name' => $category?->name ?? 'Uncategorized',
                'category_color' => $category?->color ?? '#6B7280',
                'total_amount' => $categoryExpenses->sum('amount_base_currency'),
                'expense_count' => $categoryExpenses->count(),
            ];
        }

        return $result;
    }

    /**
     * Get total expenses for a user in a period.
     */
    public function getTotalExpenses(?string $userId, ?string $startDate = null, ?string $endDate = null): float
    {
        // Handle empty or invalid user ID
        if (empty($userId)) {
            return 0;
        }

        try {
            $query = Expense::forUser($userId)->completed();

            if ($startDate && $endDate) {
                $query->inPeriod($startDate, $endDate);
            }

            return (float) $query->sum('amount_base_currency');
        } catch (\Exception $e) {
            // Return 0 on any database errors
            return 0;
        }
    }

    /**
     * Send payment reminders for expenses with due dates.
     */
    public function sendPaymentReminders(): void
    {
        $today = now()->startOfDay();
        $tomorrow = now()->addDay()->endOfDay();

        // Get expenses that need reminders
        $expenses = Expense::where('has_reminder', true)
                           ->where('reminder_sent', false)
                           ->where('reminder_date', '<=', $tomorrow)
                           ->get();

        foreach ($expenses as $expense) {
            // Create timeline event as reminder
            AccountingTimelineEvent::paymentReminder($expense->id, $expense->user_id);

            // Mark reminder as sent
            $expense->update(['reminder_sent' => true]);
        }
    }
}