# Roadmap Implementasi Bertahap (*Phase 0 – Phase 6*): Arsitektur & Kesiapan Produksi MyBookshelf

Dokumen ini memecah keseluruhan rancangan pada **[Stage 1: Architecture & Foldering Audit Plan](ARCHITECTURE_FOLDERING_AUDIT_PLAN.md)** dan **[Stage 2: Production Architecture Masterplan](PRODUCTION_ARCHITECTURE_MASTERPLAN.md)** menjadi **7 fase implementasi berurutan (`Phase 0` s.d. `Phase 6`)**.

Setiap fase dirancang agar:
- Dapat dikirim sebagai **1–2 Pull Request kecil yang aman (*incremental, reviewable PRs*)** tanpa *big-bang rewrite*.
- Mempertahankan aplikasi tetap bisa dibangun & dijalankan di akhir setiap fase.
- Memiliki **Entry Criteria (Prasyarat)**, **Peta Pekerjaan Konkret**, **Strategi Kompatibilitas**, dan **Exit Gate (Verifikasi Wajib)**.

---

## Ringkasan Peta Fase (*Execution Overview*)

```text
[Phase 0] Hygiene, Lockfile, Build Unification & Migration Cleanup
    │
    ▼
[Phase 1] Backend Route Split, Domain Foldering, Policies & FormRequests
    │
    ▼
[Phase 2] Backend Service Extraction, Currency Fix & Full API Resources
    │
    ├──────────────────────────────────────────────────────────────┐
    ▼                                                              ▼
[Phase 3] Frontend Vertical-Slice Foldering               (Dapat mulai paralel setelah
          & Strict Boundary / Zero-`any`                   Phase 2 kunci kontrak Resource)
    │                                                              │
    └──────────────────────────────┬───────────────────────────────┘
                                   ▼
[Phase 4] Data Scaling: Pagination, SQL Dashboard Aggregation & Decoupled Layout
                                   │
                                   ▼
[Phase 5] Production Hardening: S3/R2 Storage, Queues, Auth Security & OpenAPI
                                   │
                                   ▼
[Phase 6] Automated Testing Pyramid, Observability, CI Strict Gates & Cutover
```

| Fase | Fokus Utama | Estimasi PR | Risiko Regresi | Prasyarat |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 0** | Repo Hygiene, Dual Vite Cleanup & Migrasi Bersih | `1–2 PR` | Rendah | Baseline repo saat ini |
| **Phase 1** | Backend Route Modular, Policies & FormRequests | `2 PR` | Rendah–Sedang | Phase 0 selesai |
| **Phase 2** | Pecah God Controller, Services & API Resources | `2–3 PR` | Sedang | Phase 1 selesai |
| **Phase 3** | Frontend Feature Slices (`features/*`) & `0` `any` | `3–4 PR` | Sedang | Kontrak Resource Phase 2 stabil |
| **Phase 4** | Paginasi Server-Side, Agregasi SQL & Lepas `AppLayout` | `2 PR` | Sedang–Tinggi | Phase 2 & Phase 3 selesai |
| **Phase 5** | Object Storage S3/R2, Queue Worker & Security Hardening | `2–3 PR` | Tinggi | Phase 4 selesai |
| **Phase 6** | Testing Pyramid (PHPUnit/Vitest/Playwright), Sentry & CI/CD | `2 PR` | Rendah | Phase 5 selesai |

---

## Phase 0 — Repo Hygiene, Lockfile & Penyatuan Sistem Build

**Tujuan:** Membersihkan seluruh artefak yatim, skrip ad-hoc, dead code, dan dual build pipeline sehingga pondasi repositori bersih dan deterministik sebelum memindahkan kode.

### Prasyarat
- Baseline terverifikasi: `php artisan test --compact` (`17 passed`), `oxlint` (`0 warnings`), dan `vite build` lulus.

### Ruang Lingkup Pekerjaan
1. **Pembersihan Artefak Non-Kode & Skrip Ad-Hoc:**
   - Hapus file sementara di root: `backup.sql`, `gamma_assets.html`, `gamma_prompt.html`, `remove_bg.py`, `remove_bg_rembg.py`.
   - Hapus skrip maintenance di `frontend/`: `add_seo.py`, `fix_dots.py`, `update_achievements.py`, `update_translations.py`.
