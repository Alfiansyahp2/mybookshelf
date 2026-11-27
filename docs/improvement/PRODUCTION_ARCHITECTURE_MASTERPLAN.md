# Masterplan Arsitektur & Kesiapan Produksi MyBookshelf (Tahap 2)

**Landasan:** Dokumen ini dibangun langsung di atas arsitektur terstruktur Tahap 1 ([ARCHITECTURE_FOLDERING_AUDIT_PLAN.md](ARCHITECTURE_FOLDERING_AUDIT_PLAN.md) — *Domain-Grouped Backend* + *Vertical-Slice Feature Frontend*) untuk menyempurnakan seluruh sistem menjadi arsitektur **siap produksi (*Production-Grade*)** yang aman, terukur performanya, tahan beban kerja, terobservasi penuh, dan tervalidasi otomatis sebelum rilis.

---

## 1. Evolusi Arsitektur: Dari Tahap 1 ke Tahap 2

Tahap 1 menyelesaikan kerapian kode, batas modul domain, penghapusan artefak yatim, dan penataan foldering di seluruh route. Tahap 2 menambahkan **6 pilar rekayasa produksi** tepat di atas struktur folder Tahap 1 tersebut:

| Pilar Produksi | Pondasi di Tahap 1 | Penyempurnaan Arsitektur di Tahap 2 |
| :--- | :--- | :--- |
| **1. Data Scaling & Contract** | Pemisahan `Service` & `ApiResource` per domain | Hilangkan `fetch all` buku (`$withPagination = false`), standarkan cursor/page pagination, agregasi SQL server-side, dan OpenAPI contract generation. |
| **2. Storage & Asynchronous Processing** | Ekstraksi `BookCoverController` & `AccountingReportController` | Ganti disk lokal + hardcoded host URL ke Object Storage (S3/R2) + relative key; pindahkan export laporan, sync kurs, reminder, & achievement eval ke Queue Worker (`ShouldQueue`). |
| **3. Security & Auth Governance** | Sentralisasi `Policies/` & `FormRequests/` | TTL token Sanctum eksplisit, hardening session/cookie/CSRF/CORS, sanitasi upload gambar, `Route::any` JSON fallback seragam, dan konfigurasi `APP_DEBUG=false`. |
| **4. Frontend Resilience & Boundaries** | Struktur `features/*` + `shared/*` | Batas impor antar-fitur tervalidasi di linter, per-route `ErrorBoundary`, query invalidation granular berbasis `queryKeys` factory, `0` tipe `any`, serta penghapusan dual Vite/Tailwind root. |
| **5. Testing Pyramid & CI Quality Gate** | `17` PHPUnit feature test + `oxlint`/`tsc`/`vite build` | Tambahkan Larastan/PHPStan, audit kerentanan paket, suite Vitest + Testing Library (hooks & komponen), serta E2E Playwright untuk alur kritis. |
| **6. Observability & Deployment Topology** | Pemisahan rute `/up` & `/api/health` | Topologi container stateless (API, Worker, Scheduler, PostgreSQL, Redis, S3/R2, Edge SPA), readiness probe terukur, JSON structured log + `request_id`, Sentry, serta zero-downtime migration runbook. |

---

## 2. Arsitektur Produksi Backend (Laravel 12 + PostgreSQL 15 + Redis)

### 2.1 Penambahan Struktur Infrastruktur Produksi (`app/`)

Melanjutkan struktur folder Tahap 1, lapisan infrastruktur berikut ditambahkan tanpa mencampur logika HTTP maupun domain:

```text
app/
├── Console/Commands/
│   └── SyncCurrencyRatesCommand.php       # Jadwal harian sync kurs tanpa ketergantungan HTTP endpoint
├── Contracts/                             # Interface untuk decoupling infrastruktur
│   ├── MediaStorageInterface.php          # Abstraksi S3/R2 vs disk lokal dev
│   └── ExchangeRateProviderInterface.php  # Adapter API kurs eksternal
├── DataTransferObjects/                   # Typed DTO antar Controller/Request -> Service -> Job
│   ├── Library/BookFilterData.php
│   ├── Analytics/DashboardSummaryData.php
│   └── Accounting/ReportExportData.php
├── Events/                                # Domain events untuk decoupling antar-modul
│   ├── BookFinished.php                   # Memicu evaluasi achievement & update statistik cache
│   ├── BookPurchased.php                  # Memicu sinkronisasi Expense via listener/observer
│   └── ReadingSessionCompleted.php
├── Listeners/
│   ├── EvaluateUserAchievements.php       # Pindahkan engine achievement 100% ke server
│   └── InvalidateAnalyticsCache.php
├── Jobs/                                  # Pekerjaan asinkron (ShouldQueue -> Redis queue)
│   ├── Accounting/
│   │   ├── ExportAccountingReportJob.php  # Generate CSV/PDF di background & simpan URL sementara
│   │   ├── SendBudgetAlertJob.php
│   │   └── SyncCurrencyRatesJob.php
│   └── Library/
│       └── ProcessBookCoverJob.php        # Strip EXIF metadata, resize WebP, upload ke S3/R2
├── Http/Middleware/
│   ├── AttachRequestId.php                # Inject X-Request-Id & log context ke seluruh request
│   └── ForceJsonResponse.php              # Konsisten pada rute /api/*
└── Support/
    └── Health/                            # Probe readiness (DB, Redis, Storage)
        └── ReadinessChecker.php
```

### 2.2 Optimasi Kinerja Database & Penghapusan Bottleneck Skala

1. **Hentikan *Unpaginated Library Dump* ke Client:**
   - Saat ini `BookController::index` mengirim seluruh koleksi buku tanpa paginasi (`$withPagination = false`) agar `useDashboardStats.ts`, `useYearlyStats.ts`, `useAchievementTracker.ts`, `Library.tsx`, `BorrowLoan.tsx`, `Notes.tsx`, dan `Wishlist.tsx` dapat memfilter di memori browser.
   - **Desain Produksi:**
     - `GET /api/v1/books` wajib terpaginasi default (`per_page=24`, maks `100`) dengan filter server-side yang sudah diindeks (`status`, `shelf_id`, `favorite`, `is_returned`, `borrowed_by`, `search`, `has_notes`, `year`).
     - Buat endpoint dedikasi `GET /api/v1/analytics/dashboard` (atau perluas `StatisticsController`) yang mengembalikan agregasi SQL langsung (`COUNT`, `SUM`, `AVG`, breakdown status/genre/author, target tahunan, reading calendar heatmap) dengan **satu payload ringkas ter-cache di Redis** per `user_id` (TTL + invalidasi saat event `BookSaved`, `ReadingSessionCompleted`, `ExpenseUpdated`).
2. **Performa Query & Indeks PostgreSQL:**
   - Pastikan migrasi indeks komposit PostgreSQL untuk kolom query utama:
     - `books`: `(user_id, status, date_added)`, `(user_id, shelf_id, position)`, `(user_id, favorite)`, `(user_id, is_returned, due_date)`.
     - `reading_sessions`: `(user_id, started_at)`, `(book_id, status)`.
     - `expenses`: `(user_id, category_id, expense_date)`, `(user_id, book_id)`.
   - Aktifkan ekstensi `pg_trgm` dan indeks GIN pada `books(title)` & `books(author)` agar pencarian `ILIKE '%keyword%'` tetap sub-50ms saat jumlah buku user mencapai puluhan ribu.
   - Hilangkan *redundant query* di controller (saat ini `BookController` memanggil `getBook($id, $userId)` lalu method `BookService` mencari ulang buku yang sama): gunakan **Route Model Binding + Policy Authorization** (`$this->authorize('update', $book)`), sehingga model hanya di-query sekali.

### 2.3 Abstraksi Storage Media (Stateless Container Readiness)

