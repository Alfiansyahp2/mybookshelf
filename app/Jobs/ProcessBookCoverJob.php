<?php

namespace App\Jobs;

use App\Contracts\Storage\MediaStorageInterface;
use App\Events\BookSaved;
use App\Models\Book;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessBookCoverJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public string $bookId,
        public string $rawKey
    ) {}

    public function handle(MediaStorageInterface $mediaStorage): void
    {
        $bytes = $mediaStorage->get($this->rawKey);
        if ($bytes === null || $bytes === '') {
            return;
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $detectedMime = (string) $finfo->buffer($bytes);

        if (! in_array($detectedMime, ['image/jpeg', 'image/png', 'image/webp'], true)) {
            Log::warning('ProcessBookCoverJob rejected invalid MIME type', [
                'book_id' => $this->bookId,
                'mime' => $detectedMime,
            ]);
            $mediaStorage->delete($this->rawKey);

            return;
        }

        $sourceImage = @imagecreatefromstring($bytes);
        if ($sourceImage === false) {
            $mediaStorage->delete($this->rawKey);

            return;
        }

        try {
            $width = imagesx($sourceImage);
            $height = imagesy($sourceImage);
            $maxDimension = 1000;

            $targetImage = $sourceImage;
            if ($width > $maxDimension || $height > $maxDimension) {
                $ratio = min($maxDimension / $width, $maxDimension / $height);
                $newWidth = max(1, (int) round($width * $ratio));
                $newHeight = max(1, (int) round($height * $ratio));

                $resized = imagecreatetruecolor($newWidth, $newHeight);
                if ($resized !== false) {
                    imagealphablending($resized, false);
                    imagesavealpha($resized, true);
                    imagecopyresampled($resized, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                    $targetImage = $resized;
                }
            } else {
                imagepalettetotruecolor($targetImage);
                imagealphablending($targetImage, false);
                imagesavealpha($targetImage, true);
            }

            // Encoding to WebP strips EXIF/IPTC/XMP metadata automatically
            ob_start();
            imagewebp($targetImage, null, 82);
            $webpBytes = ob_get_clean();

            if ($targetImage !== $sourceImage) {
                imagedestroy($targetImage);
            }
        } finally {
            imagedestroy($sourceImage);
        }

        if (! is_string($webpBytes) || $webpBytes === '') {
            return;
        }

        $webpKey = "book-covers/book_{$this->bookId}_".now()->timestamp.'.webp';
        $mediaStorage->put($webpKey, $webpBytes, 'image/webp', 'public');

        $book = Book::find($this->bookId);
        if ($book) {
            $book->updateQuietly(['cover_image' => $webpKey]);
            BookSaved::dispatch($book->user_id);
        }

        if ($webpKey !== $this->rawKey) {
            $mediaStorage->delete($this->rawKey);
        }
    }
}
