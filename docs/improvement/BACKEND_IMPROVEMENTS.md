# Audit & Rencana Perbaikan Backend (Laravel 12)
## MyBookshelf Improvement Specification

Dokumen ini merinci seluruh temuan bug, celah keamanan (*security gaps*), inkonsistensi logika bisnis, serta status perbaikannya pada sisi backend (`app/`, `routes/`, `config/`, `database/`).

---

## Status Perbaikan Backend (Batch 1 — Terverifikasi via PHPUnit PostgreSQL)

* ✅ **Bug `response()->error()` & Bocor Exception (`Controller.php` + Seluruh V1 Accounting/Book/ReadingSession Controllers):** Teratasi via helper `validationErrorResponse()`, `notFoundResponse()`, dan `serverErrorResponse()` di [`Controller.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Controller.php).
* ✅ **Celah Cross-Tenant IDOR Foreign Key & Service:** Teratasi via `$this->ownedRule(...)` (`Rule::exists()->where('user_id', ...)`) pada [`BookController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/BookController.php), [`ShelfController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ShelfController.php), [`ReadingSessionController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ReadingSessionController.php), [`CollectionController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/CollectionController.php), [`ExpenseController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ExpenseController.php), [`BudgetController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/BudgetController.php), [`AccountingReportController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/AccountingReportController.php), serta `findOwnedBook()` di [`BookService.php`](file:///c:/laragon/www/mybookshelf/app/Services/BookService.php).
* ✅ **Bug PostgreSQL & Kontrak Data:**
  * Diperbaiki: `BookService::readAgain()` (`'restarted'` -> `'started'` sesuai ENUM PostgreSQL `timeline_events.type`).
  * Diperbaiki: `ShelfController::store()` menghapus field non-eksisten `'theme'` pada `Room::firstOrCreate()`, `ShelfController::update()` mendukung `span`, `ShelfResource` menyertakan `span` & `decorations`, dan `ShelfController::destroy()` memindahkan buku secara transaksional (`relocate_to` atau rak tersisa).
  * Diperbaiki: `BookController::update()` memetakan alias `rating`/`notes` ke `personal_rating`/`personal_notes`.
  * Diperbaiki: `BookController::uploadCover()` menghapus sampul lama pada `Storage::disk('public')`.
  * Diperbaiki: `AuthController` menambahkan guard `$request->hasSession()` agar permintaan tanpa stateful Referer tidak melempar `500 Session store not set`.
  * Diperbaiki: `ExpenseService::syncFromBook()` (dipakai bersama oleh [`BookObserver.php`](file:///c:/laragon/www/mybookshelf/app/Observers/BookObserver.php) & [`SyncBookExpensesCommand.php`](file:///c:/laragon/www/mybookshelf/app/Console/Commands/SyncBookExpensesCommand.php)) menghormati `is_gift`, `purchase_currency`, dan memakai `payment_method = 'cash'`, ditambah migrasi [`2026_11_25_000001_widen_exchange_rate_precision_on_expenses_table.php`](file:///c:/laragon/www/mybookshelf/database/migrations/2026_11_25_000001_widen_exchange_rate_precision_on_expenses_table.php) (`DECIMAL(14,6)` untuk mencegah overflow kurs seperti `16000` IDR/USD).
  * Diperbaiki: `AchievementController::unlock()` memvalidasi pemenuhan `requirement` di sisi server sebelum membuka achievement.
  * Diperbaiki: `config/cors.php` dan `config/sanctum.php` kini mendukung variabel `env()` (`CORS_ALLOWED_ORIGINS` dan `SANCTUM_STATEFUL_DOMAINS`).
  * Teruji: 3 suite Feature Test baru (`AuthAndSecurityTest`, `BookAndShelfWorkflowTest`, `AccountingErrorHandlingTest`) — total **13 passed (93 assertions)**.

---

## Sisa Item Backend yang Masih Terbuka (Next Phase)

---

## 1. Bug Kritis: Pemanggilan `response()->error()` Salah Posisi Argumen

### Lokasi & Fakta Kode
Pada [`AppServiceProvider.php`](file:///c:/laragon/www/mybookshelf/app/Providers/AppServiceProvider.php), macro `Response::error` didefinisikan dengan tanda tangan:
```php
Response::macro('error', function ($message = 'Error', $errors = null, $statusCode = 400) { ... });
```
Parameter ke-2 adalah `$errors`, dan parameter ke-3 adalah `$statusCode` (default `400`).

Namun beberapa controller memanggilnya dengan 2 argumen dan menaruh **HTTP status code di posisi parameter ke-2 (`$errors`)**:
* [`ExpenseController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ExpenseController.php): `return response()->error($e->getMessage(), 500);`, `response()->error($e->errors(), 422);`, `response()->error('...', 404);`
* [`BudgetController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/BudgetController.php): `response()->error('Budget not found', 404);`, `response()->error($e->errors(), 422);`, `response()->error($e->getMessage(), 500);`
* [`CurrencyController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/CurrencyController.php): `response()->error('Currency rate not found', 404);`, `response()->error($e->getMessage(), 500);`
* [`BookController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/BookController.php): `response()->error('Book not found', 404);`, `response()->error($e->getMessage(), 500);` pada `getExpenses`, `getCostBreakdown`, `getPurchaseHistory`.
* [`ReadingSessionController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ReadingSessionController.php): `return response()->error('Cannot pause an already ended session', 400);`

### Dampak
1. Server selalu membalas dengan **HTTP status `400`** dan payload `"errors": 500` atau `"errors": 404` alih-alih status HTTP semestinya.
2. Pada blok `catch (\Exception $e)`, `$e->getMessage()` dikembalikan mentah ke klien sehingga berisiko membocorkan informasi internal database/SQL.

### Solusi Perbaikan
* Ubah seluruh pemanggilan menjadi 3 argumen eksplisit: `response()->error('Internal server error', null, 500)` atau bungkus exception non-validasi dengan pesan generik sambil mencatat detail ke `Log::error($e)`.
* Pertimbangkan penggunaan Laravel `FormRequest` agar validasi `422` otomatis ditangani oleh exception handler global tanpa `try/catch` berulang.

---

## 2. Celah Keamanan & Isolasi Kepemilikan Data (IDOR)

### 2.1. Validasi Foreign Key `exists:` Tanpa Scope `user_id`
* [`BookController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/BookController.php) (`store`, `update`, `moveToShelf`): aturan `'shelf_id' => '...exists:shelves,id'` hanya mengecek keberadaan UUID rak di tabel `shelves`, tidak memeriksa apakah rak tersebut milik `$request->user()->id`.
* [`ReadingSessionController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ReadingSessionController.php) (`store`): `'book_id' => 'required|exists:books,id'` mengizinkan user mencatat sesi baca pada `book_id` milik user lain.
* [`ShelfController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ShelfController.php) (`store`, `update`): `'room_id' => '...exists:rooms,id'` tidak memverifikasi kepemilikan `room`.
* [`ExpenseController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ExpenseController.php) & [`BudgetController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/BudgetController.php): `category_id` (`exists:expense_categories,id`) dan `book_id` (`exists:books,id`) belum di-scope ke `user_id`.

**Perbaikan:** Gunakan `Rule::exists('shelves', 'id')->where('user_id', $request->user()->id)` (serta rule identik untuk `books`, `rooms`, dan `expense_categories`).

### 2.2. Defense-in-Depth pada [`BookService.php`](file:///c:/laragon/www/mybookshelf/app/Services/BookService.php)
Method `deleteBook`, `startReading`, `finishReading`, `updateProgress`, `toggleFavorite`, `updateNotes`, `updateRating`, `moveToShelf`, `borrowBook`, dan `returnBook` memanggil `Book::findOrFail($id)` tanpa filter `user_id`.
* **Perbaikan:** Tambahkan parameter `?string $userId = null` dan terapkan `->when($userId, fn ($q) => $q->where('user_id', $userId))` pada seluruh method mutasi agar Service aman dipanggil dari command, job, maupun controller.

### 2.3. Validasi Syarat di Server pada `AchievementController::unlock()`
Pada [`AchievementController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/AchievementController.php), terdapat komentar `// For now, we'll just unlock it` — endpoint `POST /v1/achievements/{id}/unlock` langsung membuka achievement tanpa memverifikasi di sisi server apakah user benar-benar memenuhi `requirement`.

---

## 3. Inkonsistensi Logika Bisnis & Bug Fungsional

### 3.1. Field Validation Mismatch pada `BookController::update()`
Di [`BookController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/BookController.php), method `update()` memvalidasi `'rating'` dan `'notes'`, padahal kolom di tabel `books` dan `Book::$fillable` adalah `personal_rating` dan `personal_notes`.

### 3.2. `BookObserver` & `SyncBookExpensesCommand` Mengabaikan Mata Uang & Status Hadiah
Pada [`BookObserver.php`](file:///c:/laragon/www/mybookshelf/app/Observers/BookObserver.php) dan [`SyncBookExpensesCommand.php`](file:///c:/laragon/www/mybookshelf/app/Console/Commands/SyncBookExpensesCommand.php):
1. Jika buku berstatus `is_gift = true`, observer masih mencatatnya sebagai pengeluaran belanja buku.
2. Kolom `$expense->currency` di-hardcode `'IDR'` dengan `exchange_rate = 1.0`, mengabaikan `$book->purchase_currency` dan `CurrencyRateService`.
3. `$expense->payment_method` diisi `'other'`, sedangkan validasi di `ExpenseController::store()` dan tipe `PaymentMethod` frontend hanya menerima `cash | transfer | e-wallet | credit_card`.
4. Terdapat karakter mojibake `'icon' => 'ðŸ“š'`.

### 3.3. Penghapusan Rak Meninggalkan Buku Yatim (`ShelfController::destroy`)
Di [`ShelfController.php`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/ShelfController.php) baris 95 terdapat `// TODO: Relocate books to another shelf or prevent deletion if books exist`. Saat rak dihapus, FK `nullOnDelete` mengubah `books.shelf_id` menjadi `NULL` sehingga buku hilang dari seluruh tampilan rak 3D.

### 3.4. Upload Cover Tidak Menghapus File Lama & Menyimpan Full URL
Pada `BookController::uploadCover()`:
* File disimpan ke disk `'public'` (`$file->storeAs('book-covers', $filename, 'public')`), namun pengecekan hapus file lama memanggil `Storage::exists('public/book-covers/' . $filename)` (disk default `local`), sehingga file lama tidak pernah terhapus.
* URL disimpan lengkap dengan scheme & host (`request()->getSchemeAndHttpHost() . '/storage/...'`), yang akan rusak apabila domain atau port server berubah.

### 3.5. Placeholder Export & Inkonsistensi Resource Rak
* [`AccountingReportController::export()`](file:///c:/laragon/www/mybookshelf/app/Http/Controllers/Api/V1/AccountingReportController.php) baru mengembalikan JSON placeholder (`'Export functionality placeholder'`).
* `ShelfController::update()` belum memvalidasi atribut `span`, dan [`ShelfResource.php`](file:///c:/laragon/www/mybookshelf/app/Http/Resources/Api/V1/ShelfResource.php) belum menyertakan `span` dan `decorations`.
* Rute `POST /v1/auth/register` di [`routes/api.php`](file:///c:/laragon/www/mybookshelf/routes/api.php) masih dikomentari (*Coming Soon*).
