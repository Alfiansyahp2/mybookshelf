<?php

namespace App\Jobs;

use App\Services\Accounting\CurrencyRateService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncCurrencyRatesJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function handle(CurrencyRateService $currencyRateService): void
    {
        $results = $currencyRateService->syncLiveRates();

        Log::info('SyncCurrencyRatesJob completed', [
            'currencies_synced' => count($results),
        ]);
    }
}
