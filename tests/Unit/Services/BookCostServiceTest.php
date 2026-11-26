<?php

namespace Tests\Unit\Services;

use App\Models\Book;
use App\Models\CurrencyRate;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Shelf;
use App\Models\User;
use App\Services\Library\BookCostService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class BookCostServiceTest extends TestCase
{
    use RefreshDatabase;

    private BookCostService $bookCostService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bookCostService = app(BookCostService::class);
    }

    public function test_purchase_history_uses_active_database_currency_rate_instead_of_hardcoded_rate(): void
    {
        $user = User::factory()->create();
        $shelf = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Finance Shelf',
            'capacity' => 20,
            'order' => 0,
            'span' => 1,
        ]);

        CurrencyRate::create([
            'id' => Str::uuid()->toString(),
            'from_currency' => 'USD',
            'to_currency' => 'IDR',
            'rate' => 16250,
            'effective_date' => now()->subHour(),
            'is_active' => true,
        ]);

        Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'shelf_id' => $shelf->id,
            'title' => 'Designing Data-Intensive Applications',
            'author' => 'Martin Kleppmann',
            'pages' => 616,
            'format' => 'paperback',
            'status' => 'unread',
            'spine_color_light' => '#D4B499',
            'spine_color_medium' => '#A67C52',
            'spine_color_dark' => '#6F4E37',
            'purchase_price' => 10.00,
            'purchase_currency' => 'USD',
            'purchase_date' => now(),
            'date_added' => now(),
            'last_modified' => now(),
        ]);

        $history = $this->bookCostService->getPurchaseHistory($user->id, 12);

        $this->assertCount(1, $history);
        $this->assertEquals(162500.0, (float) $history[0]['total_amount']);
        $this->assertSame('Rp 162.500', $history[0]['formatted_amount']);
        $this->assertSame(1, $history[0]['book_count']);
    }

    public function test_purchase_history_falls_back_safely_when_currency_rate_not_seeded(): void
    {
        $user = User::factory()->create();
        $shelf = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Fallback Shelf',
            'capacity' => 20,
            'order' => 0,
            'span' => 1,
        ]);

        Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'shelf_id' => $shelf->id,
            'title' => 'Clean Architecture',
            'author' => 'Robert C. Martin',
            'pages' => 432,
            'format' => 'paperback',
            'status' => 'unread',
            'spine_color_light' => '#D4B499',
            'spine_color_medium' => '#A67C52',
            'spine_color_dark' => '#6F4E37',
            'purchase_price' => 10.00,
            'purchase_currency' => 'USD',
            'purchase_date' => now(),
            'date_added' => now(),
            'last_modified' => now(),
        ]);

        $history = $this->bookCostService->getPurchaseHistory($user->id, 12);

        $this->assertCount(1, $history);
        $this->assertEquals(150000.0, (float) $history[0]['total_amount']);
        $this->assertSame('Rp 150.000', $history[0]['formatted_amount']);
    }

    public function test_cost_breakdown_aggregates_purchase_price_and_additional_expenses(): void
    {
        $user = User::factory()->create();
        $shelf = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Investment Shelf',
            'capacity' => 15,
            'order' => 0,
            'span' => 1,
        ]);

        $category = ExpenseCategory::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'name' => 'Shipping & Handling',
            'color' => '#F59E0B',
            'is_default' => true,
            'budget_currency' => 'IDR',
        ]);

        $book = Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'shelf_id' => $shelf->id,
            'title' => 'The Pragmatic Programmer',
            'author' => 'Andrew Hunt',
            'pages' => 352,
            'format' => 'hardcover',
            'status' => 'reading',
            'spine_color_light' => '#D4B499',
            'spine_color_medium' => '#A67C52',
            'spine_color_dark' => '#6F4E37',
            'purchase_price' => 250000.00,
            'purchase_currency' => 'IDR',
            'purchase_date' => now(),
            'date_added' => now(),
            'last_modified' => now(),
        ]);

        Expense::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'book_id' => $book->id,
            'category_id' => $category->id,
            'title' => 'Shipping Fee',
            'amount' => 25000,
            'currency' => 'IDR',
            'amount_base_currency' => 25000,
            'exchange_rate' => 1,
            'payment_method' => 'transfer',
            'expense_date' => now(),
            'status' => 'completed',
        ]);

        $breakdown = $this->bookCostService->getCostBreakdown($book->fresh());

        // BookObserver auto-syncs a Book Purchases expense (250,000) plus Shipping Fee (25,000)
        $this->assertEquals(275000.0, $breakdown['additional_expenses']);
        $this->assertEquals(525000.0, $breakdown['total_investment']);
        $this->assertSame(2, $breakdown['expense_count']);
        $this->assertSame('Rp 525.000,00', $breakdown['formatted']['total_investment']);
    }
}
