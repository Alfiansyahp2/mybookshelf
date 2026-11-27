<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Library\DeleteShelfRequest;
use App\Http\Requests\Api\V1\Library\StoreShelfRequest;
use App\Http\Requests\Api\V1\Library\UpdateShelfLayoutRequest;
use App\Http\Requests\Api\V1\Library\UpdateShelfRequest;
use App\Http\Resources\Api\V1\Library\ShelfResource;
use App\Models\Shelf;
use App\Services\Library\ShelfService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ShelfController extends Controller
{
    public function __construct(
        private ShelfService $shelfService
    ) {}

    /**
     * Display a listing of shelves.
     */
    public function index(Request $request): JsonResponse
    {
        $shelves = $this->shelfService->listForUser($request->user()->id);

        return response()->success(ShelfResource::collection($shelves), 'Shelves retrieved successfully');
    }

    /**
     * Store a newly created shelf.
     */
    public function store(StoreShelfRequest $request): JsonResponse
    {
        Gate::authorize('create', Shelf::class);

        $shelf = $this->shelfService->createForUser($request->user()->id, $request->validated());

        return response()->success(new ShelfResource($shelf), 'Shelf created successfully', 201);
    }

    /**
     * Display the specified shelf.
     */
    public function show(Shelf $shelf): JsonResponse
    {
        Gate::authorize('view', $shelf);

        return response()->success(new ShelfResource($shelf->load('books')), 'Shelf retrieved successfully');
    }

    /**
     * Update the specified shelf.
     */
    public function update(UpdateShelfRequest $request, Shelf $shelf): JsonResponse
    {
        Gate::authorize('update', $shelf);

        $updatedShelf = $this->shelfService->updateShelf($shelf, $request->validated());

        return response()->success(new ShelfResource($updatedShelf), 'Shelf updated successfully');
    }

    /**
     * Remove the specified shelf and safely relocate its books if another shelf exists.
     */
    public function destroy(DeleteShelfRequest $request, Shelf $shelf): JsonResponse
    {
        Gate::authorize('delete', $shelf);

        try {
            $relocatedCount = $this->shelfService->deleteAndRelocate(
                $shelf,
                $request->user()->id,
                $request->validated('relocate_to')
            );
        } catch (\InvalidArgumentException $e) {
            return response()->error($e->getMessage(), null, 422);
        }

        return response()->success([
            'relocated_books' => $relocatedCount,
        ], 'Shelf deleted successfully');
    }

    /**
     * Get shelf occupancy statistics.
     */
    public function occupancy(Shelf $shelf): JsonResponse
    {
        Gate::authorize('view', $shelf);

        return response()->success(
            $this->shelfService->getOccupancy($shelf),
            'Occupancy retrieved successfully'
        );
    }

    /**
     * Batch update shelf layout (span and order).
     */
    public function updateLayout(UpdateShelfLayoutRequest $request): JsonResponse
    {
        $this->shelfService->updateLayout($request->user()->id, $request->validated('shelves'));

        return response()->success(null, 'Layout updated successfully');
    }
}
