<?php

namespace App\Http\Resources\Api\V1\Accounting;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use App\Http\Resources\Api\V1\Library\BookResource;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Expense
 */
class ExpenseResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform an expense model into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'book_id' => $this->book_id,
            'title' => $this->title,
            'description' => $this->description,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'amount_base_currency' => $this->amount_base_currency,
            'exchange_rate' => $this->exchange_rate,
            'category_id' => $this->category_id,
            'payment_method' => $this->payment_method,
            'expense_date' => $this->toIso8601($this->expense_date),
            'is_recurring' => (bool) $this->is_recurring,
            'recurring_period' => $this->recurring_period,
            'parent_expense_id' => $this->parent_expense_id,
            'vendor' => $this->vendor,
            'location' => $this->location,
            'has_receipt' => $this->hasReceipt(),
            'receipt_path' => $this->receipt_path,
            'receipt_mime_type' => $this->receipt_mime_type,
            'receipt_filename' => $this->receipt_filename,
            'has_reminder' => (bool) $this->has_reminder,
            'reminder_date' => $this->toIso8601($this->reminder_date),
            'reminder_sent' => (bool) $this->reminder_sent,
            'status' => $this->status,
            'metadata' => $this->metadata,
            'formatted_amount' => $this->formatted_amount,
            'formatted_base_amount' => $this->formatted_base_amount,
            'category' => $this->whenLoaded('category', fn () => new ExpenseCategoryResource($this->category)),
            'book' => $this->whenLoaded('book', fn () => new BookResource($this->book)),
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
            'deleted_at' => $this->toIso8601($this->deleted_at),
        ];
    }
}
