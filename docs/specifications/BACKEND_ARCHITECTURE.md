# Backend Architecture Specification (Laravel 12)
## MyBookshelf Engineering Blueprint

Dokumen ini menguraikan arsitektur internal sisi server pada proyek **MyBookshelf**, mencakup siklus hidup request HTTP, lapisan Service, Observer, Eloquent Models, API Resources, validasi, serta utilitas Artisan CLI.

---

## 1. Siklus Hidup Request & Bootstrap (`bootstrap/app.php`)

Konfigurasi Laravel 12 menggunakan entry point modern di `bootstrap/app.php`:
1. **Routing Terpisah:**
   * `routes/web.php` untuk rute web dasar.
   * `routes/api.php` (prefiks `/api`) untuk seluruh endpoint RESTful v1 dan health check.
   * `health: '/up'` sebagai endpoint health probe bawaan framework.
2. **Middleware SPA Sanctum:**
   * `EnsureFrontendRequestsAreStateful` ditambahkan di awal grup middleware `api` agar domain yang terdaftar di `config/sanctum.php` (`localhost:5173`, `localhost:5177`, `localhost:3000`, `127.0.0.1:5173`, `127.0.0.1:5177`) memproses cookie sesi dan CSRF secara stateful.
   * Pengecualian CSRF diberikan secara spesifik pada `api/v1/auth/login` dan `api/v1/auth/register`.
3. **JSON Exception Rendering:**
   * Seluruh exception pada rute `api/*` otomatis dikembalikan sebagai payload JSON, bukan halaman HTML error.
   * Endpoint yang tidak cocok ditangani `Route::fallback` dengan status `404` dan format `{ "success": false, "message": "Endpoint not found" }`.

---

## 2. Lapisan Aplikasi (*Layered Backend Architecture*)

```text
HTTP Request
   │
   ▼
[Middleware: CORS -> Sanctum Stateful -> Throttle -> auth:sanctum]
   │
   ▼
[Controllers (app/Http/Controllers/Api/V1/*)]  ── Validasi Request & Cek Kepemilikan
   │
   ▼
[Services (app/Services/*)]                    ── Logika Bisnis, Transaksi, & Agregasi
   │
   ▼
[Eloquent Models (app/Models/*)]               ── Relasi DB, Casts, Scopes, UUIDs
   │          │
   │          └──▶ [BookObserver]              ── Efek Samping Otomatis ke Tabel Expenses
   ▼
[API Resources & Response Macros]              ── Transformasi & Pembungkus JSON Seragam
```

---

## 3. Spesifikasi Lapisan Service (`app/Services/`)

Seluruh logika domain kompleks dipisahkan dari controller ke dalam lima kelas Service:

### 3.1. `BookService.php`
* **Kueri & Filter (`getAllBooks`):** Mendukung filter `status`, `favorite`, pencarian teks (`search`), dan isolasi wajib per `user_id`.
* **Siklus Hidup Baca:**
  * `startReading($id)` & `finishReading($id)`: Mengubah status (`reading`/`finished`), memperbarui timestamp `started_date`/`finished_date`, serta mencatat `read_dates`.
  * `updateProgress($id, $currentPage)`: Menghitung ulang persentase `progress` ($0.00 - 100.00$).
  * `readAgain($id, $userId)`: Memulai siklus baca ulang untuk buku yang sudah selesai tanpa menghapus histori baca sebelumnya.
* **Sirkulasi Peminjaman:** `borrowBook($id, $borrowedBy, $dueDate)` dan `returnBook($id)` mengelola status `borrowed` dan flag `is_returned`.
* **Audit Timeline:** `createTimelineEvent(Book $book, $type, $description)` merekam peristiwa (`added`, `started`, `progress`, `finished`, `favorited`, `loaned`, `returned`) ke tabel `timeline_events`.
* **Sinkronisasi Sesi:** `syncProgressFromSessions()` menyelaraskan halaman terakhir buku berdasarkan akumulasi sesi baca.

### 3.2. `ReadingSessionService.php`
* Mengelola siklus hidup timer baca: `startSession()`, `togglePause()`, dan `endSession()`.
* Menghitung durasi bersih dengan melacak `is_paused`, `paused_seconds`, dan `last_paused_at` sehingga jeda timer tidak terhitung sebagai waktu baca aktif.
* Menyediakan statistik per buku (`getBookStatistics`) termasuk kecepatan baca rata-rata (*pages per hour*).

### 3.3. `ExpenseService.php`
* Mengelola pencatatan transaksi pengeluaran buku (`createExpense`, `updateExpense`, `deleteExpense`, `duplicateExpense`).
* **Multi-Mata Uang:** `convertToBaseCurrency()` & `getExchangeRate()` mengonversi mata uang asing ke base currency `IDR` menggunakan `CurrencyRateService` dan menyimpan `amount_base_currency` serta `exchange_rate`.
* **Transaksi Berulang & Pengingat:** `processRecurringExpenses()` memproses pengeluaran periodik (`daily`, `weekly`, `monthly`, `yearly`) dengan relasi self-referential `parent_expense_id`; `sendPaymentReminders()` memantau jadwal tagihan.
* **Penyimpanan Bukti:** `uploadReceipt()` dan `getReceipt()` menyimpan lampiran struk dalam format base64 beserta MIME type dan nama file.

