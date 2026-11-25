<?php

namespace Tests\Feature;

use App\Models\Achievement;
use App\Models\Book;
use App\Models\CurrencyRate;
use App\Models\Expense;
use App\Models\Shelf;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BookAndShelfWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_shelf_creation_works_for_new_user_and_deletion_relocates_books(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Create two shelves without providing room_id (verifies Room::firstOrCreate fix)
        $shelfARes = $this->postJson('/api/v1/shelves', [
            'name' => 'Primary Shelf',
            'capacity' => 15,
            'order' => 0,
            'span' => 6,
        ])->assertStatus(201);

        $shelfBRes = $this->postJson('/api/v1/shelves', [
            'name' => 'Overflow Shelf',
            'capacity' => 20,
            'order' => 1,
            'span' => 6,
        ])->assertStatus(201);

        $shelfAId = $shelfARes->json('data.id');
        $shelfBId = $shelfBRes->json('data.id');

        // Update span via PATCH/PUT
        $this->patchJson("/api/v1/shelves/{$shelfAId}", [
            'span' => 8,
        ])->assertStatus(200)->assertJsonPath('data.span', 8);

        // Place book on shelf A
        $bookRes = $this->postJson('/api/v1/books', [
            'title' => 'Clean Architecture',
            'author' => 'Robert C. Martin',
            'pages' => 432,
            'shelf_id' => $shelfAId,
        ])->assertStatus(201);

        $bookId = $bookRes->json('data.id');

        // Delete shelf A -> book should relocate to shelf B instead of becoming orphaned
        $this->deleteJson("/api/v1/shelves/{$shelfAId}")
            ->assertStatus(200)
            ->assertJsonPath('data.relocated_books', 1);

        $this->assertDatabaseHas('books', [
            'id' => $bookId,
            'shelf_id' => $shelfBId,
        ]);
    }

    public function test_book_update_maps_rating_and_notes_and_read_again_respects_timeline_enum(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $bookRes = $this->postJson('/api/v1/books', [
            'title' => 'Designing Data-Intensive Applications',
            'author' => 'Martin Kleppmann',
            'pages' => 611,
        ])->assertStatus(201);

        $bookId = $bookRes->json('data.id');

        // Update via rating/notes aliases
        $this->putJson("/api/v1/books/{$bookId}", [
            'rating' => 5,
            'notes' => 'Must-read systems book',
        ])->assertStatus(200)
            ->assertJsonPath('data.personal_rating', '5.0')
            ->assertJsonPath('data.personal_notes', 'Must-read systems book');

        // Finish book then trigger read-again (verifies timeline_events.type ENUM fix)
        $this->postJson("/api/v1/books/{$bookId}/finish")->assertStatus(200);
        $this->postJson("/api/v1/books/{$bookId}/read-again")
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'reading');

        $this->assertDatabaseHas('timeline_events', [
            'book_id' => $bookId,
            'type' => 'started',
            'description' => 'Started reading again',
        ]);
    }

    public function test_book_observer_handles_currency_conversion_and_gift_books(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        CurrencyRate::create([
            'id' => Str::uuid()->toString(),
            'from_currency' => 'USD',
            'to_currency' => 'IDR',
            'rate' => 16000.0,
            'effective_date' => now()->subDay(),
            'is_active' => true,
        ]);

        // Paid book in USD should convert to IDR and use valid payment_method
        $paidRes = $this->postJson('/api/v1/books', [
            'title' => 'System Design Interview',
            'author' => 'Alex Xu',
            'pages' => 320,
            'purchase_price' => 25,
            'purchase_currency' => 'USD',
            'is_gift' => false,
        ])->assertStatus(201);

        $paidBookId = $paidRes->json('data.id');

        $this->assertDatabaseHas('expenses', [
            'book_id' => $paidBookId,
            'user_id' => $user->id,
            'currency' => 'USD',
            'amount' => '25.00',
            'amount_base_currency' => '400000.00',
            'payment_method' => 'cash',
        ]);

        // Marking as gift should remove the synced expense
        $this->putJson("/api/v1/books/{$paidBookId}", [
            'is_gift' => true,
        ])->assertStatus(200);

        $this->assertSoftDeleted('expenses', [
            'book_id' => $paidBookId,
        ]);

        // Gift book created from scratch should not create expense
        $giftRes = $this->postJson('/api/v1/books', [
            'title' => 'Gift Book',
            'author' => 'Friend',
            'pages' => 120,
            'purchase_price' => 150000,
            'is_gift' => true,
        ])->assertStatus(201);

        $this->assertEquals(0, Expense::where('book_id', $giftRes->json('data.id'))->count());
    }

    public function test_upload_cover_replaces_and_deletes_previous_cover_on_public_disk(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $book = Book::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $user->id,
            'title' => 'Cover Test Book',
            'author' => 'Tester',
            'pages' => 100,
        ]);

        $firstRes = $this->post("/api/v1/books/{$book->id}/cover", [
            'cover' => UploadedFile::fake()->image('first.jpg', 200, 300),
        ])->assertStatus(200);

        $firstFilename = basename(parse_url($firstRes->json('data.cover_image'), PHP_URL_PATH));
        Storage::disk('public')->assertExists("book-covers/{$firstFilename}");

        // Sleep 1s so filename timestamp differs cleanly
        sleep(1);

        $secondRes = $this->post("/api/v1/books/{$book->id}/cover", [
            'cover' => UploadedFile::fake()->image('second.png', 200, 300),
        ])->assertStatus(200);

        $secondFilename = basename(parse_url($secondRes->json('data.cover_image'), PHP_URL_PATH));
        Storage::disk('public')->assertMissing("book-covers/{$firstFilename}");
        Storage::disk('public')->assertExists("book-covers/{$secondFilename}");
    }

    public function test_achievement_unlock_enforces_server_side_requirement(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $achievement = Achievement::create([
            'id' => Str::uuid()->toString(),
            'title' => 'Kutu Buku Pemula',
            'description' => 'Menyelesaikan 5 buku.',
            'icon' => 'CheckCircle',
            'requirement' => 5,
            'category' => 'reading',
            'rarity' => 'rare',
        ]);

        // User has 0 finished books -> reject premature unlock
        $this->postJson("/api/v1/achievements/{$achievement->id}/unlock")
            ->assertStatus(422)
            ->assertJsonPath('errors.current', 0)
            ->assertJsonPath('errors.requirement', 5);

        // Finish 5 books
        for ($i = 1; $i <= 5; $i++) {
            Book::create([
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => "Finished Book {$i}",
                'author' => 'Author',
                'pages' => 200,
                'status' => 'finished',
            ]);
        }

        // Now unlock succeeds
        $this->postJson("/api/v1/achievements/{$achievement->id}/unlock")
            ->assertStatus(200)
            ->assertJsonPath('data.current', 5);
    }
}
