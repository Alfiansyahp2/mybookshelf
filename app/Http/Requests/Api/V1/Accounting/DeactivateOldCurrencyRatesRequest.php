<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

class DeactivateOldCurrencyRatesRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'days_to_keep' => 'nullable|integer|min:1|max:365',
        ];
    }
}
