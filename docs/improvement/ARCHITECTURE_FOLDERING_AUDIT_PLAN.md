# Rencana Audit & Refaktorisasi Arsitektur File dan Foldering Seluruh Route (Tahap 1)

**Target Repositori:** `MyBookshelf` (Backend Laravel 12 + PHP `^8.2` & Frontend React `^19.2.7` + Vite `^8.1.0` + TypeScript `~6.0.2`)  
**Cakupan Audit:** Seluruh `111` route Laravel (`106` route API + `5` route web/framework), `18` path React Router (`6` path publik + `12` path terproteksi + catch-all `*`), `13` controller, `5` service, `13` model, `29` file migrasi, `10` seeder, `207` berkas di bawah `frontend/src/` (`198` berkas JS/TS ter-lint), serta konfigurasi root/CI.  
**Tujuan Tahap 1:** Merapikan batas tanggung jawab modul (*domain boundaries*), menghapus kode yatim/duplikat, menyatukan konvensi foldering Backend & Frontend agar konsisten pada seluruh route, dan menyediakan peta migrasi file tanpa mengubah kontrak bisnis.  
**Kelanjutan Tahap 2:** Hasil arsitektur Tahap 1 disempurnakan lebih lanjut menjadi arsitektur **siap produksi (*Production-Readiness Blueprint*)** pada dokumen [PRODUCTION_ARCHITECTURE_MASTERPLAN.md](PRODUCTION_ARCHITECTURE_MASTERPLAN.md).

---

## 1. Inventaris Kuantitatif Kondisi Saat Ini (*As-Is Baseline*)

| Layer / Area | Kondisi Terukur Saat Ini | Catatan Struktural Utama |
| :--- | :--- | :--- |
| **Route Backend** (`routes/`) | `111` total route (`106` API, `5` web/framework) dalam `routes/api.php` (`183` baris) & `routes/web.php` (`7` baris) | Seluruh `106` endpoint API menumpuk di 1 file `api.php`; blok `/v1/books` terpecah 2 blok middleware berbeda (`baris 52–59` & `62–85`). |
| **Controllers** (`app/Http/Controllers/Api/V1/`) | `13` file flat dalam 1 folder (`BookController` `592` baris, `AccountingReportController` `476` baris) | Tidak ada sub-folder domain, tidak ada `FormRequest`, validasi inline berulang di seluruh controller. |
| **Services** (`app/Services/`) | `5` file (`ExpenseService` `565`, `BudgetService` `518`, `BookService` `512`, `CurrencyRateService` `337`, `ReadingSessionService` `245`) | Sebagian domain (`Shelf`, `Collection`, `Statistics`, `Achievement`, `AccountingReport`, `Auth`) langsung menaruh query/logika di Controller. |
| **Resources & Policies** | `5` `ApiResource` (`Book`, `BookCollection`, `Collection`, `Room`, `Shelf`), `0` `Policy`, `0` `FormRequest`, `0` `Actions` | `ownedRule` tersebar manual + cek ulang `getBook($id, $userId)` di setiap method; domain Accounting/Stats/Session belum memakai API Resource. |
| **Models & Migrations** | `13` Model (`app/Models/`), `29` Migrasi (`database/migrations/`), `10` Seeder (`database/seeders/`) | Ada domain yatim `Room` (`Room.php`, `RoomResource.php`, `RoomSeeder.php`) dan `3` migrasi berisi *sample data* & hardcoded UUID (`2026_07_09_000006–000008`). |
| **Helpers & Providers** | `app/Helpers/Response macros.php` (`11` baris) & `AppServiceProvider.php` (`49` baris) | Nama berkas `Response macros.php` mengandung spasi (melanggar PSR-4) berisi `class ResponseMixin {}` sementara macro sesungguhnya di `AppServiceProvider`. |
| **Frontend SPA** (`frontend/src/`) | `16` pages (`Reading.tsx` `957` baris, `Collections.tsx` `640`, `BorrowLoan.tsx` `581`), `132` components, `19` hooks, `10` lib, `7` types, `5` constants, `2` store, `1` utils | `42` penggunaan `any` masih tersisa; komponen terpecah secara asimetris (`components/assets/WishlistCard.tsx` vs `src/assets/`, `useShelves`/`useCollections` campur API fetch dengan React Query hook). |
| **Root & Build Tooling** | Dual Vite/Tailwind (`root`: Vite `7.0.7` + Tailwind `4.0.0`; `frontend/`: Vite `8.1.0` + Tailwind `3.4.19`) + dual `vercel.json` | `composer dev` memanggil `npm run dev` di root alih-alih `frontend/`; ada skrip `.py`/`.html`/`.sql` di root & `frontend/`; `.gitignore` mengabaikan `composer.lock`. |

---

