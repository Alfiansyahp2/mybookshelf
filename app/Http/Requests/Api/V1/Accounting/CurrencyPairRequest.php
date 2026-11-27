<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

class CurrencyPairRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'from_currency' => 'required|string|size:3',
            'to_currency' => 'nullable|string|size:3',
        ];
    }
}
