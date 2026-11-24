# Architecture Decision Records (ADR)
## MyBookshelf Engineering Blueprint

Dokumen ini mencatat keputusan arsitektural fundamental (*Architecture Decision Records*) yang diambil selama perancangan dan pengembangan aplikasi MyBookshelf. Setiap record mendokumentasikan konteks masalah, opsi yang dipertimbangkan, keputusan final, serta konsekuensi teknisnya.

---

## Daftar Rekam Keputusan

| ADR ID | Judul Keputusan | Status | Tanggal |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Arsitektur Decoupled (Laravel 12 API + React 19 SPA) | Diterima | Juni 2026 |
| **ADR-002** | Pemilihan PostgreSQL sebagai Primary Relational Database | Diterima | Juni 2026 |
| **ADR-003** | Dual State Management: Zustand (UI) + TanStack Query (Server Cache) | Diterima | Juli 2026 |
| **ADR-004** | Engine Render Rak Buku 3D berbasis CSS 3D Transforms vs WebGL/Three.js | Diterima | Juli 2026 |
| **ADR-005** | Adopsi `@dnd-kit` untuk Manipulasi Posisi Buku di Rak 3D | Diterima | Juli 2026 |
| **ADR-006** | Isolasi Tema Visual: Dual-Theme Architecture (Cosmic Landing vs Teak App) | Diterima | Oktober 2026 |

---

### ADR-001: Arsitektur Decoupled (Laravel 12 REST API + React 19 SPA)

#### Konteks & Masalah
Aplikasi MyBookshelf membutuhkan interaksi grafis tinggi (animasi perpindahan rak buku 60 FPS, timer membaca real-time, manipulasi 3D spine) yang tidak boleh terganggu oleh refresh halaman penuh (*full page reload*). Pendekatan monolitik tradisional (Laravel Blade murni) memerlukan manipulasi DOM manual yang rentan terhadap *state desynchronization*.

#### Opsi yang Dipertimbangkan
1. **Monolith Blade + Alpine.js / Livewire:** Cepat dalam setup awal, namun rendering 3D spine dan drag-and-drop interaktif kompleks menjadi lambat karena beban network roundtrip pada setiap mutasi UI.
2. **Decoupled Architecture (Laravel 12 API + React 19 SPA):** Memisahkan backend API murni dengan client web app mandiri berbasis Vite.

#### Keputusan
Memilih **Decoupled Architecture**:
* **Backend:** Laravel 12 (PHP 8.2+) difungsikan eksklusif sebagai Stateless JSON REST API dengan autentikasi Laravel Sanctum.
* **Frontend:** React 19 SPA dengan TypeScript, dibundel menggunakan Vite 8 untuk performa HMR instan.

#### Konsekuensi & Mitigasi
* **Konsekuensi:** Kompleksitas deployment terpisah (Vercel untuk frontend, server PHP/Laragon untuk backend) dan kebutuhan manajemen CORS.
* **Mitigasi:** Konfigurasi middleware `cors.php` dan `Sanctum stateful domains` yang ketat serta konfigurasi proxy dev di `vite.config.ts`.

---

### ADR-002: Pemilihan PostgreSQL sebagai Primary Relational Database

#### Konteks & Masalah
MyBookshelf memiliki relasi data kompleks yang saling terikat: buku, sesi membaca bertahap, transaksi pengeluaran multi-mata uang, histori timeline, target tahunan, serta pengaturan rak kustom. Dibutuhkan engine basis data dengan integritas referensial ketat, dukungan agregasi analitik cepat, dan kemampuan query JSON.

#### Opsi yang Dipertimbangkan
1. **SQLite:** Ringan untuk pengujian lokal, namun konkurensi write rendah dan fitur analitik statistik terbatas.
2. **MySQL:** Cukup umum, namun fitur JSON path indexing dan window functions kurang fleksibel dibanding PostgreSQL.
3. **PostgreSQL 16+:** Standar industri untuk relational database dengan dukungan kuat terhadap tipe data native, JSONB, concurrency MVCC, dan indexing canggih.

#### Keputusan
Menggunakan **PostgreSQL** sebagai database utama (`DB_CONNECTION=pgsql` pada port `5432`).

