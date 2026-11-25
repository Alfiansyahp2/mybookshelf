<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\V1\ReadingSessionController;
use App\Models\Book;
use App\Models\ExpenseCategory;
use App\Models\ReadingSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccountingErrorHandlingTest extends TestCase
{
    use RefreshDatabase;

    public function test_controllers_return_accurate_http_error_status_codes(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $fakeUuid = Str::uuid()->toString();

        // 404 responses should carry HTTP 404 (not 400)
        $this->getJson("/api/v1/accounting/expenses/{$fakeUuid}")
            ->assertStatus(404)
            ->assertJsonPath('success', false);

        $this->getJson("/api/v1/accounting/budgets/{$fakeUuid}")
            ->assertStatus(404)
            ->assertJsonPath('success', false);

        $this->getJson("/api/v1/accounting/categories/{$fakeUuid}")
            ->assertStatus(404)
            ->assertJsonPath('success', false);

        $this->getJson('/api/v1/accounting/currency/rates/current?from_currency=ZZZ')
            ->assertStatus(404)
            ->assertJsonPath('success', false);

        $this->getJson("/api/v1/books/{$fakeUuid}/expenses")
            ->assertStatus(404)
            ->assertJsonPath('success', false);

        // 422 validation errors should carry HTTP 422 with errors object
        $this->postJson('/api/v1/accounting/expenses', [])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['title', 'amount']]);

        $this->postJson('/api/v1/accounting/budgets', [])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['name', 'amount']]);

        // 403 when deleting default category
        $this->postJson('/api/v1/accounting/categories/initialize-defaults')
            ->assertStatus(201);

        $defaultCategory = ExpenseCategory::forUser($user->id)->where('is_default', true)->firstOrFail();

        $this->deleteJson("/api/v1/accounting/categories/{$defaultCategory->id}")
            ->assertStatus(403)
            ->assertJsonPath('success', false);

        // Re-initializing defaults returns 422
        $this->postJson('/api/v1/accounting/categories/initialize-defaults')
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_pausing_ended_reading_session_returns_400(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $book = Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'title' => 'Session Book',
            'author' => 'Author',
            'pages' => 100,
        ]);

        $session = ReadingSession::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'book_id' => $book->id,
            'start_time' => now()->subMinutes(30),
            'end_time' => now(),
            'start_page' => 0,
            'end_page' => 20,
            'duration' => 1800,
        ]);

        $this->patchJson("/api/v1/reading-sessions/{$session->id}", [
            'end_time' => now()->toIso8601String(),
            'end_page' => 25,
        ])->assertStatus(200);

        // Direct pause via BookController on ended session or via ReadingSessionController::pause if routed
        $controller = new ReadingSessionController;
        $request = Request::create("/api/v1/reading-sessions/{$session->id}/pause", 'PATCH', ['is_paused' => true]);
        $request->setUserResolver(fn () => $user);

        $res = $controller->pause($request, $session->id);
        $this->assertEquals(400, $res->getStatusCode());
    }
}
