<?php

namespace App\Http\Resources\Api\V1\Library;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Collection
 */
class CollectionResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform the collection model into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'color' => $this->color,
            'icon' => $this->icon,
            'progress' => (float) $this->progress,
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
            'deleted_at' => $this->toIso8601($this->deleted_at),
            'books' => BookResource::collection($this->whenLoaded('books')),
        ];
    }
}
