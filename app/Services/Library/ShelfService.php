<?php

namespace App\Services\Library;

use App\Models\Book;
use App\Models\Shelf;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ShelfService
{
    /**
     * List all shelves belonging to a user ordered by shelf layout order.
     */
    public function listForUser(string $userId): Collection
    {
        return Shelf::with('books')
            ->where('user_id', $userId)
            ->orderBy('order')
            ->latest()
            ->get();
    }

    /**
     * Create a new shelf for a user.
     */
    public function createForUser(string $userId, array $data): Shelf
    {
        $data['user_id'] = $userId;

        return Shelf::create($data)->load('books');
    }

    /**
     * Update an existing shelf and return it with loaded books.
     */
    public function updateShelf(Shelf $shelf, array $data): Shelf
    {
        $shelf->update($data);

        return $shelf->load('books');
    }

    /**
     * Delete a shelf and optionally relocate its books to a fallback shelf.
     *
     * @throws \InvalidArgumentException
     */
    public function deleteAndRelocate(Shelf $shelf, string $userId, ?string $targetShelfId): int
    {
        if ($targetShelfId === $shelf->id) {
            throw new \InvalidArgumentException('Cannot relocate books to the shelf being deleted');
        }

        return DB::transaction(function () use ($shelf, $userId, $targetShelfId): int {
            $fallbackShelfId = $targetShelfId ?? Shelf::where('user_id', $userId)
                ->where('id', '!=', $shelf->id)
                ->orderBy('order')
                ->value('id');

            $relocatedCount = 0;
            if ($fallbackShelfId) {
                $relocatedCount = Book::where('shelf_id', $shelf->id)
                    ->where('user_id', $userId)
                    ->update(['shelf_id' => $fallbackShelfId]);
            }

            $shelf->delete();

            return $relocatedCount;
        });
    }

    /**
     * Calculate occupancy metrics for a shelf.
     */
    public function getOccupancy(Shelf $shelf): array
    {
        $shelf->load('books');
        $occupied = $shelf->books->count();

        return [
            'shelf_id' => $shelf->id,
            'name' => $shelf->name,
            'total' => $shelf->capacity,
            'occupied' => $occupied,
            'available' => max(0, $shelf->capacity - $occupied),
            'percentage' => $shelf->capacity > 0
                ? round(($occupied / $shelf->capacity) * 100, 2)
                : 0,
        ];
    }

    /**
     * Batch update shelf display order and grid spans for a user.
     */
    public function updateLayout(string $userId, array $shelvesData): void
    {
        DB::transaction(function () use ($userId, $shelvesData): void {
            foreach ($shelvesData as $shelfData) {
                Shelf::where('id', $shelfData['id'])
                    ->where('user_id', $userId)
                    ->update([
                        'order' => $shelfData['order'],
                        'span' => $shelfData['span'],
                    ]);
            }
        });
    }
}
