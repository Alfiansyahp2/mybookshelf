<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
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
            'title' => $this->title,
            'author' => $this->author,
            'isbn' => $this->isbn,
            'genre' => $this->genre,
            'language' => $this->language,
            'publisher' => $this->publisher,
            'publish_year' => $this->publish_year,
            'pages' => $this->pages,
            'format' => $this->format,

            // Spine colors as array for frontend
            'spine_colors' => [
                $this->spine_color_light,
                $this->spine_color_medium,
                $this->spine_color_dark,
            ],

            'height' => $this->height,
            'thickness' => $this->thickness,

            // Reading status
            'status' => $this->status,
            'favorite' => (bool) $this->favorite,
            'current_page' => $this->current_page,
            'progress' => $this->progress ? (float) $this->progress : 0,

            // Dates as ISO 8601 strings
            'started_date' => $this->started_date?->toIso8601String(),
            'finished_date' => $this->finished_date?->toIso8601String(),
            'estimated_start_date' => $this->estimated_start_date?->toIso8601String(),

            // Borrowing info
            'borrowed_by' => $this->borrowed_by,
            'borrowed_date' => $this->borrowed_date?->toIso8601String(),
            'due_date' => $this->due_date?->toIso8601String(),
            'is_returned' => $this->is_returned,

            // Personal data
            'personal_notes' => $this->personal_notes,
            'personal_rating' => $this->personal_rating ? (float) $this->personal_rating : null,

            // Purchase info
            'purchase_date' => $this->purchase_date?->toIso8601String(),
            'purchase_price' => $this->purchase_price ? (float) $this->purchase_price : null,
            'purchase_location' => $this->purchase_location,

            // Shelf placement
            'shelf_id' => $this->shelf_id,
            'position' => $this->position,

            // Timestamps
            'date_added' => $this->date_added->toIso8601String(),
            'last_modified' => $this->last_modified->toIso8601String(),

            // Relationships
            'shelf' => $this->when($this->shelf, fn () => new ShelfResource($this->shelf)),
            'collections' => CollectionResource::collection($this->whenLoaded('collections')),
        ];
    }
}
