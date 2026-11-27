# Dokumentasi Teknis & Spesifikasi Rekayasa MyBookshelf

Selamat datang di repositori dokumentasi rekayasa perangkat lunak resmi untuk **MyBookshelf** — platform perpustakaan digital, pelacak bacaan waktu-nyata, dan pembukuan literatur berbasis arsitektur terpisah (*Decoupled Laravel 12 API + React 19 SPA*).

Seluruh dokumen di bawah ini ditulis secara spesifik berdasarkan basis kode aktual di repositori (`app/`, `database/migrations/`, `routes/api.php`, `frontend/src/`), mencakup arsitektur backend, frontend, kontrak API, skema PostgreSQL, hingga sistem desain UI/UX.

---

## 1. Arsitektur & Cetak Biru Sistem (`architecture/`)

* 🏛️ **[Spesifikasi Arsitektur Sistem](architecture/SYSTEM_ARCHITECTURE.md)**  
  *Topologi Decoupled Client-Server (Laravel 12 API + React 19 SPA), alur autentikasi stateful Sanctum + XSRF-TOKEN, diagram C4 & sequence, pola event-driven `BookObserver`, serta optimasi caching TanStack Query dan memoization React.*

* 📋 **[Rekam Keputusan Arsitektur / ADR](architecture/DECISION_RECORDS.md)**  
  *Rekam jejak keputusan teknis dan trade-off (ADR-001 s/d ADR-008): PostgreSQL UUID primary keys, pemisahan Zustand vs TanStack Query, engine rak 3D berbasis CSS, `@dnd-kit` layout grid, isolasi Dual-Theme, dan sinkronisasi otomatis pengeluaran buku.*

---

## 2. Spesifikasi Teknis Inti (`specifications/`)

* 🌳 **[Susunan & Organisasi Proyek](specifications/PROJECT_STRUCTURE.md)**  
  *Pohon direktori lengkap monorepo backend Laravel dan subfolder `frontend/`, daftar controller, model, service, komponen UI, serta skrip workflow `composer dev`.*

* ⚙️ **[Spesifikasi Arsitektur Backend (Laravel 12)](specifications/BACKEND_ARCHITECTURE.md)**  
  *Konfigurasi `bootstrap/app.php`, 5 Service layer bisnis (`BookService`, `ReadingSessionService`, `ExpenseService`, `BudgetService`, `CurrencyRateService`), `BookObserver`, Response Macros, Artisan CLI `accounting:sync-books`, serta model Eloquent.*

* ⚛️ **[Spesifikasi Arsitektur Frontend (React 19 + TypeScript)](specifications/FRONTEND_ARCHITECTURE.md)**  
  *Routing publik vs `ProtectedRoute`, transisi halaman membalik 3D di `AppLayout`, interceptor `ApiClient`, adapter `transformBook()`, store Zustand (`useBookstore`, `useThemeStore`, `useLighting`, `useNotifications`), TanStack Query, hirarki rak 3D, i18n, dan SEO.*

* 🗄️ **[Skema Basis Data PostgreSQL (`DATABASE_SCHEMA.md`)](specifications/DATABASE_SCHEMA.md)**  
  *Diagram ERD menyeluruh, spesifikasi seluruh tabel inti dan akuntansi dengan primary key UUID, enum PostgreSQL, kolom JSON/JSONB, indeks komposit, SoftDeletes, dan self-referential foreign key.*

* 🔌 **[Spesifikasi RESTful API v1](specifications/API_SPECIFICATION.md)**  
  *Referensi lengkap seluruh rute `routes/api.php`: autentikasi SPA Sanctum, operasi siklus hidup buku, sesi baca, rak 3D, koleksi, statistik, pencapaian, serta sistem akuntansi lengkap (expenses, budgets, categories, currency rates, reports).*

* 🎨 **[Spesifikasi UI/UX & Design System](specifications/UI_UX_DESIGN_SYSTEM.md)**  
  *Isolasi Dual-Theme (Warm Teak & Ivory Sanctuary vs Celestial Midnight Landing), token warna CSS/Tailwind, dimensi rak (`BOOK_AREA_H=200`, `BOARD_H=14`, `INFO_H=32`), ukuran buku (`HEIGHT_RATIO` & `THICKNESS_PX`), tekstur matte, 5 preset lampu rak, dan 15 dekorasi.*

---

## 3. Panduan Fitur Fungsional (`features/`)

* 📚 **[Kustomisasi Rak Buku 3D](features/Kustomisasi_Rak_Buku.md)** — Katalog dekorasi rak, kontrol pencahayaan, dan tata letak rak fisik.
* ⏱️ **[Sistem Membaca & Timer Sesi](features/Sistem_Membaca.md)** — Alur kerja *Reading Session Timer*, jeda/resume, dan pencatatan progres harian.
* 💰 **[Manajemen Keuangan & Anggaran](features/Manajemen_Keuangan.md)** — Panduan sistem akuntansi buku internal (anggaran, transaksi, kategori, dan laporan).

---

## 4. Audit & Rencana Perbaikan (`improvement/`)

* 🔍 **[Ringkasan Audit & Matriks Prioritas](improvement/INDEX.md)** — Ringkasan eksekutif seluruh temuan codebase beserta skala prioritas P0–P3.
* ⚙️ **[Rencana Perbaikan Backend](improvement/BACKEND_IMPROVEMENTS.md)** — Bug macro error HTTP, celah IDOR validasi FK, `BookObserver`, dan manajemen aset cover.
* ⚛️ **[Rencana Perbaikan Frontend](improvement/FRONTEND_IMPROVEMENTS.md)** — Endpoint `useRooms`, halaman stub, 193 warning `oxlint`, 59 tipe `any`, 66 `console.*`, dan code-splitting bundle.
* 🛡️ **[Perbaikan Infrastruktur, DB, & Testing](improvement/INFRA_DB_AND_QUALITY_IMPROVEMENTS.md)** — Sinkronisasi `.env.example` ke PostgreSQL, CORS/Sanctum env, automated tests, dan CI/CD hardening.

---

## 5. Referensi Implementasi & Riwayat Evolusi (`technical/` & `history/`)

* 🔗 **[Ringkasan Implementasi API](technical/API_Implementation.md)** — Status implementasi backend/frontend API v1 terkini.
* 🖼️ **[Arsitektur Sistem Modal](technical/Modal_System_Architecture.md)** — Spesifikasi implementasi aktual seluruh modal dialog (`BookDetailModal`, `EditBookModal`, `AddBookModal`, `AddShelfModal`, dll.).
* 🔒 **[Log Perbaikan Autentikasi](technical/Authentication_Fix_Log.md)** — Catatan perbaikan alur login SPA dan proteksi rute.
* 🗃️ **[Panduan Data Seeder](technical/Book_Seeder_Guide.md)** — Panduan injeksi dataset buku statis (*seeding*).
* 🛠️ **[Panduan Perintah Operasional & Generator CLI](technical/Operational_Commands_Guide.md)** — Referensi perintah OpenAPI/TypeScript generator, queue worker, scheduler, linting, testing, migrasi, dan maintenance CLI.
* 🚧 **[Rencana Refactoring (Agustus 2026)](history/Refactoring_Plan_Agustus.md)** & 📈 **[Laporan Progres & Arsitektur](history/Progress_Report.md)** — Catatan historis modularisasi komponen.
