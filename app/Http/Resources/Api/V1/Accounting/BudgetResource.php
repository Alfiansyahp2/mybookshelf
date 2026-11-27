<?php

namespace App\Http\Resources\Api\V1\Accounting;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform a budget model into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'description' => $this->description,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'amount_base_currency' => $this->amount_base_currency,
            'period' => $this->period,
            'start_date' => $this->toIso8601($this->start_date),
            'end_date' => $this->toIso8601($this->end_date),
            'alert_threshold' => $this->alert_threshold,
            'is_active' => (bool) $this->is_active,
            'category' => $this->whenLoaded('category', fn () => new ExpenseCategoryResource($this->category)),
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
            'deleted_at' => $this->toIso8601($this->deleted_at),
        ];
    }
}
