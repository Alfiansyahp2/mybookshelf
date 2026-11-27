<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shelf extends Model
{
    /** @use HasFactory<Factory<static>> */
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'name',
        'capacity',
        'order',
        'span',
        'decorations',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'order' => 'integer',
        'span' => 'integer',
        'decorations' => 'array',
    ];

    /**
     * @return HasMany<Book, $this>
     */
    public function books(): HasMany
    {
        return $this->hasMany(Book::class)->orderBy('position');
    }

    /**
     * Get shelf occupancy statistics.
     *
     * @return array{shelf_id: string, total: int, occupied: int, available: int, percentage: float|int}
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
