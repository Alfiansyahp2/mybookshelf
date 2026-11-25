# RESTful API Specification (v1)
## MyBookshelf Engineering Blueprint

Dokumen ini merupakan referensi kontrak lengkap **API v1** pada `routes/api.php`, mencakup mekanisme sesi Sanctum SPA, seluruh endpoint domain, aturan validasi payload, serta struktur respons JSON terstandardisasi.

---

## 1. Protokol Komunikasi & Pembungkus Respons

* **Base URL:** `http://localhost:8000/api` (rute sumber daya v1 menggunakan prefiks `/api/v1`)
* **Mekanisme Autentikasi SPA:** Cookie sesi terenkripsi (`laravel_session`) + proteksi CSRF (`GET /sanctum/csrf-cookie` -> header `X-XSRF-TOKEN` pada mutasi).
* **Format Respons Sukses (`Response::success`):**
  ```json
  {
    "success": true,
    "message": "Books retrieved successfully",
    "data": { ... }
  }
  ```
* **Format Respons Error (`Response::error`):**
  ```json
  {
    "success": false,
    "message": "Error summary",
    "errors": { "field": ["Validation message"] }
  }
  ```

---

## 2. Health, Autentikasi, & Profil Pengguna

| Metode | Path | Middleware | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/sanctum/csrf-cookie` | `web` | Inisialisasi cookie `XSRF-TOKEN` sebelum login/register |
| `GET` | `/api/health` | Publik | Mengembalikan `{ status: "ok", timestamp }` (ISO 8601) |
| `POST` | `/api/v1/auth/login` | `throttle:5,1` | Login sesi SPA (`email`, `password`, optional `remember`) |
| `POST` | `/api/v1/auth/logout` | `auth:sanctum` | Logout guard `web` dan invalidasi sesi |
| `GET` | `/api/v1/auth/me` | `auth:sanctum` | Mengambil data user terautentikasi (`id`, `name`, `email`, `created_at`) |
| `PUT` | `/api/v1/user/profile` | `auth:sanctum` | Update `name` & `email` (unik mengecualikan ID user) |
| `PUT` | `/api/v1/user/password` | `auth:sanctum` | Update password (`current_password`, `password` min 8 & `confirmed`) |

*(Catatan: `POST /api/v1/auth/register` tersedia di `AuthController::register`, namun sementara dinonaktifkan di `routes/api.php`.)*

---

## 3. Books & Reading Sessions (`/api/v1/books`)

Seluruh endpoint di bawah ini dilindungi middleware `auth:sanctum` dan kepemilikan user.

### 3.1. CRUD & Query Buku

| Metode | Path | Keterangan & Validasi Utama |
| :--- | :--- | :--- |
| `GET` | `/v1/books/purchase-history` | Histori pembelian buku (ditempatkan sebelum `apiResource` agar tidak bentrok dengan `{book}`) |
| `GET` | `/v1/books` | List buku user; query params: `status`, `favorite` (`boolean`), `search` (`max:50`) |
| `POST` | `/v1/books` | Tambah buku; wajib: `title`, `author`; opsional: `isbn` (`max:50`), `pages` (`min:1`), `format`, `height`, `thickness`, `status`, `spine_color_light/medium/dark` (hex regex), `purchase_price`, `purchase_currency` (3 char), `is_gift`, `shelf_id` (`exists:shelves,id`) |
| `GET` | `/v1/books/{book}` | Detail satu buku |
| `PUT`/`PATCH` | `/v1/books/{book}` | Update atribut buku |
| `DELETE` | `/v1/books/{book}` | Soft delete buku (`SoftDeletes`) dan sinkronisasi penghapusan expense via `BookObserver` |

### 3.2. Operasi Siklus Hidup & Aset Buku

| Metode | Path | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/v1/books/{book}/start` | Memulai membaca buku (`status -> reading`) |
| `POST` | `/v1/books/{book}/finish` | Menyelesaikan buku (`status -> finished`) |
| `POST` | `/v1/books/{book}/borrow` | Menandai buku sedang dipinjam (`borrowed_by`, `due_date`) |
| `POST` | `/v1/books/{book}/return` | Mencatat pengembalian buku pinjaman |
| `PATCH` | `/v1/books/{book}/progress` | Update halaman baca (`current_page >= 0`) dan kalkulasi ulang `progress` |
| `PATCH` | `/v1/books/{book}/favorite` | Toggle status `favorite` |
| `PATCH` | `/v1/books/{book}/notes` | Update `personal_notes` |
| `PATCH` | `/v1/books/{book}/rating` | Update `personal_rating` |
| `PATCH` | `/v1/books/{book}/shelf` | Memindahkan buku ke rak & posisi baru |
| `POST` | `/v1/books/{book}/cover` | Upload gambar sampul (`cover`: `image\|mimes:jpeg,jpg,png,webp\|max:5120`), disimpan ke disk `public/book-covers` |
| `GET` | `/v1/books/{book}/timeline` | Histori `timeline_events` untuk buku tersebut |
| `GET` | `/v1/books/{book}/expenses` | Daftar pengeluaran terkait buku |
| `GET` | `/v1/books/{book}/cost-breakdown` | Ringkasan biaya beli + biaya tambahan (`total_investment`) |

### 3.3. Sesi Membaca (`/reading-sessions`)