## 2. Audit Menyeluruh Seluruh Route & Pemetaan Modul

### 2.1 Route Backend (`111` Route di `routes/api.php`, `routes/web.php`, `bootstrap/app.php`)

| Prefix / Group | Jumlah Route | Controller / Handler | Frontend Consumers | Temuan Arsitektur & Foldering Spesifik |
| :--- | :---: | :--- | :--- | :--- |
| `GET /`, `/up`, `/sanctum/csrf-cookie`, `/storage/{path}` (`GET`, `PUT`) | `5` | `routes/web.php`, `ApplicationBuilder`, Sanctum, `FilesystemServiceProvider` | SPA Entry, Auth CSRF, Cover media | `routes/web.php` masih mengembalikan view default `welcome` dan menarik paket build root (`resources/js/library.js`, `resources/css/library.css`). `/up` duplikat fungsi dengan `/api/health`. `storage.local.upload` (`PUT storage/{path}`) terekspos otomatis dari Filesystem Laravel 12. |
| `GET /api/health` & fallback `api/{fallbackPlaceholder}` | `2` | Closure `routes/api.php` (`baris 30`, `baris 178`) | Monitoring / Error handling | `Route::fallback` pada `routes/api.php:178` hanya teregistrasi untuk `GET|HEAD` (`api/{fallbackPlaceholder}`), sehingga method `POST/PUT/DELETE` ke path nyasar bisa menghasilkan respons non-uniform. |
| `POST /api/v1/auth/*` & `PUT /api/v1/user/*` | `5` *(+1 commented `/register`)* | `Api\V1\AuthController` (`162` baris) | `Login.tsx`, `Settings.tsx` (`AccountSettings.tsx`), `useAuth.ts`, `lib/api/auth.ts` | `/register` dikomentari di backend, sementara frontend me-route `/register` ke `Login.tsx` dan menyisakan `RegisterForm.tsx` serta `RegisterComingSoon.tsx` tidak terpakai. Logic profil & password tercampur ke `AuthController`. |
| `/api/v1/books/*` (CRUD, Cover, Progress, Borrow, Notes, Rating, Shelf move, Purchase history, Cost) | `19` + `4` (`reading-sessions/*`) + `1` (`TimelineController`) | `Api\V1\BookController` (`592` baris), `Api\V1\TimelineController` (`28` baris) | `Library.tsx`, `Dashboard.tsx`, `Reading.tsx`, `Wishlist.tsx`, `BorrowLoan.tsx`, `Notes.tsx`, `BookDetailModal.tsx`, `Accounting.tsx` | **God Controller** (`592` baris) menggabungkan CRUD buku, upload file cover (menyimpan absolute URL host ke DB), pinjam/kembali, sub-sesi baca, biaya buku, dan purchase history (hardcode kurs USD `* 15000` alih-alih memanggil `CurrencyRateService`). Blok route `/v1/books` terpisah dua grup (`baris 52–59` vs `62–85`). Endpoint `/books` mengambil semua data tanpa paginasi (`$withPagination = false`) untuk dipakai agregasi client-side di 8 halaman. |
| `/api/v1/shelves/*` (`layout`, CRUD, `occupancy`) | `7` | `Api\V1\ShelfController` (`189` baris) | `Library.tsx`, `ExploreLibrary.tsx`, `AppLayout.tsx`, `useShelves.ts` | Masih bergantung pada model yatim `App\Models\Room` (`Room::firstOrCreate(['name' => 'Main Room'])` pada `store()`), meskipun frontend sudah menghapus seluruh modul `Room`. Tidak memakai `ShelfService`; API fetch langsung ditulis di `hooks/useShelves.ts`. |
| `/api/v1/collections/*` (CRUD + book pivot & reorder) | `8` | `Api\V1\CollectionController` (`159` baris) | `Collections.tsx`, `useCollections.ts` | API client didefinisikan langsung di dalam hook `hooks/useCollections.ts` dan mengimpor `transformBook` lintas-layer dari `lib/api/books.ts`. Tidak ada `CollectionService`. |
| `/api/v1/reading-sessions/*` | `4` *(+4 duplikat di bawah `/books/{book}/reading-sessions`)* | `Api\V1\ReadingSessionController` (`143` baris) & `BookController` | `Reading.tsx`, `useReadingSessions.ts`, `lib/api/readingSessions.ts` | **Duplikasi Endpoint:** Operasi reading session tersebar antara `ReadingSessionController` (`/reading-sessions`) dan `BookController` (`/books/{book}/reading-sessions/*`, `baris 52–59` & `70–75` `api.php`), padahal keduanya memakai `ReadingSessionService`. |
| `/api/v1/statistics` | `1` | `Api\V1\StatisticsController` (`167` baris) | `Statistics.tsx`, `useStatistics.ts`, `lib/api/statistics.ts` | Semua agregasi SQL/Collection ada di Controller tanpa `StatisticsService` / Query Object / Resource. Sementara halaman `Dashboard.tsx` & `Reading.tsx` mengabaikan API ini dan menghitung statistik ulang di browser lewat `useDashboardStats.ts` & `useYearlyStats.ts` dari seluruh list buku. |
| `/api/v1/achievements/*` | `3` | `Api\V1\AchievementController` (`162` baris) | `Achievements.tsx`, `useAchievements.ts`, `lib/api/achievements.ts` | **Dual Source of Truth:** Backend punya `AchievementController` + tabel `achievements` / `user_achievements`, tetapi `AppLayout.tsx` menjalankan `useAchievementTracker.ts` (Zustand + `localStorage`) yang mengevaluasi ulang achievement secara lokal dari array buku sehingga state antarperangkat tidak pernah sinkron. |
| `/api/v1/accounting/expenses/*` | `13` | `Api\V1\ExpenseController` (`340` baris) + `ExpenseService` (`565`) | `Accounting.tsx`, `accounting/*`, `hooks/accounting/useExpenses.ts` | Controller gemuk (`340` baris) + banyak sub-route prosedural (`/duplicate`, `/mark-paid`, `/convert-currency`, `/send-reminder`). |
| `/api/v1/accounting/categories/*` | `8` | `Api\V1\ExpenseCategoryController` (`303` baris) | `CategoryManager.tsx`, `hooks/accounting/useExpenseCategories.ts` | Query & business logic langsung berada di controller tanpa Service / Repository / Resource. |
| `/api/v1/accounting/budgets/*` | `12` | `Api\V1\BudgetController` (`267` baris) + `BudgetService` (`518`) | `BudgetTracker.tsx`, `hooks/accounting/useBudgets.ts` | Validasi & transformasi payload inline di controller. |
| `/api/v1/accounting/currency/*` | `11` | `Api\V1\CurrencyController` (`271` baris) + `CurrencyRateService` (`337`) | `hooks/accounting/useCurrencyRates.ts`, `lib/api/accounting.ts` | Terdapat endpoint `POST /sync` dan `POST /deactivate-old` sinkron di HTTP request tanpa background job / admin guard eksplisit. |
| `/api/v1/accounting/reports/*` | `8` | `Api\V1\AccountingReportController` (`476` baris) | `MonthlyExpensesChart.tsx`, `useAccountingReports.ts` | **God Report Controller** (`476` baris) mencampur query analitik 8 laporan langsung di controller tanpa `AccountingReportService` maupun kelas Export dedikasi. |

