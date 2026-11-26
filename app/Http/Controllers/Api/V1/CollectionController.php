<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Library\AddBookToCollectionRequest;
use App\Http\Requests\Api\V1\Library\ReorderCollectionBookRequest;
use App\Http\Requests\Api\V1\Library\StoreCollectionRequest;
use App\Http\Requests\Api\V1\Library\UpdateCollectionRequest;
use App\Models\Book;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class CollectionController extends Controller
{
    /**
     * Display a listing of collections.
     */
    public function index(Request $request)
    {
        $collections = Collection::where('user_id', $request->user()->id)
            ->with('books')
            ->get();

        return response()->success($collections, 'Collections retrieved successfully');
    }

    /**
     * Store a newly created collection.
     */
    public function store(StoreCollectionRequest $request)
    {
        Gate::authorize('create', Collection::class);

        $data = $request->validated();

        $collection = Collection::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $request->user()->id,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'color' => $data['color'] ?? null,
            'icon' => $data['icon'] ?? null,
            'progress' => 0,
        ]);

        return response()->success($collection->load('books'), 'Collection created successfully', 201);
    }

    /**
     * Display the specified collection.
     */
    public function show(Collection $collection)
    {
        Gate::authorize('view', $collection);

        return response()->success($collection->load('books'), 'Collection retrieved successfully');
    }

    /**
     * Update the specified collection.
     */
    public function update(UpdateCollectionRequest $request, Collection $collection)
    {
        Gate::authorize('update', $collection);

        $collection->update($request->validated());

        return response()->success($collection->load('books'), 'Collection updated successfully');
    }

    /**
     * Remove the specified collection.
     */
    public function destroy(Collection $collection)
    {
        Gate::authorize('delete', $collection);

        $collection->delete();

        return response()->success(null, 'Collection deleted successfully');
    }

    /**
     * Add book to collection.
     */
    public function addBook(AddBookToCollectionRequest $request, Collection $collection)
    {
        Gate::authorize('update', $collection);

        $data = $request->validated();

        if ($collection->books()->where('books.id', $data['book_id'])->exists()) {
            return response()->error('Book already in collection', null, 400);
        }

        $collection->books()->attach($data['book_id'], [
            'order' => $data['order'] ?? $collection->books()->count(),
            'added_at' => now(),
        ]);

        $collection->updateProgress();

        return response()->success($collection->load('books'), 'Book added to collection');
    }

    /**
     * Remove book from collection.
     */
    public function removeBook(Collection $collection, Book $book)
    {
        Gate::authorize('update', $collection);
        Gate::authorize('view', $book);

        abort_unless($collection->books()->where('books.id', $book->id)->exists(), 404);

        $collection->books()->detach($book->id);
        $collection->updateProgress();

        return response()->success($collection->load('books'), 'Book removed from collection');
    }

    /**
     * Reorder book in collection.
     */
    public function reorderBook(ReorderCollectionBookRequest $request, Collection $collection, Book $book)
    {
        Gate::authorize('update', $collection);
        Gate::authorize('view', $book);

        abort_unless($collection->books()->where('books.id', $book->id)->exists(), 404);

        $collection->books()->updateExistingPivot($book->id, ['order' => $request->validated('order')]);

        return response()->success($collection->load('books'), 'Book reordered successfully');
    }
}