| Metode | Path | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/v1/books/{book}/reading-sessions/start` | Mulai timer sesi baca (`start_page`, `mood`, `location`) |
| `PATCH` | `/v1/books/{book}/reading-sessions/{session}/pause` | Toggle jeda timer (`is_paused: boolean`) |
| `PUT` | `/v1/books/{book}/reading-sessions/{session}/end` | Akhiri sesi (`end_page`, `notes`) dan sinkronkan progres buku |
| `GET` | `/v1/books/{book}/reading-sessions` | Ambil daftar sesi + statistik kecepatan baca (`pages_per_hour`) |
| `POST` | `/v1/books/{book}/read-again` | Mulai siklus baca ulang untuk buku yang sudah selesai |
| `GET/POST/PUT` | `/v1/reading-sessions` | Resource `index`, `show`, `store`, `update` |

---

## 4. Shelves, Collections, Statistics, & Achievements

| Domain | Metode | Path | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Shelves** | `PUT` | `/v1/shelves/layout` | Batch update urutan & lebar grid (`shelves.*.id` uuid, `order`, `span` 2–12) |
| **Shelves** | `CRUD` | `/v1/shelves` | List (eager load `room`, `books`), create (auto-assign room `"Main Room"`), show, update (`decorations` array), delete |
| **Shelves** | `GET` | `/v1/shelves/{shelf}/occupancy` | Mengembalikan `{ shelf_id, name, total, occupied, available, percentage }` |
| **Collections** | `CRUD` | `/v1/collections` | Manajemen koleksi buku kustom |
| **Collections** | `POST/DEL/PATCH`| `/v1/collections/{id}/books` | Tambah, hapus (`/{book}`), dan ubah urutan (`/{book}/order`) buku di koleksi |
| **Statistics** | `GET` | `/v1/statistics` | Overview buku, total waktu baca, dan `daily_activity` 365 hari terakhir (heatmap) |
| **Achievements**| `GET/POST` | `/v1/achievements` | `index`, `show`, serta `POST /v1/achievements/{id}/unlock` |

---

## 5. Sistem Akuntansi Lengkap (`/api/v1/accounting`)

| Sub-modul | Metode | Path | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Expenses** | `GET` | `/accounting/expenses/by-category`, `/total` | Agregasi pengeluaran per kategori & total nominal |
| **Expenses** | `CRUD` | `/accounting/expenses` | CRUD lengkap transaksi pengeluaran |
| **Expenses** | `POST/GET` | `/accounting/expenses/{id}/receipt` | Upload (base64) dan ambil bukti struk |
| **Expenses** | `POST` | `/accounting/expenses/{id}/duplicate` | Duplikasi entri transaksi |
| **Expenses** | `POST` | `/accounting/expenses/{id}/convert-currency` | Konversi mata uang transaksi ke target currency |
| **Expenses** | `POST` | `/accounting/expenses/{id}/mark-paid`, `/send-reminder` | Tandai lunas atau kirim pengingat pembayaran |
| **Categories** | `GET/POST` | `/accounting/categories/default`, `/initialize-defaults` | Ambil atau inisialisasi kategori default user |
| **Categories** | `CRUD` | `/accounting/categories`, `/{id}/statistics` | CRUD kategori + statistik pengeluaran per kategori |
| **Budgets** | `GET` | `/accounting/budgets/summary`, `/check-alerts`, `/top-spending-categories` | Ringkasan anggaran, cek threshold peringatan, & kategori boros |
| **Budgets** | `CRUD` | `/accounting/budgets` | CRUD anggaran belanja buku |
| **Budgets** | `GET/POST` | `/accounting/budgets/{id}/progress`, `/expenses`, `/reset-period`, `/performance-trends` | Progres budget, daftar transaksi, reset periode, & tren performa |
| **Currency** | `GET/POST` | `/accounting/currency/rates*` | `rates`, `rates/current`, `rates` (set), `rates/sync`, `rates/bulk-upsert`, `rates/historical`, `rates/deactivate-old` |
| **Currency** | `POST/GET` | `/accounting/currency/convert`, `/supported`, `/validate`, `/info` | Utilitas konversi & validasi kode mata uang ISO 4217 |
| **Reports** | `GET/POST` | `/accounting/reports/*` | `overview`, `expenses-by-category`, `expenses-by-period`, `budget-tracking`, `payment-methods`, `monthly-comparison`, `year-to-date`, `POST export` |

---

## 6. Contoh Bentuk Resource (`BookResource`)

Output `App\Http\Resources\Api\V1\BookResource` menggunakan format `snake_case` dan ISO 8601 untuk tanggal:

```json
{
  "id": "9f2a1d3e-...",
  "title": "Dune",
  "author": "Frank Herbert",
  "isbn": "9780441172719",
  "pages": 688,
  "format": "paperback",
  "spine_colors": ["#D4A574", "#8B5A2B", "#4A3B2F"],
  "height": "tall",
  "thickness": "thick",
  "status": "reading",
  "favorite": true,
  "current_page": 210,
  "progress": 30.52,
  "purchase_price": 185000.0,
  "purchase_currency": "IDR",
  "is_gift": false,
  "shelf_id": "9f2a1d10-...",
  "position": 2,
  "date_added": "2026-07-02T10:15:00+00:00",
  "last_modified": "2026-11-11T09:20:00+00:00"
}
```
