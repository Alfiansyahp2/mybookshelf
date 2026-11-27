<?php

namespace App\Http\Requests\Api\V1\Accounting;

class ExpensesByPeriodRequest extends ReportCategoryFilterRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'group_by' => 'nullable|in:day,week,month,year',
        ]);
    }
}
