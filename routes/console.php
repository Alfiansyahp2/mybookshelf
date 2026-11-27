<?php

use App\Jobs\SendBudgetAlertJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('currency:sync-rates')->dailyAt('02:00')->withoutOverlapping();
Schedule::job(new SendBudgetAlertJob)->hourly()->withoutOverlapping();
