<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Room;
use App\Models\Shelf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            ->orderBy('order')
            ->latest()
            ->get();
        return response()->success($shelves, 'Shelves retrieved successfully');
    }

    /**
     * Store a newly created shelf.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'order' => 'nullable|integer|min:0',
            'span' => 'nullable|integer|min:2|max:12',
            'room_id' => ['nullable', $this->ownedRule('rooms', $user->id)],
        ]);

        // SECURITY: Set user_id to authenticated user
        $data['user_id'] = $user->id;

        if (empty($data['room_id'])) {
            $room = Room::firstOrCreate(
                ['user_id' => $user->id],
                ['name' => 'Main Room', 'order' => 0, 'unlocked' => true]
            );
            $data['room_id'] = $room->id;
        }

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
        $userId = $request->user()->id;

        // SECURITY: Only allow user to update their own shelves
        $shelf = Shelf::where('user_id', $userId)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'order' => 'sometimes|integer|min:0',
            'span' => 'sometimes|integer|min:2|max:12',
            'room_id' => ['sometimes', $this->ownedRule('rooms', $userId)],
            'decorations' => 'sometimes|array|nullable',
        ]);

        $shelf->update($data);

        return response()->success($shelf->load(['room', 'books']), 'Shelf updated successfully');
    }

    /**
     * Remove the specified shelf and safely relocate its books if another shelf exists.
     */
    public function destroy(Request $request, $id)
    {
        $userId = $request->user()->id;

        // SECURITY: Only allow user to delete their own shelves
        $shelf = Shelf::where('user_id', $userId)->findOrFail($id);

        $validated = $request->validate([
            'relocate_to' => ['nullable', $this->ownedRule('shelves', $userId)],
        ]);

        $targetShelfId = $validated['relocate_to'] ?? null;
        if ($targetShelfId === $shelf->id) {
            return response()->error('Cannot relocate books to the shelf being deleted', null, 422);
        }

        $relocatedCount = DB::transaction(function () use ($shelf, $userId, $targetShelfId) {
            $fallbackShelfId = $targetShelfId ?? Shelf::where('user_id', $userId)
                ->where('id', '!=', $shelf->id)
                ->orderBy('order')
                ->value('id');

            $affected = 0;
            if ($fallbackShelfId) {
                $affected = Book::where('shelf_id', $shelf->id)
                    ->where('user_id', $userId)
                    ->update(['shelf_id' => $fallbackShelfId]);
            }

            $shelf->delete();

            return $affected;
        });

        return response()->success([
            'relocated_books' => $relocatedCount,
        ], 'Shelf deleted successfully');
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
    /**
     * Batch update shelf layout (span and order).
     */
    public function updateLayout(Request $request)
    {
        $data = $request->validate([
            'shelves' => 'required|array',
            'shelves.*.id' => 'required|uuid',
            'shelves.*.order' => 'required|integer',
            'shelves.*.span' => 'required|integer|min:2|max:12',
        ]);

        $userId = $request->user()->id;

        // Perform batch update
        foreach ($data['shelves'] as $shelfData) {
            Shelf::where('id', $shelfData['id'])
                ->where('user_id', $userId)
                ->update([
                    'order' => $shelfData['order'],
                    'span' => $shelfData['span']
                ]);
        }

        return response()->success(null, 'Layout updated successfully');
    }
}
