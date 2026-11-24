# Project Structure & Codebase Organization
## MyBookshelf Engineering Blueprint

Dokumen ini memetakan susunan pohon direktori (*directory tree*) dari proyek **MyBookshelf**, menguraikan batasan arsitektur antara backend dan frontend, serta menjelaskan tanggung jawab setiap modul.

---

## 1. Ikhtisar Struktur Monorepo

MyBookshelf disusun dalam struktur terisolasi (*Decoupled Repository*), di mana direktori root difungsikan sebagai rumah dari backend Laravel 12 API, sementara aplikasi klien SPA berada mandiri di dalam folder `frontend/`.

```text
mybookshelf/
├── app/                      # Backend Core Logic (Laravel 12)
│   ├── Http/Controllers/Api/V1/ # RESTful API Controllers
│   └── Models/               # Eloquent Models (Active Record)
├── bootstrap/                # Application bootstrap & providers
├── config/                   # Konfigurasi sistem (database, auth, cors)
├── database/
│   ├── factories/            # Model factories untuk testing
│   ├── migrations/           # Skema database version-controlled
│   └── seeders/              # Seeder data buku awal
├── docs/                     # Repositori Dokumentasi & Spesifikasi Teknis
│   ├── architecture/         # Blueprint arsitektur & rekam keputusan (ADRs)
│   ├── features/             # Panduan fitur pengguna
│   ├── history/              # Catatan log refactoring & evolusi
│   ├── specifications/       # Spesifikasi skema database, API, & UI/UX
│   └── INDEX.md              # Master indeks dokumentasi
├── frontend/                 # Client Web Application (React 19 + TypeScript)
│   ├── public/               # Asset statis (favicon, icons, textures)
│   ├── src/
│   │   ├── components/       # Komponen UI modular
│   │   │   ├── accounting/   # Widget pembukuan keuangan & anggaran
│   │   │   ├── assets/       # Kartu katalog & elemen visual
│   │   │   ├── dashboard/    # Seksi ringkasan analitik beranda
│   │   │   ├── landing/      # Komponen presentasi visual Landing Page
│   │   │   ├── layout/       # AppHeader, AppLayout, Navbar, Notifikasi
│   │   │   ├── modals/       # Dialog pop-up buku, rak, dan kalender
│   │   │   ├── reading/      # Komponen pelacak sesi & target baca
│   │   │   ├── shelf/        # Engine visualisasi rak 3D & drag-and-drop
│   │   │   └── ui/           # Atom komponen generik (jam, kalender, toggle)
│   │   ├── hooks/            # Custom hooks & TanStack Query integrations
│   │   ├── lib/              # Client API wrapper (Axios instance)
│   │   ├── pages/            # Komponen rute halaman utama
│   │   ├── store/            # State management lokal (Zustand)
│   │   ├── types/            # TypeScript Interface & Type Definitions
│   │   ├── App.css           # Styling spesifik aplikasi
│   │   ├── App.tsx           # Router view & provider tree
│   │   ├── index.css         # Tailwind directives & CSS custom variables
│   │   └── main.tsx          # Client entrypoint bootstrapping
│   ├── package.json          # Dependensi frontend & script build Vite
│   ├── tailwind.config.js    # Konfigurasi token warna kustom Tailwind
│   ├── tsconfig.json         # Konfigurasi compiler TypeScript
│   └── vite.config.ts        # Konfigurasi bundler Vite
├── routes/
│   ├── api.php               # Rute endpoint RESTful API v1
│   └── web.php               # Rute dasar web server
├── tests/                    # Pengujian unit & fitur backend (PHPUnit)
├── .env                      # Konfigurasi environment lokal
├── composer.json             # Dependensi PHP backend & script artisan
└── README.md                 # Ringkasan cepat proyek
```

---

## 2. Tanggung Jawab Modul Backend (`app/`)

* **`app/Http/Controllers/Api/V1/`**:
  * Mengonsumsi request HTTP, memvalidasi payload, mengeksekusi logika bisnis, dan mengembalikan respons JSON terstandardisasi.
  * Bersifat *stateless* dan diproteksi middleware autentikasi Sanctum.
* **`app/Models/`**:
  * Mengelola relasi data antar entitas (contoh: `Book.php` memiliki relasi `belongsTo(Shelf::class)` dan `hasMany(ReadingSession::class)`).
  * Menyediakan casting tipe data atribut (contoh: casting `decorations` menjadi `array` JSON).

---

## 3. Tanggung Jawab Modul Frontend (`frontend/src/`)

### 3.1. Pembagian Komponen (`src/components/`)
1. **`shelf/`**:
   * Jantung visual aplikasi MyBookshelf. Mengelola rendering rak kayu jati (`ShelfWoodFrame`), track peletakan buku (`ShelfBooksTrack`), punggung buku prosedural (`BookSpine`), panel kendali pencahayaan (`LightingControl`), dan logika drag-and-drop `@dnd-kit`.
2. **`dashboard/`**:
   * Menampilkan wawasan analitik komprehensif: kartu ringkasan buku aktif, grafik distribusi genre via Recharts, dan target tahunan.
3. **`layout/`**:
   * Kerangka tata letak terpusat (`AppLayout.tsx`) yang membungkus header dinamis (`AppHeader.tsx`), drawer menu mobile, dan sistem notifikasi toast.
4. **`modals/`**:
   * Dialog modal terisolasi untuk melihat detail buku fisik, mengedit metadata, menambah rak baru, atau mengatur timer sesi membaca.

### 3.2. Data & State Pipeline
* **`src/lib/api/`**: Modul komunikasi jaringan berbasis instance Axios yang secara otomatis menyisipkan Bearer token dari storage lokal pada setiap request.
* **`src/hooks/`**: Membungkus panggilan API ke dalam *query* dan *mutation* TanStack Query, menyediakan data reaktif, indikator loading, penanganan error, dan invalidasi cache otomatis.
* **`src/store/`**: Mengelola state transient UI (seperti ID buku yang sedang dibuka di modal detail) menggunakan Zustand tanpa overhead rendering yang tidak perlu.
