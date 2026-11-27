<?php

namespace Tests\Feature;

use App\Models\Achievement;
use App\Models\Book;
use App\Models\ExpenseCategory;
use App\Models\ReadingSession;
use App\Models\Shelf;
use App\Models\User;
use App\Services\Analytics\DashboardAnalyticsService;
use App\Services\Analytics\StatisticsService;
use Database\Seeders\AchievementSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class Phase4DataScalingTest extends TestCase
{
    use RefreshDatabase;

    public function test_books_index_paginates_by_24_and_supports_extended_filters(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $shelfA = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Shelf A',
            'capacity' => 50,
            'order' => 0,
            'span' => 1,
        ]);

        $shelfB = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Shelf B',
            'capacity' => 50,
            'order' => 1,
            'span' => 1,
        ]);

        // Create 26 base unread books on shelf A so default page size of 24 spans 2 pages
        for ($i = 1; $i <= 26; $i++) {
            Book::create([
                'user_id' => $user->id,
                'shelf_id' => $shelfA->id,
                'title' => sprintf('Catalog Book %02d', $i),
                'author' => 'Standard Author',
                'genre' => 'Fiction',
                'pages' => 200,
                'status' => 'unread',
                'favorite' => false,
                'last_modified' => now()->subMinutes($i),
            ]);
        }

        // Targeted matching books for specific filters
        Book::create([
            'user_id' => $user->id,
            'shelf_id' => $shelfB->id,
            'title' => 'Deep PostgreSQL Scaling',
            'author' => 'Ada Lovelace',
            'genre' => 'Technology, Databases',
            'pages' => 420,
            'status' => 'reading',
            'current_page' => 120,
            'progress' => 28.57,
            'favorite' => true,
            'personal_notes' => 'B-Tree and GIN notes',
            'started_date' => '2025-03-10',
            'last_modified' => now(),
        ]);

        Book::create([
            'user_id' => $user->id,
            'shelf_id' => $shelfB->id,
            'title' => 'Loaned Architecture Tome',
            'author' => 'Martin Kleppmann',
            'genre' => 'Technology',
            'pages' => 500,
            'status' => 'borrowed',
            'borrowed_by' => 'Budi Santoso',
            'borrowed_date' => now()->subDays(20)->toDateString(),
            'due_date' => now()->subDays(5)->toDateString(),
            'is_returned' => false,
            'last_modified' => now()->subSecond(),
        ]);

        // 1. Default pagination (24 per page out of 28 total)
        $defaultResponse = $this->getJson('/api/v1/books');
        $defaultResponse->assertStatus(200)
            ->assertJsonPath('data.meta.total', 28)
            ->assertJsonPath('data.meta.per_page', 24)
            ->assertJsonPath('data.meta.current_page', 1)
            ->assertJsonPath('data.meta.last_page', 2);
        $this->assertCount(24, $defaultResponse->json('data.data'));

        $page2Response = $this->getJson('/api/v1/books?page=2');
        $page2Response->assertStatus(200)
            ->assertJsonPath('data.meta.current_page', 2);
        $this->assertCount(4, $page2Response->json('data.data'));

        // 2. Multi-status & exclude_statuses
        $this->getJson('/api/v1/books?statuses=reading,borrowed')
            ->assertStatus(200)
            ->assertJsonPath('data.meta.total', 2);

        $this->getJson('/api/v1/books?exclude_statuses=unread,reading')
            ->assertStatus(200)
            ->assertJsonPath('data.meta.total', 1)
            ->assertJsonPath('data.data.0.title', 'Loaned Architecture Tome');

        // 3. Shelf, favorite, has_notes, genre, year filters
        $this->getJson("/api/v1/books?shelf_id={$shelfB->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.meta.total', 2);

        $this->getJson('/api/v1/books?favorite=true&has_notes=true&genre=Databases&year=2025')
            ->assertStatus(200)
            ->assertJsonPath('data.meta.total', 1)
            ->assertJsonPath('data.data.0.title', 'Deep PostgreSQL Scaling');

        // 4. Overdue, is_returned, borrowed_by, search
        $this->getJson('/api/v1/books?overdue=true&is_returned=false&borrowed_by=Budi')
            ->assertStatus(200)
            ->assertJsonPath('data.meta.total', 1)
            ->assertJsonPath('data.data.0.title', 'Loaned Architecture Tome');

        $this->getJson('/api/v1/books?search=PostgreSQL')
            ->assertStatus(200)
            ->assertJsonPath('data.meta.total', 1)
            ->assertJsonPath('data.data.0.title', 'Deep PostgreSQL Scaling');
    }

    public function test_analytics_dashboard_endpoint_returns_sql_aggregations_and_invalidates_cache_on_events(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $shelf = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Main Shelf',
            'capacity' => 20,
            'order' => 0,
            'span' => 1,
        ]);

        $readingBook = Book::create([
            'user_id' => $user->id,
            'shelf_id' => $shelf->id,
            'title' => 'Atomic Habits',
            'author' => 'James Clear',
            'genre' => 'Self-Help, Productivity',
            'pages' => 300,
            'current_page' => 150,
            'progress' => 50,
            'status' => 'reading',
            'favorite' => true,
            'personal_rating' => 5,
            'started_date' => now()->subDays(3),
            'date_added' => now(),
            'last_modified' => now(),
        ]);

        Book::create([
            'user_id' => $user->id,
            'shelf_id' => $shelf->id,
            'title' => 'Clean Code',
            'author' => 'Robert Martin',
            'genre' => 'Technology',
            'pages' => 400,
            'current_page' => 400,
            'progress' => 100,
            'status' => 'finished',
            'personal_rating' => 4,
            'finished_date' => now(),
            'read_dates' => [now()->toDateString()],
            'date_added' => now(),
            'last_modified' => now(),
        ]);

        // Seed dashboard + statistics cache
        $response = $this->getJson('/api/v1/analytics/dashboard');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'overview' => [
                        'total',
                        'reading',
                        'finished',
                        'unread',
                        'wishlist',
                        'borrowed',
                        'favorites',
                        'noted_count',
                        'overdue_count',
                        'available_to_loan_count',
                        'added_this_month',
                        'finished_this_year',
                        'current_year',
                        'target',
                        'total_pages',
                        'pages_read',
                        'reading_pages_read',
                        'reading_total_pages',
                        'avg_rating',
                        'top_genre',
                        'shelves_count',
                    ],
                    'yearly_stats',
                    'genre_chart',
                    'author_chart',
                    'status_counts',
                    'currently_reading',
                    'top_read_books',
                    'recent_books',
                    'recently_finished',
                    'book_colors',
                    'daily_activity',
                    'activity_books',
                    'generated_at',
                ],
            ])
            ->assertJsonPath('data.overview.total', 2)
            ->assertJsonPath('data.overview.reading', 1)
            ->assertJsonPath('data.overview.finished', 1)
            ->assertJsonPath('data.overview.favorites', 1)
            ->assertJsonPath('data.overview.shelves_count', 1);

        $this->getJson('/api/v1/statistics')->assertStatus(200);

        $this->assertTrue(Cache::has(DashboardAnalyticsService::cacheKey($user->id)));
        $this->assertTrue(Cache::has(StatisticsService::cacheKey($user->id)));

        // 1. Finishing reading session invalidates both caches
        $session = ReadingSession::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'book_id' => $readingBook->id,
            'start_time' => now()->subMinutes(20),
            'start_page' => 150,
            'paused_seconds' => 0,
            'is_paused' => false,
        ]);

        $this->putJson("/api/v1/books/{$readingBook->id}/reading-sessions/{$session->id}/end", [
            'end_page' => 180,
            'notes' => 'Great chapter',
        ])->assertStatus(200);

        $this->assertFalse(Cache::has(DashboardAnalyticsService::cacheKey($user->id)));
        $this->assertFalse(Cache::has(StatisticsService::cacheKey($user->id)));

        // Re-warm cache
        $this->getJson('/api/v1/analytics/dashboard')->assertStatus(200);
        $this->assertTrue(Cache::has(DashboardAnalyticsService::cacheKey($user->id)));

        // 2. Creating an expense invalidates analytics cache
        $category = ExpenseCategory::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'name' => 'Books',
            'slug' => 'books',
            'color' => '#8B5E3C',
            'icon' => 'book',
            'is_default' => true,
            'is_active' => true,
        ]);

        $this->postJson('/api/v1/accounting/expenses', [
            'title' => 'Hardcover Purchase',
            'amount' => 150000,
            'currency' => 'IDR',
            'category_id' => $category->id,
            'expense_date' => now()->toDateString(),
        ])->assertStatus(201);

        $this->assertFalse(Cache::has(DashboardAnalyticsService::cacheKey($user->id)));
    }

    public function test_finishing_books_evaluates_and_unlocks_achievements_server_side(): void
    {
        $this->seed(AchievementSeeder::class);

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $shelf = Shelf::create([
            'user_id' => $user->id,
            'name' => 'Achievement Shelf',
            'capacity' => 20,
            'order' => 0,
            'span' => 1,
        ]);

        $book = Book::create([
            'user_id' => $user->id,
            'shelf_id' => $shelf->id,
            'title' => 'First Finished Book',
            'author' => 'Author One',
            'pages' => 220,
            'status' => 'reading',
            'current_page' => 200,
            'last_modified' => now(),
        ]);

        $this->postJson("/api/v1/books/{$book->id}/finish")->assertStatus(200);

        $firstBookAchievement = Achievement::where('title', 'Langkah Pertama')->firstOrFail();

        $this->assertDatabaseHas('user_achievements', [
            'user_id' => $user->id,
            'achievement_id' => $firstBookAchievement->id,
            'unlocked' => true,
        ]);

        $achievementsResponse = $this->getJson('/api/v1/achievements');
        $achievementsResponse->assertStatus(200);

        $unlockedItem = collect($achievementsResponse->json('data'))
            ->firstWhere('title', 'Langkah Pertama');

        $this->assertNotNull($unlockedItem);
        $this->assertTrue($unlockedItem['user_progress']['unlocked']);
        $this->assertGreaterThanOrEqual(1, $unlockedItem['user_progress']['current']);
    }
}
