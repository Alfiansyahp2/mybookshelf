# Project Structure & Codebase Organization
## MyBookshelf Engineering Blueprint

Dokumen ini memetakan susunan pohon direktori aktual proyek **MyBookshelf**, menjelaskan pemisahan backend Laravel 12 dan frontend React 19, serta tanggung jawab spesifik masing-masing modul.

---

## 1. Struktur Root & Monorepo Terpisah

```text
mybookshelf/
├── app/
│   ├── Console/Commands/
│   │   └── SyncBookExpensesCommand.php      # CLI: accounting:sync-books
│   ├── Helpers/
│   │   └── Response macros.php              # PHPDoc helper untuk Response::success / error
│   ├── Http/
│   │   ├── Controllers/Api/V1/              # 13 Controller API versi 1
│   │   └── Resources/Api/V1/                # BookResource, ShelfResource, RoomResource, CollectionResource, BookCollection
│   ├── Models/                              # 13 Model Eloquent (UUID PKs + casts + relasi)
│   ├── Observers/
│   │   └── BookObserver.php                 # Sinkronisasi otomatis purchase_price ke tabel expenses
│   ├── Providers/
│   │   └── AppServiceProvider.php           # Registrasi BookObserver & Response::macro
│   └── Services/                            # 5 Service bisnis (Book, ReadingSession, Expense, Budget, CurrencyRate)
├── bootstrap/
│   └── app.php                              # Konfigurasi routing, Sanctum SPA middleware, & JSON exceptions
├── config/
│   ├── cors.php                             # Whitelist origin frontend & supports_credentials: true
│   └── sanctum.php                          # Stateful domains & guard web
├── database/
│   ├── factories/
│   ├── migrations/                          # 28 berkas migrasi PostgreSQL (Core + Accounting)
│   └── seeders/
├── docs/                                    # Dokumentasi teknis & cetak biru arsitektur
│   ├── architecture/                        # SYSTEM_ARCHITECTURE.md, DECISION_RECORDS.md
│   ├── features/                            # Panduan fitur pengguna
│   ├── history/                             # Catatan evolusi & refactoring
│   ├── specifications/                      # Spec Backend, Frontend, DB, API, UI/UX, & Struktur
│   ├── technical/                           # Catatan implementasi teknis & seeder
│   └── INDEX.md                             # Indeks pusat dokumentasi
├── frontend/                                # Client SPA (React 19 + TypeScript + Vite 8)
│   ├── src/
│   │   ├── components/
│   │   │   ├── accounting/                  # AccountingDashboard, BudgetTracker, CategoryManager, ExpenseList/Modal, Chart
│   │   │   ├── assets/                      # WishlistCard
│   │   │   ├── auth/                        # ProtectedRoute, LoginForm, RegisterForm, AuthLeftPage, AuthDecoration
│   │   │   ├── book-details/                # BookDetailLeftPage, BookDetailRightPage, sub-komponen timer & sesi
│   │   │   ├── dashboard/                   # DashboardHeroSection, StatCards, Charts, Goals, Authors, Activity, Widgets
│   │   │   ├── decorations/                 # DecorationPicker, DecorationSystem (15 jenis dekorasi rak)
│   │   │   ├── landing/                     # InteractiveBookDemo, DesktopBookShelf, MobileBookShelf, AmbientParticles, Comets, UFO
│   │   │   ├── layout/                      # AppLayout, AppHeader, MobileMenu, SearchBar, NotificationCenter, CatchAll
│   │   │   ├── modals/                      # AddBookModal, AddWishlistBookModal, BookDetailModal, DemoBookDetailModal, EditBookModal, ReadingCalendarModal
│   │   │   ├── reading/                     # YearlyTargetCards
│   │   │   ├── shelf/                       # Bookshelf, SortableShelf, Shelf, Book, LightingControl, Add/EditShelfModal
│   │   │   │   ├── book-elements/           # BookSpine, BookTooltip, bookConstants, useBookInteraction
│   │   │   │   ├── lighting-control/        # BrightnessControl, ColorTempSelector, LightingControlPanel, LightingHeader, TableLampButton
│   │   │   │   └── shelf-elements/          # ShelfWoodFrame, ShelfBooksTrack, ShelfInfoBar, DeleteShelfModal, shelfConstants, useShelfScroll
│   │   │   ├── ui/                          # BigDigitalClock, FlipCalendar, LayoutPicker, ToastContainer
│   │   │   └── SEO.tsx                      # Helmet meta & page title wrapper
│   │   ├── constants/                       # editorialBooks, genres, dll.
│   │   ├── hooks/                           # useBooks, useShelves, useReadingSessions, useAccounting/*, useLighting, useAchievementTracker, useYearlyStats, dll.
│   │   ├── lib/
│   │   │   ├── api/                         # accounting.ts, achievements.ts, auth.ts, books.ts (transformBook), readingSessions.ts, statistics.ts
│   │   │   ├── apiClient.ts                 # Axios instance + CSRF X-XSRF-TOKEN interceptor
│   │   │   ├── reactQuery.ts                # Konfigurasi QueryClient global
│   │   │   └── ReactQueryProvider.tsx
│   │   ├── locales/                         # en/translation.json & id/translation.json
│   │   ├── pages/                           # 16 komponen halaman (Landing, Login, Dashboard, Library, Reading, Wishlist, Accounting, dll.)
│   │   ├── store/                           # Zustand: useBookstore.ts & useThemeStore.ts
│   │   ├── types/                           # TypeScript interfaces: accounting, app, book, collection, decorations, shelf
│   │   ├── App.tsx                          # BrowserRouter & konfigurasi rute publik/terproteksi
│   │   ├── i18n.ts                          # Setup i18next + LanguageDetector
│   │   └── index.css                        # Tailwind base & variabel warna global (--color-cream, --color-walnut, dll.)
│   ├── package.json
│   ├── tailwind.config.js                   # Pemetaan warna kustom (cream, darkBrown, walnut, gold, beige, night.*)
│   ├── vercel.json                          # Konfigurasi SPA rewrite Vercel untuk folder frontend
│   └── vite.config.ts
├── routes/
│   ├── api.php                              # Definisi rute /api/health & /api/v1/*
│   ├── console.php
│   └── web.php
├── tests/                                   # PHPUnit 11 Feature & Unit tests
├── composer.json                            # Script setup, dev (concurrently 4 proses), test
├── vercel.json                              # Konfigurasi monorepo Vercel pointing ke frontend/dist
└── README.md
```

---

## 2. Alur Eksekusi & Development Workflow (`composer.json`)

Skrip `composer dev` menjalankan 4 proses secara paralel via `npx concurrently`:
1. `php artisan serve` — Backend API Server Laravel.
2. `php artisan queue:listen --tries=1 --timeout=0` — Worker antrean job background.
3. `php artisan pail --timeout=0` — Log streaming terminal real-time.
4. `npm run dev` — Vite asset watcher (atau `cd frontend && npm run dev` untuk SPA frontend port `5173`).