---

### 2.2 Route Frontend SPA (`frontend/src/App.tsx` — `18` Route Path)

| Route Path | Komponen Halaman (Ukuran) | Guard & Layout | Ketergantungan Data & Store | Temuan Arsitektur & Foldering Spesifik |
| :--- | :--- | :--- | :--- | :--- |
| `/`, `/landing` | `LandingPage.tsx` (`372`) | Public | `components/landing/*` (`11` file), `editorialBooks.ts` | Memuat komponen showcase 3D (`Book3DModel`), ambient particle, dan demo rak secara cukup bersih dalam folder `components/landing/`. |
| `/landing/book/:id`, `/book/:id` | `LandingBookDetail.tsx` (`414`) | Public | `DemoBookDetailModal.tsx`, `editorialBooks.ts` | `DemoBookDetailModal.tsx` diletakkan di `components/modals/` bersama modal app terautentikasi, alih-alih di modul `landing`. |
| `/login`, `/register` | `Login.tsx` (`428`) | Public | `components/auth/*` (`5` file), `useAuth.ts`, `Landing*Toggle` | `Login.tsx` mengimpor komponen UI dari folder `components/landing/` (`LandingLanguageToggle`, `LandingThemeToggle`). `RegisterForm.tsx` (dalam `components/auth/`) & `RegisterComingSoon.tsx` (`4` baris) yatim. |
| `/dashboard` | `Dashboard.tsx` (`185`) | `ProtectedRoute` + `AppLayout` | `components/dashboard/*` (`9` file), `useDashboardStats.ts`, `useBooks`, `useShelves` | Mengambil **seluruh koleksi buku** (`useBooks()`) untuk kalkulasi client-side di `useDashboardStats.ts` (`201` baris). Layout rapi memakai `Dashboard*Section`. |
| `/library` | `Library.tsx` (`401`) | `ProtectedRoute` + `AppLayout` | `components/shelf/*` (`26`), `decorations/*` (`17`), `modals/*`, `useBooks`, `useShelves` | Mengelola drag-and-drop rak, filter, pagination/grid view, serta event global `CustomEvent` ke `AppLayout` untuk edit rak. |
| `/explore` | `ExploreLibrary.tsx` (`229`) | `ProtectedRoute` + `AppLayout` | `Shelf.tsx`, `useBooks`, `useShelves` | Menavigasi klik buku dengan `window.location.href = ...` (memaksa hard browser reload dan mereset state React Query/Zustand), bukan `useNavigate()` / `openBookDetail()`. `<SEO>` ditempatkan di branch `if (isLoading)` saja. |
| `/reading` | `Reading.tsx` (`957`) | `ProtectedRoute` + `AppLayout` | `reading/*` (`2`), `MobileCoverGrid.tsx` (`shelf/`), `useReadingSessions`, `useYearlyStats` | **Halaman terbesar (`957` baris)**, mencampur logic session timer, UI filter/view mode, grid mobile, shelf bacaan tunggal, dan daftar riwayat bacaan dalam satu file halaman. Mengimpor `MobileCoverGrid` dari `components/shelf/`. |
| `/wishlist` | `Wishlist.tsx` (`321`) | `ProtectedRoute` + `AppLayout` | `components/assets/WishlistCard.tsx`, `AddWishlistBookModal.tsx` | Komponen domain fitur (`WishlistCard.tsx`) salah lokasi di folder `components/assets/` (membuat bentrok makna dengan `src/assets/`). |
| `/borrow-loan` | `BorrowLoan.tsx` (`581`) | `ProtectedRoute` + `AppLayout` | `useBooks`, `useBookstore` | Halaman besar (`581` baris) tanpa sub-komponen domain `components/borrow-loan/`. Logika tab, filter jatuh tempo, dan modal/aksi bercampur di page file. |
| `/collections` | `Collections.tsx` (`640`) | `ProtectedRoute` + `AppLayout` | `useCollections.ts`, `useBooks`, `Collection` types | Halaman besar (`640` baris) tanpa folder komponen sendiri (`components/collections/`). API calls berada di dalam `useCollections.ts`. |
| `/achievements` | `Achievements.tsx` (`464`) | `ProtectedRoute` + `AppLayout` | `useAchievements`, `useAchievementTracker` | Halaman `464` baris tanpa folder komponen `components/achievements/`. Berpotensi konflik data antara backend `/v1/achievements` dan `useAchievementStore` lokal. |
| `/notes` | `Notes.tsx` (`355`) | `ProtectedRoute` + `AppLayout` | `useBooks`, `useBookstore` | Halaman `355` baris tanpa pemisahan sub-komponen note editor/card. |
| `/statistics` | `Statistics.tsx` (`381`) | `ProtectedRoute` + `AppLayout` | `useStatistics`, `useBooks`, Recharts | Sebagian statistik diambil dari backend `/v1/statistics`, namun masih menarik `useBooks` serta menaruh seluruh chart Recharts langsung di file halaman (`381` baris) tanpa pemisahan sub-komponen chart domain. |
| `/accounting` | `Accounting.tsx` (`198`) | `ProtectedRoute` + `AppLayout` | `components/accounting/*` (`8`), `hooks/accounting/*` (`6`), `lib/api/accounting.ts` | **Paling terstruktur di Frontend** (`Accounting.tsx` ringkas `198` baris karena mendelegasikan ke sub-komponen `components/accounting/` & `hooks/accounting/`), meski tetap menarik waterfall `AppLayout` (`useShelves`, `useBooks` via `useAchievementTracker`) saat halaman dibuka. |
| `/settings` | `Settings.tsx` (`223`) | `ProtectedRoute` + `AppLayout` | `components/settings/*` (`4`), `useThemeStore`, `useAuth` | Terstruktur baik secara modular (`AccountSettings`, `AppPreferences`, `DataManagement`, `AboutSettings`), namun masih terselip penyebutan/dependensi dari `useThemeStore` yang hanya relevan untuk app terproteksi. |
| `*` (Fallback) | `CatchAll.tsx` | Router Root | `components/layout/CatchAll.tsx` | Halaman/komponen fallback 404 berada di `components/layout/` bukan `pages/`. |

