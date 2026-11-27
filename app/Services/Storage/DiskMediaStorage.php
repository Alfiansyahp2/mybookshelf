<?php

namespace App\Services\Storage;

use App\Contracts\Storage\MediaStorageInterface;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use RuntimeException;

class DiskMediaStorage implements MediaStorageInterface
{
    public function diskName(): string
    {
        return (string) config('filesystems.media_disk', 'public');
    }

    public function put(
        string $key,
        string $contents,
        ?string $mimeType = null,
        string $visibility = 'public'
    ): string {
        $normalizedKey = ltrim($key, '/');
        $options = ['visibility' => $visibility];

        if ($mimeType) {
            $options['ContentType'] = $mimeType;
        }

        $this->disk()->put($normalizedKey, $contents, $options);

        return $normalizedKey;
    }

    public function exists(string $key): bool
    {
        $normalizedKey = $this->normalizeKey($key);
        if (! $normalizedKey) {
            return false;
        }

        return $this->disk()->exists($normalizedKey);
    }

    public function get(string $key): ?string
    {
        $normalizedKey = $this->normalizeKey($key);
        if (! $normalizedKey || ! $this->disk()->exists($normalizedKey)) {
            return null;
        }

        return $this->disk()->get($normalizedKey);
    }

    public function delete(?string $keyOrUrl): void
    {
        $key = $this->normalizeKey($keyOrUrl);
        if ($key && $this->disk()->exists($key)) {
            $this->disk()->delete($key);
        }
    }

    public function normalizeKey(?string $keyOrUrl): ?string
    {
        if (! is_string($keyOrUrl)) {
            return null;
        }

        $trimmed = trim($keyOrUrl);
        if ($trimmed === '') {
            return null;
        }

        if (str_starts_with($trimmed, 'http://') || str_starts_with($trimmed, 'https://')) {
            $path = (string) (parse_url($trimmed, PHP_URL_PATH) ?: '');
            if (str_contains($path, '/storage/')) {
                $afterStorage = explode('/storage/', $path, 2)[1] ?? '';

                return $afterStorage !== '' ? ltrim($afterStorage, '/') : null;
            }

            $cdnUrl = config('filesystems.media_cdn_url');
            if (is_string($cdnUrl) && $cdnUrl !== '' && str_starts_with($trimmed, rtrim($cdnUrl, '/').'/')) {
                return ltrim(substr($trimmed, strlen(rtrim($cdnUrl, '/').'/')), '/');
            }

            return null;
        }

        if (str_starts_with($trimmed, '/storage/')) {
            return ltrim(substr($trimmed, strlen('/storage/')), '/');
        }

        if (str_starts_with($trimmed, 'storage/')) {
            return ltrim(substr($trimmed, strlen('storage/')), '/');
        }

        return ltrim($trimmed, '/');
    }

    public function publicUrl(?string $keyOrUrl): ?string
    {
        if (! is_string($keyOrUrl) || trim($keyOrUrl) === '') {
            return null;
        }

        $trimmed = trim($keyOrUrl);
        $normalized = $this->normalizeKey($trimmed);

        // External non-storage URL (e.g., third-party cover link)
        if ($normalized === null) {
            return $trimmed;
        }

        $cdnUrl = config('filesystems.media_cdn_url');
        if (is_string($cdnUrl) && trim($cdnUrl) !== '') {
            return rtrim($cdnUrl, '/').'/'.$normalized;
        }

        return $this->disk()->url($normalized);
    }

    public function temporarySignedUrl(string $key, int $minutes = 5): string
    {
        $normalizedKey = $this->normalizeKey($key) ?? ltrim($key, '/');
        $expiresAt = now()->addMinutes($minutes);

        try {
            return $this->disk()->temporaryUrl($normalizedKey, $expiresAt);
        } catch (RuntimeException) {
            return URL::temporarySignedRoute(
                'api.v1.media.signed',
                $expiresAt,
                ['key' => $normalizedKey]
            );
        }
    }

    private function disk(): FilesystemAdapter
    {
        /** @var FilesystemAdapter $adapter */
        $adapter = Storage::disk($this->diskName());

        return $adapter;
    }
}
