<?php

namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ServiceStatusController extends Controller
{
    /**
     * Return root service metadata for the API entrypoint.
     */
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'service' => config('app.name', 'MyBookshelf API'),
            'status' => 'ok',
        ]);
    }
}
