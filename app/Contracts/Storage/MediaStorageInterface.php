<?php

namespace App\Contracts\Storage;

interface MediaStorageInterface
{
    public function diskName(): string;

    public function put(
        string $key,
        string $contents,
        ?string $mimeType = null,
        string $visibility = 'public'
    ): string;

    public function exists(string $key): bool;

    public function get(string $key): ?string;

    public function delete(?string $keyOrUrl): void;

    public function normalizeKey(?string $keyOrUrl): ?string;

    public function publicUrl(?string $keyOrUrl): ?string;

    public function temporarySignedUrl(string $key, int $minutes = 5): string;
}