Masalah teramati pada `BookController::uploadCover()` (`baris 179–199`): file ditulis ke `Storage::disk('public')` lokal dan kolom `cover_image` menyimpan URL penuh (`request()->getSchemeAndHttpHost() . '/storage/book-covers/...'`), sedangkan `php artisan route:list` juga menyingkap route `PUT storage/{path}` (`storage.local.upload`).

- **Standar Produksi:**
  - Gunakan object storage kompatibel S3 (**AWS S3 / Cloudflare R2 / MinIO**) via `FILESYSTEM_MEDIA_DISK=s3` (konfigurasi di `config/filesystems.php`).
  - Kolom `books.cover_image` dan `expenses.receipt_path` **hanya menyimpan relative object key** (contoh: `covers/{user_id}/{uuid}.webp` atau `receipts/{user_id}/{uuid}.pdf`), **bukan** host URL.
  - `BookResource` menyusun public/CDN URL secara dinamis via `Storage::disk($disk)->url($key)`, sementara nota pengeluaran (`GET /v1/accounting/expenses/{expense}/receipt`) menggunakan **temporary signed URL** berdurasi singkat (`5 menit`) setelah melewati `ExpensePolicy`.
  - Setiap gambar cover yang diunggah diproses (validasi MIME aktual dari magic bytes, re-encode WebP/JPEG untuk menghapus EXIF/payload tersembunyi, maksimal resolusi 1200px) sebelum masuk bucket publik.

### 2.4 Asynchronous Queue & Konsistensi Engine Accounting/Achievement

- **`ExportAccountingReportJob`:** Menggantikan export laporan sinkron pada `AccountingReportController::export`; HTTP endpoint mengembalikan `202 Accepted` + `export_id`, lalu client polling status atau menerima notifikasi ketika berkas tersedia di temporary signed URL S3.
- **Akurasi Kurs Mata Uang:** Gantikan hardcode `* 15000` USD pada `BookController::getPurchaseHistory()` dengan konversi historis/terkini lewat `CurrencyRateService`, dan jadwalkan `SyncCurrencyRatesJob` di `routes/console.php` setiap hari (memindahkan aksi sync dari HTTP request user biasa ke scheduler + endpoint internal admin).
- **Single Source of Truth Achievement:** Nonaktifkan perhitungan/persisten `useAchievementStore` (`localStorage`) di browser. Jadikan `Event -> EvaluateUserAchievements (Listener/Job)` sebagai satu-satunya mesin pembuka pencapaian di DB, sementara Frontend hanya membaca `GET /api/v1/achievements` dengan polling ringan atau event invalidasi setelah mutasi buku/sesi selesai.

---

## 3. Hardening Keamanan & Tata Kelola Kontrak API

