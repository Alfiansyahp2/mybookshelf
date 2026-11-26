<?php

namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class FallbackController extends Controller
{
    /**
     * Handle unmatched API routes with a standardized JSON 404 response.
     */
    public function __invoke(): JsonResponse
    {
        return $this->notFoundResponse('Endpoint not found');
    }
}
