<?php

namespace App\Http\Resources\Api\V1\Analytics;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Achievement
 */
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
        /** @var \App\Models\User|null $userAchievement */
        $userAchievement = $this->users->first();
        /** @var \Illuminate\Database\Eloquent\Relations\Pivot|null $pivot */
        $pivot = $userAchievement?->getRelationValue('pivot');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'icon' => $this->icon,
            'requirement' => $this->requirement,
            'category' => $this->category,
            'rarity' => $this->rarity,
            'user_progress' => [
                'current' => (int) ($this->getAttribute('computed_current') ?? $pivot?->getAttribute('current') ?? 0),
                'unlocked' => (bool) ($pivot?->getAttribute('unlocked') ?? false),
                'unlocked_date' => $this->toIso8601($pivot?->getAttribute('unlocked_date')),
            ],
        ];
    }
}
