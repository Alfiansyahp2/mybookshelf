<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Library\DeleteShelfRequest;
use App\Http\Requests\Api\V1\Library\StoreShelfRequest;
use App\Http\Requests\Api\V1\Library\UpdateShelfLayoutRequest;
use App\Http\Requests\Api\V1\Library\UpdateShelfRequest;
use App\Models\Book;
use App\Models\Shelf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ShelfController extends Controller
{
    /**
     * Display a listing of shelves.
     */
    public function index(Request $request)
    {
        $shelves = Shelf::with('books')
            ->where('user_id', $request->user()->id)
            ->orderBy('order')
            ->latest()
            ->get();

        return response()->success($shelves, 'Shelves retrieved successfully');
    }

    /**
     * Store a newly created shelf.
     */
    public function store(StoreShelfRequest $request)
    {
        Gate::authorize('create', Shelf::class);

        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $shelf = Shelf::create($data);

        return response()->success($shelf->load('books'), 'Shelf created successfully', 201);
    }

    /**
     * Display the specified shelf.
     */
    public function show(Shelf $shelf)
    {
        Gate::authorize('view', $shelf);

        return response()->success($shelf->load('books'), 'Shelf retrieved successfully');
    }

    /**
     * Update the specified shelf.
     */
    public function update(UpdateShelfRequest $request, Shelf $shelf)
    {
        Gate::authorize('update', $shelf);

        $shelf->update($request->validated());

        return response()->success($shelf->load('books'), 'Shelf updated successfully');
    }

    /**
     * Remove the specified shelf and safely relocate its books if another shelf exists.
     */
    public function destroy(DeleteShelfRequest $request, Shelf $shelf)
    {
        Gate::authorize('delete', $shelf);

        $userId = $request->user()->id;
        $targetShelfId = $request->validated('relocate_to');

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
    public function occupancy(Shelf $shelf)
    {
        Gate::authorize('view', $shelf);

        $shelf->load('books');

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
    public function updateLayout(UpdateShelfLayoutRequest $request)
    {
        $userId = $request->user()->id;

        foreach ($request->validated('shelves') as $shelfData) {
            Shelf::where('id', $shelfData['id'])
                ->where('user_id', $userId)
                ->update([
                    'order' => $shelfData['order'],
                    'span' => $shelfData['span'],
                ]);
        }

        return response()->success(null, 'Layout updated successfully');
    }
}
