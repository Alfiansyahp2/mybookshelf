<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Accounting\ExpenseResource;
use App\Models\Book;
use App\Services\Library\BookCostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BookCostController extends Controller
{
    public function __construct(
        private BookCostService $bookCostService
    ) {}

    /**
     * Get expenses associated with a specific book.
     */
    public function expenses(Book $book): JsonResponse
    {
        Gate::authorize('view', $book);

        try {
            $expenses = $this->bookCostService->getBookExpenses($book);

            return response()->success(ExpenseResource::collection($expenses), 'Book expenses retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BookCostController::expenses failed');
        }
    }

    /**
     * Get cost breakdown for a specific book.
     */
    public function costBreakdown(Book $book): JsonResponse
    {
        Gate::authorize('view', $book);

        try {
            $breakdown = $this->bookCostService->getCostBreakdown($book);
            $breakdown['expenses'] = ExpenseResource::collection($breakdown['expenses'])->resolve(request());

            return response()->success($breakdown, 'Book cost breakdown retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BookCostController::costBreakdown failed');
        }
    }

    /**
     * Get monthly purchase history with live currency conversions to IDR.
     */
    public function purchaseHistory(Request $request): JsonResponse
    {
        try {
            $months = max(1, (int) $request->query('months', 12));
            $history = $this->bookCostService->getPurchaseHistory($request->user()->id, $months);

            $message = empty($history) ? 'No purchase data available' : 'Purchase history retrieved successfully';

            return response()->success($history, $message);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, 'BookCostController::purchaseHistory failed');
        }
    }
}
