<?php

namespace App\Http\Resources\Api\V1\Reading;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use App\Http\Resources\Api\V1\Library\BookResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReadingSessionResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform a reading session model into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'book_id' => $this->book_id,
            'start_time' => $this->toIso8601($this->start_time),
            'end_time' => $this->toIso8601($this->end_time),
            'start_page' => $this->start_page,
            'end_page' => $this->end_page,
            'duration' => $this->duration,
            'is_paused' => (bool) $this->is_paused,
            'last_paused_at' => $this->toIso8601($this->last_paused_at),
            'paused_seconds' => $this->paused_seconds ?? 0,
            'mood' => $this->mood,
            'location' => $this->location,
            'notes' => $this->notes,
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
            'book' => $this->whenLoaded('book', fn () => new BookResource($this->book)),
        ];
    }
}
