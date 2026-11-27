<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

class BulkUpsertCurrencyRatesRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'rates' => 'required|array|min:1',
            'rates.*.from_currency' => 'required|string|size:3',
            'rates.*.to_currency' => 'nullable|string|size:3',
            'rates.*.rate' => 'required|numeric|min:0',
            'rates.*.effective_date' => 'nullable|date',
            'rates.*.expires_at' => 'nullable|date',
        ];
    }
}
