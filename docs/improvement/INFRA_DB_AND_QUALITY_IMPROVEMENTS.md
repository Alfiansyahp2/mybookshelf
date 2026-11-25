# Audit Infrastruktur, Database, Testing, & Kebersihan Repositori
## MyBookshelf Improvement Specification

Dokumen ini merangkum temuan lintas-sistem (*cross-cutting*) di luar logika halaman individu, meliputi konsistensi basis data, konfigurasi lingkungan, cakupan pengujian otomatis, pipeline CI/CD, dan kebersihan berkas repositori.

---

## 1. Konflik Konfigurasi Database: PostgreSQL vs SQLite

### Fakta Audit
* [`BookService.php`](file:///c:/laragon/www/mybookshelf/app/Services/BookService.php) menggunakan operator pencarian case-insensitive **`ilike`** (eksklusif milik PostgreSQL).
* Migrasi [`create_expenses_table.php`](file:///c:/laragon/www/mybookshelf/database/migrations/2026_07_09_000002_create_expenses_table.php) menjalankan raw SQL `DB::statement('ALTER TABLE expenses ADD CONSTRAINT ...')` khusus kompatibilitas PostgreSQL.
* Pipeline [`.github/workflows/ci.yml`](file:///c:/laragon/www/mybookshelf/.github/workflows/ci.yml) menjalankan pengujian menggunakan layanan `postgres:15`.
* **Masalah:** Berkas [`.env.example`](file:///c:/laragon/www/mybookshelf/.env.example) masih menetapkan `DB_CONNECTION=sqlite`, dan [`README.md`](file:///c:/laragon/www/mybookshelf/README.md) baris 32 masih menginstruksikan `touch database/database.sqlite`.

### Dampak & Perbaikan
Developer baru yang mengikuti `README.md` dan `.env.example` akan mengalami kegagalan query `ilike` saat melakukan pencarian buku. Perbarui `.env.example` dan `README.md` agar secara konsisten menetapkan **PostgreSQL** (`DB_CONNECTION=pgsql`, port `5432`) sebagai prasyarat resmi.

---

## 2. Kesiapan Konfigurasi Produksi (CORS & Sanctum)

* [`config/cors.php`](file:///c:/laragon/www/mybookshelf/config/cors.php): `allowed_origins` di-hardcode ke `['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5177']`.
* [`config/sanctum.php`](file:///c:/laragon/www/mybookshelf/config/sanctum.php): `stateful` di-hardcode ke daftar domain `localhost` dan `127.0.0.1` tanpa membaca `env('SANCTUM_STATEFUL_DOMAINS')`.
* **Perbaikan:** Ubah keduanya agar membaca variabel environment (`FRONTEND_URL` dan `SANCTUM_STATEFUL_DOMAINS`) dengan fallback localhost untuk mode pengembangan.

---

## 3. Cakupan Automated Testing & Pipeline CI/CD

### 3.1. Minimnya Cakupan Tes (`tests/`)
Direktori [`tests/`](file:///c:/laragon/www/mybookshelf/tests) saat ini baru memiliki tes bawaan skeleton Laravel:
* [`tests/Feature/ExampleTest.php`](file:///c:/laragon/www/mybookshelf/tests/Feature/ExampleTest.php) (`GET / -> 200`)
* [`tests/Unit/ExampleTest.php`](file:///c:/laragon/www/mybookshelf/tests/Unit/ExampleTest.php) (`assertTrue(true)`)

**Target Pengujian yang Perlu Dibangun:**
1. **Auth & Security Tests:** Alur `/sanctum/csrf-cookie` -> login -> rate limit `throttle:5,1` -> akses `401` tanpa login -> uji isolasi IDOR lintas user.
2. **Book & Shelf Domain Tests:** CRUD buku, update progres, alur baca ulang (`read-again`), pindah rak, dan batch `PUT /v1/shelves/layout`.
3. **Reading Session & Accounting Tests:** Akurasi kalkulasi durasi dengan jeda (`pause`/`resume`), `BookObserver` auto-sync harga buku ke tabel `expenses`, serta `BudgetService` alert threshold.

### 3.2. Penguatan Pipeline [`.github/workflows/ci.yml`](file:///c:/laragon/www/mybookshelf/.github/workflows/ci.yml)
* Job `backend-tests` menjalankan `./vendor/bin/pint --test` dengan `continue-on-error: true`.
* Job `frontend-build` menjalankan `npm run lint` (`oxlint`) dengan `continue-on-error: true` dan **tidak menjalankan `tsc --noEmit`**.
* **Perbaikan:** Setelah seluruh warning `oxlint` dan style Pint diselesaikan, hapus `continue-on-error: true` dan tambahkan langkah `npx tsc --noEmit` sebelum `vite build`.

---

## 4. Kebersihan Repositori, Legacy Views, & Encoding

* **Artefak & Skrip Sementara di Root & Frontend:** Terdapat berkas presentasi/skrip bantu seperti `gamma_assets.html`, `gamma_prompt.html`, `remove_bg.py`, `remove_bg_rembg.py`, `backup.sql` di root, serta `add_seo.py`, `fix_dots.py`, `update_achievements.py`, `update_translations.py` di `frontend/`. Pastikan berkas-berkas yang sudah tidak dipakai dibersihkan atau dipindah ke folder arsip terpisah.
* **Legacy View Laravel:** [`routes/web.php`](file:///c:/laragon/www/mybookshelf/routes/web.php) masih memiliki rute `/library` yang merender [`library.blade.php`](file:///c:/laragon/www/mybookshelf/resources/views/library.blade.php) (sisa UI sebelum migrasi ke React SPA).
* **Normalisasi Encoding:** Dokumen fitur lama di [`docs/features/`](file:///c:/laragon/www/mybookshelf/docs/features), [`docs/technical/Authentication_Fix_Log.md`](file:///c:/laragon/www/mybookshelf/docs/technical/Authentication_Fix_Log.md), [`docs/technical/Book_Seeder_Guide.md`](file:///c:/laragon/www/mybookshelf/docs/technical/Book_Seeder_Guide.md), serta [`docs/history/`](file:///c:/laragon/www/mybookshelf/docs/history) masih mengandung artefak mojibake UTF-8 dari konversi encoding sebelumnya.
