import type * as SentryNamespace from "@sentry/react";

let sentryModule: typeof SentryNamespace | null = null;
let initPromise: Promise<void> | null = null;
let lastRequestId: string | null = null;

export function setLastRequestId(requestId: string | null): void {
    if (requestId) {
        lastRequestId = requestId;
    }
}

export function getLastRequestId(): string | null {
    return lastRequestId;
}

export async function initTelemetry(): Promise<void> {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn || typeof dsn !== "string" || dsn.trim() === "") {
        return;
    }

    if (initPromise) {
        return initPromise;
    }

    initPromise = import("@sentry/react")
        .then((Sentry) => {
            sentryModule = Sentry;
            Sentry.init({
                dsn: dsn.trim(),
                release: import.meta.env.VITE_APP_VERSION || undefined,
                environment: import.meta.env.MODE,
                ignoreErrors: [
                    "Request failed with status code 401",
                    "Request failed with status code 403",
                    "Request failed with status code 404",
                    "Request failed with status code 422",
                ],
            });
        })
        .catch(() => {
            // Do not crash application bootstrap if telemetry SDK fails to initialize
        });

    return initPromise;
}

export function reportClientError(
    error: unknown,
    context?: Record<string, unknown>,
): void {
    if (!sentryModule) {
        return;
    }

    sentryModule.withScope((scope) => {
        if (lastRequestId) {
            scope.setTag("request_id", lastRequestId);
        }
        if (context) {
            scope.setContext("client", context);
        }
        sentryModule?.captureException(error);
    });
}
