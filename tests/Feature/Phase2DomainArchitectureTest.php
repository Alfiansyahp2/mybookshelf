<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\CurrencyRate;
use App\Models\Shelf;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class Phase2DomainArchitectureTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_and_fallback_controllers_return_expected_json(): void
    {
        $this->getJson('/api/health')
            ->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonStructure(['status', 'timestamp']);

        $this->getJson('/api/v1/nonexistent-phase2-route')
            ->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Endpoint not found');
    }

    public function test_profile_controller_updates_user_profile_and_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('old-password-123'),
        ]);

        Sanctum::actingAs($user);

        $this->putJson('/api/v1/user/profile', [
            'name' => 'Updated Reader',
            'email' => 'updated.reader@example.com',
        ])
            ->assertStatus(200)
            ->assertJsonPath('data.user.name', 'Updated Reader')
            ->assertJsonPath('data.user.email', 'updated.reader@example.com');

        $this->putJson('/api/v1/user/password', [
            'current_password' => 'old-password-123',
            'password' => 'new-secure-password-456',
            'password_confirmation' => 'new-secure-password-456',
        ])->assertStatus(200);

        $this->assertTrue(Hash::check('new-secure-password-456', $user->fresh()->password));
    }

    public function test_book_loan_cost_statistics_and_accounting_report_endpoints_work_via_domain_controllers(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $shelf = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Main Shelf',
            'capacity' => 30,
            'order' => 0,
            'span' => 1,
        ]);

        CurrencyRate::create([
            'id' => Str::uuid()->toString(),
            'from_currency' => 'USD',
            'to_currency' => 'IDR',
            'rate' => 16000,
            'effective_date' => now()->subMinute(),
            'is_active' => true,
        ]);

        // Initialize default categories before creating a priced book (which triggers BookObserver category auto-creation)
        $this->postJson('/api/v1/accounting/categories/initialize-defaults')
            ->assertStatus(201);

        $bookResponse = $this->postJson('/api/v1/books', [
            'shelf_id' => $shelf->id,
            'title' => 'Domain-Driven Design',
            'author' => 'Eric Evans',
            'pages' => 560,
            'purchase_price' => 20,
            'purchase_currency' => 'USD',
            'purchase_date' => now()->toDateString(),
        ])->assertStatus(201);

        $bookId = $bookResponse->json('data.id');

        $this->postJson("/api/v1/books/{$bookId}/borrow", [
            'borrowed_by' => 'Andi',
            'due_date' => now()->addDays(14)->toDateString(),
        ])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'borrowed')
            ->assertJsonPath('data.borrowed_by', 'Andi');

        $this->postJson("/api/v1/books/{$bookId}/return")
            ->assertStatus(200)
            ->assertJsonPath('data.is_returned', true);

        $this->getJson("/api/v1/books/{$bookId}/timeline")
            ->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->getJson('/api/v1/books/purchase-history')
            ->assertStatus(200)
            ->assertJsonPath('data.0.total_amount', 320000);

        $this->getJson("/api/v1/books/{$bookId}/cost-breakdown")
            ->assertStatus(200)
            ->assertJsonPath('data.book_id', $bookId);

        $this->getJson('/api/v1/statistics')
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'overview' => ['total_books', 'finished_books', 'currently_reading', 'favorite_books', 'pages_read', 'total_pages'],
                    'reading_time' => ['total_seconds', 'total_hours', 'total_days'],
                    'purchases',
                    'top_read_books',
                    'generated_at',
                ],
            ]);

        $this->getJson('/api/v1/accounting/reports/overview?period=month')
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'period',
                    'summary',
                    'budget',
                    'expenses_by_category',
                    'top_spending_categories',
                    'recent_expenses',
                ],
            ]);

        $this->getJson('/api/v1/accounting/reports/year-to-date')
            ->assertStatus(200)
            ->assertJsonPath('data.year', now()->year);

        $this->assertNotNull(Book::find($bookId));
    }
}
