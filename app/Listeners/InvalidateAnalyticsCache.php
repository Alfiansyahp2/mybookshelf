<?php

namespace App\Listeners;

use App\Events\BookFinished;
use App\Events\BookSaved;
use App\Events\ExpenseUpdated;
use App\Events\ReadingSessionCompleted;
use App\Services\Analytics\DashboardAnalyticsService;
use App\Services\Analytics\StatisticsService;

class InvalidateAnalyticsCache
{
    public function handleBookSaved(BookSaved $event): void
    {
        $this->invalidateUser($event->userId);
    }

    public function handleBookFinished(BookFinished $event): void
    {
        $this->invalidateUser($event->book->user_id);
    }

    public function handleSessionCompleted(ReadingSessionCompleted $event): void
    {
        $this->invalidateUser($event->session->user_id);
    }

    public function handleExpenseUpdated(ExpenseUpdated $event): void
    {
        $this->invalidateUser($event->userId);
    }

    private function invalidateUser(string $userId): void
    {
        DashboardAnalyticsService::forgetForUser($userId);
        StatisticsService::forgetForUser($userId);
    }
}
