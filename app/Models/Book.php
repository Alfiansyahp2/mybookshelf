<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Disable automatic timestamps since we use custom column names
     */
    const CREATED_AT = 'date_added';
    const UPDATED_AT = 'last_modified';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'id',
        'user_id',
        'shelf_id',
        'title',
        'author',
        'isbn',
        'genre',
        'language',
        'publisher',
        'publish_year',
        'pages',
        'format',
        'height',
        'thickness',
        'status',
        'spine_color_light',
        'spine_color_medium',
        'spine_color_dark',
        'cover_image',
        'position',
        'favorite',
        'current_page',
        'progress',
        'started_date',
        'finished_date',
        'estimated_start_date',
        'borrowed_by',
        'borrowed_date',
        'due_date',
        'is_returned',
        'personal_notes',
        'personal_rating',
        'purchase_date',
        'purchase_price',
        'purchase_location',
        'date_added',
        'last_modified',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'publish_year' => 'integer',
        'pages' => 'integer',
        'position' => 'integer',
        'favorite' => 'boolean',
        'current_page' => 'integer',
        'progress' => 'decimal:2',
        'started_date' => 'datetime',
        'finished_date' => 'datetime',
        'estimated_start_date' => 'datetime',
        'borrowed_date' => 'datetime',
        'due_date' => 'datetime',
        'is_returned' => 'boolean',
        'personal_rating' => 'decimal:1',
        'purchase_date' => 'datetime',
        'purchase_price' => 'decimal:2',
        'date_added' => 'datetime',
        'last_modified' => 'datetime',
    ];

    /**
     * Get the user that owns the book.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the shelf that the book belongs to.
     */
    public function shelf(): BelongsTo
    {
        return $this->belongsTo(Shelf::class);
    }

    /**
     * Get the collections that the book belongs to.
     */
    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class, 'collection_book')
                    ->withPivot('order', 'added_at');
    }

    /**
     * Get all reading sessions for the book.
     */
    public function readingSessions(): HasMany
    {
        return $this->hasMany(ReadingSession::class);
    }

    /**
     * Get all timeline events for the book.
     */
    public function timelineEvents(): HasMany
    {
        return $this->hasMany(TimelineEvent::class);
    }

    /**
     * Scope a query to only include favorite books.
     */
    public function scopeFavorite($query)
    {
        return $query->where('favorite', true);
    }

    /**
     * Scope a query to only include books with a given status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Get the spine colors as an array.
     */
    public function getSpineColorsAttribute(): array
    {
        return [
            $this->spine_color_light,
            $this->spine_color_medium,
            $this->spine_color_dark,
        ];
    }
}
