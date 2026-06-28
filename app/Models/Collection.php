<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Collection extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'description',
        'color',
        'icon',
        'progress',
    ];

    protected $casts = [
        'progress' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function books(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'collection_book')
                    ->withPivot('order', 'added_at')
                    ->orderBy('collection_book.order');
    }

    /**
     * Update collection progress based on completed books.
     */
    public function updateProgress(): void
    {
        $totalBooks = $this->books()->count();
        if ($totalBooks === 0) {
            $this->update(['progress' => 0]);
            return;
        }

        $finishedBooks = $this->books()
            ->where('status', 'finished')
            ->count();

        $progress = ($finishedBooks / $totalBooks) * 100;
        $this->update(['progress' => round($progress, 2)]);
    }
}