| Aspek Keamanan | Celah yang Ditemukan Saat Audit | Standar Produksi yang Diterapkan |
| :--- | :--- | :--- |
| **Token & Session Lifecycle** | `config/sanctum.php` menetapkan `'expiration' => null` (token tak pernah kedaluwarsa); `.env.example` memakai `APP_DEBUG=true` & `SESSION_ENCRYPT=false`. | Tetapkan `'expiration' => env('SANCTUM_TOKEN_EXPIRATION', 10080)` (misal 7 hari untuk API token), aktifkan `SESSION_ENCRYPT=true`, cookie `HttpOnly` + `Secure` + `SameSite=Lax`, dan wajibkan `APP_DEBUG=false` pada environment staging/prod. |
| **CORS & Stateful Origin** | `bootstrap/app.php` mengecualikan `/v1/auth/login` & `/register` dari CSRF; konfigurasi origin bergantung pada env multi-value. | Pisahkan domain SPA (`app.domain.com`) dan API (`api.domain.com`) di bawah apex domain yang sama atau pisahkan auth flow murni cookie SPA vs bearer token. Hapus pengecualian CSRF jika memakai alur `/sanctum/csrf-cookie` sepenuhnya. |
| **Route Registration & Authorization** | Belum ada `Policy` class; `Route::fallback` di `routes/api.php:178` hanya menangkap `GET\|HEAD`. Endpoint `/register` dikomentari di backend tetapi aktif di router frontend. | Wajibkan `Policy` di seluruh 13 resource controller (`authorizeResource` atau eksplisit); ubah fallback API ke `Route::any('{any}', ...)` agar `POST/PUT/DELETE` ke URI salah selalu membalas JSON `404`; selesaikan status `/register` (implementasikan lengkap dengan validasi email + rate limit `throttle:3,10` atau hapus UI/rute yatim). |
| **Rate Limiting Granular** | Hanya `/login` yang memakai `throttle:5,1`; endpoint upload file, export laporan, sync kurs, dan mutasi massal belum memiliki rate limiter terpisah. | Terapkan named `RateLimiter` di `AppServiceProvider`: `auth` (`5/min`), `api` (`120/min/user`), `uploads` (`15/min/user`), dan `exports` (`5/min/user`). |
| **Static Storage Exposure** | `php artisan route:list` menunjukkan `PUT storage/{path}` (`storage.local.upload`) aktif otomatis dari Laravel 12. | Pastikan disk `local` tidak mengizinkan upload URL tak terotorisasi di production, dan blokir endpoint upload selain melalui controller terproteksi Sanctum + Policy. |
| **API Schema Contract** | Frontend mendefinisikan tipe TS secara manual di `src/types/*` (sebagian menyisakan `42` tipe `any` & bug kontrak nama field seperti yang tercatat pada perbaikan sebelumnya). | Pasang generator OpenAPI (`dedoc/scramble`) di Backend untuk menghasilkan `openapi.json` otomatis dari `FormRequest` & `ApiResource`, lalu generate tipe TypeScript (`openapi-typescript`) ke `frontend/src/shared/api/schema.d.ts` sebagai bagian dari check CI. |

---

## 4. Arsitektur Produksi Frontend (React 19 + Vite 8 + TypeScript 6)

Berdasarkan hasil verifikasi build `frontend/` (`oxlint`: `0 warnings, 0 errors` pada `198` berkas; Vite `v8.1.0` menghasilkan code-splitting dengan chunk terbesar `vendor-charts` `393.05 kB` / `112.65 kB` gzip, `vendor-react` `232.54 kB`, `index` `220.48 kB`), penyempurnaan menuju produksi berfokus pada **isolasi fitur, stabilitas runtime, nol duplikasi tooling, dan penghematan payload**:

### 4.1 Konsolidasi Build System & Konfigurasi Deployment
- **Hapus Dual Vite/Tailwind Duality:** Saat ini root `package.json` memakai Tailwind `^4.0.0` + Vite `^7.0.7` (`resources/js/library.js`, `resources/views/welcome.blade.php`), sementara `frontend/package.json` memakai Tailwind `^3.4.19` + Vite `^8.1.0`. Untuk arsitektur produksi *decoupled SPA + API*:
  - Tetapkan **`frontend/` sebagai satu-satunya build Frontend**.
  - Arahkan `composer dev` di `composer.json` menjadi `npm --prefix frontend run dev` alih-alih root `npm run dev`.
  - Arsipkan/hapus `package.json`, `vite.config.js`, `resources/js/`, `resources/css/` yang hanya melayani boilerplate `welcome.blade.php` (atau ganti `routes/web.php` `/` menjadi endpoint JSON info API singkat `{"service": "mybookshelf-api", "version": "v1"}`), serta konsolidasikan menjadi **satu `vercel.json`** yang jelas kepemilikannya.

### 4.2 Boundary Enforcement, State Hygiene & Error Resilience
1. **Import Boundary Guard (`oxlint` / ESLint):**
   - Konfigurasikan aturan batas modul di `frontend/` agar:
     - `shared/*` **tidak boleh** mengimpor dari `features/*` maupun `app/*`.
     - `features/<A>/*` **tidak boleh** mengimpor internal file dari `features/<B>/*` (kecuali melalui barrel publik `features/<B>/index.ts` bila memang disepakati).
   - Hilangkan seluruh sisa `42` tipe `any` dan aktifkan rule larangan eksplisit `no-explicit-any` sebagai `error` (bukan off/warning).
