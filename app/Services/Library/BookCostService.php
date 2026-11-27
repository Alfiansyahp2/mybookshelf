<?php

namespace App\Services\Library;

use App\Models\Book;
use App\Services\Accounting\CurrencyRateService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class BookCostService
{
    private const INDONESIAN_MONTHS = [
        'January' => 'Januari',
        'February' => 'Februari',
        'March' => 'Maret',
        'April' => 'April',
        'May' => 'Mei',
        'June' => 'Juni',
        'July' => 'Juli',
        'August' => 'Agustus',
        'September' => 'September',
        'October' => 'Oktober',
        'November' => 'November',
        'December' => 'Desember',
    ];

    public function __construct(
        private CurrencyRateService $currencyRateService
    ) {}

    /**
     * Retrieve completed expenses associated with a book.
     */
    public function getBookExpenses(Book $book): Collection
    {
        return $book->expenses()->with(['category'])->get();
    }

    /**
     * Build a complete cost and investment breakdown for a book.
     */
    public function getCostBreakdown(Book $book): array
    {
        $expenses = $this->getBookExpenses($book);
        $additionalExpenses = (float) $expenses->sum('amount_base_currency');
        $totalInvestment = (float) ($book->purchase_price ?: 0) + $additionalExpenses;

        return [
            'book_id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'purchase_price' => $book->purchase_price,
            'purchase_currency' => $book->purchase_currency,
            'purchase_date' => $book->purchase_date,
            'is_gift' => $book->is_gift,
            'purchase_location' => $book->purchase_location,
            'additional_expenses' => $additionalExpenses,
            'total_investment' => $totalInvestment,
            'expense_count' => $expenses->count(),
            'expenses' => $expenses,
            'formatted' => [
                'purchase_price' => $book->purchase_price
                    ? 'Rp '.number_format($book->purchase_price, 2, ',', '.')
                    : 'Not set',
                'additional_expenses' => 'Rp '.number_format($additionalExpenses, 2, ',', '.'),
                'total_investment' => 'Rp '.number_format($totalInvestment, 2, ',', '.'),
            ],
        ];
    }

    /**
     * Aggregate monthly book purchase totals converted into IDR via CurrencyRateService.
     */
    public function getPurchaseHistory(string $userId, int $months = 12): array
    {
        $books = Book::query()
            ->where('user_id', $userId)
            ->whereNotNull('purchase_date')
            ->whereNotNull('purchase_price')
            ->orderBy('purchase_date', 'desc')
            ->get(['id', 'purchase_date', 'purchase_price', 'purchase_currency', 'title']);

        if ($books->isEmpty()) {
            return [];
        }

        $purchaseHistory = [];

        foreach ($books as $book) {
            $parsedDate = Carbon::parse($book->purchase_date);
            $monthKey = $parsedDate->format('Y-m');
            $monthName = strtr($parsedDate->format('F Y'), self::INDONESIAN_MONTHS);

            if (! isset($purchaseHistory[$monthKey])) {
                $purchaseHistory[$monthKey] = [
                    'month' => $monthKey,
                    'month_name' => $monthName,
                    'total_amount' => 0,
                    'formatted_amount' => 'Rp 0',
                    'book_count' => 0,
                    'average_price' => 0,
                    'books' => [],
                ];
            }

            $purchaseHistory[$monthKey]['book_count']++;
            $purchaseHistory[$monthKey]['books'][] = [
                'id' => $book->id,
                'title' => $book->title,
                'purchase_price' => $book->purchase_price,
                'purchase_currency' => $book->purchase_currency,
                'purchase_date' => $book->purchase_date,
            ];

            $amountInIdr = $this->currencyRateService->convertToIdrWithFallback(
                (float) $book->purchase_price,
                (string) ($book->purchase_currency ?? 'IDR')
            );

            $purchaseHistory[$monthKey]['total_amount'] += $amountInIdr;
        }

        foreach ($purchaseHistory as &$month) {
            if ($month['book_count'] > 0) {
                $month['average_price'] = $month['total_amount'] / $month['book_count'];
                $month['formatted_amount'] = 'Rp '.number_format($month['total_amount'], 0, ',', '.');
            }
        }
        unset($month);

        ksort($purchaseHistory);

        return array_slice(array_values($purchaseHistory), -$months, $months);
    }
}
