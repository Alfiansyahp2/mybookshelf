<?php

namespace App\Http\Requests\Api\V1\Accounting;

class ReportCategoryFilterRequest extends DateRangeRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'category_id' => ['nullable', 'uuid', $this->ownedRule('expense_categories')],
        ]);
    }
}
