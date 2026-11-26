<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

class BudgetTrackingRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'is_active' => 'nullable|boolean',
            'period' => 'nullable|in:daily,weekly,monthly,yearly',
        ];
    }
}
