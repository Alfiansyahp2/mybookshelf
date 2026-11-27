<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

abstract class ExpenseCategoryMutationRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    protected function categoryRules(bool $isUpdate): array
    {
        return [
            'name' => $isUpdate ? 'sometimes|required|string|max:100' : 'required|string|max:100',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'monthly_budget' => 'nullable|numeric|min:0',
            'budget_currency' => 'nullable|string|size:3',
        ];
    }
}
