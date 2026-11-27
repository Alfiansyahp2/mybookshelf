<?php

namespace App\Http\Resources\Api\V1\Accounting;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurrencyRateResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform a currency rate model into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'from_currency' => $this->from_currency,
            'to_currency' => $this->to_currency,
            'rate' => $this->rate,
            'effective_date' => $this->toIso8601($this->effective_date),
            'expires_at' => $this->toIso8601($this->expires_at),
            'is_active' => $this->is_active !== null ? (bool) $this->is_active : true,
            'formatted' => $this->formatted_rate,
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
        ];
    }
}