2. **Hapus Dead Code & Dependency Frontend Tak Terpakai:**
   - Hapus `frontend/src/App.css`, `frontend/src/utils/mockData.ts` (serta folder `src/utils/` sementara hingga formatter baru dibuat di Phase 3), `frontend/src/pages/RegisterComingSoon.tsx`, dan `frontend/src/components/auth/RegisterForm.tsx` (kecuali alur registrasi langsung diaktifkan pada Phase 5).
   - Uninstall paket tak terpakai di `frontend/package.json`: `zod` dan `react-hook-form`.
3. **Deterministik Dependency Lockfile:**
   - Hapus baris pengabaian `composer.lock` pada `.gitignore:73` dan commit `composer.lock` agar `composer install` identik di lokal, CI, dan production.
4. **Penyatuan Build Frontend (Hentikan Dual Vite/Tailwind):**
   - Putuskan `frontend/` (Vite `^8.1.0` + Tailwind `^3.4.19`) sebagai satu-satunya build frontend resmi.
   - Ubah script `dev` di `composer.json` dari `npm run dev` menjadi `npm --prefix frontend run dev`.
   - Hapus/arsipkan sistem build duplikat di root (`package.json`, `package-lock.json`, `vite.config.js`, `resources/js/`, `resources/css/`), ubah `routes/web.php` `/` agar mengembalikan JSON status API ringkas (`{"service":"mybookshelf-api","status":"ok"}`), serta konsolidasikan konfigurasi deployment menjadi **satu `vercel.json`** aktif di root (atau `frontend/` sesuai target proyek Vercel).
5. **Pemisahan DDL vs Seed Data pada Migrasi:**
   - Ekstrak data sample dan hardcoded user UUID `'019f21d5-ef05-731a-98ff-4713b284ea7f'` dari `database/migrations/2026_07_09_000006–000008` ke Seeder idempoten di `database/seeders/` agar `php artisan migrate` di CI dan production murni menjalankan DDL skema.

### Exit Gate (Verifikasi Wajib Phase 0)
- `git status` bersih dari skrip `.py`, `.html`, `.sql`.
- `composer.lock` ter-track di Git (`git ls-files composer.lock`).
- Fresh DB: `php artisan migrate:fresh --seed` berhasil pada PostgreSQL tanpa bergantung pada UUID user tertentu.
- `php artisan test --compact` dan `cd frontend && npm run lint && npm run build` tetap lulus penuh.

---

## Phase 1 — Konsolidasi Route Backend, Pembersihan `Room`, `Policy` & `FormRequest`

**Tujuan:** Merapikan entry routing `routes/api.php`, memutus ketergantungan pada domain yatim `Room`, serta mengganti validasi inline dan cek otorisasi manual menjadi standar Laravel (`Policy` + `FormRequest`).

### Prasyarat
- Phase 0 selesai.

### Ruang Lingkup Pekerjaan
1. **Modularisasi File Route (`routes/api/v1/`):**
   - Pecah `routes/api.php` (`183` baris) ke file per domain:
     - `routes/api/v1/auth.php`
     - `routes/api/v1/library.php` (satukan blok `/v1/books` yang terpisah di `baris 52–59` dan `baris 62–85`)
     - `routes/api/v1/reading.php` (satukan endpoint `/reading-sessions` dan putuskan kanonikal endpoint agar tidak duplikat dengan `/books/{book}/reading-sessions/*`)
     - `routes/api/v1/analytics.php`
     - `routes/api/v1/accounting.php`
   - Ubah `Route::fallback` pada `routes/api.php:178` menjadi `Route::any('{any}', ...)` agar `POST/PUT/PATCH/DELETE` ke path tak dikenal selalu mengembalikan JSON `404`.
2. **Perbaiki Helper PSR-4:**
   - Ganti nama `app/Helpers/Response macros.php` menjadi `app/Helpers/ResponseMacros.php` (atau hapus class mixin duplikat bila tidak diperlukan IDE helper).