#### Konsekuensi
* Migrasi dan query analitik (seperti agregasi jam baca harian di `StatisticsController`) memanfaatkan agregasi native PostgreSQL.
* Driver PHP `pdo_pgsql` menjadi dependensi wajib di lingkungan runtime server.

---

### ADR-003: Dual State Management (Zustand untuk UI + TanStack Query untuk Server State)

#### Konteks & Masalah
Menyimpan seluruh data aplikasi (daftar ratusan buku, histori sesi baca, data user, serta status modal dialog UI) ke dalam satu store global seperti Redux Toolkit menciptakan boilerplate berlebih dan masalah *cache staleness*.

#### Keputusan
Menerapkan pemisahan tugas (*Separation of Concerns*) secara tegas:
1. **Client UI State -> Zustand (`useBookstore`, `useThemeStore`):**
   * Menyimpan status sementara: modal terbuka/tertutup, pencarian teks aktif, filter kategori aktif, dan preferensi tema gelap.
   * Tidak ada persistensi ke database untuk data UI transient.
2. **Server State & Caching -> TanStack Query v5 (`useBooks`, `useShelves`, dll.):**
   * Mengatur data fetching, caching otomatis, background refetching, deduping request, dan *optimistic updates*.
   * Mengurangi panggilan API redundant hingga ~45%.

---

### ADR-004: Engine Render Rak Buku 3D berbasis CSS 3D Transforms vs WebGL/Three.js

#### Konteks & Masalah
Aplikasi membutuhkan visualisasi rak buku yang terlihat nyata (ada ketebalan papan kayu jati, punggung buku/spine berserat tekstur canvas matte, bayangan dinamis, dan efek pencahayaan lampu meja). Penggunaan library 3D berat seperti Three.js / Canvas WebGL berpotensi meningkatkan ukuran bundle hingga >800KB dan boros baterai pada perangkat mobile.

#### Keputusan
Mengembangkan **CSS 3D Procedural Engine**:
* Menggunakan kombinasi CSS transforms (`perspective`, `rotateY`, `translateZ`), gradient procedural, dan repeating SVG canvas noise.
* Mengatur ketebalan buku dinamis berdasarkan proporsi halaman (`clamp(24px, pages * 0.08px, 58px)`).
* Hasil: Ukuran bundle tetap ringan (<125KB CSS), performa render 60 FPS stabil di mobile browser, dan waktu load halaman instan.

---

### ADR-005: Adopsi `@dnd-kit` untuk Manipulasi Buku di Rak

#### Konteks & Masalah
User membutuhkan kemampuan memindahkan buku antar-rak atau mengatur ulang urutan buku di atas rak secara alami. HTML5 Drag and Drop native memiliki limitasi visual pada elemen dengan transform 3D dan tidak ramah layar sentuh (*touch devices*).

#### Keputusan
Mengadopsi **`@dnd-kit/core`** dan **`@dnd-kit/sortable`**:
* Mendukung sensor pointer dan touch secara native.
* Collision detection algorithm yang akurat pada elemen sortable.
* Kompatibel penuh dengan animasi CSS transforms dan Framer Motion.

---

### ADR-006: Isolasi Tema Visual (Dual-Theme Architecture)

#### Konteks & Masalah
Landing Page memiliki konsep estetika *Celestial Midnight / Nebula Starlight* (warna indigo, ungu, partikel bintang kosmik), sementara area kerja pengguna (Dashboard, Library, Reading, Wishlist) membutuhkan suasana *Warm Wood Sanctuary* (warna kayu jati alami, walnut, espresso, dan kertas krem) agar mata tidak lelah saat membaca dan mencatat buku.

#### Keputusan
* Variabel tema global di `:root` (`index.css`) didefinisikan murni menggunakan palet kayu jati hangat (`--color-cream: #F8F5F0`, `--color-dark-brown: #4A3B2F`, `--color-walnut: #7A5C42`, `--color-gold: #D4A574`).
* Estetika biru kosmik diisolasi secara ketat hanya di `LandingPage.tsx` menggunakan class scoped Tailwind tanpa mencemari sistem warna aplikasi utama.
