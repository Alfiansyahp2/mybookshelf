<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;
use Illuminate\Validation\ValidationException;

abstract class Controller
{
    /**
     * Build a Rule::exists scoped to the authenticated user's records.
     */
    protected function ownedRule(string $table, ?string $userId = null): Exists
    {
        return Rule::exists($table, 'id')->where(
            'user_id',
            $userId ?? auth()->id()
        );
    }

    /**
     * Return a standardized 422 validation error response.
     */
    protected function validationErrorResponse(ValidationException $e): JsonResponse
    {
        return response()->error('Validation failed', $e->errors(), 422);
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