2. **Typed Query Key Factory & Request Cancellation:**
   - Gantikan string literal query key tersebar di hooks dengan `queryKeys` factory terpusat di `@shared/api/queryKeys.ts` sehingga invalidasi cache setelah mutasi (misal edit rak atau bayar expense) terarah presisi tanpa men-refetch query yang tak relevan.
   - Teruskan `signal` (`AbortSignal`) dari React Query ke `apiClient` untuk membatalkan request yang sudah usang saat user berpindah halaman cepat.
3. **Hilangkan Coupling Global `AppLayout` & Anti-Pattern Navigasi:**
   - Keluarkan pemanggilan `useBooks()`, `useShelves()`, dan `useAchievementTracker()` dari `AppLayout.tsx`. Setiap fitur memuat data kebutuhannya sendiri (dan header pencarian memakai endpoint ringkas `/books?search=...&per_page=8` saat `SearchBar` dibuka, bukan menarik seluruh database buku).
   - Hapus DOM event bus `window.CustomEvent` di `AppLayout.tsx` (ganti dengan Zustand action di `useBookstore`).
   - Ganti `window.location.href` di `ExploreLibrary.tsx` menjadi `useNavigate()` React Router agar tidak memicu *full page reload*.
   - Pindahkan `<SEO>` ke luar branch `if (isLoading)` di `ExploreLibrary.tsx`.
4. **Error Boundaries & Client Monitoring:**
   - Bungkus setiap route utama di `app/router/routes.tsx` dengan `<RouteErrorBoundary>` + React Query `QueryErrorResetBoundary` sehingga error render di satu modul (misal grafik di `/accounting`) tidak meruntuhkan seluruh shell aplikasi (`/library`, `/reading`).
   - Integrasikan **Sentry React SDK** untuk menangkap uncaught exception, failed lazy-chunk load (auto-reload prompt saat deploy versi baru), dan API HTTP `5xx` dengan menyertakan `X-Request-Id` dari response backend untuk korelasi langsung.
5. **Performance Budget & Lazy Loading:**
   - Jaga `index-*.js` awal tetap di bawah `70 kB` gzip (`56.57 kB` saat ini — pertahankan dengan memindahkan modul modal global berat seperti `EditBookModal` & `BookDetailModal` agar di-import dinamis hanya ketika `isBookDetailOpen === true`).
   - Pastikan `vendor-charts` (`112.65 kB` gzip) tetap terisolasi hanya pada rute `/dashboard`, `/statistics`, dan `/accounting`, bukan dimuat di `/landing` maupun `/library`.

---

## 5. Piramida Pengujian & Gerbang Kualitas CI/CD (*Quality Gates*)

### 5.1 Celah Pengujian Saat Ini
- **Backend (`php artisan test --compact`):** Saat ini lulus `17` test (`134` assertion) dalam `5.36s` di bawah 6 file (`AccountingErrorHandlingTest`, `AuthAndSecurityTest`, `BookAndShelfWorkflowTest`, `ReadingSessionAndBudgetTest`, serta 2 default `ExampleTest`). Belum ada Larastan/PHPStan, belum ada test otorisasi lengkap untuk 100% endpoint mutasi `Expense/Budget/Category/Currency/Collection/Shelf/Achievement`, dan belum ada test Queue Job maupun S3 Storage mock.
- **Frontend:** **`0` unit test, `0` component test, `0` E2E test** (belum ada Vitest, Testing Library, maupun Playwright di `frontend/package.json`).

### 5.2 Target Piramida Pengujian Produksi

