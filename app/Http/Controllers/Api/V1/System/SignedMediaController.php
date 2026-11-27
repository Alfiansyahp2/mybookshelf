<?php

namespace App\Http\Controllers\Api\V1\System;

use App\Contracts\Storage\MediaStorageInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class SignedMediaController extends Controller
{
    public function __construct(
        private MediaStorageInterface $mediaStorage
    ) {}

    /**
     * Stream private media assets referenced by a Laravel signed URL fallback.
     */
    public function __invoke(Request $request): Response
    {
        $key = $this->mediaStorage->normalizeKey((string) $request->query('key', ''));

        if (! $key || str_contains($key, '..') || ! $this->mediaStorage->exists($key)) {
            return response()->error('Media asset not found', null, 404);
        }

        $disk = Storage::disk($this->mediaStorage->diskName());

        return $disk->response($key);
    }
}
