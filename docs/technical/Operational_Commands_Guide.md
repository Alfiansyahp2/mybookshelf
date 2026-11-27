# Panduan Perintah Operasional & Generator CLI

Dokumen ini merangkum perintah-perintah praktis untuk pengembangan harian, sinkronisasi kontrak API, background worker, pengujian, serta pemeliharaan aplikasi **MyBookshelf**.

> [!NOTE]
> Berkas `openapi.json` di root proyek merupakan hasil generate otomatis penuh dari kode backend (`routes/`, controller, dan FormRequest), **tidak dibaca saat runtime**, dan telah dimasukkan ke `.gitignore` sehingga aman untuk tidak disimpan di repositori Git. Anda dapat men-generate ulang kapan saja melalui perintah di bawah ini.

---

## 1. Kontrak API (OpenAPI & TypeScript Schema)

Gunakan perintah berikut setiap kali menambah, mengubah, atau menghapus endpoint API, parameter request, maupun struktur response JSON di backend Laravel:

```bash
# 1. Generate ulang skema OpenAPI dari kode backend Laravel (Scramble)
composer openapi

# 2. Generate ulang definisi tipe TypeScript frontend dari openapi.json
npm --prefix frontend run generate:api
```

Perintah bantu Scramble lainnya:

| Perintah | Fungsi |
| --- | --- |
| `php artisan scramble:export --path=openapi.json` | Sama dengan `composer openapi`; mengekspor skema OpenAPI 3.1 ke `openapi.json`. |
| `php artisan scramble:analyze` | Memeriksa apakah ada route atau tipe controller yang gagal dianalisis Scramble. |
| `php artisan scramble:cache` | Men-cache dokumen OpenAPI di server bila mode dokumentasi runtime diaktifkan. |
| `php artisan scramble:clear` | Menghapus cache dokumen OpenAPI Scramble. |

> [!TIP]
> Berkas `frontend/src/shared/api/schema.d.ts` dapat tetap disimpan di Git sebagai kontrak tipe TypeScript untuk frontend, sementara `openapi.json` cukup di-generate lokal saat diperlukan.

---

## 2. Setup Awal & Pengembangan Lokal

```bash
# Setup proyek pertama kali (install dependensi PHP & JS, salin .env jika belum ada,
# generate APP_KEY, jalankan migrasi, dan build frontend)
composer setup

# Jalankan seluruh stack dev secara paralel:
# Laravel server + queue:listen + pail logs + Vite frontend dev server
composer dev
```

Jika hanya ingin menjalankan Vite dev server frontend secara terpisah:

```bash
npm --prefix frontend run dev
```

---

## 3. Queue Worker & Task Scheduler

Beberapa fitur berjalan di latar belakang melalui queue dan scheduler (`routes/console.php`):
- **Queue Jobs**: `ProcessBookCoverJob`, `ExportAccountingReportJob`, `SyncCurrencyRatesJob`, `SendBudgetAlertJob`, dan evaluasi pencapaian pengguna.
- **Jadwal Otomatis (`routes/console.php`)**:
  - `currency:sync-rates` — setiap hari pukul `02:00` (`withoutOverlapping`).
  - `SendBudgetAlertJob` — setiap jam (`withoutOverlapping`).

### Menjalankan Secara Lokal

```bash
# Menjalankan queue worker lokal (otomatis memuat perubahan kode PHP tanpa restart)
php artisan queue:listen --tries=1 --timeout=0

# Menjalankan scheduler lokal agar job terjadwal berjalan otomatis
php artisan schedule:work

# Melihat daftar seluruh task terjadwal
php artisan schedule:list
```

### Menjalankan di Lingkungan Produksi

```bash
# Jalankan queue worker daemon (umumnya dikelola Supervisor / systemd)
php artisan queue:work --tries=3

# Wajib dipicu setiap menit melalui cron sistem operasi:
# * * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
php artisan schedule:run
```

### Manajemen & Troubleshooting Queue

| Perintah | Fungsi |
| --- | --- |
| `php artisan queue:failed` | Melihat daftar job queue yang gagal. |
| `php artisan queue:retry all` | Menjalankan ulang seluruh job yang gagal. |
| `php artisan queue:restart` | Memberi sinyal restart ke worker daemon setelah deploy kode baru. |
| `php artisan queue:flush` | Menghapus seluruh catatan job gagal dari tabel `failed_jobs`. |

---

## 4. Custom Artisan Commands (Data & Akuntansi)

| Perintah | Fungsi |
| --- | --- |
| `php artisan currency:sync-rates` | Mengantrekan sinkronisasi kurs mata uang ke mata uang dasar (`IDR`). |
| `php artisan currency:sync-rates --sync` | Menjalankan sinkronisasi kurs secara langsung (sinkron, tanpa menunggu queue worker). |
| `php artisan accounting:sync-books` | Menyinkronkan buku yang memiliki `purchase_price > 0` ke modul pengeluaran akuntansi. |

---

## 5. Pengujian, Linting & Build

Jalankan rangkaian pemeriksaan berikut sebelum membuat commit atau pull request:

### Backend (Laravel / PHP)

```bash
# Memeriksa standar formatting kode PHP (Laravel Pint) tanpa mengubah file
./vendor/bin/pint --test

# Memperbaiki formatting kode PHP secara otomatis
./vendor/bin/pint

# Static analysis dengan Larastan (PHPStan Level 6)
composer analyse

# Audit kerentanan keamanan paket Composer
composer audit

# Menjalankan test suite backend (membersihkan config cache terlebih dahulu)
composer test

# Alternatif ringkas saat pengembangan
php artisan test --compact
```

### Frontend (React / TypeScript / Vite)

```bash
# Linter ketat tanpa toleransi warning (oxlint --deny-warnings)
npm --prefix frontend run lint

# Pemeriksaan tipe TypeScript
npm --prefix frontend run typecheck

# Unit & integration test (Vitest + Testing Library + MSW)
npm --prefix frontend run test:unit

# Build produksi frontend (menjalankan typecheck + vite build)
npm --prefix frontend run build

# Memvalidasi batas ukuran bundle produksi (gzip)
npm --prefix frontend run check:budget

# Pratinjau hasil build produksi secara lokal
npm --prefix frontend run preview

# Install browser Chromium untuk Playwright E2E (cukup sekali per mesin)
npm --prefix frontend exec playwright -- install chromium

# Menjalankan E2E smoke suite dengan server terisolasi (port 8010 + DB testing)
npm --prefix frontend run test:e2e
```

---

## 6. Database, Migrasi, Cache & Storage

```bash
# Memeriksa status seluruh file migrasi
php artisan migrate:status

# Menjalankan migrasi baru (gunakan --force di lingkungan non-interaktif/produksi)
php artisan migrate --force

# Menjalankan seeder referensi dasar secara selektif (contoh seeder data statis/kategori)
php artisan db:seed --class=AchievementSeeder
php artisan db:seed --class=DefaultExpenseCategorySeeder

# Membuat symlink storage publik jika diperlukan oleh driver lokal
php artisan storage:link
```

### Cache & Optimasi Deploy

```bash
# Mem-build cache konfigurasi, route, dan metadata Laravel untuk produksi
php artisan optimize

# Membersihkan seluruh cache Laravel (jalankan setelah mengubah .env atau config)
php artisan optimize:clear
```

> [!IMPORTANT]
> Hindari menjalankan `php artisan migrate:fresh` atau `php artisan db:wipe` pada database produksi atau database yang sudah berisi data pengguna karena seluruh tabel akan dihapus dan dibuat ulang.
