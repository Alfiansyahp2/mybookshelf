<?php

namespace App\Http\Requests\Api\V1\Accounting;

class TopSpendingCategoriesRequest extends DateRangeRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'limit' => 'nullable|integer|min:1|max:20',
        ]);
    }
}
