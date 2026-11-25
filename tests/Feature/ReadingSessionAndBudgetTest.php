<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\ExpenseCategory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReadingSessionAndBudgetTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_reading_session_pause_resume_excludes_paused_seconds_from_duration(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $book = Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'title' => 'Domain-Driven Design',
            'author' => 'Eric Evans',
            'pages' => 200,
        ]);

        $baseTime = Carbon::create(2026, 11, 25, 10, 0, 0);
        Carbon::setTestNow($baseTime);

        $sessionId = $this->postJson("/api/v1/books/{$book->id}/reading-sessions/start", [
            'start_page' => 10,
        ])->assertStatus(201)->json('data.id');

        Carbon::setTestNow($baseTime->copy()->addSeconds(30));
        $this->patchJson("/api/v1/books/{$book->id}/reading-sessions/{$sessionId}/pause", [
            'is_paused' => true,
        ])->assertStatus(200)->assertJsonPath('data.is_paused', true);

        Carbon::setTestNow($baseTime->copy()->addSeconds(75));
        $this->patchJson("/api/v1/books/{$book->id}/reading-sessions/{$sessionId}/pause", [
            'is_paused' => false,
        ])->assertStatus(200)
            ->assertJsonPath('data.is_paused', false)
            ->assertJsonPath('data.paused_seconds', 45);

        Carbon::setTestNow($baseTime->copy()->addSeconds(105));
        $this->putJson("/api/v1/books/{$book->id}/reading-sessions/{$sessionId}/end", [
            'end_page' => 35,
            'notes' => 'Focused reading block',
        ])->assertStatus(200)
            ->assertJsonPath('data.duration', 60)
            ->assertJsonPath('data.end_page', 35);

        $this->assertDatabaseHas('books', [
            'id' => $book->id,
            'current_page' => 35,
        ]);
    }

    public function test_budget_alerts_trigger_warning_at_threshold_and_exceeded_over_limit(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $category = ExpenseCategory::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'name' => 'Books',
            'color' => '#7A5C42',
            'budget_currency' => 'IDR',
        ]);

        $startDate = now()->startOfMonth()->toDateString();
        $endDate = now()->endOfMonth()->toDateString();

        $this->postJson('/api/v1/accounting/budgets', [
            'name' => 'Monthly Book Budget',
            'amount' => 100000,
            'currency' => 'IDR',
            'category_id' => $category->id,
            'period' => 'monthly',
            'start_date' => $startDate,
            'end_date' => $endDate,
            'alert_threshold' => 80,
            'is_active' => true,
        ])->assertStatus(201);

        $this->postJson('/api/v1/accounting/expenses', [
            'title' => 'Book Purchase 1',
            'amount' => 85000,
            'currency' => 'IDR',
            'category_id' => $category->id,
            'expense_date' => $startDate,
            'status' => 'completed',
        ])->assertStatus(201);

        $warningAlerts = $this->getJson('/api/v1/accounting/budgets/check-alerts')
            ->assertStatus(200)
            ->json('data');

        $this->assertCount(1, $warningAlerts);
        $this->assertSame('warning', $warningAlerts[0]['type']);
        $this->assertEquals(85, $warningAlerts[0]['usage_percentage']);

        $this->postJson('/api/v1/accounting/expenses', [
            'title' => 'Book Purchase 2',
            'amount' => 25000,
            'currency' => 'IDR',
            'category_id' => $category->id,
            'expense_date' => $startDate,
            'status' => 'completed',
        ])->assertStatus(201);

        $exceededAlerts = $this->getJson('/api/v1/accounting/budgets/check-alerts')
            ->assertStatus(200)
            ->json('data');

        $this->assertCount(1, $exceededAlerts);
        $this->assertSame('exceeded', $exceededAlerts[0]['type']);
        $this->assertEquals(110, $exceededAlerts[0]['usage_percentage']);
    }
}
