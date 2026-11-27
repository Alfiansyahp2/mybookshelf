<?php

namespace App\Services\Library;

use App\Models\Book;
use App\Models\Collection;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Str;

class CollectionService
{
    /**
     * List all collections belonging to a user with embedded books.
     */
    public function listForUser(string $userId): EloquentCollection
    {
        return Collection::where('user_id', $userId)
            ->with('books')
            ->get();
    }

    /**
     * Create a new collection for a user.
     */
    public function createForUser(string $userId, array $data): Collection
    {
        $collection = Collection::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'color' => $data['color'] ?? null,
            'icon' => $data['icon'] ?? null,
            'progress' => 0,
        ]);

        return $collection->load('books');
    }

    /**
     * Update an existing collection and return it with loaded books.
     */
    public function updateCollection(Collection $collection, array $data): Collection
    {
        $collection->update($data);

        return $collection->load('books');
    }

    /**
     * Delete a collection.
     */
    public function deleteCollection(Collection $collection): void
    {
        $collection->delete();
    }

    /**
     * Attach a book to a collection and recalculate progress.
     *
     * @throws \InvalidArgumentException
     */
    public function addBook(Collection $collection, string $bookId, ?int $order = null): Collection
    {
        if ($collection->books()->where('books.id', $bookId)->exists()) {
            throw new \InvalidArgumentException('Book already in collection');
        }

        $collection->books()->attach($bookId, [
            'order' => $order ?? $collection->books()->count(),
            'added_at' => now(),
        ]);

        $collection->updateProgress();

        return $collection->load('books');
    }

    /**
     * Detach a book from a collection and recalculate progress.
     *
     * @throws ModelNotFoundException
     */
    public function removeBook(Collection $collection, Book $book): Collection
    {
        $this->assertContainsBook($collection, $book);

        $collection->books()->detach($book->id);
        $collection->updateProgress();

        return $collection->load('books');
    }

    /**
     * Update the ordering position of a book inside a collection.
     *
     * @throws ModelNotFoundException
     */
    public function reorderBook(Collection $collection, Book $book, int $order): Collection
    {
        $this->assertContainsBook($collection, $book);

        $collection->books()->updateExistingPivot($book->id, ['order' => $order]);

        return $collection->load('books');
    }

    /**
     * Ensure the given book currently belongs to the collection.
     */
    private function assertContainsBook(Collection $collection, Book $book): void
    {
        if (! $collection->books()->where('books.id', $book->id)->exists()) {
            throw new ModelNotFoundException('Book is not in this collection.');
        }
    }
}
