<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

abstract class BudgetMutationRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    protected function budgetRules(bool $isUpdate): array
    {
        return [
            'name' => $isUpdate ? 'sometimes|required|string|max:255' : 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => $isUpdate ? 'sometimes|required|numeric|min:0' : 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'period' => 'nullable|in:daily,weekly,monthly,yearly',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'category_id' => ['nullable', 'uuid', $this->ownedRule('expense_categories')],
            'alert_threshold' => 'nullable|numeric|min:1|max:100',
            'is_active' => 'nullable|boolean',
        ];
    }
}