3. **Lepaskan Ketergantungan Domain Yatim `Room` (*Expand Step*):**
   - Hapus logika `Room::firstOrCreate(['name' => 'Main Room'])` pada `ShelfController::store()` serta hapus eager loading `with(['room', ...])`.
   - Buat migrasi *Expand* yang menjadikan kolom `shelves.room_id` nullable & lepaskan foreign key constraint (drop kolom & tabel `rooms` dijadwalkan di Phase 6 setelah deploy aman).
   - Hapus `app/Models/Room.php`, `app/Http/Resources/Api/V1/RoomResource.php`, `database/seeders/RoomSeeder.php`, dan referensi `Room` di `DatabaseSeeder.php`.
4. **Implementasi `app/Policies/` & `app/Http/Requests/Api/V1/`:**
   - Buat Policy untuk kepemilikan `user_id`: `BookPolicy`, `ShelfPolicy`, `CollectionPolicy`, `ReadingSessionPolicy`, `ExpensePolicy`, `ExpenseCategoryPolicy`, `BudgetPolicy`.
   - Ekstrak seluruh `$request->validate(...)` inline dan `$this->ownedRule(...)` ke kelas `FormRequest` per endpoint mutasi/filter di bawah `app/Http/Requests/Api/V1/{Auth,Library,Reading,Accounting}/`.
   - Hilangkan pola query ganda `$this->bookService->getBook($id, $userId)` di `BookController` dengan memanfaatkan Route Model Binding + `$this->authorize(...)`.

### Exit Gate (Verifikasi Wajib Phase 1)
- `php artisan route:list` memverifikasi pengelompokan route bersih dan fallback aktif untuk seluruh HTTP verb.
- Tambahan feature test PHPUnit memastikan akses lintas-user (*Cross-Tenant IDOR*) pada seluruh resource (`Book`, `Shelf`, `Collection`, `ReadingSession`, `Expense`, `Budget`, `ExpenseCategory`) mengembalikan HTTP `403` atau `404` secara konsisten.

---

## Phase 2 — Dekomposisi God Controller, Service Layer & Kelengkapan `ApiResource`

**Tujuan:** Memecah controller gemuk ke folder domain `Api\V1\<Domain>`, memindahkan logika bisnis dari controller ke `Service`, memperbaiki konversi mata uang hardcoded, serta menstandarkan seluruh output JSON melalui `ApiResource`.

### Prasyarat
- Phase 1 selesai (`Policy` & `FormRequest` terpasang).

### Ruang Lingkup Pekerjaan
1. **Reorganisasi Controller ke Sub-Folder Domain:**
   - `System/HealthController.php` (pindahkan logika `/api/health` dari closure `routes/api.php`)
   - `Auth/AuthController.php` & `Auth/ProfileController.php` (pisahkan `/user/profile` & `/user/password`)
   - Pecah `BookController.php` (`592` baris) menjadi controller single-responsibility:
     - `Library/BookController.php` (CRUD inti, favorite, notes, rating, shelf move)
     - `Library/BookCoverController.php` (upload/delete cover)
     - `Library/BookLoanController.php` (`borrow`, `returnBook`)
     - `Library/BookCostController.php` (`purchaseHistory`, `costBreakdown`, `expenses`)
     - `Library/BookTimelineController.php` (eks `TimelineController`)
     - `Library/ShelfController.php` & `Library/CollectionController.php`
   - `Reading/BookReadingController.php` (`start`, `finish`, `updateProgress`, `readAgain`) & `Reading/ReadingSessionController.php`
   - `Analytics/StatisticsController.php` & `Analytics/AchievementController.php`
   - `Accounting/{Expense,ExpenseCategory,Budget,Currency,AccountingReport}Controller.php`
2. **Ekstraksi Service Layer yang Hilang:**
   - Buat `ShelfService`, `CollectionService`, `StatisticsService`, `AchievementService`, `ExpenseCategoryService`, `AccountingReportService` (memindahkan 8 query laporan dari `AccountingReportController.php` `476` baris ke service), `BookLoanService`, `BookCostService`, dan `ProfileService`.
   - **Perbaikan Bisnis Kritis:** Ganti hardcode `$amountInIdr = $book->purchase_price * 15000` pada `BookController::getPurchaseHistory()` dengan pemanggilan ke `CurrencyRateService`.