```text
          /\         4. E2E Critical Flows (Playwright — 6–10 skenario utama di CI Preview)
         /  \           Login -> Rak & Buku -> Drag Shelf -> Sesi Baca -> Expense & Budget -> Tema
        /----\       3. Frontend Component & Hook Tests (Vitest + Testing Library + MSW)
       /      \         Query hooks, useThemeStore, Form validation, Currency formatter
      /--------\     2. Backend Feature & Policy Matrix (PHPUnit + PostgreSQL 15 + Redis)
     /          \       100% route auth/403 IDOR matrix, Queue::fake, Storage::fake, Rollback DB
    /------------\   1. Static Analysis, Contract & Security Gates
                        Pint + Larastan (Lv 6+) + composer audit + oxlint + tsc + OpenAPI drift
```

### 5.3 Pipeline `.github/workflows/ci.yml` Menuju Produksi

| Stage CI | Job & Checks Wajib | Kebijakan Gate |
| :--- | :--- | :--- |
| **Backend Quality** | `composer install --no-interaction` (menggunakan `composer.lock` yang di-track di Git) -> `./vendor/bin/pint --test` -> `./vendor/bin/phpstan analyse` (Larastan) -> `composer audit` | **Hard Fail** pada error Pint, Larastan, atau CVE kritikal. |
| **Backend Test & Migration Check** | Jalankan PostgreSQL 15 + Redis service -> `php artisan migrate --force` (memastikan nol sample/UUID hardcoded di migrations) -> `php artisan test --parallel --coverage --min=80` | **Hard Fail** jika test gagal atau cakupan fitur domain utama di bawah ambang minimum. |
| **Frontend Quality & Build** | `npm ci` -> `npm run lint` (`oxlint --deny-warnings`) -> `npx tsc --noEmit` -> `npm run test:unit` (Vitest) -> `npm run build` + pengecekan ukuran chunk (`dist/assets`) -> `npm audit --audit-level=high` | **Hard Fail** pada warning lint, type error, unit test gagal, atau chunk entry melampaui budget. |
| **E2E Smoke Gate (Staging/PR)** | Spin up Laravel API test server + Vite preview -> `npx playwright test` (login, CRUD buku/rak, catat expense, ubah bahasa & palet warna) | **Wajib Hijau** sebelum merge ke branch rilis (`main`/`production`). |

---

## 6. Topologi Deployment, Observabilitas & Runbook Rilis Produksi

### 6.1 Topologi Infrastruktur Terpisah (*Stateless Compute + Managed State*)

```text
                    [ Pengguna (Browser / Mobile PWA) ]
                                    │
                   ┌────────────────┴────────────────┐
                   ▼ HTTPS                           ▼ HTTPS
     [ Edge CDN / Vercel ]              [ Reverse Proxy / Load Balancer ]
     (Static SPA: frontend/dist)         (TLS Termination, Rate Limit, WAF)
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             ▼                                               ▼
               [ API Container Pool ]                          [ Queue Worker + Scheduler ]
               (PHP 8.2+ FPM/Octane,                           (php artisan queue:work redis
                Stateless, 0 Local Disk Media)                  & schedule:run via Cron)
                             │                                               │
            ┌────────────────┼────────────────────┬──────────────────────────┘
            ▼                ▼                    ▼
     [ PostgreSQL 15 ]   [ Redis 7 ]      [ Object Storage S3 / R2 ]
     (Primary + Automated (Cache, Session, (Buku Cover Publik/CDN +
      Daily Snapshot)     Queue, RateLimit) Nota Keuangan Signed Private)
```

### 6.2 Observabilitas & Monitoring

1. **Pembedaan Probe Infrastruktur:**
   - **Liveness (`/up`):** Probe cepat milik Laravel framework; hanya mengecek proses PHP/HTTP merespons `200 OK` (tanpa query DB agar pod tidak di-restart berantai saat DB lambat sesaat).
   - **Readiness (`/api/health`):** Endpoint khusus produksi (`HealthController`) yang menguji koneksi PostgreSQL (`DB::select('SELECT 1')`), Redis (`Cache::store('redis')->put/get`), dan konektivitas storage disk, mengembalikan status `200` atau `503` (tanpa membocorkan stack trace / kredensial!).
