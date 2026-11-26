<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

abstract class ExpenseMutationRequest extends ApiFormRequest
{
    /**
     * Shared validation rules for creating and updating expenses.
     *
     * @return array<string, mixed>
     */
    protected function expenseRules(bool $isUpdate): array
    {
        $titleRule = $isUpdate ? 'sometimes|required|string|max:255' : 'required|string|max:255';
        $amountRule = $isUpdate ? 'sometimes|required|numeric|min:0' : 'required|numeric|min:0';

        return [
            'title' => $titleRule,
            'description' => 'nullable|string',
            'amount' => $amountRule,
            'currency' => 'nullable|string|size:3',
            'category_id' => ['nullable', 'uuid', $this->ownedRule('expense_categories')],
            'payment_method' => 'nullable|in:cash,transfer,e-wallet,credit_card',
            'expense_date' => 'nullable|date',
            'is_recurring' => 'nullable|boolean',
            'recurring_period' => 'nullable|in:daily,weekly,monthly,yearly',
            'book_id' => ['nullable', 'uuid', $this->ownedRule('books')],
            'vendor' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'has_reminder' => 'nullable|boolean',
            'reminder_date' => 'nullable|date',
            'status' => 'nullable|in:pending,completed,cancelled',
            'metadata' => 'nullable|array',
        ];
    }
}
