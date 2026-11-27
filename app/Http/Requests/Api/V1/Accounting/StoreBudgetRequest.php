<?php

namespace App\Http\Requests\Api\V1\Accounting;

class StoreBudgetRequest extends BudgetMutationRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->budgetRules(false);
    }
}
