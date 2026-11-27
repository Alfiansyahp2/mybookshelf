<?php

namespace Tests\Feature;

use App\Contracts\Storage\MediaStorageInterface;
use App\Models\Achievement;
use App\Models\Book;
use App\Models\Budget;
use App\Models\Collection;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\ReadingSession;
use App\Models\Shelf;
use App\Models\User;
use App\Services\Library\BookService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Mockery;
use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Processor\PsrLogMessageProcessor;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\TestCase;

class Phase6ObservabilityAndMatrixTest extends TestCase
{
    use RefreshDatabase;

    public function test_contract_migration_drops_deprecated_rooms_table_and_shelves_room_id(): void
    {
        $this->assertFalse(Schema::hasTable('rooms'));
        $this->assertFalse(Schema::hasColumn('shelves', 'room_id'));
    }

    public function test_liveness_up_and_readiness_health_probes_behave_accurately(): void
    {
        $this->get('/up')->assertStatus(200);

        $healthResponse = $this->getJson('/api/health');
        $healthResponse->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('checks.database', 'ok')
            ->assertJsonPath('checks.cache', 'ok')
            ->assertJsonPath('checks.storage', 'ok');

        $this->assertNotEmpty($healthResponse->headers->get('X-Request-Id'));
    }

    public function test_readiness_probe_returns_503_without_leaking_credentials_when_storage_fails(): void
    {
        $brokenStorage = Mockery::mock(MediaStorageInterface::class);
        $brokenStorage->shouldReceive('exists')
            ->once()
            ->with('.health-probe')
            ->andThrow(new RuntimeException('S3 secret=super_sensitive_token connection failed'));

        $this->app->instance(MediaStorageInterface::class, $brokenStorage);

        $response = $this->getJson('/api/health');

        $response->assertStatus(503)
            ->assertJsonPath('status', 'degraded')
            ->assertJsonPath('checks.database', 'ok')
            ->assertJsonPath('checks.cache', 'ok')
            ->assertJsonPath('checks.storage', 'fail');

        $this->assertStringNotContainsString('super_sensitive_token', $response->getContent());
        $this->assertStringNotContainsString('RuntimeException', $response->getContent());
    }

    public function test_request_id_middleware_propagates_valid_ids_and_sanitizes_untrusted_headers(): void
    {
        $validId = 'trace-client-1234abcd';
        $validResponse = $this->withHeaders(['X-Request-Id' => $validId])->getJson('/api/health');
        $validResponse->assertHeader('X-Request-Id', $validId);

        $maliciousResponse = $this->withHeaders(['X-Request-Id' => "bad\nlog-injection"])->getJson('/api/health');
        $generatedId = $maliciousResponse->headers->get('X-Request-Id');

        $this->assertNotNull($generatedId);
        $this->assertNotSame("bad\nlog-injection", $generatedId);
        $this->assertMatchesRegularExpression('/^[0-9a-f-]{36}$/i', $generatedId);
    }

    public function test_structured_json_logging_channel_formats_context_as_valid_json(): void
    {
        $stream = fopen('php://memory', 'r+');
        config([
            'logging.channels.json_test' => [
                'driver' => 'monolog',
                'level' => 'info',
                'handler' => StreamHandler::class,
                'handler_with' => ['stream' => $stream],
                'formatter' => JsonFormatter::class,
                'processors' => [PsrLogMessageProcessor::class],
            ],
        ]);

        Log::channel('json_test')->withContext(['request_id' => 'req-json-001']);
        Log::channel('json_test')->info('Readiness audit log entry');

        rewind($stream);
        $rawLine = trim((string) stream_get_contents($stream));
        fclose($stream);

        $decoded = json_decode($rawLine, true);
        $this->assertIsArray($decoded);
        $this->assertSame('Readiness audit log entry', $decoded['message'] ?? null);
        $this->assertSame('req-json-001', $decoded['context']['request_id'] ?? null);
    }

    #[DataProvider('unauthenticatedEndpointsProvider')]
    public function test_unauthenticated_requests_matrix_returns_401(string $method, string $uri): void
    {
        $this->json($method, $uri)->assertStatus(401);
    }

