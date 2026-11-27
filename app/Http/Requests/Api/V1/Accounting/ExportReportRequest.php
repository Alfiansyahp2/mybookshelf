<?php

namespace App\Http\Requests\Api\V1\Accounting;

class ExportReportRequest extends DateRangeRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'report_type' => 'required|in:overview,expenses,budgets,payment_methods',
            'format' => 'required|in:json,csv,excel,pdf',
        ]);
    }
}
