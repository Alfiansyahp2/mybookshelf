<?php

namespace App\Http\Requests\Api\V1\Accounting;

class HistoricalCurrencyRatesRequest extends CurrencyPairRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'date' => 'nullable|date',
        ]);
    }
}
