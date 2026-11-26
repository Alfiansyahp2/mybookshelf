<?php

namespace App\Http\Resources\Api\V1\Library;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShelfResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform the shelf model into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'capacity' => $this->capacity,
            'order' => $this->order,
            'span' => $this->span,
            'decorations' => $this->decorations ?? [],
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
            'books' => BookResource::collection($this->whenLoaded('books')),
            'occupancy' => $this->when(
                $this->relationLoaded('books'),
                function (): array {
                    $occupied = $this->books->count();

                    return [
                        'total' => $this->capacity,
                        'occupied' => $occupied,
                        'available' => max(0, $this->capacity - $occupied),
                        'percentage' => $this->capacity > 0
                            ? round(($occupied / $this->capacity) * 100, 2)
                            : 0,
                    ];
                }
            ),
        ];
    }
}