    /**
     * @return array<string, array{0: string, 1: string}>
     */
    public static function unauthenticatedEndpointsProvider(): array
    {
        $uuid = '550e8400-e29b-41d4-a716-446655440000';

        return [
            'auth me' => ['GET', '/api/v1/auth/me'],
            'profile update' => ['PUT', '/api/v1/user/profile'],
            'books index' => ['GET', '/api/v1/books'],
            'books store' => ['POST', '/api/v1/books'],
            'books purchase history' => ['GET', '/api/v1/books/purchase-history'],
            'shelves index' => ['GET', '/api/v1/shelves'],
            'shelves layout' => ['PUT', '/api/v1/shelves/layout'],
            'collections index' => ['GET', '/api/v1/collections'],
            'reading sessions index' => ['GET', '/api/v1/reading-sessions'],
            'analytics dashboard' => ['GET', '/api/v1/analytics/dashboard'],
            'statistics' => ['GET', '/api/v1/statistics'],
            'achievements index' => ['GET', '/api/v1/achievements'],
            'achievements unlock' => ['POST', "/api/v1/achievements/{$uuid}/unlock"],
            'expenses index' => ['GET', '/api/v1/accounting/expenses'],
            'categories index' => ['GET', '/api/v1/accounting/categories'],
            'budgets index' => ['GET', '/api/v1/accounting/budgets'],
            'currency rates' => ['GET', '/api/v1/accounting/currency/rates'],
            'reports overview' => ['GET', '/api/v1/accounting/reports/overview'],
            'reports export' => ['POST', '/api/v1/accounting/reports/export'],
        ];
    }

