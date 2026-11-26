<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    // Route::post('/register', [AuthController::class, 'register']); // Dinonaktifkan sementara (Coming Soon)
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->prefix('v1/user')->group(function () {
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::put('/password', [ProfileController::class, 'updatePassword']);
});
