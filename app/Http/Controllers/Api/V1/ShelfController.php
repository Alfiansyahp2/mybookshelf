<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Shelf;
use Illuminate\Http\Request;

class ShelfController extends Controller
{
    /**
     * Display a listing of shelves.
     */
    public function index(Request $request)
    {
        // SECURITY: Only show shelves belonging to authenticated user
        $shelves = Shelf::with(['room', 'books'])
            ->where('user_id', $request->user()->id)
            ->get();
        return response()->success($shelves, 'Shelves retrieved successfully');
    }

    /**
     * Store a newly created shelf.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'order' => 'nullable|integer|min:0',
            'room_id' => 'required|exists:rooms,id',
        ]);

        // SECURITY: Set user_id to authenticated user
        $data['user_id'] = $request->user()->id;
        $shelf = Shelf::create($data);

        return response()->success($shelf->load(['room', 'books']), 'Shelf created successfully', 201);
    }

    /**
     * Display the specified shelf.
     */
    public function show(Request $request, $id)
    {
        // SECURITY: Only allow user to see their own shelves
        $shelf = Shelf::with(['room', 'books'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);
        return response()->success($shelf, 'Shelf retrieved successfully');
    }

    /**
     * Update the specified shelf.
     */
    public function update(Request $request, $id)
    {
        // SECURITY: Only allow user to update their own shelves
        $shelf = Shelf::where('user_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'order' => 'sometimes|integer|min:0',
            'room_id' => 'sometimes|exists:rooms,id',
        ]);

        $shelf->update($data);

        return response()->success($shelf->load(['room', 'books']), 'Shelf updated successfully');
    }

    /**
     * Remove the specified shelf.
     */
    public function destroy(Request $request, $id)
    {
        // SECURITY: Only allow user to delete their own shelves
        $shelf = Shelf::where('user_id', $request->user()->id)->findOrFail($id);

        // TODO: Relocate books to another shelf or prevent deletion if books exist

        $shelf->delete();

        return response()->success(null, 'Shelf deleted successfully');
    }

    /**
     * Get shelf occupancy statistics.
     */
    public function occupancy(Request $request, $id)
    {
        // SECURITY: Only allow user to see their own shelves
        $shelf = Shelf::with('books')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        $occupancy = [
            'shelf_id' => $shelf->id,
            'name' => $shelf->name,
            'total' => $shelf->capacity,
            'occupied' => $shelf->books->count(),
            'available' => max(0, $shelf->capacity - $shelf->books->count()),
            'percentage' => $shelf->capacity > 0
                ? round(($shelf->books->count() / $shelf->capacity) * 100, 2)
                : 0,
        ];

        return response()->success($occupancy, 'Occupancy retrieved successfully');
    }
}
