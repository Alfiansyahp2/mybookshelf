<?php

namespace App\Jobs;

use App\Contracts\Storage\MediaStorageInterface;
use App\Services\Accounting\AccountingReportService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class ExportAccountingReportJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    /**
     * @param  array<string, mixed>  $params
     */
    public function __construct(
        public string $userId,
        public string $exportId,
        public array $params
    ) {}

    public static function cacheKey(string $userId, string $exportId): string
    {
        return "accounting:export:{$userId}:{$exportId}";
    }

    public function handle(
        AccountingReportService $reportService,
        MediaStorageInterface $mediaStorage
    ): void {
        try {
            $artifact = $reportService->buildExportArtifact($this->userId, $this->params);

            $storageKey = "exports/{$this->userId}/{$artifact['filename']}";
            $mediaStorage->put(
                $storageKey,
                $artifact['content'],
                $artifact['mime_type'],
                'private'
            );

            $downloadUrl = $mediaStorage->temporarySignedUrl($storageKey, 15);

            Cache::put(self::cacheKey($this->userId, $this->exportId), [
                'export_id' => $this->exportId,
                'status' => 'completed',
                'report_type' => $this->params['report_type'] ?? 'overview',
                'format' => $this->params['format'] ?? 'csv',
                'filename' => $artifact['filename'],
                'storage_key' => $storageKey,
                'download_url' => $downloadUrl,
                'completed_at' => now()->toIso8601String(),
            ], now()->addHours(2));
        } catch (Throwable $e) {
            Log::error('ExportAccountingReportJob failed', [
                'export_id' => $this->exportId,
                'user_id' => $this->userId,
                'message' => $e->getMessage(),
            ]);

            Cache::put(self::cacheKey($this->userId, $this->exportId), [
                'export_id' => $this->exportId,
                'status' => 'failed',
                'report_type' => $this->params['report_type'] ?? 'overview',
                'format' => $this->params['format'] ?? 'csv',
                'failed_at' => now()->toIso8601String(),
            ], now()->addHours(2));
        }
    }
}
