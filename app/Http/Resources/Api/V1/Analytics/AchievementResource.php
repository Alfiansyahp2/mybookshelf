<?php

namespace App\Http\Resources\Api\V1\Analytics;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AchievementResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform an achievement model with loaded user pivot progress into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userAchievement = $this->users->first();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'icon' => $this->icon,
            'requirement' => $this->requirement,
            'category' => $this->category,
            'rarity' => $this->rarity,
            'user_progress' => [
                'current' => (int) ($this->getAttribute('computed_current') ?? $userAchievement?->pivot->current ?? 0),
                'unlocked' => (bool) ($userAchievement?->pivot->unlocked ?? false),
                'unlocked_date' => $this->toIso8601($userAchievement?->pivot->unlocked_date),
            ],
        ];
    }
}
