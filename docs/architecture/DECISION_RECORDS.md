# Architecture Decision Records (ADR)
## MyBookshelf Engineering Blueprint

Dokumen ini mencatat keputusan arsitektural fundamental (*Architecture Decision Records*) yang diambil dalam pengembangan **MyBookshelf**, lengkap dengan konteks masalah, opsi alternatif, keputusan final, dan dampaknya pada implementasi kode.

---

## Ringkasan Keputusan

| ADR ID | Keputusan Arsitektur | Status | Lokasi Implementasi Kunci |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Arsitektur Decoupled (Laravel 12 API + React 19 SPA) | Diterima | `routes/api.php`, `frontend/src/App.tsx` |
| **ADR-002** | PostgreSQL dengan Primary Key UUID (`HasUuids`) & Native ENUM/JSON | Diterima | `database/migrations/*`, `app/Models/*` |
| **ADR-003** | Sanctum Stateful SPA Cookie + CSRF (`X-XSRF-TOKEN`) vs Bearer Token | Diterima | `bootstrap/app.php`, `config/sanctum.php`, `apiClient.ts` |
| **ADR-004** | Pemisahan Cache Server (TanStack Query) dan State UI (Zustand) | Diterima | `reactQuery.ts`, `frontend/src/store/*` |
| **ADR-005** | CSS 3D Procedural Book & Shelf Engine vs WebGL/Three.js | Diterima | `Book.tsx`, `BookSpine.tsx`, `ShelfWoodFrame.tsx` |
| **ADR-006** | `@dnd-kit` untuk Pengaturan Tata Letak Rak Grid 12-Kolom | Diterima | `Bookshelf.tsx`, `SortableShelf.tsx` |
| **ADR-007** | Isolasi Dual-Theme: Cosmic Midnight Landing vs Warm Teak App | Diterima | `index.css`, `LandingPage.tsx`, `Reading.tsx` |
| **ADR-008** | Event-Driven Auto-Sync Pengeluaran Buku via `BookObserver` | Diterima | `BookObserver.php`, `SyncBookExpensesCommand.php` |

---

### ADR-001: Arsitektur Decoupled (Laravel 12 REST API + React 19 SPA)

* **Konteks:** Aplikasi memerlukan interaksi UI kaya (rak kayu 3D, transisi halaman membalik 3D `rotateY`, drag-and-drop rak, timer membaca real-time, serta modal buku dua halaman) yang tidak boleh memicu reload halaman server penuh.
* **Opsi Dipertimbangkan:**
  1. Monolith Laravel Blade + Livewire/Alpine.js (membuat state sinkronisasi timer & animasi 3D antar komponen menjadi kaku).
  2. Decoupled API + React SPA dengan Vite bundler.
* **Keputusan:** Memisahkan **Laravel 12** sebagai RESTful API murni (`/api/v1/*`) dan **React 19 + TypeScript + Vite 8** sebagai SPA di direktori `frontend/`.
* **Konsekuensi:** Memerlukan konfigurasi CORS (`config/cors.php`) untuk origin lokal (`localhost:5173`, `5177`, `3000`) serta lapisan adapter `transformBook()` di frontend untuk memetakan kontrak `snake_case` Laravel ke `camelCase` TypeScript.

---

### ADR-002: PostgreSQL dengan Primary Key UUID & Native ENUM/JSON

* **Konteks:** Model data melibatkan entitas finansial (`expenses`, `budgets`, `currency_rates`), log aktivitas (`timeline_events`, `accounting_timeline_events`), serta metadata dinamis (`decorations`, `read_dates`). Selain itu, ID sekuensial berisiko membocorkan volume data via URL/API.
* **Keputusan:** Menggunakan **PostgreSQL** (`DB_CONNECTION=pgsql`) dengan:
  * **UUID Primary Key (`uuid('id')->primary()`)** dan trait Laravel `HasUuids` pada seluruh model utama.
  * **Pemisahan Kolom Warna Spine:** Pada migrasi `create_books_table.php`, warna spine dipecah menjadi 3 kolom terpisah (`spine_color_light`, `spine_color_medium`, `spine_color_dark`) untuk kompatibilitas skema relasional yang bersih di PostgreSQL.
  * **JSON/JSONB Columns:** `timeline_events.metadata` (`jsonb`), `shelves.decorations` (`json`), `books.read_dates` (`json`).
* **Konsekuensi:** Foreign key self-referential seperti `expenses.parent_expense_id` ditambahkan melalui `DB::statement('ALTER TABLE ...')` setelah tabel dibuat demi kompatibilitas penuh dengan PostgreSQL.

---

### ADR-003: Laravel Sanctum Stateful SPA Auth vs LocalStorage Bearer Token

* **Konteks:** Penyimpanan API token jangka panjang di `localStorage` rentan terhadap pencurian token melalui skrip XSS.
* **Keputusan:** Menggunakan autentikasi SPA stateful berbasis cookie HttpOnly milik Sanctum:
  * `EnsureFrontendRequestsAreStateful` pada grup middleware API di `bootstrap/app.php`.
  * Frontend memanggil `GET /sanctum/csrf-cookie` terlebih dahulu sebelum `POST /api/v1/auth/login`, lalu `apiClient.ts` menyisipkan `X-XSRF-TOKEN` pada setiap permintaan mutasi dengan `withCredentials: true`.
  * Rute `api/v1/auth/login` dan `api/v1/auth/register` dikecualikan secara eksplisit dari verifikasi CSRF di `bootstrap/app.php`, sementara login dilindungi `throttle:5,1`.
