<?php

namespace App\Http\Requests\Api\V1\Accounting;

class UpdateBudgetRequest extends BudgetMutationRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->budgetRules(true);
    }
}
