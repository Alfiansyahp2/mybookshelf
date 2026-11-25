# Audit Codebase & Roadmap Perbaikan MyBookshelf
## Ringkasan Eksekutif (`docs/improvement/`)

Direktori ini berisi hasil audit teknis menyeluruh terhadap basis kode aktual **MyBookshelf** (Backend Laravel 12, Frontend React 19 + TypeScript, PostgreSQL, serta konfigurasi CI/CD & repositori). Setiap temuan dirujuk langsung ke jalur berkas, simbol, dan perilaku kode yang teramati.

---

## 1. Peta Dokumen Perbaikan

| Dokumen | Cakupan Audit | Fokus Utama |
| :--- | :--- | :--- |
| **[Backend Improvements](BACKEND_IMPROVEMENTS.md)** | `app/`, `routes/`, `config/` | Bug macro error HTTP, celah validasi IDOR, inkonsistensi `BookObserver` & `BookController`, orphan files upload cover, stub export. |
| **[Frontend Improvements](FRONTEND_IMPROVEMENTS.md)** | `frontend/src/` | Broken endpoint `useRooms`, 4 halaman stub, `193` warning `oxlint`, `59` tipe `any`, `66` debug `console.*`, bundle `1.6 MB` tanpa code-splitting. |
| **[Infra, DB & Quality Improvements](INFRA_DB_AND_QUALITY_IMPROVEMENTS.md)** | `.env.example`, `README.md`, `tests/`, `.github/` | Konflik instruksi SQLite vs query PostgreSQL `ilike`, hardcoded CORS/Sanctum, minimnya automated test, CI `continue-on-error`, mojibake & artefak root. |

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
