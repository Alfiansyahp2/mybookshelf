<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShelfResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'capacity' => $this->capacity,
            'order' => $this->order,
            'span' => $this->span,
            'decorations' => $this->decorations ?? [],

            // Timestamps
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Relationships
            'books' => BookResource::collection($this->whenLoaded('books')),

            // Computed occupancy (if loaded)
            'occupancy' => $this->when(isset($this->occupancy), fn () => [
                'total' => $this->capacity,
                'occupied' => $this->whenLoaded('books')?->count() ?? 0,
                'available' => max(0, $this->capacity - ($this->whenLoaded('books')?->count() ?? 0)),
                'percentage' => $this->capacity > 0
                    ? round((($this->whenLoaded('books')?->count() ?? 0) / $this->capacity) * 100, 2)
                    : 0,
            ]),
        ];
    }
}
