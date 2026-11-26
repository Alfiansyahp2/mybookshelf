<?php

namespace App\Http\Requests\Api\V1\Accounting;

class AccountingOverviewRequest extends DateRangeRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'period' => 'nullable|in:today,week,month,year,all',
        ]);
    }
}
