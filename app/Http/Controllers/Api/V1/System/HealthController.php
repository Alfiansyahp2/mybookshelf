<?php

namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use App\Support\Health\ReadinessChecker;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    /**
     * Return API readiness probe status covering database, cache, and media storage.
     */
    public function __invoke(ReadinessChecker $readiness): JsonResponse
    {
        $result = $readiness->check();

        return response()->json([
            'status' => $result['status'],
            'checks' => $result['checks'],
            'timestamp' => $result['timestamp'],
        ], $result['healthy'] ? 200 : 503);
    }
}
