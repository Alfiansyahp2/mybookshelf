<?php

namespace App\Console\Commands;

use App\Jobs\SyncCurrencyRatesJob;
use Illuminate\Console\Command;

class SyncCurrencyRatesCommand extends Command
{
    protected $signature = 'currency:sync-rates {--sync : Run synchronization immediately instead of queuing}';

    protected $description = 'Synchronize currency exchange rates to base currency (IDR)';

    public function handle(): int
    {
        if ($this->option('sync')) {
            SyncCurrencyRatesJob::dispatchSync();
            $this->info('Currency exchange rates synchronized synchronously.');

            return self::SUCCESS;
        }

        SyncCurrencyRatesJob::dispatch();
        $this->info('Currency exchange rates synchronization job dispatched.');

        return self::SUCCESS;
    }
}
