# Audit Codebase & Roadmap Perbaikan MyBookshelf
## Ringkasan Eksekutif (`docs/improvement/`)

Direktori ini berisi hasil audit teknis menyeluruh terhadap basis kode aktual **MyBookshelf** (Backend Laravel 12, Frontend React 19 + TypeScript, PostgreSQL, serta konfigurasi CI/CD & repositori). Setiap temuan dirujuk langsung ke jalur berkas, simbol, dan perilaku kode yang teramati.

---

## 1. Peta Dokumen Perencanaan & Audit

### A. Perencanaan Arsitektur & Kesiapan Produksi (*Route-Wide Masterplan — Terbaru*)

| Dokumen | Cakupan | Fokus Utama |
| :--- | :--- | :--- |
| **[Stage 1: Architecture & Foldering Audit Plan](ARCHITECTURE_FOLDERING_AUDIT_PLAN.md)** | Seluruh `111` route Laravel, `18` path SPA `App.tsx`, root & CI | Audit lengkap file/folder per route, pemetaan artefak yatim (`Room`, `App.css`, `mockData.ts`, skrip `.py`/`.sql`), dual build Vite/Tailwind, serta arsitektur target *Domain-Grouped Backend* + *Vertical-Slice Feature Frontend* dan urutan migrasi `Fase 1A–1E`. |
| **[Stage 2: Production Architecture Masterplan](PRODUCTION_ARCHITECTURE_MASTERPLAN.md)** | Evolusi Tahap 1 menuju *Production-Grade System* | Skalabilitas data & paginasi server-side, indeks PostgreSQL `pg_trgm`, abstraksi Object Storage S3/R2, Queue Worker (`ShouldQueue`), hardening Sanctum/CSRF/Policy/OpenAPI, ErrorBoundary & boundary linting Frontend, piramida test (Larastan, Vitest, Playwright), serta topologi deployment & release gate. |
| **[Implementation Phases Roadmap](IMPLEMENTATION_PHASES_ROADMAP.md)** | Rencana eksekusi **Phase 0 – Phase 6** (PR-sized) | Pemecahan lengkap implementasi Stage 1 + Stage 2 menjadi 7 fase bertahap dengan prasyarat, daftar file konkret, strategi kompatibilitas *Expand-Contract*, dan *Exit Gate* di akhir setiap fase. |

### B. Audit Teknis Baseline (*Riwayat Awal — Sebagian Sudah Teratasi*)

| Dokumen | Cakupan Audit | Fokus Utama |
| :--- | :--- | :--- |
| **[Backend Improvements](BACKEND_IMPROVEMENTS.md)** | `app/`, `routes/`, `config/` | Bug macro error HTTP, celah validasi IDOR (`ownedRule` kini sudah ditambahkan), inkonsistensi `BookObserver` & `BookController`, upload cover, stub export. |
| **[Frontend Improvements](FRONTEND_IMPROVEMENTS.md)** | `frontend/src/` | Endpoint `useRooms` (sudah dihapus), 4 halaman stub (sudah diimplementasikan), `193` warning `oxlint` (kini `0`), tipe `any` (kini tersisa `42`), code-splitting Vite (kini aktif). |
| **[Infra, DB & Quality Improvements](INFRA_DB_AND_QUALITY_IMPROVEMENTS.md)** | `.env.example`, `README.md`, `tests/`, `.github/` | Konflik SQLite vs query PostgreSQL `ilike`, konfigurasi CORS/Sanctum, cakupan test (`17` test / `134` assertion berjalan di `php artisan test --compact`), CI & artefak root. |

---

## 2. Matriks Prioritas Eksekusi

| Prioritas | Kategori | Temuan Kritis | Dampak Jika Tidak Diperbaiki |
| :--- | :--- | :--- | :--- |
| **P0 (Kritis)** | Backend Bug | Argumen `response()->error()` salah urutan di 5+ controller | Client menerima HTTP `400` dengan `"errors": 500` alih-alih status `404`/`422`/`500`, serta raw exception bocor ke user. |
| **P0 (Kritis)** | Keamanan | Validasi `exists:` pada `shelf_id`, `book_id`, `room_id` tanpa filter `user_id` | Potensi *Cross-Tenant IDOR* (user mengaitkan resource ke ID milik user lain). |
| **P0 (Kritis)** | Kontrak API | `BookController::update()` memvalidasi `rating`/`notes`, DB memakai `personal_rating`/`personal_notes` | Update rating/catatan melalui `PUT/PATCH /books/{id}` terabaikan atau gagal terpetakan. |
| **P1 (Tinggi)** | Data Integrity | `BookObserver` hardcode `'IDR'` & `'other'`, abaikan `purchase_currency` & `is_gift` | Buku hadiah atau buku mata uang asing tercatat salah sebagai transaksi `IDR`. |
| **P1 (Tinggi)** | Kontrak API | `useRooms.ts` memanggil `/v1/rooms` yang tidak ada di `routes/api.php` | Request room selalu menghasilkan `404 Endpoint not found`. |
| **P1 (Tinggi)** | Config / DB | `.env.example` & `README.md` mengarah ke `sqlite`, padahal `BookService` pakai `ilike` PostgreSQL | Aplikasi error di lokal bagi pengembang baru yang mengikuti dokumentasi setup. |
| **P2 (Menengah)** | Frontend UX | 4 halaman rute aktif (`BorrowLoan`, `Collections`, `Notes`, `Statistics`) masih stub | Menu/rute tersedia tetapi belum fungsional saat diakses user. |
| **P2 (Menengah)** | Storage & File | `ShelfController::destroy` biarkan buku yatim; `uploadCover` gagal hapus file lama | File cover menumpuk di disk `public` dan buku hilang dari tampilan rak. |
| **P3 (Rendah)** | Quality & CI | `tests/` hanya `ExampleTest`, `193` warning `oxlint`, `66` `console.*`, chunk `1.6 MB` | Regresi sulit dideteksi otomatis dan beban *initial JS download* besar. |