2. **Structured JSON Logging & Traceability:**
   - Aktifkan channel JSON (`LOG_CHANNEL=stderr` dengan formatter JSON) agar mudah diindeks oleh CloudWatch / Datadog / Grafana Loki / Railway Logs.
   - Setiap request & job queue membawa `request_id` (`X-Request-Id`) dan `user_id` (tanpa PII sensitif/password/token).
3. **Alerting & Error Tracking:**
   - Sentry Backend + Sentry Frontend dengan release tagging berdasarkan commit SHA (`VITE_APP_VERSION`, `APP_VERSION`) dan filter agar HTTP `401/404/422` validasi normal tidak mengotori kuota alert 5xx.

### 6.3 Strategi Migrasi Zero-Downtime & Rollback Runbook

1. **Pisahkan DDL vs Seed Data:** Hapus/arsipkan data dummy & hardcoded UUID user pada `2026_07_09_000006–000008` sebelum deployment baru; kategorisasi default user baru dijalankan melalui listener/service saat registrasi user atau seeder idempoten terpisah.
2. **Pola *Expand & Contract*:** Perubahan skema kolom existing (seperti penghapusan `room_id` di `shelves` dan drop tabel `rooms`) dilakukan dalam 2 fase deploy:
   - *Deploy 1 (Expand):* Kode aplikasi tidak lagi membaca/menulis `room_id` atau `Room`; migrasi menjadikan kolom nullable.
   - *Deploy 2 (Contract):* Setelah 100% instance menjalankan kode baru, drop kolom `room_id` dan tabel `rooms`.
3. **Prosedur Rilis & Rollback Terotomasi:**
   - Sebelum `php artisan migrate --force`, pipeline rilis otomatis mengambil snapshot PostgreSQL.
   - Jalankan `php artisan config:cache`, `route:cache`, `event:cache`, `view:cache` saat build image; jalankan `php artisan queue:restart` segera setelah rilis agar worker memuat kode terbaru.
   - Jika error rate 5xx > 1% atau readiness probe gagal dalam 5 menit pasca-deploy: revert container ke tag rilis sebelumnya, kembalikan frontend deployment ke immutable build sebelumnya di Vercel/Edge, dan evaluasi migrasi rollback/snapshot bila terdapat perubahan skema.

---

## 7. Checklist Kesiapan Produksi (*Production Release Gate Scorecard*)

Aplikasi baru dinyatakan **Production-Ready** apabila seluruh poin gerbang berikut berstatus **Lulus (`PASS`)**:

- [ ] **P0 — Deterministik Build & Hygiene:** `composer.lock` & `package-lock.json` ter-track di Git; zero skrip ad-hoc (`.py`, `backup.sql`, HTML sementara) di repositori; hanya 1 sistem Vite/Tailwind aktif (`frontend/`).
- [ ] **P0 — Keamanan & Otorisasi:** `APP_DEBUG=false`, `SESSION_ENCRYPT=true`, TTL Sanctum terkonfigurasi, `Policy` melindungi 100% endpoint resource per `user_id`, validasi upload file aman, `Route::any` JSON fallback aktif untuk semua HTTP verb.
- [ ] **P0 — Storage & Skala Data:** Upload cover & receipt berjalan di S3/R2 menggunakan relative key (0 file tersimpan di local ephemeral disk); endpoint `/api/v1/books` terpaginasi default; Dashboard & Reading membaca ringkasan agregasi backend tanpa menarik full dataset buku.
- [ ] **P1 — Asinkron & Migrasi Bersih:** Export laporan, sync kurs, dan evaluasi achievement berjalan via Queue Worker; migrasi database bebas dari sample data & hardcoded user UUID.
- [ ] **P1 — Observabilitas & Testing Gate:** Probe `/up` vs `/api/health` terpisah, structured JSON logs + `X-Request-Id` + Sentry aktif, serta CI menjalankan Pint, Larastan, PHPUnit (coverage feature & 403 matrix), `oxlint`, `tsc`, Vitest, dan Playwright E2E tanpa `continue-on-error`.