3. **Standarisasi `app/Http/Resources/Api/V1/<Domain>/`:**
   - Tambahkan `UserResource`, `ReadingSessionResource`, `AchievementResource`, `StatisticsResource`, `TimelineEventResource`, `ExpenseResource`, `ExpenseCategoryResource`, `BudgetResource`, dan `CurrencyRateResource` sambil memindahkan `Book`, `BookCollection`, `Collection`, dan `Shelf` ke sub-folder `Library/`.
   - Pertahankan *field names* JSON yang dipakai Frontend agar tidak memutus SPA sebelum Phase 3/4 selesai.

### Exit Gate (Verifikasi Wajib Phase 2)
- Tidak ada controller melebihi ~`200` baris atau berisi query Eloquent kompleks langsung.
- Seluruh PHPUnit test (lama + unit test service baru untuk `CurrencyRateService`/`BookCostService`/`AccountingReportService`) lulus 100%.
- Frontend SPA berjalan normal melawan backend yang baru direorganisasi tanpa error kontrak JSON.

---

## Phase 3 — Restrukturisasi Frontend (*Vertical-Slice Feature Architecture*) & `0` Tipe `any`

**Tujuan:** Menyusun ulang seluruh `207` file di bawah `frontend/src/` menjadi fitur yang terisolasi (`features/*` + `shared/*` + `app/`), memecah halaman besar (`Reading` `957`, `Collections` `640`, `BorrowLoan` `581`, `Achievements` `464`), dan menghilangkan utang TypeScript (`42` tipe `any`).

### Prasyarat
- Struktur API Phase 2 stabil (disarankan dikerjakan per fitur menjadi 3–4 PR bertahap).

### Ruang Lingkup Pekerjaan (Urutan Migrasi Aman per Slice)
1. **PR 3.1 — Fondasi `app/`, `shared/` & Alias Path:**
   - Tambahkan alias `@app/*`, `@shared/*`, `@features/*` di `frontend/tsconfig.app.json` dan `frontend/vite.config.ts`.
   - Siapkan `shared/api/apiClient.ts`, `shared/api/queryKeys.ts` (typed query key factory), `shared/components/ui/`, `shared/components/layout/`, `shared/constants/appPalettes.ts`, `shared/store/useThemeStore.ts`, `shared/store/useNotificationStore.ts` (dipindah dari `hooks/useNotifications.ts`), dan `shared/utils/` (formatter mata uang/tanggal).
2. **PR 3.2 — Slice `landing/`, `auth/`, `accounting/`, & `settings/`:**
   - Pindahkan `LandingPage`, `LandingBookDetail`, `components/landing/*`, dan `DemoBookDetailModal.tsx` (dari `components/modals/`) ke `features/landing/`.
   - Pindahkan `Login.tsx`, `useAuth.ts`, `auth.api.ts`, dan `components/auth/*` ke `features/auth/`.
   - Pindahkan modul `accounting` (halaman, `accounting.ts`, `accounting.api.ts`, `hooks/accounting/*`, `components/accounting/*`) ke `features/accounting/`.
   - Pindahkan `Settings.tsx` dan `components/settings/*` ke `features/settings/`.
   - Pindahkan `CatchAll.tsx` ke `app/router/`.
3. **PR 3.3 — Slice `reading/` & `analytics/` + Pemecahan Halaman Besar:**
   - Pecah `Reading.tsx` (`957` baris) menjadi `features/reading/pages/ReadingPage.tsx` (`<250` baris) + sub-komponen di `features/reading/components/` (`ReadingSessionTimer`, `FinishedBooksShelf`, `ActiveReadingCard`, `YearlyTargetCards`, `ReadingCalendarModal`).
   - Satukan `Dashboard`, `Statistics.tsx` (`381` baris -> pecah komponen chart Recharts ke `features/analytics/components/statistics/`), dan `Achievements.tsx` (`464` baris -> pecah ke `features/analytics/components/achievements/`) ke dalam `features/analytics/`.
