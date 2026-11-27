<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Sentry\State\Scope;
use Symfony\Component\HttpFoundation\Response;

class AttachRequestId
{
    /**
     * Propagate or generate a sanitized correlation ID across logs, Sentry scope, and response headers.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $incoming = $request->header('X-Request-Id');
        $requestId = is_string($incoming) && preg_match('/^[A-Za-z0-9._-]{8,64}$/', $incoming) === 1
            ? $incoming
            : Str::uuid()->toString();

        $request->attributes->set('request_id', $requestId);

        Log::withContext([
            'request_id' => $requestId,
        ]);

        if (app()->bound('sentry')) {
            \Sentry\configureScope(function (Scope $scope) use ($requestId): void {
                $scope->setTag('request_id', $requestId);
            });
        }

        /** @var Response $response */
        $response = $next($request);

        $userId = $request->user()?->id;
        if ($userId !== null) {
            Log::withContext([
                'request_id' => $requestId,
                'user_id' => (string) $userId,
            ]);
        }

        $response->headers->set('X-Request-Id', $requestId);

        return $response;
    }
}
