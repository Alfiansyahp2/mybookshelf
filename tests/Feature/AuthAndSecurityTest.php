<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Budget;
use App\Models\Collection;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\ReadingSession;
use App\Models\Shelf;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthAndSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_protected_endpoints_reject_unauthenticated_requests(): void
    {
        $this->getJson('/api/v1/books')->assertStatus(401);
        $this->getJson('/api/v1/shelves')->assertStatus(401);
        $this->getJson('/api/v1/accounting/expenses')->assertStatus(401);
        $this->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_user_can_login_fetch_profile_and_logout_via_spa_session(): void
    {
        $user = User::factory()->create([
            'email' => 'reader@example.com',
            'password' => 'secret123',
        ]);

        $spaHeaders = [
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/login',
        ];

        $loginResponse = $this->withHeaders($spaHeaders)->postJson('/api/v1/auth/login', [
            'email' => 'reader@example.com',
            'password' => 'secret123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.id', $user->id);

        $this->withHeaders($spaHeaders)->getJson('/api/v1/auth/me')
            ->assertStatus(200)
            ->assertJsonPath('data.user.email', 'reader@example.com');

        $this->withHeaders($spaHeaders)->postJson('/api/v1/auth/logout')
            ->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_login_without_stateful_referer_does_not_throw_session_store_500(): void
    {
        User::factory()->create([
            'email' => 'api@example.com',
            'password' => 'secret123',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'api@example.com',
            'password' => 'secret123',
        ])->assertStatus(200)->assertJsonPath('success', true);
    }

    public function test_cross_tenant_idor_validation_and_policies_protect_all_owned_resources(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $ownerShelf = Shelf::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Owner Shelf',
            'capacity' => 10,
            'order' => 0,
            'span' => 12,
        ]);

        $ownerBook = Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'shelf_id' => $ownerShelf->id,
            'title' => 'Owner Secret Book',
            'author' => 'Author A',
            'pages' => 200,
        ]);

        $ownerCollection = Collection::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Owner Collection',
            'progress' => 0,
        ]);

        $ownerSession = ReadingSession::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'book_id' => $ownerBook->id,
            'start_time' => now()->subMinutes(15),
            'start_page' => 1,
        ]);

        $ownerCategory = ExpenseCategory::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Owner Category',
            'color' => '#7A5C42',
            'budget_currency' => 'IDR',
            'is_default' => false,
        ]);

        $ownerExpense = Expense::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'title' => 'Owner Secret Expense',
            'amount' => 120000,
            'currency' => 'IDR',
            'amount_base_currency' => 120000,
            'exchange_rate' => 1,
            'category_id' => $ownerCategory->id,
            'payment_method' => 'cash',
            'expense_date' => now()->toDateString(),
            'status' => 'completed',
        ]);

        $ownerBudget = Budget::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Owner Secret Budget',
            'amount' => 500000,
            'currency' => 'IDR',
            'amount_base_currency' => 500000,
            'category_id' => $ownerCategory->id,
            'period' => 'monthly',
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->endOfMonth()->toDateString(),
            'alert_threshold' => 80,
            'is_active' => true,
        ]);

        $attackerShelf = Shelf::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $attacker->id,
            'name' => 'Attacker Shelf',
            'capacity' => 10,
            'order' => 0,
            'span' => 12,
        ]);

        $attackerBook = Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $attacker->id,
            'shelf_id' => $attackerShelf->id,
            'title' => 'Attacker Book',
            'author' => 'Author B',
            'pages' => 150,
        ]);

        $attackerCollection = Collection::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $attacker->id,
            'name' => 'Attacker Collection',
            'progress' => 0,
        ]);

        Sanctum::actingAs($attacker);

        // Input ownership rules (422)
        $this->postJson('/api/v1/books', [
            'title' => 'Hijacked Shelf Book',
            'author' => 'Attacker',
            'shelf_id' => $ownerShelf->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['shelf_id']);

        $this->patchJson("/api/v1/books/{$attackerBook->id}/shelf", [
            'shelf_id' => $ownerShelf->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['shelf_id']);

        $this->postJson('/api/v1/reading-sessions', [
            'book_id' => $ownerBook->id,
            'start_time' => now()->toIso8601String(),
            'start_page' => 1,
        ])->assertStatus(422)->assertJsonValidationErrors(['book_id']);

        $this->postJson("/api/v1/collections/{$attackerCollection->id}/books", [
            'book_id' => $ownerBook->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['book_id']);

        $this->postJson('/api/v1/accounting/expenses', [
            'title' => 'Cross Tenant Expense',
            'amount' => 50000,
            'category_id' => $ownerCategory->id,
            'book_id' => $ownerBook->id,
        ])->assertStatus(422);

        $this->postJson('/api/v1/accounting/budgets', [
            'name' => 'Cross Tenant Budget',
            'amount' => 500000,
            'category_id' => $ownerCategory->id,
        ])->assertStatus(422);

        // Policy enforcement across all 7 owned resource models (returns 404 to block UUID enumeration)
        $this->getJson("/api/v1/books/{$ownerBook->id}")->assertStatus(404);
        $this->postJson("/api/v1/books/{$ownerBook->id}/start")->assertStatus(404);
        $this->deleteJson("/api/v1/books/{$ownerBook->id}")->assertStatus(404);

        $this->getJson("/api/v1/shelves/{$ownerShelf->id}")->assertStatus(404);
        $this->patchJson("/api/v1/shelves/{$ownerShelf->id}", ['name' => 'Hacked'])->assertStatus(404);
        $this->deleteJson("/api/v1/shelves/{$ownerShelf->id}")->assertStatus(404);

        $this->getJson("/api/v1/collections/{$ownerCollection->id}")->assertStatus(404);
        $this->putJson("/api/v1/collections/{$ownerCollection->id}", ['name' => 'Hacked'])->assertStatus(404);
        $this->deleteJson("/api/v1/collections/{$ownerCollection->id}")->assertStatus(404);

        $this->getJson("/api/v1/reading-sessions/{$ownerSession->id}")->assertStatus(404);
        $this->patchJson("/api/v1/reading-sessions/{$ownerSession->id}", [
            'end_time' => now()->toIso8601String(),
            'end_page' => 20,
        ])->assertStatus(404);

        $this->getJson("/api/v1/accounting/categories/{$ownerCategory->id}")->assertStatus(404);
        $this->putJson("/api/v1/accounting/categories/{$ownerCategory->id}", ['name' => 'Hacked'])->assertStatus(404);
        $this->deleteJson("/api/v1/accounting/categories/{$ownerCategory->id}")->assertStatus(404);

        $this->getJson("/api/v1/accounting/expenses/{$ownerExpense->id}")->assertStatus(404);
        $this->putJson("/api/v1/accounting/expenses/{$ownerExpense->id}", ['title' => 'Hacked'])->assertStatus(404);
        $this->deleteJson("/api/v1/accounting/expenses/{$ownerExpense->id}")->assertStatus(404);

        $this->getJson("/api/v1/accounting/budgets/{$ownerBudget->id}")->assertStatus(404);
        $this->putJson("/api/v1/accounting/budgets/{$ownerBudget->id}", ['name' => 'Hacked'])->assertStatus(404);
        $this->deleteJson("/api/v1/accounting/budgets/{$ownerBudget->id}")->assertStatus(404);
    }

    public function test_api_fallback_returns_json_404_for_all_http_methods_and_invalid_uuids(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/nonexistent')->assertStatus(404)->assertJsonPath('success', false);
        $this->postJson('/api/v1/nonexistent')->assertStatus(404)->assertJsonPath('success', false);
        $this->putJson('/api/v1/nonexistent')->assertStatus(404)->assertJsonPath('success', false);
        $this->deleteJson('/api/v1/nonexistent')->assertStatus(404)->assertJsonPath('success', false);

        // Non-UUID resource IDs should return clean 404 instead of PostgreSQL 500
        $this->getJson('/api/v1/books/not-a-uuid')->assertStatus(404)->assertJsonPath('success', false);
        $this->getJson('/api/v1/shelves/not-a-uuid')->assertStatus(404)->assertJsonPath('success', false);
    }

    public function test_sanctum_csrf_cookie_and_login_throttle_rate_limit(): void
    {
        $spaHeaders = [
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/',
        ];

        $this->withHeaders($spaHeaders)
            ->get('/sanctum/csrf-cookie')
            ->assertStatus(204)
            ->assertCookie('XSRF-TOKEN');

        $throttledHeaders = array_merge($spaHeaders, ['REMOTE_ADDR' => '10.10.10.99']);

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->withHeaders($throttledHeaders)
                ->withServerVariables(['REMOTE_ADDR' => '10.10.10.99'])
                ->postJson('/api/v1/auth/login', [
                    'email' => 'throttle@example.com',
                    'password' => 'wrong-password',
                ])->assertStatus(422);
        }

        $this->withHeaders($throttledHeaders)
            ->withServerVariables(['REMOTE_ADDR' => '10.10.10.99'])
            ->postJson('/api/v1/auth/login', [
                'email' => 'throttle@example.com',
                'password' => 'wrong-password',
            ])->assertStatus(429);
    }
}
