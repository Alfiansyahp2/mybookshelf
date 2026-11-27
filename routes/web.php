<?php

use App\Http\Controllers\Api\V1\System\ServiceStatusController;
use Illuminate\Support\Facades\Route;

Route::get('/', ServiceStatusController::class);
