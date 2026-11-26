<?php

namespace App\Http\Resources\Api\V1\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatisticsResource extends JsonResource
{
    /**
     * Transform aggregated reading and financial statistics into an API payload.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'overview' => $this->resource['overview'] ?? [],
            'reading_time' => $this->resource['reading_time'] ?? [],
            'genre_distribution' => $this->resource['genre_distribution'] ?? [],
            'format_distribution' => $this->resource['format_distribution'] ?? [],
            'monthly_reading' => $this->resource['monthly_reading'] ?? [],
            'yearly_reading' => $this->resource['yearly_reading'] ?? [],
            'daily_activity' => $this->resource['daily_activity'] ?? [],
            'purchases' => $this->resource['purchases'] ?? [],
            'top_read_books' => $this->resource['top_read_books'] ?? [],
            'generated_at' => $this->resource['generated_at'] ?? now()->toIso8601String(),
        ];
    }
}
