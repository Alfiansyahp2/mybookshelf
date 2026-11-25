<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Collection;
use App\Models\ExpenseCategory;
use App\Models\Room;
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

        // Stateful SPA request with allowed Referer/Origin headers
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

    public function test_cross_tenant_idor_validation_blocks_linking_other_users_resources(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $ownerRoom = Room::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Owner Room',
            'order' => 0,
            'unlocked' => true,
        ]);

        $ownerShelf = Shelf::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'room_id' => $ownerRoom->id,
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

        $ownerCategory = ExpenseCategory::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Owner Category',
            'color' => '#7A5C42',
            'budget_currency' => 'IDR',
        ]);

        $attackerShelf = Shelf::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $attacker->id,
            'room_id' => Room::create([
                'id' => Str::uuid()->toString(),
                'user_id' => $attacker->id,
                'name' => 'Attacker Room',
                'order' => 0,
                'unlocked' => true,
            ])->id,
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

        // 1. Cannot create book on owner's shelf
        $this->postJson('/api/v1/books', [
            'title' => 'Hijacked Shelf Book',
            'author' => 'Attacker',
            'shelf_id' => $ownerShelf->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['shelf_id']);

        // 2. Cannot move own book onto owner's shelf
        $this->patchJson("/api/v1/books/{$attackerBook->id}/shelf", [
            'shelf_id' => $ownerShelf->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['shelf_id']);

        // 3. Cannot start reading session for owner's book
        $this->postJson('/api/v1/reading-sessions', [
            'book_id' => $ownerBook->id,
            'start_time' => now()->toIso8601String(),
            'start_page' => 1,
        ])->assertStatus(422)->assertJsonValidationErrors(['book_id']);

        // 4. Cannot create shelf inside owner's room
        $this->postJson('/api/v1/shelves', [
            'name' => 'Hijacked Room Shelf',
            'capacity' => 10,
            'room_id' => $ownerRoom->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['room_id']);

        // 5. Cannot attach owner's book to attacker's collection
        $this->postJson("/api/v1/collections/{$attackerCollection->id}/books", [
            'book_id' => $ownerBook->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['book_id']);

        // 6. Cannot create expense/budget referencing owner's category or book
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

        // 7. Cannot directly mutate owner's book
        $this->postJson("/api/v1/books/{$ownerBook->id}/start")->assertStatus(404);
        $this->deleteJson("/api/v1/books/{$ownerBook->id}")->assertStatus(404);
    }
}
