<?php

namespace App\Services\Library;

use App\Models\Book;

class BookLoanService
{
    public function __construct(
        private BookService $bookService
    ) {}

    /**
     * Mark a book as borrowed and record a loan timeline event.
     */
    public function borrow(Book $book, string $borrowedBy, string $dueDate): Book
    {
        $book->update([
            'status' => 'borrowed',
            'borrowed_by' => $borrowedBy,
            'borrowed_date' => now(),
            'due_date' => $dueDate,
            'is_returned' => false,
            'last_modified' => now(),
        ]);

        $this->bookService->createTimelineEvent($book, 'loaned', "Loaned to {$borrowedBy}");

        return $book->fresh();
    }

    /**
     * Return a borrowed book, restoring its status from current reading progress.
     */
    public function returnBook(Book $book): Book
    {
        $previousStatus = 'unread';
        if ($book->progress >= 100) {
            $previousStatus = 'finished';
        } elseif ($book->progress > 0) {
            $previousStatus = 'reading';
        }

        $book->update([
            'status' => $previousStatus,
            'borrowed_by' => null,
            'borrowed_date' => null,
            'due_date' => null,
            'is_returned' => true,
            'last_modified' => now(),
        ]);

        $this->bookService->createTimelineEvent($book, 'returned', 'Book returned');

        return $book->fresh();
    }
}