---

## 3. Ringkasan Anti-Pattern & Celah Struktural Lintas Repo

1. **Artefak Yatim, Dead Code & Skrip Ad-Hoc Mengotori Tree:**
   - **Backend:** Model `Room.php`, `RoomResource.php`, `RoomSeeder.php`, migrasi `2026_06_27_190603_create_rooms_table.php`, serta ketergantungan semu di `ShelfController::store()` (`Main Room`).
   - **Frontend:** `src/pages/RegisterComingSoon.tsx` (`4` baris), `src/components/auth/RegisterForm.tsx` (`0` impor), `src/App.css` (`0` impor), `src/utils/mockData.ts` (satu-satunya file di `src/utils/`, `0` impor), serta dependency npm `zod` (`^4.4.3`) dan `react-hook-form` (`^7.80.0`) yang terpasang di `frontend/package.json` tanpa satupun pemakaian.
   - **Root & Skrip Maintenance:** File `backup.sql`, `gamma_assets.html`, `gamma_prompt.html`, `remove_bg.py`, `remove_bg_rembg.py` di root, serta `add_seo.py`, `fix_dots.py`, `update_achievements.py`, `update_translations.py` di `frontend/`.
   - **Lockfile & Build Duality:** `.gitignore` baris `73` mengabaikan `composer.lock` (`git ls-files` mengonfirmasi `composer.lock` tidak ter-track di Git). Terdapat **dua sistem build Vite/Tailwind** yang berbeda versi major: root (`package.json`: Vite `7.0.7` + Tailwind `4.0.0`, dipakai `composer dev` dan `resources/views/welcome.blade.php`) vs `frontend/` (`frontend/package.json`: Vite `8.1.0` + Tailwind `3.4.19`), serta dual `vercel.json` (root & `frontend/vercel.json`).
