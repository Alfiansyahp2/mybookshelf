<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

class DateRangeRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ];
    }
}