* **Konsekuensi:** `localStorage.getItem("user")` hanya menyimpan penanda/profil UI non-sensitif untuk kebutuhan `ProtectedRoute` dan flag `enabled` pada React Query; validitas sesi sesungguhnya tetap ditegakkan oleh server melalui cookie terenkripsi.

---

### ADR-004: Pemisahan Server State (TanStack Query v5) dan Client State (Zustand)

* **Konteks:** Menggabungkan data hasil fetch server (daftar buku, rak, pengeluaran) dan state antarmuka sementara (modal terbuka, kata kunci pencarian, lampu rak) ke dalam satu store monolitik meningkatkan boilerplate dan menyebabkan ketidaksinkronan cache.
* **Keputusan:**
  * **TanStack Query v5 (`reactQuery.ts`):** Mengelola seluruh data server dengan `staleTime` 5 menit, `gcTime` 10 menit, `refetchOnWindowFocus: false`, serta invalidasi query key terarah (`["books"]`, `["shelves"]`, `["accounting", ...]`).
  * **Zustand:** Dibatasi pada store ringan sesuai domain UI:
    * `useBookstore`: state UI transient tanpa persistensi (`selectedBookId`, `isBookDetailOpen`, `searchQuery`, `activeFilter`, `sidebarCollapsed`).
    * `useThemeStore`, `useLighting`, `useNotifications`, `useAchievementStore`: memakai middleware `persist` ke `localStorage` hanya untuk preferensi/riwayat klien lokal.

---

### ADR-005: CSS 3D Procedural Engine vs WebGL (Three.js)

* **Konteks:** Rak buku harus terlihat realistis dengan tekstur serat kayu, kain jilid buku matte, pencahayaan lampu meja yang dapat diatur warnanya, serta interaksi spring saat disentuh, namun harus tetap ringan di perangkat mobile.
* **Keputusan:** Menggunakan **CSS 3D Transforms + Framer Motion + Procedural Gradients** (`Book.tsx`, `BookSpine.tsx`, `ShelfWoodFrame.tsx`):
  * Dimensi buku dihitung secara deterministik dari `HEIGHT_RATIO` (`short: 0.72`, `medium: 0.86`, `tall: 0.96`) dan `THICKNESS_PX` (`thin: 18`, `regular: 26`, `thick: 38`).
  * Efek klik menggunakan animasi spring `rotateY: 10`, `scale: 1.06`, dan translasi sumbu Y dengan `transformStyle: "preserve-3d"`.
  * Serat kayu dan tenunan kanvas dirender menggunakan `repeating-linear-gradient` tanpa request aset gambar tekstur tambahan.

---

### ADR-006: Adopsi `@dnd-kit` untuk Editor Tata Letak Rak

* **Konteks:** Pengguna dapat masuk ke *Edit Mode* di halaman `/library` untuk mengubah urutan rak dan lebar kolom grid rak (`span` 2 sampai 12 kolom).
* **Keputusan:** Menggunakan `@dnd-kit/core` dan `@dnd-kit/sortable` (`PointerSensor`, `KeyboardSensor`, `rectSortingStrategy`, `closestCenter`) pada `Bookshelf.tsx` dan `SortableShelf.tsx`, lalu menyimpan perubahan secara batch melalui endpoint `PUT /api/v1/shelves/layout`.

---

### ADR-007: Isolasi Dual-Theme Visual

* **Konteks:** Landing Page berfungsi sebagai etalase dramatis bertema malam kosmik (*Celestial Midnight* `#0a0e1a` dengan efek nebula indigo/ungu/sky), sedangkan area kerja aplikasi (`/library`, `/dashboard`, `/reading`, `/wishlist`) digunakan untuk manajemen literatur jangka panjang dan membutuhkan keteduhan material kayu cokelat hangat tanpa bias warna biru.
* **Keputusan:**
  * Token global `:root` di `index.css` ditetapkan murni ke palet kayu hangat (`#f8f5f0`, `#4a3b2f`, `#7a5c42`, `#d4a574`, `#e8e0d5`) dengan dark mode internal `#1a1612` / `#201a14`.
  * Gaya biru kosmik dikunci secara eksplisit menggunakan utility class inline di `LandingPage.tsx` dan komponen di folder `components/landing/`.

---

### ADR-008: Otomatisasi Sinkronisasi Buku ke Akuntansi via `BookObserver`

* **Konteks:** Pengguna yang mengisi `purchase_price` saat menambah atau mengedit buku mengharapkan pengeluaran tersebut langsung tercatat di modul Akuntansi tanpa input ganda.
* **Keputusan:** Mengimplementasikan `App\Observers\BookObserver` yang memantau event `saved`, `deleted`, dan `forceDeleted` pada model `Book`. Data pengeluaran otomatis disinkronkan ke tabel `expenses` di kategori default `"Book Purchases"`. Untuk migrasi data lama sebelum observer aktif, disediakan Artisan command `php artisan accounting:sync-books`.
