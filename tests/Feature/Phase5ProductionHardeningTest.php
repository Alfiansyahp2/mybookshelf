<?php

namespace Tests\Feature;

use App\Jobs\ExportAccountingReportJob;
use App\Jobs\ProcessBookCoverJob;
use App\Jobs\SendBudgetAlertJob;
use App\Models\Book;
use App\Models\Budget;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Shelf;
use App\Models\User;
use App\Services\Analytics\DashboardAnalyticsService;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class Phase5ProductionHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_book_cover_upload_uses_media_disk_queues_webp_job_and_rejects_fake_images(): void
    {
        Storage::fake('s3');
        Queue::fake();
        Config::set('filesystems.media_disk', 's3');

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $shelf = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Cover Shelf',
            'capacity' => 20,
            'order' => 0,
            'span' => 12,
        ]);

        $book = Book::create([
            'user_id' => $user->id,
            'shelf_id' => $shelf->id,
            'title' => 'Cloud Storage Architecture',
            'author' => 'Martin Fowler',
            'pages' => 320,
        ]);

        // Fake spoofed payload with .jpg filename must fail magic-byte validation
        $spoofed = UploadedFile::fake()->createWithContent('evil.jpg', '<?php echo "hacked"; ?>');
        $this->postJson("/api/v1/books/{$book->id}/cover", ['cover' => $spoofed])
            ->assertStatus(422);

        // Valid high-res JPEG upload
        $image = UploadedFile::fake()->image('cover.jpg', 1400, 1800);
        $response = $this->postJson("/api/v1/books/{$book->id}/cover", ['cover' => $image]);
        $response->assertStatus(200);

        $rawKey = $response->json('data.cover_key');
        $this->assertNotNull($rawKey);
        $this->assertStringStartsWith("book-covers/raw_{$book->id}_", $rawKey);
        $this->assertStringNotContainsString('http://', $book->fresh()->cover_image);

        Storage::disk('s3')->assertExists($rawKey);
        Queue::assertPushed(ProcessBookCoverJob::class, fn (ProcessBookCoverJob $job) => $job->bookId === $book->id && $job->rawKey === $rawKey);

        // Execute job handler directly since Queue::fake() intercepts dispatchSync
        $this->app->call([new ProcessBookCoverJob($book->id, $rawKey), 'handle']);

        $updatedKey = (string) $book->fresh()->cover_image;
        $this->assertStringEndsWith('.webp', $updatedKey);
        Storage::disk('s3')->assertExists($updatedKey);
        Storage::disk('s3')->assertMissing($rawKey);
    }

    public function test_expense_receipt_stores_on_s3_and_returns_signed_url_scoped_by_policy(): void
    {
        Storage::fake('s3');
        Config::set('filesystems.media_disk', 's3');

        $owner = User::factory()->create();
        $stranger = User::factory()->create();

        $expense = Expense::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $owner->id,
            'title' => 'Technical Book Receipt',
            'amount' => 250000,
            'currency' => 'IDR',
            'amount_base_currency' => 250000,
            'exchange_rate' => 1,
            'payment_method' => 'transfer',
            'expense_date' => now(),
            'status' => 'completed',
        ]);

        Sanctum::actingAs($owner);

        $receiptFile = UploadedFile::fake()->image('invoice.png', 600, 800);
        $uploadRes = $this->post("/api/v1/accounting/expenses/{$expense->id}/receipt", [
            'receipt' => $receiptFile,
        ], ['Accept' => 'application/json']);

        $uploadRes->assertStatus(200)
            ->assertJsonPath('data.has_receipt', true);

        $freshExpense = $expense->fresh();
        $this->assertNotNull($freshExpense->receipt_path);
        $this->assertNull($freshExpense->receipt_data);
        Storage::disk('s3')->assertExists($freshExpense->receipt_path);

        $getRes = $this->getJson("/api/v1/accounting/expenses/{$expense->id}/receipt");
        $getRes->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['temporary_url', 'url', 'expires_in_seconds', 'mime_type', 'filename'],
            ])
            ->assertJsonPath('data.expires_in_seconds', 300);

        $signedUrl = (string) $getRes->json('data.temporary_url');
        $this->assertNotEmpty($signedUrl);

        // Stranger is denied via ExpensePolicy -> 404
        Sanctum::actingAs($stranger);
        $this->getJson("/api/v1/accounting/expenses/{$expense->id}/receipt")
            ->assertStatus(404);
    }

    public function test_accounting_export_dispatches_queue_job_and_stores_csv_download(): void
    {
        Storage::fake('s3');
        Queue::fake();
        Config::set('filesystems.media_disk', 's3');

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Expense::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'title' => 'Designing Data-Intensive Applications',
            'amount' => 450000,
            'currency' => 'IDR',
            'amount_base_currency' => 450000,
            'exchange_rate' => 1,
            'payment_method' => 'credit_card',
            'expense_date' => now(),
            'status' => 'completed',
        ]);

        $exportRes = $this->postJson('/api/v1/accounting/reports/export', [
            'report_type' => 'overview',
            'format' => 'csv',
        ]);

        $exportRes->assertStatus(202)
            ->assertJsonPath('data.status', 'queued')
            ->assertJsonStructure(['data' => ['export_id', 'status', 'status_url']]);

        $exportId = (string) $exportRes->json('data.export_id');

        Queue::assertPushed(ExportAccountingReportJob::class, fn (ExportAccountingReportJob $job) => $job->exportId === $exportId && $job->userId === $user->id);

        // Execute queued export job handler directly and verify status endpoint returns download URL
        $this->app->call([new ExportAccountingReportJob($user->id, $exportId, [
            'report_type' => 'overview',
            'format' => 'csv',
        ]), 'handle']);

        $statusRes = $this->getJson("/api/v1/accounting/reports/exports/{$exportId}");
        $statusRes->assertStatus(200)
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonStructure(['data' => ['download_url', 'storage_key', 'filename']]);

        Storage::disk('s3')->assertExists((string) $statusRes->json('data.storage_key'));
    }

    public function test_currency_sync_command_budget_alert_job_and_schedule_work(): void
    {
        Config::set('services.currency.endpoint', 'https://rates.example.test/latest');
        Http::fake([
            'https://rates.example.test/latest' => Http::response([
                'rates' => [
                    'USD' => 16250,
                    'EUR' => 17600,
                ],
            ], 200),
        ]);

        $this->artisan('currency:sync-rates --sync')->assertExitCode(0);

        $this->assertDatabaseHas('currency_rates', [
            'from_currency' => 'USD',
            'to_currency' => 'IDR',
            'rate' => 16250,
            'is_active' => true,
        ]);

        $user = User::factory()->create();
        $category = ExpenseCategory::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'name' => 'Reading Budget Cat',
            'slug' => 'reading-budget-cat',
            'color' => '#3B82F6',
            'icon' => 'book',
            'is_default' => false,
            'is_active' => true,
        ]);

        Budget::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'category_id' => $category->id,
            'name' => 'Monthly Books Budget',
            'amount' => 100000,
            'currency' => 'IDR',
            'amount_base_currency' => 100000,
            'period' => 'monthly',
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'alert_threshold' => 80,
            'is_active' => true,
        ]);

        Expense::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Threshold Crossing Purchase',
            'amount' => 95000,
            'currency' => 'IDR',
            'amount_base_currency' => 95000,
            'exchange_rate' => 1,
            'payment_method' => 'cash',
            'expense_date' => now(),
            'status' => 'completed',
        ]);

        SendBudgetAlertJob::dispatchSync($user->id);

        $this->assertDatabaseHas('accounting_timeline_events', [
            'user_id' => $user->id,
            'type' => 'budget_alert',
        ]);

        $events = app(Schedule::class)->events();
        $this->assertGreaterThanOrEqual(2, count($events));
    }

    public function test_security_hardening_rate_limits_token_expiration_error_sanitization_and_registration(): void
    {
        Notification::fake();

        // 1. storage.local.upload route disabled by default (FILESYSTEM_LOCAL_SERVE=false)
        $this->assertFalse(Route::has('storage.local.upload'));

        // 2. Full registration seeds default categories, sends email verification, and throttles 3/10min
        $registerRes = $this->withServerVariables(['REMOTE_ADDR' => '10.20.30.40'])
            ->postJson('/api/v1/auth/register', [
                'name' => 'New Reader',
                'email' => 'new.reader@example.com',
                'password' => 'StrongPass123!',
                'password_confirmation' => 'StrongPass123!',
            ]);

        $registerRes->assertStatus(201)
            ->assertJsonPath('data.user.email', 'new.reader@example.com');

        $newUser = User::where('email', 'new.reader@example.com')->firstOrFail();
        Notification::assertSentTo($newUser, VerifyEmail::class);
        $this->assertEquals(5, ExpenseCategory::forUser($newUser->id)->count());

        $verifyUrl = URL::temporarySignedRoute('verification.verify', now()->addMinutes(10), [
            'id' => $newUser->id,
            'hash' => sha1($newUser->getEmailForVerification()),
        ]);
        $this->getJson($verifyUrl)->assertStatus(200)->assertJsonPath('data.verified', true);
        $this->assertTrue($newUser->fresh()->hasVerifiedEmail());

        // Trigger registration rate limit (remaining 2 requests succeed/fail validation, 4th returns 429)
        for ($i = 2; $i <= 3; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '10.20.30.40'])
                ->postJson('/api/v1/auth/register', [
                    'name' => "Reader {$i}",
                    'email' => "reader{$i}@example.com",
                    'password' => 'StrongPass123!',
                    'password_confirmation' => 'StrongPass123!',
                ])->assertStatus(201);
        }

        $this->withServerVariables(['REMOTE_ADDR' => '10.20.30.40'])
            ->postJson('/api/v1/auth/register', [
                'name' => 'Blocked Reader',
                'email' => 'blocked@example.com',
                'password' => 'StrongPass123!',
                'password_confirmation' => 'StrongPass123!',
            ])->assertStatus(429);

        // 3. Export rate limiter enforces 5/min/user -> 6th returns 429
        Queue::fake();
        Sanctum::actingAs($newUser);
        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->postJson('/api/v1/accounting/reports/export', [
                'report_type' => 'overview',
                'format' => 'json',
            ])->assertStatus(202);
        }
        $this->postJson('/api/v1/accounting/reports/export', [
            'report_type' => 'overview',
            'format' => 'json',
        ])->assertStatus(429);
    }

    public function test_sanctum_token_expiration_and_app_debug_false_error_sanitization(): void
    {
        $user = User::factory()->create();

        // 1. Sanctum token expiration obeys configured SANCTUM_TOKEN_EXPIRATION (10080 min)
        $this->assertSame(10080, config('sanctum.expiration'));
        $tokenResult = $user->createToken('test-token');
        $plainToken = $tokenResult->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$plainToken)
            ->getJson('/api/v1/auth/me')
            ->assertStatus(200);

        $this->travel(10081)->minutes();
        app('auth')->forgetGuards();

        $this->withHeader('Authorization', 'Bearer '.$plainToken)
            ->getJson('/api/v1/auth/me')
            ->assertStatus(401);

        $this->travelBack();

        // 2. APP_DEBUG=false strips exception traces on API 500 errors
        Config::set('app.debug', false);
        Sanctum::actingAs($user);
        $this->mock(DashboardAnalyticsService::class)
            ->shouldReceive('getSummaryForUser')
            ->once()
            ->andThrow(new \RuntimeException('Sensitive internal DB host secret'));

        $errorRes = $this->getJson('/api/v1/analytics/dashboard');
        $errorRes->assertStatus(500);
        $json = $errorRes->json();
        $this->assertArrayNotHasKey('trace', $json);
        $this->assertArrayNotHasKey('file', $json);
        $this->assertStringNotContainsString('Sensitive internal DB host secret', json_encode($json));
    }
}