    public function test_cross_tenant_idor_matrix_protects_nested_subresources_across_domains(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $ownerShelf = Shelf::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Private Shelf',
            'capacity' => 10,
            'order' => 0,
            'span' => 12,
        ]);

        $ownerBook = Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'shelf_id' => $ownerShelf->id,
            'title' => 'Private Book',
            'author' => 'Author X',
            'pages' => 250,
            'status' => 'finished',
            'progress' => 100,
        ]);

        $ownerCollection = Collection::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Private Collection',
            'progress' => 0,
        ]);

        $ownerSession = ReadingSession::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'book_id' => $ownerBook->id,
            'start_time' => now()->subMinutes(10),
            'start_page' => 0,
        ]);

        $ownerCategory = ExpenseCategory::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'name' => 'Private Category',
            'color' => '#3B82F6',
            'budget_currency' => 'IDR',
        ]);

        $ownerExpense = Expense::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'book_id' => $ownerBook->id,
            'category_id' => $ownerCategory->id,
            'title' => 'Private Expense',
            'amount' => 100000,
            'currency' => 'IDR',
            'amount_base_currency' => 100000,
            'exchange_rate' => 1,
            'payment_method' => 'cash',
            'expense_date' => now()->toDateString(),
            'status' => 'completed',
        ]);

        $ownerBudget = Budget::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'category_id' => $ownerCategory->id,
            'name' => 'Private Budget',
            'amount' => 500000,
            'currency' => 'IDR',
            'amount_base_currency' => 500000,
            'period' => 'monthly',
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->endOfMonth()->toDateString(),
            'alert_threshold' => 80,
            'is_active' => true,
        ]);

        Achievement::create([
            'id' => Str::uuid()->toString(),
            'title' => 'First Book',
            'description' => 'Finish 1 book',
            'icon' => '📚',
            'requirement' => 1,
            'category' => 'reading',
            'rarity' => 'common',
        ]);

        Sanctum::actingAs($attacker);

        $blockedEndpoints = [
            ['PATCH', "/api/v1/books/{$ownerBook->id}/favorite", []],
            ['PATCH', "/api/v1/books/{$ownerBook->id}/notes", ['personal_notes' => 'Hacked']],
            ['PATCH', "/api/v1/books/{$ownerBook->id}/rating", ['personal_rating' => 5]],
            ['POST', "/api/v1/books/{$ownerBook->id}/borrow", ['borrowed_by' => 'Attacker']],
            ['POST', "/api/v1/books/{$ownerBook->id}/return", []],
            ['GET', "/api/v1/books/{$ownerBook->id}/timeline", []],
            ['GET', "/api/v1/books/{$ownerBook->id}/expenses", []],
            ['GET', "/api/v1/books/{$ownerBook->id}/cost-breakdown", []],
            ['POST', "/api/v1/books/{$ownerBook->id}/finish", []],
            ['POST', "/api/v1/books/{$ownerBook->id}/read-again", []],
            ['PATCH', "/api/v1/books/{$ownerBook->id}/progress", ['current_page' => 100]],
            ['GET', "/api/v1/books/{$ownerBook->id}/reading-sessions", []],
            ['POST', "/api/v1/books/{$ownerBook->id}/reading-sessions/start", []],
            ['PATCH', "/api/v1/books/{$ownerBook->id}/reading-sessions/{$ownerSession->id}/pause", []],
            ['PUT', "/api/v1/books/{$ownerBook->id}/reading-sessions/{$ownerSession->id}/end", ['end_page' => 20]],
            ['GET', "/api/v1/shelves/{$ownerShelf->id}/occupancy", []],
            ['POST', "/api/v1/collections/{$ownerCollection->id}/books", ['book_id' => $ownerBook->id]],
            ['DELETE', "/api/v1/collections/{$ownerCollection->id}/books/{$ownerBook->id}", []],
            ['PATCH', "/api/v1/collections/{$ownerCollection->id}/books/{$ownerBook->id}/order", ['order' => 1]],
            ['GET', "/api/v1/accounting/categories/{$ownerCategory->id}/statistics", []],
            ['GET', "/api/v1/accounting/expenses/{$ownerExpense->id}/receipt", []],
            ['POST', "/api/v1/accounting/expenses/{$ownerExpense->id}/duplicate", []],
            ['POST', "/api/v1/accounting/expenses/{$ownerExpense->id}/convert-currency", ['target_currency' => 'USD']],
            ['POST', "/api/v1/accounting/expenses/{$ownerExpense->id}/mark-paid", []],
            ['POST', "/api/v1/accounting/expenses/{$ownerExpense->id}/send-reminder", []],
            ['GET', "/api/v1/accounting/budgets/{$ownerBudget->id}/progress", []],
            ['GET', "/api/v1/accounting/budgets/{$ownerBudget->id}/expenses", []],
            ['POST', "/api/v1/accounting/budgets/{$ownerBudget->id}/reset-period", []],
            ['GET', "/api/v1/accounting/budgets/{$ownerBudget->id}/performance-trends", []],
        ];

        foreach ($blockedEndpoints as [$method, $uri, $payload]) {
            $status = $this->json($method, $uri, $payload)->getStatusCode();
            $this->assertTrue(
                in_array($status, [403, 404, 422], true),
                "Expected 403/404/422 for {$method} {$uri}, got {$status}"
            );
        }

        // Shelf layout reorder must ignore attacker attempting to mutate owner shelf order/span
        $this->putJson('/api/v1/shelves/layout', [
            'shelves' => [
                ['id' => $ownerShelf->id, 'order' => 99, 'span' => 4],
            ],
        ])->assertStatus(200);

        $ownerShelf->refresh();
        $this->assertSame(0, $ownerShelf->order);
        $this->assertSame(12, $ownerShelf->span);
    }

    public function test_database_transaction_rolls_back_book_creation_atomically_on_timeline_failure(): void
    {
        $user = User::factory()->create();
        $shelf = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Rollback Shelf',
            'capacity' => 10,
            'order' => 0,
            'span' => 12,
        ]);

        $mockService = Mockery::mock(BookService::class)->makePartial();
        $mockService->shouldReceive('createTimelineEvent')
            ->once()
            ->andThrow(new RuntimeException('Simulated timeline failure'));

        try {
            $mockService->createBook([
                'title' => 'Should Rollback',
                'author' => 'Atomic Tester',
                'pages' => 120,
                'shelf_id' => $shelf->id,
            ], $user->id);
            $this->fail('Expected RuntimeException to trigger DB rollback');
        } catch (RuntimeException $e) {
            $this->assertSame('Simulated timeline failure', $e->getMessage());
        }

        $this->assertSame(0, DB::table('books')->where('user_id', $user->id)->count());
        $this->assertSame(0, DB::table('timeline_events')->count());
    }
}
