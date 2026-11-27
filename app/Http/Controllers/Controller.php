<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

abstract class Controller
{
    /**
     * Return a standardized paginated response while transforming items through a JsonResource class.
     *
     * @param  class-string<JsonResource>  $resourceClass
     */
    protected function paginatedSuccess(
        LengthAwarePaginator $paginator,
        string $resourceClass,
        string $message = 'Success',
        int $statusCode = 200
    ): JsonResponse {
        $payload = $paginator->toArray();
        $payload['data'] = $resourceClass::collection($paginator->getCollection())->resolve(request());

        return response()->success($payload, $message, $statusCode);
    }

    /**
     * Return a standardized 404 not found error response.
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return response()->error($message, null, 404);
    }

    /**
     * Log unexpected exception details and return a safe 500 JSON response.
     */
    protected function serverErrorResponse(\Throwable $e, string $context = 'Unexpected API error'): JsonResponse
    {
        Log::error($context, [
            'message' => $e->getMessage(),
            'exception' => get_class($e),
        ]);

        return response()->error('An unexpected error occurred', null, 500);
    }
}
