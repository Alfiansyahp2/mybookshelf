<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shelf extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'room_id',
        'name',
        'capacity',
        'order',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'order' => 'integer',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function books(): HasMany
    {
        return $this->hasMany(Book::class)->orderBy('position');
    }

    /**
     * Get shelf occupancy statistics.
     */
    public function getOccupancyAttribute(): array
    {
        $total = $this->capacity;
        $occupied = $this->books()->count();
        $available = max(0, $total - $occupied);
        $percentage = $total > 0 ? round(($occupied / $total) * 100, 2) : 0;

        return [
            'shelf_id' => $this->id,
            'total' => $total,
            'occupied' => $occupied,
            'available' => $available,
            'percentage' => $percentage,
        ];
    }
}