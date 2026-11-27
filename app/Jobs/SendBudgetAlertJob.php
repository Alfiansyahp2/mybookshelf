<?php

namespace App\Jobs;

use App\Models\Budget;
use App\Services\Accounting\BudgetService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendBudgetAlertJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public ?string $userId = null
    ) {}

    public function handle(BudgetService $budgetService): void
    {
        $userIds = $this->userId !== null
            ? [$this->userId]
            : Budget::active()->distinct()->pluck('user_id')->all();

        foreach ($userIds as $uid) {
            $alerts = $budgetService->checkBudgetAlerts((string) $uid);
            if ($alerts !== []) {
                Log::info('Budget alerts triggered', [
                    'user_id' => $uid,
                    'count' => count($alerts),
                ]);
            }
        }
    }
}
