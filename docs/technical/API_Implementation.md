# Ringkasan Implementasi API MyBookshelf
## Status Sinkronisasi Backend & Frontend

> **Catatan:** Untuk daftar lengkap seluruh endpoint, aturan validasi, dan contoh payload resource v1, lihat dokumen utama di **[Spesifikasi RESTful API v1](../specifications/API_SPECIFICATION.md)**.

---

## 1. Status Implementasi Backend (`Laravel 12`)

* **Autentikasi SPA Stateful:** Menggunakan Laravel Sanctum (`EnsureFrontendRequestsAreStateful` pada `bootstrap/app.php`) dengan proteksi cookie sesi dan header `X-XSRF-TOKEN`.
* **13 API Controllers (`app/Http/Controllers/Api/V1/`):**
  * Inti Literasi: `AuthController`, `BookController`, `ShelfController`, `CollectionController`, `ReadingSessionController`, `StatisticsController`, `AchievementController`, `TimelineController`.
  * Sistem Akuntansi: `ExpenseController`, `ExpenseCategoryController`, `BudgetController`, `CurrencyController`, `AccountingReportController`.
* **5 Service Bisnis (`app/Services/`):** `BookService`, `ReadingSessionService`, `ExpenseService`, `BudgetService`, `CurrencyRateService`.
* **Otomatisasi Event-Driven:** `BookObserver` menyinkronkan harga pembelian buku (`purchase_price`) ke tabel `expenses` secara otomatis setiap buku disimpan atau dihapus.
* **Standarisasi JSON:** Menggunakan Response Macros (`response()->success()`, `response()->error()`) yang didaftarkan pada `AppServiceProvider` serta 5 Eloquent API Resources (`BookResource`, `ShelfResource`, `RoomResource`, `CollectionResource`, `BookCollection`).

---

## 2. Status Implementasi Frontend (`React 19 + TanStack Query v5`)

* **Client Wrapper (`frontend/src/lib/apiClient.ts`):** Singleton Axios dengan `withCredentials: true`, ekstraktor otomatis cookie `XSRF-TOKEN`, dan handler sesi expired `401`.
* **Domain API Modules (`frontend/src/lib/api/`):** `auth.ts`, `books.ts` (termasuk adapter `transformBook()`), `readingSessions.ts`, `statistics.ts`, `achievements.ts`, dan `accounting.ts`.
* **Caching & Hook Layer (`frontend/src/hooks/`):** Pembungkusan seluruh query dan mutasi di atas `queryClient` (`staleTime: 5 menit`, `gcTime: 10 menit`, `refetchOnWindowFocus: false`).

---

## 3. Verifikasi Endpoint Dasar

```bash
# 1. Health Check Backend
curl -H "Accept: application/json" http://localhost:8000/api/health

# 2. Alur SPA Cookie-Based (melalui browser / frontend Vite port 5173)
# Langkah 1: GET  http://localhost:8000/sanctum/csrf-cookie
# Langkah 2: POST http://localhost:8000/api/v1/auth/login
# Langkah 3: GET  http://localhost:8000/api/v1/books (mengirim cookie sesi otomatis)
```
