<?php

namespace App\Observers;

use App\Models\Book;
use App\Services\Accounting\ExpenseService;

class BookObserver
{
    public function __construct(protected ExpenseService $expenseService) {}

    /**
     * Handle the Book "saved" event (created and updated).
     */
    public function saved(Book $book): void
    {
        $this->expenseService->syncFromBook($book);
    }

    /**
     * Handle the Book "deleted" event.
     */
    public function deleted(Book $book): void
    {
        $this->expenseService->removeForBook($book);
    }

    /**
     * Handle the Book "force deleted" event.
     */
    public function forceDeleted(Book $book): void
    {
        $this->expenseService->removeForBook($book, true);
    }
}
