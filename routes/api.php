<?php

use Illuminate\Support\Facades\Route;

// Public health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

require __DIR__.'/api/v1/auth.php';
require __DIR__.'/api/v1/library.php';
require __DIR__.'/api/v1/reading.php';
require __DIR__.'/api/v1/analytics.php';
require __DIR__.'/api/v1/accounting.php';

// Catch-all JSON 404 across every HTTP method under /api/*
Route::any('{fallbackPlaceholder}', function () {
    return response()->error('Endpoint not found', null, 404);
})->where('fallbackPlaceholder', '.*');
