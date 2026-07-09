<?php

namespace App\Observers;

use App\Models\Book;
use App\Models\Expense;
use App\Models\ExpenseCategory;

class BookObserver
{
    /**
     * Handle the Book "saved" event.
     * This handles both created and updated.
     */
    public function saved(Book $book): void
    {
        // Only track if the book has a purchase price
        if ($book->purchase_price > 0) {
            $this->syncExpense($book);
        } else {
            // If the price is updated to 0 or null, remove the expense if it exists
            $this->removeExpense($book);
        }
    }

    /**
     * Handle the Book "deleted" event.
     */
    public function deleted(Book $book): void
    {
        $this->removeExpense($book);
    }

    /**
     * Handle the Book "force deleted" event.
     */
    public function forceDeleted(Book $book): void
    {
        $this->removeExpense($book, true);
    }

    /**
     * Sync the book's purchase price to the expenses table.
     */
    private function syncExpense(Book $book): void
    {
        // Find or create the "Book Purchases" category for this user
        $category = ExpenseCategory::firstOrCreate(
            [
                'user_id' => $book->user_id,
                'name' => 'Book Purchases'
            ],
            [
                'description' => 'Pembelian buku baru dan bekas',
                'icon' => '📚',
                'color' => '#3B82F6',
                'monthly_budget' => 500000,
                'budget_currency' => 'IDR',
                'is_default' => true,
            ]
        );

        // Date logic: use date_added if available, else created_at
        $expenseDate = $book->date_added ?? $book->created_at ?? now();

        // Find existing expense for this book, or create a new instance
        $expense = Expense::firstOrNew([
            'book_id' => $book->id,
            'user_id' => $book->user_id,
        ]);

        // Update the attributes
        $expense->title = 'Pembelian Buku: ' . $book->title;
        $expense->description = 'Otomatis dicatat dari fitur rak buku.';
        $expense->amount = $book->purchase_price;
        $expense->currency = 'IDR'; // Assuming default currency is IDR
        $expense->amount_base_currency = $book->purchase_price;
        $expense->exchange_rate = 1.0;
        $expense->category_id = $category->id;
        $expense->expense_date = $expenseDate;
        $expense->payment_method = 'other';
        $expense->status = 'completed';

        $expense->save();
    }

    /**
     * Remove the expense associated with this book.
     */
    private function removeExpense(Book $book, bool $force = false): void
    {
        $query = Expense::where('book_id', $book->id);
        
        if ($force) {
            $query->forceDelete();
        } else {
            $query->delete();
        }
    }
}
