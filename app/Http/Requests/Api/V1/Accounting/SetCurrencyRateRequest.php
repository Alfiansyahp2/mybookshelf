<?php

namespace App\Http\Requests\Api\V1\Accounting;

class SetCurrencyRateRequest extends CurrencyPairRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'rate' => 'required|numeric|min:0',
            'effective_date' => 'nullable|date',
            'expires_at' => 'nullable|date',
            'force' => 'nullable|boolean',
        ]);
    }
}
