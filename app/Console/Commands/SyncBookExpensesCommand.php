<?php

namespace App\Console\Commands;

use App\Models\Book;
use App\Services\Accounting\ExpenseService;
use Illuminate\Console\Command;

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
    protected $description = 'Synchronize all existing books with purchase prices into the Accounting Expenses dashboard';

    /**
     * Execute the console command.
     */
    public function handle(ExpenseService $expenseService): int
    {
        $this->info('Starting book expenses synchronization...');

        $books = Book::whereNotNull('purchase_price')
            ->where('purchase_price', '>', 0)
            ->get();

        $count = 0;
        foreach ($books as $book) {
            if ($expenseService->syncFromBook($book, 'Di-sync otomatis dari buku lama.') !== null) {
                $count++;
            }
        }

        $this->info("Successfully synced {$count} books into Accounting Expenses.");

        return self::SUCCESS;
    }
}
