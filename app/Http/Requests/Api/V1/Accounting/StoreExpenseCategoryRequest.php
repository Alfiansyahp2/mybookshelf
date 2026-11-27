<?php

namespace App\Http\Requests\Api\V1\Accounting;

class StoreExpenseCategoryRequest extends ExpenseCategoryMutationRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->categoryRules(false);
    }
}
