<?php

namespace App\Http\Requests\Api\V1\Accounting;

class StoreExpenseRequest extends ExpenseMutationRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->expenseRules(false);
    }
}