4. **PR 3.4 — Slice `library/`, Eliminasi Anti-Pattern Navigasi & Zero-`any`:**
   - Pindahkan `books`, `shelves`, `collections`, `wishlist`, `borrow-loan`, `notes`, dan `explore` ke `features/library/`.
   - Pisahkan `shelves.api.ts` dan `collections.api.ts` dari `hooks/useShelves.ts` & `hooks/useCollections.ts` ke `features/library/api/` (hentikan import lintas-layer `transformBook` di dalam hook).
   - Pindahkan `WishlistCard.tsx` dari `components/assets/` -> `features/library/components/wishlist/`, dan `book-animation/` -> `features/library/components/animations/`.
   - Pecah `Collections.tsx` (`640`), `BorrowLoan.tsx` (`581`), `Notes.tsx` (`355`), `Library.tsx` (`401`) menjadi komposisi halaman + sub-komponen domain.
   - Ganti `window.location.href` di `ExploreLibrary.tsx` menjadi `useNavigate()`, pindahkan `<SEO>` keluar dari kondisi `isLoading`, dan ganti `window.CustomEvent` di `AppLayout.tsx` ke state `useBookstore`.
   - Hilangkan seluruh `42` penggunaan `: any` / `as any`, aktifkan rule larangan `no-explicit-any` + boundary lint antar-fitur (`features/A` dilarang mengimpor internal `features/B`).

### Exit Gate (Verifikasi Wajib Phase 3)
- `rg "\bany\b"` pada tipe eksplisit di `frontend/src` = `0`.
- `cd frontend && npm run lint` (`0 warnings, 0 errors`), `npx tsc --noEmit`, `npm run build` lulus.
- Entry chunk `index-*.js` tetap `< 70 kB` gzip; `vendor-charts` tidak dimuat di `/landing` maupun `/library`.

---

## Phase 4 — Skalabilitas Data, Server-Side Pagination & Decoupling `AppLayout`

**Tujuan:** Menghapus bottleneck paling kritis menuju produksi—yaitu penarikan seluruh database buku user (`$withPagination = false` & `AppLayout` memanggil `useAchievementTracker` -> `useBooks()`)—serta mengoptimalkan kueri PostgreSQL + Redis cache.

### Prasyarat
- Phase 2 (Service + Resource Backend) dan Phase 3 (Query Key Factory & Feature Slices Frontend) selesai.

### Ruang Lingkup Pekerjaan
1. **Wajib Paginasi Server-Side pada `/api/v1/books`:**
   - Ubah default `BookController::index` menjadi terpaginasi (`per_page=24`, max `100`) melalui `BookCollection`.
   - Lengkapi parameter filter server-side yang dipetakan oleh `BookFilterData` DTO: `status`, `shelf_id`, `favorite`, `is_returned`, `borrowed_by`, `has_notes`, `genre`, `year`, dan `search`.
   - Tambahkan filter query pada hook `useBooks` di Frontend agar halaman `Library`, `Wishlist`, `BorrowLoan`, `Notes`, dan `Reading` hanya meminta irisan data yang diperlukan.
2. **Endpoint Agregasi Dashboard & Redis Cache:**
   - Tambahkan `GET /api/v1/analytics/dashboard` (`DashboardSummaryData`) yang menghitung ringkasan KPI, distribusi status, top genres, top authors, target tahunan, dan heatmap kalender langsung melalui agregasi SQL PostgreSQL.
   - Cache hasil agregasi di **Redis** per `user_id`, dan invalidasi via Event/Observer (`BookFinished`, `BookSaved`, `ReadingSessionCompleted`, `ExpenseUpdated`).
   - Migrasikan `useDashboardStats.ts` dan `useYearlyStats.ts` di Frontend dari kalkulasi array buku di browser menjadi pembaca endpoint agregasi backend.
3. **Indeks Komposit & Pencarian `pg_trgm` PostgreSQL:**
   - Buat migrasi indeks komposit:
     - `books`: `(user_id, status, date_added)`, `(user_id, shelf_id, position)`, `(user_id, favorite)`, `(user_id, is_returned, due_date)`.
     - `reading_sessions`: `(user_id, started_at)`, `(book_id, status)`.
     - `expenses`: `(user_id, category_id, expense_date)`, `(user_id, book_id)`.
   - Aktifkan ekstensi PostgreSQL `pg_trgm` + indeks GIN pada `books(title)` & `books(author)` untuk akselerasi `ILIKE`.
4. **Lepaskan Coupling Global `AppLayout` & Dual Achievement Store:**
   - Hentikan pemanggilan `useShelves()`, `useBook()`, dan `useAchievementTracker()` dari `AppLayout.tsx`.
   - Arahkan `SearchBar` header memakai debounced query `/api/v1/books?search=...&per_page=8` hanya ketika dropdown pencarian aktif.
   - Hentikan `useAchievementStore` (`localStorage`): jadikan Backend event listener (`EvaluateUserAchievements`) sebagai satu-satunya sumber kebenaran saat buku selesai atau reading session berakhir.

