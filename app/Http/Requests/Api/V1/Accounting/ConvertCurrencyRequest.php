<?php

namespace App\Http\Requests\Api\V1\Accounting;

class ConvertCurrencyRequest extends CurrencyPairRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'amount' => 'required|numeric|min:0',
        ]);
    }
}
