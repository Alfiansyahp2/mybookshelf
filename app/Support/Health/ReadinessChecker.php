<?php

namespace App\Support\Health;

use App\Contracts\Storage\MediaStorageInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class ReadinessChecker
{
    public function __construct(
        private readonly MediaStorageInterface $mediaStorage
    ) {}

    /**
     * Evaluate downstream infrastructure readiness without exposing secrets or stack traces.
     *
     * @return array{healthy: bool, status: string, checks: array<string, string>, timestamp: string}
     */
    public function check(): array
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'storage' => $this->checkStorage(),
        ];

        $healthy = ! in_array('fail', $checks, true);

        return [
            'healthy' => $healthy,
            'status' => $healthy ? 'ok' : 'degraded',
            'checks' => $checks,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    private function checkDatabase(): string
    {
        try {
            DB::select('SELECT 1');

            return 'ok';
        } catch (Throwable) {
            return 'fail';
        }
    }

    private function checkCache(): string
    {
        try {
            $storeName = config('queue.default') === 'redis' || config('cache.default') === 'redis'
                ? 'redis'
                : (string) config('cache.default', 'array');

            $store = Cache::store($storeName);
            $probeKey = 'health:probe:'.Str::uuid()->toString();
            $store->put($probeKey, 'ok', 10);
            $value = $store->get($probeKey);
            $store->forget($probeKey);

            return $value === 'ok' ? 'ok' : 'fail';
        } catch (Throwable) {
            return 'fail';
        }
    }

    private function checkStorage(): string
    {
        try {
            $this->mediaStorage->exists('.health-probe');

            return 'ok';
        } catch (Throwable) {
            return 'fail';
        }
    }
}
