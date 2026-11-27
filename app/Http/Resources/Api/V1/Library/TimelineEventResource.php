<?php

namespace App\Http\Resources\Api\V1\Library;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimelineEventResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform a book timeline event model into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'book_id' => $this->book_id,
            'type' => $this->type,
            'date' => $this->toIso8601($this->date),
            'description' => $this->description,
            'metadata' => $this->metadata,
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
        ];
    }
}