2. **Ketimpangan Arsitektur Backend (Flat V1 & Missing Laravel Boundary Layers):**
   - Semua controller di `App\Http\Controllers\Api\V1\` datar tanpa pemisahan domain.
   - Tidak ada folder `app/Http/Requests/` maupun `app/Policies/`: seluruh validasi dan verifikasi kepemilikan (`ownedRule`, `getBook($id, $userId)`) dilakukan berulang secara prosedural di controller, bahkan menyebabkan query `Book::find` berulang (`getBook` lalu service query ulang).
   - File `app/Helpers/Response macros.php` mengandung spasi sehingga tidak sesuai PSR-4 dan membuat IDE/autoloader rancu terhadap macro di `AppServiceProvider`.
   - `routes/api.php` menumpuk 106 route dalam satu file dan memecah `/v1/books` di dua lokasi (`baris 52–59` vs `62–85`).
   - `database/migrations/2026_07_09_000006–000008` menanam data awal, data contoh, dan UUID user spesifik (`019f21d5-ef05-731a-98ff-4713b284ea7f`) langsung ke pipeline migrasi skema.
3. **Ketimpangan Arsitektur Frontend (Horizontal Mismatch + Global Layout Coupling):**
   - Halaman besar (`Reading` `957`, `Collections` `640`, `BorrowLoan` `581`, `Achievements` `464`, `Login` `428`, `LandingBookDetail` `414`, `Library` `401`) belum dipecah ke modul fitur.
   - Inkonsistensi penempatan data layer: 6 modul API ada di `src/lib/api/`, sedangkan `useShelves.ts` dan `useCollections.ts` menanam definisi endpoint axios langsung di `src/hooks/`.
   - Inkonsistensi state manager: `useBookstore` & `useThemeStore` ada di `src/store/`, sementara Zustand store lain (`useAchievementStore`, `useNotifications`, `useLighting`) tersimpan di `src/hooks/`.
   - `AppLayout.tsx` memuat `useShelves()`, `useBook()`, dan `useAchievementTracker()` (yang menarik `useBooks()`) di setiap route terproteksi dan mengandalkan DOM `CustomEvent` lintas-komponen.

---

## 4. Arsitektur Target Tahap 1: *Domain-Grouped Backend* & *Feature-Sliced Frontend*

Prinsip desain Tahap 1 membagi aplikasi menjadi **5 Domain Fungsional Utama** yang simetris antara Backend dan Frontend:
1. **`Identity` / `Auth`** (Autentikasi, Profil, Pengaturan Akun & Preferensi)
2. **`Library`** (Books, Shelves, Collections, Borrow/Loan, Notes, Wishlist, Timeline)
3. **`Reading`** (Active Reading, Reading Sessions, Target Tahunan, Progress)
4. **`Analytics` / `Gamification`** (Dashboard stats, Statistics, Achievements)
5. **`Accounting`** (Expenses, Categories, Budgets, Currency Rates, Financial Reports)
*(Ditambah modul `Landing` khusus Frontend publik.)*

### 4.1 Struktur Target Backend (Domain-Organized Laravel 12)

```text
app/
├── Helpers/
│   └── ResponseMacros.php              # Rename PSR-4 (hapus spasi) atau pindahkan ke IDE helper
├── Http/
│   ├── Controllers/
│   │   ├── Controller.php              # Hapus helper ad-hoc setelah Policy & FormRequest aktif
│   │   └── Api/V1/
│   │       ├── System/
│   │       │   └── HealthController.php
│   │       ├── Auth/
│   │       │   ├── AuthController.php
│   │       │   └── ProfileController.php          # Pisahkan /v1/user/profile & /password
│   │       ├── Library/
│   │       │   ├── BookController.php             # Hanya CRUD & status buku inti
│   │       │   ├── BookCoverController.php        # Khusus upload & hapus cover
│   │       │   ├── BookLoanController.php         # Khusus borrow & returnBook
│   │       │   ├── BookCostController.php         # purchase-history, cost-breakdown, expenses
│   │       │   ├── BookTimelineController.php     # Ex TimelineController
│   │       │   ├── ShelfController.php            # Tanpa ketergantungan Room
│   │       │   └── CollectionController.php
│   │       ├── Reading/
│   │       │   ├── ReadingSessionController.php   # Satu pintu session (/books/{book}/sessions & /reading-sessions)
│   │       │   └── BookReadingController.php      # start, finish, progress, read-again
│   │       ├── Analytics/
│   │       │   ├── StatisticsController.php
│   │       │   └── AchievementController.php
│   │       └── Accounting/
│   │           ├── ExpenseController.php
│   │           ├── ExpenseCategoryController.php
│   │           ├── BudgetController.php
│   │           ├── CurrencyController.php
│   │           └── AccountingReportController.php
│   ├── Requests/Api/V1/                           # BARU: 1 FormRequest per endpoint mutasi/filter
│   │   ├── Auth/        (LoginRequest, UpdateProfileRequest, UpdatePasswordRequest)
│   │   ├── Library/     (StoreBookRequest, UpdateBookRequest, MoveShelfRequest, StoreShelfRequest, StoreCollectionRequest, ...)
│   │   ├── Reading/     (StartSessionRequest, UpdateProgressRequest, ...)
│   │   └── Accounting/  (StoreExpenseRequest, StoreBudgetRequest, ConvertCurrencyRequest, ExportReportRequest, ...)
│   └── Resources/Api/V1/                          # Lengkapi seluruh domain dengan API Resource konsisten
│       ├── Auth/        (UserResource)
│       ├── Library/     (BookResource, BookCollection, ShelfResource, CollectionResource, TimelineEventResource)
│       ├── Reading/     (ReadingSessionResource)
│       ├── Analytics/   (AchievementResource, StatisticsResource)
│       └── Accounting/  (ExpenseResource, ExpenseCategoryResource, BudgetResource, CurrencyRateResource)
├── Models/                                        # Room.php DIHAPUS setelah migrasi drop/arsip
├── Observers/
│   └── BookObserver.php
├── Policies/                                      # BARU: Otorisasi kepemilikan terpusat (user_id === resource.user_id)
│   ├── BookPolicy.php
│   ├── ShelfPolicy.php
│   ├── CollectionPolicy.php
│   ├── ReadingSessionPolicy.php
│   └── Accounting/ (ExpensePolicy, ExpenseCategoryPolicy, BudgetPolicy)
└── Services/
    ├── Auth/        (ProfileService)
    ├── Library/     (BookService, ShelfService, CollectionService, BookLoanService, BookCostService)
    ├── Reading/     (ReadingSessionService)
    ├── Analytics/   (StatisticsService, AchievementService)
    └── Accounting/  (ExpenseService, ExpenseCategoryService, BudgetService, CurrencyRateService, AccountingReportService)