### Exit Gate (Verifikasi Wajib Phase 4)
- Network trace halaman `/accounting` dan `/settings` menunjukkan **0 request** ke `/api/v1/books` full dump.
- `EXPLAIN ANALYZE` pada PostgreSQL dengan seed `5.000+` buku per user menunjukkan penggunaan Index Scan / Bitmap Index Scan (`< 50ms`).
- Seluruh fitur UI (Dashboard, Reading, Notes, BorrowLoan, Wishlist, Achievements) tetap akurat memakai data server terpaginasi/teragregasi.

---

## Phase 5 — Production Hardening: S3/R2 Media Storage, Queue Worker, Security & OpenAPI

**Tujuan:** Menyiapkan backend agar **stateless** (aman dijalankan multi-container), memindahkan beban sinkron ke queue worker, menutup celah konfigurasi keamanan, dan mengunci kontrak API otomatis.

### Prasyarat
- Phase 4 selesai.

### Ruang Lingkup Pekerjaan
1. **Abstraksi Media Storage ke S3 / Cloudflare R2:**
   - Implementasikan `MediaStorageInterface` dan ubah `BookCoverController` serta `ExpenseController` (`uploadReceipt`/`getReceipt`) menggunakan disk konfigurasi `FILESYSTEM_MEDIA_DISK=s3` (bukan `public` lokal).
   - Simpan **hanya relative object key** pada kolom `books.cover_image` & `expenses.receipt_path` (hapus konstruksi `request()->getSchemeAndHttpHost()`), serta buat migrasi backfill data URL lama -> key relatif.
   - `BookResource` menyusun URL publik/CDN secara dinamis; `getReceipt` menghasilkan **temporary signed URL (`5 menit`)** setelah verifikasi `ExpensePolicy`.
   - Nonaktifkan/blokir route ekspos `storage.local.upload` (`PUT storage/{path}`) pada konfigurasi production.
2. **Asynchronous Jobs (`ShouldQueue`) & Scheduler:**
   - Buat `ProcessBookCoverJob` (validasi MIME magic-bytes, strip EXIF, resize WebP).
   - Ubah `AccountingReportController::export` menjadi async via `ExportAccountingReportJob` (`202 Accepted` + status/signed download URL).
   - Buat `SyncCurrencyRatesJob` + `SyncCurrencyRatesCommand` terjadwal di `routes/console.php`, serta `SendBudgetAlertJob` dan event-driven `EvaluateUserAchievements`.
3. **Hardening Auth, Session, CORS, Rate Limiter & `/register`:**
   - Set `'expiration' => env('SANCTUM_TOKEN_EXPIRATION', 10080)` di `config/sanctum.php`.
   - Perketat `CORS_ALLOWED_ORIGINS` & `SANCTUM_STATEFUL_DOMAINS`, aktifkan `SESSION_ENCRYPT=true` dan `APP_DEBUG=false` di template deployment produksi (`.env.production.example`).
   - Definisikan named `RateLimiter` di `AppServiceProvider`: `auth` (`5/min`), `api` (`120/min/user`), `uploads` (`15/min/user`), `exports` (`5/min/user`).
   - Finalisasi `/register`: implementasikan registrasi lengkap (validasi + default categories seeding + email verification + `throttle:3,10`) ATAU hapus rute `/register` sepenuhnya dari UI & Router.
4. **Kontrak OpenAPI & Ketahanan Runtime Frontend:**
   - Pasang `dedoc/scramble` di Backend + script generator `openapi-typescript` ke `frontend/src/shared/api/schema.d.ts`.
   - Pasang `RouteErrorBoundary` + `QueryErrorResetBoundary` di setiap fitur router Frontend dan teruskan `AbortSignal` pada `apiClient`.

### Exit Gate (Verifikasi Wajib Phase 5)
- `php artisan test` lulus memakai `Storage::fake('s3')` dan `Queue::fake()` untuk skenario upload cover, receipt signed URL, export CSV/PDF, dan sync kurs.
- Uji keamanan memverifikasi tidak ada stack trace di response `500` ketika `APP_DEBUG=false`, rate limiter membalas `429`, dan token Sanctum kedaluwarsa sesuai konfigurasi.
- Generate OpenAPI & `tsc --noEmit` sinkron tanpa drift antara API Resource dan tipe Frontend.

