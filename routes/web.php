<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', function (): JsonResponse {
    return response()->json([
        'service' => config('app.name', 'MyBookshelf API'),
        'status' => 'ok',
    ]);
});