### 3.4. `BudgetService.php`
* Mengelola anggaran belanja buku (`daily`, `weekly`, `monthly`, `yearly`).
* `getBudgetProgress()` menghitung realisasi pengeluaran terhadap pagu anggaran aktif.
* `checkBudgetAlerts()` & `checkSingleBudgetAlert()` mendeteksi saat pemakaian anggaran melewati `alert_threshold` (default `80.00%`) dan memicu log pada `accounting_timeline_events`.
* `resetBudgetPeriod()` dan `deactivateExpiredBudgets()` menangani perputaran siklus anggaran.

### 3.5. `CurrencyRateService.php`
* Mengelola nilai tukar historis dan aktif (`getRate`, `setRate`, `bulkUpsertRates`, `getHistoricalRates`, `deactivateOldRates`).
* `syncLiveRates()` & `convertAmount()` menangani konversi presisi hingga 6 angka desimal (`decimal:6`).

---

## 4. Event-Driven Observer & Provider Macros

### 4.1. `BookObserver` (`app/Observers/BookObserver.php`)
Didaftarkan pada `AppServiceProvider::boot()` via `\App\Models\Book::observe(\App\Observers\BookObserver::class)`.
* **Event `saved`:**
  * Jika `$book->purchase_price > 0`, otomatis mencari atau membuat kategori `ExpenseCategory` bernama `"Book Purchases"` (dengan budget bulanan default `500000 IDR`), lalu melakukan `firstOrNew` pada `expenses` berdasarkan `book_id` dan `user_id`.
  * Jika `purchase_price` diubah menjadi `0` atau `null`, entri `Expense` terkait otomatis dihapus (`removeExpense`).
* **Event `deleted` & `forceDeleted`:** Menghapus atau menghapus permanen record `Expense` yang berelasi dengan buku tersebut.

### 4.2. Response Macros (`AppServiceProvider.php` & `app/Helpers/Response macros.php`)
* `Response::macro('success', fn ($data = null, $message = 'Success', $statusCode = 200) => ...)`
* `Response::macro('error', fn ($message = 'Error', $errors = null, $statusCode = 400) => ...)`

---

## 5. Daftar Model & Trait Utama (`app/Models/`)

| Model | Primary Key | Trait Utama | Relasi Kunci |
| :--- | :--- | :--- | :--- |
| `User` | `uuid` | `HasApiTokens`, `HasUuids`, `Notifiable` | `hasMany` Books, Shelves, Rooms, Expenses, Budgets |
| `Room` | `uuid` | `HasFactory`, `HasUuids` | `belongsTo` User, `hasMany` Shelves |
| `Shelf` | `uuid` | `HasFactory`, `HasUuids` | `belongsTo` User/Room, `hasMany` Books |
| `Book` | `uuid` | `HasFactory`, `SoftDeletes`, `HasUuids` | `belongsTo` User/Shelf, `belongsToMany` Collections, `hasMany` ReadingSessions/TimelineEvents/Expenses |
| `Collection` | `uuid` | `HasFactory`, `SoftDeletes` | `belongsTo` User, `belongsToMany` Books (`collection_book`) |
| `ReadingSession` | `uuid` | `HasFactory` | `belongsTo` Book/User |
| `TimelineEvent` | `uuid` | `HasFactory`, `HasUuids` | `belongsTo` Book |
| `Achievement` | `uuid` | `HasFactory`, `HasUuids` | `belongsToMany` Users (`user_achievements`) |
| `Expense` | `uuid` | `HasFactory`, `SoftDeletes`, `HasUuids` | `belongsTo` User/Book/ExpenseCategory, self `parent_expense_id` |
| `ExpenseCategory` | `uuid` | `HasFactory`, `SoftDeletes`, `HasUuids` | `belongsTo` User, `hasMany` Expenses/Budgets |
| `Budget` | `uuid` | `HasFactory`, `SoftDeletes`, `HasUuids` | `belongsTo` User/ExpenseCategory |
| `CurrencyRate` | `uuid` | `HasFactory`, `HasUuids` | Standalone rate lookup pair |
| `AccountingTimelineEvent` | `uuid` | `HasFactory`, `HasUuids` | `belongsTo` User/Expense |

*(Catatan: `Book.php` menggunakan nama kolom timestamp kustom `const CREATED_AT = 'date_added'` dan `const UPDATED_AT = 'last_modified'`.)*

---

## 6. Perintah Artisan & Pengujian

* **`php artisan accounting:sync-books`** (`app/Console/Commands/SyncBookExpensesCommand.php`):
  Melakukan sinkronisasi batch untuk seluruh buku existing yang memiliki `purchase_price > 0` ke tabel `expenses` pada kategori `"Book Purchases"`.
* **Testing & Code Quality (`composer.json`):**
  * `composer test`: Menjalankan `php artisan config:clear --ansi` diikuti `php artisan test` (PHPUnit `^11.5.50`).
  * `laravel/pint`: Code style fixer PSR-12 / Laravel preset.
  * `laravel/pail`: Tail log real-time saat development (`composer dev`).
