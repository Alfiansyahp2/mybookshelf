<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;
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
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

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
    public function show(Request $request, $id)
    {
        $collection = Collection::where('user_id', $request->user()->id)
            ->with('books')
            ->findOrFail($id);

        return response()->success($collection, 'Collection retrieved successfully');
    }

    /**
     * Update the specified collection.
     */
    public function update(Request $request, $id)
    {
        $collection = Collection::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

        $collection->update($data);

        return response()->success($collection->load('books'), 'Collection updated successfully');
    }

    /**
     * Remove the specified collection.
     */
    public function destroy(Request $request, $id)
    {
        $collection = Collection::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $collection->delete();

        return response()->success(null, 'Collection deleted successfully');
    }

    /**
     * Add book to collection.
     */
    public function addBook(Request $request, $id)
    {
        $collection = Collection::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $data = $request->validate([
            'book_id' => 'required|exists:books,id',
            'order' => 'nullable|integer|min:0',
        ]);

        // Check if book already in collection
        if ($collection->books()->where('books.id', $data['book_id'])->exists()) {
            return response()->error('Book already in collection', null, 400);
        }

        $collection->books()->attach($data['book_id'], [
            'order' => $data['order'] ?? $collection->books()->count(),
            'added_at' => now(),
        ]);

        // Update collection progress
        $collection->updateProgress();

        return response()->success($collection->load('books'), 'Book added to collection');
    }

    /**
     * Remove book from collection.
     */
    public function removeBook(Request $request, $id, $book)
    {
        $collection = Collection::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $collection->books()->detach($book);

        // Update collection progress
        $collection->updateProgress();

        return response()->success($collection->load('books'), 'Book removed from collection');
    }

    /**
     * Reorder book in collection.
     */
    public function reorderBook(Request $request, $id, $book)
    {
        $collection = Collection::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $data = $request->validate([
            'order' => 'required|integer|min:0',
        ]);

        $collection->books()->updateExistingPivot($book, ['order' => $data['order']]);

        return response()->success($collection->load('books'), 'Book reordered successfully');
    }
}
