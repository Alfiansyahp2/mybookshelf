<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Library\AddBookToCollectionRequest;
use App\Http\Requests\Api\V1\Library\ReorderCollectionBookRequest;
use App\Http\Requests\Api\V1\Library\StoreCollectionRequest;
use App\Http\Requests\Api\V1\Library\UpdateCollectionRequest;
use App\Http\Resources\Api\V1\Library\CollectionResource;
use App\Models\Book;
use App\Models\Collection;
use App\Services\Library\CollectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CollectionController extends Controller
{
    public function __construct(
        private CollectionService $collectionService
    ) {}

    /**
     * Display a listing of collections.
     */
    public function index(Request $request): JsonResponse
    {
        $collections = $this->collectionService->listForUser($request->user()->id);

        return response()->success(CollectionResource::collection($collections), 'Collections retrieved successfully');
    }

    /**
     * Store a newly created collection.
     */
    public function store(StoreCollectionRequest $request): JsonResponse
    {
        Gate::authorize('create', Collection::class);

        $collection = $this->collectionService->createForUser($request->user()->id, $request->validated());

        return response()->success(new CollectionResource($collection), 'Collection created successfully', 201);
    }

    /**
     * Display the specified collection.
     */
    public function show(Collection $collection): JsonResponse
    {
        Gate::authorize('view', $collection);

        return response()->success(
            new CollectionResource($collection->load('books')),
            'Collection retrieved successfully'
        );
    }

    /**
     * Update the specified collection.
     */
    public function update(UpdateCollectionRequest $request, Collection $collection): JsonResponse
    {
        Gate::authorize('update', $collection);

        $updatedCollection = $this->collectionService->updateCollection($collection, $request->validated());

        return response()->success(new CollectionResource($updatedCollection), 'Collection updated successfully');
    }

    /**
     * Remove the specified collection.
     */
    public function destroy(Collection $collection): JsonResponse
    {
        Gate::authorize('delete', $collection);

        $this->collectionService->deleteCollection($collection);

        return response()->success(null, 'Collection deleted successfully');
    }

    /**
     * Add a book to the collection.
     */
    public function addBook(AddBookToCollectionRequest $request, Collection $collection): JsonResponse
    {
        Gate::authorize('update', $collection);

        $data = $request->validated();

        try {
            $updated = $this->collectionService->addBook(
                $collection,
                $data['book_id'],
                $data['order'] ?? null
            );
        } catch (\InvalidArgumentException $e) {
            return response()->error($e->getMessage(), null, 400);
        }

        return response()->success(new CollectionResource($updated), 'Book added to collection');
    }

    /**
     * Remove a book from the collection.
     */
    public function removeBook(Collection $collection, Book $book): JsonResponse
    {
        Gate::authorize('update', $collection);
        Gate::authorize('view', $book);

        $updated = $this->collectionService->removeBook($collection, $book);

        return response()->success(new CollectionResource($updated), 'Book removed from collection');
    }

    /**
     * Reorder a book within the collection.
     */
    public function reorderBook(ReorderCollectionBookRequest $request, Collection $collection, Book $book): JsonResponse
    {
        Gate::authorize('update', $collection);
        Gate::authorize('view', $book);

        $updated = $this->collectionService->reorderBook($collection, $book, $request->validated('order'));

        return response()->success(new CollectionResource($updated), 'Book reordered successfully');
    }
}
