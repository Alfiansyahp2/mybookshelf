<?php

use App\Http\Controllers\Api\V1\System\FallbackController;
use App\Http\Controllers\Api\V1\System\HealthController;
use Illuminate\Support\Facades\Route;

// Public health check
Route::get('/health', HealthController::class);

require __DIR__.'/api/v1/auth.php';
require __DIR__.'/api/v1/library.php';
require __DIR__.'/api/v1/reading.php';
require __DIR__.'/api/v1/analytics.php';
require __DIR__.'/api/v1/accounting.php';

// Catch-all JSON 404 across every HTTP method under /api/*
Route::any('{fallbackPlaceholder}', FallbackController::class)->where('fallbackPlaceholder', '.*');
