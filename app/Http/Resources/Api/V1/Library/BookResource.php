<?php

namespace App\Http\Resources\Api\V1\Library;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform the book model into an array preserving existing API & frontend contracts.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'shelf_id' => $this->shelf_id,
            'title' => $this->title,
            'author' => $this->author,
            'isbn' => $this->isbn,
            'genre' => $this->genre,
            'language' => $this->language,
            'publisher' => $this->publisher,
            'publish_year' => $this->publish_year,
            'pages' => $this->pages,
            'format' => $this->format,
            'height' => $this->height,
            'thickness' => $this->thickness,
            'status' => $this->status,

            'spine_color_light' => $this->spine_color_light,
            'spine_color_medium' => $this->spine_color_medium,
            'spine_color_dark' => $this->spine_color_dark,
            'spine_colors' => [
                $this->spine_color_light,
                $this->spine_color_medium,
                $this->spine_color_dark,
            ],

            'cover_image' => $this->cover_image,
            'position' => $this->position,
            'favorite' => (bool) $this->favorite,
            'current_page' => $this->current_page,
            'progress' => $this->progress,

            'started_date' => $this->toIso8601($this->started_date),
            'finished_date' => $this->toIso8601($this->finished_date),
            'estimated_start_date' => $this->toIso8601($this->estimated_start_date),
            'read_dates' => $this->read_dates,

            'borrowed_by' => $this->borrowed_by,
            'borrowed_date' => $this->toIso8601($this->borrowed_date),
            'due_date' => $this->toIso8601($this->due_date),
            'is_returned' => $this->is_returned,

            'personal_notes' => $this->personal_notes,
            'personal_rating' => $this->personal_rating,

            'purchase_date' => $this->toIso8601($this->purchase_date),
            'purchase_price' => $this->purchase_price,
            'purchase_currency' => $this->purchase_currency,
            'is_gift' => (bool) $this->is_gift,
            'purchase_location' => $this->purchase_location,

            'date_added' => $this->toIso8601($this->date_added),
            'last_modified' => $this->toIso8601($this->last_modified),
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
            'deleted_at' => $this->toIso8601($this->deleted_at),

            'session_stats' => $this->when(isset($this->session_stats), fn () => $this->session_stats),

            'pivot' => $this->whenPivotLoaded('collection_book', fn () => [
                'collection_id' => $this->pivot->collection_id,
                'book_id' => $this->pivot->book_id,
                'order' => $this->pivot->order,
                'added_at' => $this->pivot->added_at,
            ]),

            'shelf' => $this->whenLoaded('shelf', fn () => new ShelfResource($this->shelf)),
            'collections' => CollectionResource::collection($this->whenLoaded('collections')),
        ];
    }
}
