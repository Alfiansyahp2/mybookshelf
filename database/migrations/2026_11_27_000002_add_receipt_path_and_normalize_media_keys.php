<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('receipt_path', 500)->nullable()->after('receipt_filename');
        });

        // Normalize legacy full /storage/... URLs on books.cover_image to relative object keys
        DB::table('books')
            ->whereNotNull('cover_image')
            ->where('cover_image', 'like', '%/storage/%')
            ->orderBy('id')
            ->chunkById(200, function ($books): void {
                foreach ($books as $book) {
                    $path = (string) (parse_url((string) $book->cover_image, PHP_URL_PATH) ?: '');
                    if (str_contains($path, '/storage/')) {
                        $relativeKey = ltrim(explode('/storage/', $path, 2)[1] ?? '', '/');
                        if ($relativeKey !== '') {
                            DB::table('books')
                                ->where('id', $book->id)
                                ->update(['cover_image' => $relativeKey]);
                        }
                    }
                }
            });

        // Move legacy base64 receipts from expenses.receipt_data into configured media storage keys
        $diskName = (string) config('filesystems.media_disk', 'public');
        DB::table('expenses')
            ->whereNotNull('receipt_data')
            ->where('receipt_data', '<>', '')
            ->whereNull('receipt_path')
            ->orderBy('id')
            ->chunkById(100, function ($expenses) use ($diskName): void {
                foreach ($expenses as $expense) {
                    $rawData = (string) $expense->receipt_data;
                    $mime = (string) ($expense->receipt_mime_type ?: 'image/jpeg');

                    if (preg_match('/^data:([^;]+);base64,(.*)$/s', $rawData, $matches)) {
                        $mime = $matches[1];
                        $binary = base64_decode($matches[2], true);
                    } else {
                        $binary = base64_decode($rawData, true);
                    }

                    if ($binary === false || $binary === '') {
                        continue;
                    }

                    $ext = match ($mime) {
                        'image/png' => 'png',
                        'image/webp' => 'webp',
                        'application/pdf' => 'pdf',
                        default => 'jpg',
                    };

                    $key = "receipts/{$expense->user_id}/{$expense->id}.{$ext}";
                    Storage::disk($diskName)->put($key, $binary, [
                        'visibility' => 'private',
                        'ContentType' => $mime,
                    ]);

                    DB::table('expenses')
                        ->where('id', $expense->id)
                        ->update([
                            'receipt_path' => $key,
                            'receipt_data' => null,
                        ]);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn('receipt_path');
        });
    }
};