routes/
├── web.php                                        # Ringkas (atau SPA/API info redirect; hapus aset Vite root yang tak dipakai)
├── api.php                                        # Entry V1 + fallback JSON semua HTTP method (Route::any)
└── api/
    └── v1/
        ├── auth.php
        ├── library.php                            # Satukan /books, /shelves, /collections tanpa pecahan blok
        ├── reading.php
        ├── analytics.php
        └── accounting.php
```

### 4.2 Struktur Target Frontend (*Vertical-Slice Feature Architecture*)

```text
frontend/src/
├── app/                                           # Routing, providers, root shell
│   ├── App.tsx                                    # Lazy-loaded routes + RouteErrorBoundary
│   ├── ReactQueryProvider.tsx                     # Pindahan dari lib/ReactQueryProvider.tsx
│   ├── i18n.ts
│   └── router/
│       └── routes.tsx                             # Pemetaan eksplisit publicRoutes & protectedRoutes
├── shared/                                        # Kode lintas-fitur yang benar-benar generik (tanpa logika bisnis domain)
│   ├── api/
│   │   ├── apiClient.ts                           # Axios instance + interceptor CSRF/401
│   │   └── reactQuery.ts                          # Konfigurasi QueryClient + queryKeys factory
│   ├── components/
│   │   ├── ui/                                    # Modal, ConfirmModal, Pagination, ToastContainer, SEO
│   │   └── layout/                                # AppLayout (tanpa eager fetch useBooks!), AppHeader, MobileMenu, SearchBar, NotificationCenter
│   ├── constants/                                 # appPalettes.ts, genres.ts
│   ├── hooks/                                     # useDebounce, dll.
│   ├── lib/                                       # logger.ts
│   ├── locales/                                   # en/translation.json, id/translation.json
│   ├── store/                                     # useThemeStore.ts, useNotificationStore.ts (pindahan dari hooks/useNotifications)
│   ├── types/                                     # Tipe API response generik & primitif
│   └── utils/                                     # Formatters (currency, date) — mockData.ts DIHAPUS
└── features/                                      # Setiap fitur memiliki sub-folder tertutup: api/, hooks/, components/, pages/, types/
    ├── landing/
    │   ├── pages/       (LandingPage.tsx, LandingBookDetail.tsx)
    │   ├── components/  (Book3DModel, DesktopBookShelf, MobileBookShelf, InteractiveBookDemo, DemoBookDetailModal, Landing*Toggle, ...)
    │   └── constants/   (editorialBooks.ts)
    ├── auth/
    │   ├── api/         (auth.api.ts)
    │   ├── hooks/       (useAuth.ts)
    │   ├── components/  (AuthDecoration, AuthLeftPage, LoginForm, ProtectedRoute) # RegisterForm.tsx dihapus sampai fitur siap
    │   └── pages/       (LoginPage.tsx)           # RegisterComingSoon.tsx dihapus; /register diarahkan bersih di router
    ├── library/                                   # Menangani Books, Shelves, Collections, Wishlist, Borrow/Loan, Notes, Explore
    │   ├── api/         (books.api.ts, shelves.api.ts, collections.api.ts) # API calls dipindah dari hooks/useShelves & useCollections
    │   ├── hooks/       (useBooks.ts, usePurchaseHistory.ts, useShelves.ts, useCollections.ts, useLightingStore.ts)
    │   ├── store/       (useBookstore.ts — + modal state editShelf agar bebas window CustomEvent)
    │   ├── types/       (book.ts, shelf.ts, collection.ts, decorations.ts)
    │   ├── constants/   (decorations.ts, shelfConstants.ts)
    │   ├── components/
    │   │   ├── shelf/       (Bookshelf, Shelf, SortableShelf, Book, MobileCoverGrid, LightingControl, AddShelfModal, EditShelfModal, shelf-elements/, book-elements/, lighting-control/)
    │   │   ├── decorations/ (DecorationPicker, DecorationSystem, items/)
    │   │   ├── book-details/(BookDetailModal, BookDetailLeftPage, BookDetailRightPage, left/, right/)
    │   │   ├── book-form/   (AddBookModal, EditBookModal, AddWishlistBookModal, Book*Input)
    │   │   ├── wishlist/    (WishlistCard.tsx — dipindah dari components/assets/)
    │   │   ├── animations/  (book-animation/ — dipindah dari components/assets/)
    │   │   ├── borrow-loan/ (komponen hasil pecah dari BorrowLoan.tsx 581 baris)
    │   │   ├── collections/ (komponen hasil pecah dari Collections.tsx 640 baris)
    │   │   └── notes/       (komponen hasil pecah dari Notes.tsx 355 baris)
    │   └── pages/       (LibraryPage.tsx, ExploreLibraryPage.tsx, WishlistPage.tsx, BorrowLoanPage.tsx, CollectionsPage.tsx, NotesPage.tsx)
    ├── reading/
    │   ├── api/         (readingSessions.api.ts)
    │   ├── hooks/       (useReadingSessions.ts, useYearlyStats.ts)
    │   ├── components/  (ActiveReadingCard, YearlyTargetCards, ReadingSessionTimer, FinishedBooksShelf, ReadingCalendarModal, BigDigitalClock, FlipCalendar)
    │   └── pages/       (ReadingPage.tsx — dipecah dari 957 baris -> <250 baris komposisi)
    ├── analytics/                                 # Dashboard, Statistics, Achievements
    │   ├── api/         (statistics.api.ts, achievements.api.ts)
    │   ├── hooks/       (useDashboardStats.ts, useStatistics.ts, useAchievements.ts, useAchievementTracker.ts)
    │   ├── constants/   (dashboardTheme.ts)
    │   ├── components/
    │   │   ├── dashboard/    (Dashboard*Section, DashboardWidgets)
    │   │   ├── statistics/   (komponen hasil pecah dari Statistics.tsx 381 baris)
    │   │   └── achievements/ (komponen hasil pecah dari Achievements.tsx 464 baris)
    │   └── pages/       (DashboardPage.tsx, StatisticsPage.tsx, AchievementsPage.tsx)
    ├── accounting/
    │   ├── api/         (accounting.api.ts)
    │   ├── hooks/       (useExpenses.ts, useExpenseCategories.ts, useBudgets.ts, useCurrencyRates.ts, useAccountingReports.ts)
    │   ├── types/       (accounting.ts)
    │   ├── components/  (AccountingDashboard, BudgetTracker, CategoryManager, DashboardAccountingSection, ExpenseList, ExpenseModal, MonthlyExpensesChart)
    │   └── pages/       (AccountingPage.tsx)
    └── settings/
        ├── components/  (AccountSettings, AppPreferences, DataManagement, AboutSettings)
        └── pages/       (SettingsPage.tsx)
