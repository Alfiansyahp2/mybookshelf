<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Book;
use App\Models\Expense;
use App\Models\ExpenseCategory;

class SyncBookExpensesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'accounting:sync-books';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincronize all existing books with purchase prices into the Accounting Expenses dashboard';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting book expenses synchronization...');

        $books = Book::whereNotNull('purchase_price')->where('purchase_price', '>', 0)->get();
        $count = 0;

        foreach ($books as $book) {
            // Find or create the category for this user
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

            $expenseDate = $book->date_added ?? $book->created_at ?? now();

            $expense = Expense::firstOrNew([
                'book_id' => $book->id,
                'user_id' => $book->user_id,
            ]);

            $expense->title = 'Pembelian Buku: ' . $book->title;
            $expense->description = 'Di-sync otomatis dari buku lama.';
            $expense->amount = $book->purchase_price;
            $expense->currency = 'IDR';
            $expense->amount_base_currency = $book->purchase_price;
            $expense->exchange_rate = 1.0;
            $expense->category_id = $category->id;
            $expense->expense_date = $expenseDate;
            $expense->payment_method = 'other';
            $expense->status = 'completed';

            $expense->save();
            $count++;
        }

        $this->info("Successfully synced {$count} books into Accounting Expenses.");
    }
}