---

## Phase 6 — Automated Testing Pyramid, Observability, CI Strict Gates & Production Cutover

**Tujuan:** Mengunci kualitas dengan otomasi pengujian di semua layer (termasuk Frontend yang saat ini belum punya tes), memasang observabilitas penuh, memperketat CI/CD, dan mengeksekusi cutover deployment produksi secara aman.

### Prasyarat
- Phase 5 selesai dan lingkungan staging tersedia (PostgreSQL 15 + Redis + S3/R2 + Edge Preview).

### Ruang Lingkup Pekerjaan
1. **Lengkapi Piramida Pengujian:**
   - **Backend Static & Security:** Tambahkan konfigurasi **Larastan (PHPStan Level 6+)** dan `composer audit`.
   - **Backend Feature Suite:** Lengkapi cakupan PHPUnit menjadi >= 80% pada domain inti (matrix auth `401/403`, edge case konversi kurs presisi desimal, rollback transaksi DB, Queue & Storage).
   - **Frontend Unit & Component Tests:** Tambahkan **Vitest + React Testing Library + MSW** untuk menguji hooks (`useBooks`, `useBudgets`, `useYearlyStats`), stores (`useThemeStore`, `useBookstore`), komponen form/modal kritis (`LoginForm`, `BookDetailModal`, `ExpenseModal`), dan utility formatter.
   - **E2E Suite:** Tambahkan **Playwright** untuk minimal 6–8 alur kritis (Login -> Buat Rak & Buku -> Drag/Move Buku -> Sesi Baca & Progress -> Catat Expense & Cek Alert Budget -> Ubah Bahasa & Palet Warna + Reload).
2. **Observability & Probe Infrastruktur:**
   - Bedakan liveness probe `/up` (ringan, tanpa koneksi DB/Redis) dengan readiness probe `/api/health` (`ReadinessChecker`: validasi PostgreSQL, Redis, dan S3/R2 tanpa membocorkan kredensial).
   - Pasang middleware `AttachRequestId` (`X-Request-Id`), structured JSON logging (`stderr`), serta **Sentry Backend & Frontend** dengan release tagging commit SHA.
3. **CI/CD Pipeline Ketat (`.github/workflows/ci.yml`):**
   - Wajibkan job: `pint --test` + `phpstan analyse` + `composer audit` + `php artisan migrate --force` + `php artisan test --parallel` + `oxlint --deny-warnings` + `tsc --noEmit` + `vitest` + `vite build` + pengecekan budget ukuran bundle + `playwright test`. Nol toleransi `continue-on-error`.
4. **DB Final Contract & Cutover Runbook:**
   - Jalankan migrasi *Contract Step* untuk men-drop kolom `shelves.room_id` dan tabel `rooms` setelah 100% instance memakai kode baru.
   - Siapkan topologi terpisah (Stateless API container + Queue worker + Cron scheduler + Managed PostgreSQL 15 + Redis 7 + S3/R2 + Vercel/Cloudflare Edge SPA).
   - Jalankan verifikasi pre-deploy snapshot PostgreSQL -> `migrate --force` -> `config:cache`/`route:cache` -> `queue:restart` -> uji smoke staging terhadap seluruh item **Checklist Kesiapan Produksi** di [PRODUCTION_ARCHITECTURE_MASTERPLAN.md](PRODUCTION_ARCHITECTURE_MASTERPLAN.md#7-checklist-kesiapan-produksi-production-release-gate-scorecard).

### Exit Gate (Verifikasi Wajib Phase 6 — Go-Live Release Gate)
- Seluruh pipeline CI/CD (Pint, Larastan, PHPUnit, `oxlint`, `tsc`, Vitest, Vite Build, Playwright E2E) **100% Hijau**.
- Staging soak test & kesiapan readiness `/api/health` terverifikasi `200 OK`, error tracking Sentry menerima event uji dengan `request_id` lengkap, dan simulasi rollback container + DB snapshot teruji.
- Seluruh 5 kategori pada *Production Release Gate Scorecard* berstatus **PASS**.
