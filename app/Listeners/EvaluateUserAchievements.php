<?php

namespace App\Listeners;

use App\Events\BookFinished;
use App\Events\ReadingSessionCompleted;
use App\Services\Analytics\AchievementService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class EvaluateUserAchievements implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        private AchievementService $achievementService
    ) {}

    public function handleBookFinished(BookFinished $event): void
    {
        $this->achievementService->evaluateForUser($event->book->user_id);
    }

    public function handleSessionCompleted(ReadingSessionCompleted $event): void
    {
        $this->achievementService->evaluateForUser($event->session->user_id);
    }
}
