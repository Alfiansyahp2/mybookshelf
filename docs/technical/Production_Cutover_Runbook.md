# Runbook Cutover Produksi & Rollback (MyBookshelf)

Dokumen ini menjadi panduan standar untuk deployment, finalisasi kontrak skema database (*Expand/Contract*), pemeriksaan probe kesehatan (*observability*), serta prosedur rollback **MyBookshelf**.

---

## 1. Topologi Produksi Terpisah (*Decoupled*)

Arsitektur produksi memisahkan tanggung jawab antar proses agar penskalaan dan isolasi gangguan berjalan aman:

| Komponen | Peran | Endpoint / Proses |
| --- | --- | --- |
| **Edge Static / SPA** | Menyajikan aset statis hasil `npm --prefix frontend run build` (`dist/`) | Nginx / CDN / Vercel |
| **Stateless Laravel API** | Menangani request REST API `/api/v1/*`, autentikasi Sanctum, & probe kesehatan | PHP-FPM + Nginx / HTTP worker |
| **Queue Worker** | Memproses job latar belakang (`ProcessBookCoverJob`, `ExportAccountingReportJob`, `SyncCurrencyRatesJob`, `SendBudgetAlertJob`) | `php artisan queue:work --tries=3` |
| **Task Scheduler** | Memicu jadwal berkala (`routes/console.php`) | `* * * * * php artisan schedule:run` |
| **PostgreSQL 15+** | Penyimpanan data utama (UUID primary key, `numeric(12,2)` / `numeric(12,6)`) | Koneksi privat TLS |
| **Redis 7+** | Cache terdistribusi, rate-limiter, dan antrean queue | `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis` |
| **Object Storage (S3/R2)** | Penyimpanan sampul buku & struk terisolasi per user | `FILESYSTEM_DISK=s3` atau `public` |

---

## 2. Observability, Health Probes & Tracing

### Liveness vs Readiness Probe
- **Liveness (`/up`)**: Probe ringan bawaan Laravel untuk memastikan proses HTTP/PHP masih responsif (digunakan oleh load balancer/container orchestrator untuk *restart*).
- **Readiness (`/api/health`)**: Dikelola oleh `App\Support\Health\ReadinessChecker`. Mengembalikan status `200 OK` jika seluruh dependensi kritis sehat (`database`, `cache`, `storage`), dan `503 Service Unavailable` tanpa membocorkan kredensial atau stack trace apabila salah satu dependensi gagal.

### Request Tracing & Structured Logging
- Middleware `App\Http\Middleware\AttachRequestId` menerima header `X-Request-Id` yang valid (alphanumeric/dash/underscore/dot) atau membuat UUID v4 baru, menyisipkannya ke header respons `X-Request-Id`, konteks logger Laravel (`request_id`), dan tag Sentry.
- Channel log terstruktur JSON tersedia di `config/logging.php` (`LOG_CHANNEL=json` atau `stderr` dengan format JSON di produksi) untuk memudahkan agregasi log terpusat.
- Pelacakan error opsional via **Sentry** aktif secara otomatis hanya ketika variabel lingkungan `SENTRY_LARAVEL_DSN` (backend) dan `VITE_SENTRY_DSN` (frontend) diisi.

---

## 3. Checklist Sebelum Cutover (*Pre-Flight*)

1. **Snapshot Database Wajib**: Ambil *logical backup* atau snapshot disk PostgreSQL sebelum menjalankan migrasi skema baru:
   ```bash
   pg_dump -Fc -h <host> -U <user> -d <db_name> -f pre_cutover_$(date +%Y%m%d_%H%M%S).dump
   ```
2. **Validasi Gate CI/CD**: Pastikan seluruh job di `.github/workflows/ci.yml` (`backend-quality`, `backend-tests`, `frontend-quality`, dan `e2e-smoke`) berstatus hijau tanpa *bypass*.
3. **Siapkan Variabel Lingkungan Produksi**:
   - `APP_ENV=production`, `APP_DEBUG=false`, `LOG_CHANNEL=json`
   - `CORS_ALLOWED_ORIGINS` dan `SANCTUM_STATEFUL_DOMAINS` hanya menunjuk domain produksi
   - `SENTRY_LARAVEL_DSN` & `APP_VERSION` / `SENTRY_RELEASE` (opsional) serta `VITE_SENTRY_DSN` & `VITE_APP_VERSION` saat build frontend

---

## 4. Kontrak Final Database (*Expand/Contract*: Drop `rooms`)

Fitur `rooms` telah dinonaktifkan pada kode aplikasi sejak fase sebelumnya (*Expand* & masa transisi). Migrasi kontrak final berada pada:
- `database/migrations/2026_11_28_000001_drop_rooms_table_and_shelves_room_id.php`

### Langkah Cutover Aman
1. Pastikan tidak ada kode backend maupun frontend aktif yang membaca kolom `shelves.room_id` atau tabel `rooms`.
2. Backup database terlebih dahulu (khususnya bila tabel `rooms` masih memiliki baris historis yang ingin diarsipkan).
3. Verifikasi status migrasi sebelum eksekusi:
   ```bash
   php artisan migrate:status
   ```
4. Jalankan migrasi pada jendela pemeliharaan singkat (*maintenance window*) atau saat seluruh node API sudah memakai versi kode terbaru:
   ```bash
   php artisan migrate --force
   ```
5. Segarkan cache aplikasi dan restart queue worker:
   ```bash
   php artisan optimize
   php artisan queue:restart
   ```
6. Verifikasi kesehatan layanan:
   ```bash
   curl -i https://<api-domain>/up
   curl -i https://<api-domain>/api/health
   ```

---

## 5. Prosedur Rollback Darurat

### A. Rollback Aplikasi Tanpa Perubahan Skema
1. Arahkan traffic / deploy ulang build image atau release tag sebelumnya (`git checkout <previous-release-tag>`).
2. Jalankan `php artisan optimize:clear && php artisan optimize && php artisan queue:restart`.
3. Periksa `/api/health` dan log JSON `request_id` hingga metrik error kembali normal.

### B. Rollback Skema Migrasi Kontrak (`rooms`)
Migrasi `2026_11_28_000001_drop_rooms_table_and_shelves_room_id.php` menyediakan method `down()` untuk memulihkan struktur tabel `rooms` dan kolom nullable `shelves.room_id`:
```bash
php artisan migrate:rollback --step=1 --force
```
> [!WARNING]
> `migrate:rollback` mengembalikan **struktur tabel/kolom**, bukan isi baris data `rooms` yang sudah terhapus saat `up()`. Untuk mengembalikan data historis secara utuh, pulihkan dari snapshot `pg_dump` yang diambil sebelum cutover menggunakan `pg_restore`.