```

---

## 5. Urutan Eksekusi Refaktorisasi Tahap 1 (*Zero-Breakage Migration Sequence*)

| Fase | Target Perubahan | Langkah Nyata | Verifikasi |
| :--- | :--- | :--- | :--- |
| **Fase 1A** | **Hygiene & Dead-Code Removal** | 1. Hapus `backup.sql`, `gamma_*.html`, `*.py` di root dan `frontend/`.<br>2. Hapus `App.css`, `utils/mockData.ts`, `pages/RegisterComingSoon.tsx`, `components/auth/RegisterForm.tsx` (atau simpan di branch arsip) dan uninstall `zod` & `react-hook-form` bila belum digunakan.<br>3. Putuskan apakah Vite root (`package.json`, `vite.config.js`, `resources/`) dipertahankan untuk Blade atau dihapus agar `composer dev` langsung menjalankan `frontend/` (`npm --prefix frontend run dev`) dan satu `vercel.json`.<br>4. Track `composer.lock` di Git (hapus entry di `.gitignore:73`). | `npm run lint`, `npm run build`, `php artisan test --compact`. |
| **Fase 1B** | **Route & Policy Consolidation (Backend)** | 1. Pecah `routes/api.php` ke `routes/api/v1/{auth,library,reading,analytics,accounting}.php`, satukan `/v1/books` dalam 1 grup `auth:sanctum`, ubah fallback menjadi `Route::any`.<br>2. Buat `app/Policies/*` dan `app/Http/Requests/Api/V1/*` menggantikan `ownedRule()` + validasi inline + query double `getBook()` di `BookController`.<br>3. Bersihkan model yatim `Room`, `RoomResource`, `RoomSeeder` & hapus ketergantungan `Room::firstOrCreate` di `ShelfController` via migrasi baru `drop_room_id_from_shelves_and_drop_rooms_table`.<br>4. Rename `app/Helpers/Response macros.php` -> `ResponseMacros.php`. | `php artisan route:list` & seluruh suite PHPUnit + tambah test Policy/403. |
| **Fase 1C** | **Service & Resource Extraction (Backend)** | 1. Pecah `BookController` (`592` baris) -> `BookController`, `BookCoverController`, `BookLoanController`, `BookCostController`, `BookReadingController`.<br>2. Pindahkan hardcode USD `* 15000` di `BookController::getPurchaseHistory()` ke `BookCostService` + `CurrencyRateService`.<br>3. Buat `ShelfService`, `CollectionService`, `StatisticsService`, `AchievementService`, `ExpenseCategoryService`, `AccountingReportService` serta lengkapi `ApiResource` untuk `User`, `Expense`, `Budget`, `ReadingSession`, `Achievement`. | PHPUnit feature tests lulus penuh; JSON response shape identik 100% dengan frontend. |
| **Fase 1D** | **Frontend Feature Restructuring** | 1. Gunakan path alias Vite/TypeScript (`@shared/*`, `@features/*`) di `tsconfig.app.json` & `vite.config.ts`.<br>2. Pindahkan modul demi modul (dimulai dari `accounting` & `settings` -> `auth` & `landing` -> `reading` & `analytics` -> `library`).<br>3. Pisahkan `shelves.api.ts` dan `collections.api.ts` dari hooks; pindahkan Zustand stores (`useNotificationStore`, `useLightingStore`, `useAchievementStore`) ke lokasi eksplisit; ganti `CustomEvent` edit-shelf ke Zustand `useBookstore`; ganti `window.location.href` di `ExploreLibrary` menjadi `navigate()`.<br>4. Pecah `Reading.tsx` (`957`), `Collections.tsx` (`640`), `BorrowLoan.tsx` (`581`), `Achievements.tsx` (`464`) ke sub-komponen di folder `components/` fitur masing-masing. | `npm --prefix frontend run lint` (`0 warnings`), `tsc --noEmit`, `vite build`, cek navigasi setiap route SPA. |
| **Fase 1E** | **Decouple Global Layout & Migration Hygiene** | 1. Hentikan pemanggilan `useBooks()` global dari `AppLayout.tsx` (pindahkan sinkronisasi achievement ke backend trigger saat finish book / session, bukan scan ulang semua buku di client).<br>2. Pindahkan data sample & default categories dari `migrations/2026_07_09_000006–000008` ke `DatabaseSeeder` / command artisan terpisah agar CI/production migration murni hanya DDL skema. | Fresh `php artisan migrate:fresh --seed` berhasil tanpa hardcode UUID user tertentu. |
