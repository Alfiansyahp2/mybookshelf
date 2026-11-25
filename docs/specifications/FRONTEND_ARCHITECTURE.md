# Frontend Architecture Specification (React 19 + TypeScript)
## MyBookshelf Engineering Blueprint

Dokumen ini menjelaskan struktur internal sisi klien pada proyek **MyBookshelf** di direktori `frontend/`, meliputi routing, konfigurasi jaringan, lapisan manajemen state, mesin rendering rak 3D, sistem modal, pelacakan pencapaian, dan internasionalisasi.

---

## 1. Stack & Konfigurasi Build (`frontend/package.json`)

* **Core:** React `^19.2.7`, React DOM `^19.2.7`, TypeScript `~6.0.2`
* **Bundler & Linter:** Vite `^8.1.0` (`@vitejs/plugin-react`), `oxlint ^1.69.0`
* **Routing:** `react-router-dom ^7.18.0`
* **Server State:** `@tanstack/react-query ^5.101.1`
* **Client State:** `zustand ^5.0.14`
* **Networking:** `axios ^1.18.1`
* **Styling & Animasi:** `tailwindcss ^3.4.19`, `framer-motion ^12.42.0`, `animejs ^4.5.0`, `lucide-react`
* **Drag & Drop:** `@dnd-kit/core ^6.3.1`, `@dnd-kit/sortable ^10.0.0`, `@dnd-kit/utilities ^3.2.2`
* **Formulir & Validasi:** `react-hook-form ^7.80.0`, `zod ^4.4.3`
* **Charts, i18n, SEO, Notifikasi:** `recharts ^3.9.0`, `i18next ^26.3.6`, `react-i18next ^17.0.11`, `react-helmet-async ^3.0.0`, `react-hot-toast ^2.6.0`

---

## 2. Arsitektur Routing & Proteksi Halaman (`frontend/src/App.tsx`)

Aplikasi dibungkus oleh `ReactQueryProvider` -> `BrowserRouter` -> `Routes` + `ToastContainer`.

| Kategori | Path URL | Komponen Halaman | Keterangan |
| :--- | :--- | :--- | :--- |
| **Publik** | `/`, `/landing` | `LandingPage` | Showcase interaktif bertema kosmik malam |
| **Publik** | `/landing/book/:id`, `/book/:id` | `LandingBookDetail` | Detail buku editorial demo dari landing page |
| **Publik** | `/login`, `/register` | `Login` | Autentikasi 3D page-flip book layout |
| **Terproteksi** | `/dashboard` | `Dashboard` | Ringkasan statistik, target, grafik genre & aktivitas |
| **Terproteksi** | `/library` | `Library` | Rak buku 3D interaktif, filter status, edit layout rak |
| **Terproteksi** | `/explore` | `ExploreLibrary` | Eksplorasi koleksi perpustakaan |
| **Terproteksi** | `/reading` | `Reading` | Target tahunan, metrik progres, & rak buku aktif |
| **Terproteksi** | `/wishlist` | `Wishlist` | Katalog buku impian (view `list` dan `grid`) |
| **Terproteksi** | `/borrow-loan` | `BorrowLoan` | Pelacakan buku dipinjam / jatuh tempo |
| **Terproteksi** | `/statistics` | `Statistics` | Analitik mendalam kebiasaan membaca |
| **Terproteksi** | `/collections` | `Collections` | Pengelompokan buku ke dalam koleksi kustom |
| **Terproteksi** | `/achievements` | `Achievements` | Daftar lencana pencapaian (*gamification*) |
| **Terproteksi** | `/notes` | `Notes` | Kumpulan catatan & ulasan pribadi buku |
| **Terproteksi** | `/accounting` | `Accounting` | Dasbor akuntansi pengeluaran & anggaran buku |
| **Terproteksi** | `/settings` | `Settings` | Pengaturan profil & kata sandi pengguna |
| **Fallback** | `*` | `CatchAll` | Penanganan rute tidak dikenal |

### 2.1. `ProtectedRoute` & `AppLayout`
* **`ProtectedRoute.tsx`:** Memeriksa `localStorage.getItem("user")` serta status query `useAuthUser()`. Jika data lokal kosong atau query `me()` gagal (`isError`), klien otomatis diarahkan ke `/login`.
* **`AppLayout.tsx`:**
  * Mengelola header adaptif (`AppHeader`) yang otomatis bersembunyi saat scroll ke bawah (`currentScrollY > lastScrollY && currentScrollY > 80`).
  * Mengimplementasikan transisi rute **3D Book-Turn (`AnimatePresence`)** menggunakan `perspective: 1200px`, `transformOrigin: "50% 50% 50vw"`, dan animasi `rotateY: -90 -> 0 -> 90` dengan filter `brightness(0.2) -> 1`.
  * Menyediakan kontainer global untuk modal buku dan rak (`BookDetailModal`, `EditBookModal`, `EditShelfModal`, `AddShelfModal`) serta menginisialisasi `useAchievementTracker()`.

---

## 3. Lapisan Komunikasi API & Normalisasi Data

### 3.1. `ApiClient` (`frontend/src/lib/apiClient.ts`)
* Instance Axios tunggal dengan `baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"` dan `withCredentials: true`.
* **Request Interceptor:** Mengekstrak cookie `XSRF-TOKEN` dan menyematkannya sebagai header `X-XSRF-TOKEN` pada metode mutasi (`post`, `put`, `patch`, `delete`).
* **Response Interceptor:** Jika server merespons HTTP `401`, interceptor menghapus `localStorage.removeItem("user")`.

### 3.2. Adapter Kontrak (`frontend/src/lib/api/books.ts`)
* Backend Laravel mengembalikan atribut `snake_case` (`RawBook`), sementara seluruh komponen UI React mengonsumsi tipe `Book` (`camelCase`).
* Fungsi `transformBook(raw: RawBook): Book` bertugas melakukan konversi deterministik (misal menggabungkan `spine_color_light/medium/dark` menjadi tuple `spineColors: [string, string, string]`, mem-parsing string desimal `progress` dan `purchase_price` ke `number`).

---

## 4. Arsitektur State Management

### 4.1. Client Stores (Zustand)

| Store | File | Persistensi | State & Tanggung Jawab |
| :--- | :--- | :--- | :--- |
| `useBookstore` | `store/useBookstore.ts` | Tidak ada (DevTools enabled) | `selectedBookId`, `isBookDetailOpen`, `sidebarCollapsed`, `searchQuery`, `activeFilter` |
| `useThemeStore` | `store/useThemeStore.ts` | `localStorage("theme")` | `isDarkMode`; menyinkronkan kelas `.dark` pada `<html>` & `<body>` |
| `useLighting` | `hooks/useLighting.ts` | `localStorage("mybookshelf_lighting")` | `on` (boolean), `brightness` (10–100), `colorTemp` (`warm \| neutral \| cool \| rose \| mint`) |
| `useNotifications` | `hooks/useNotifications.ts` | `localStorage("mybookshelf_notifications")` | Antrean notifikasi aplikasi (`achievement`, `info`, `success`, `warning`), status `read` |
| `useAchievementStore`| `hooks/useAchievementTracker.ts`| `localStorage("mybookshelf_achievements")` | Daftar `unlockedIds` untuk mencegah duplikasi notifikasi pencapaian |

### 4.2. Server Cache & Custom Hooks (TanStack Query v5)
Konfigurasi global di `frontend/src/lib/reactQuery.ts` menetapkan `staleTime: 5 * 60 * 1000`, `gcTime: 10 * 60 * 1000`, `retry: 1`, dan `refetchOnWindowFocus: false`.
* **Buku & Rak:** `useBooks(filters)`, `useBook(id)`, `useShelves()`, `useShelfOccupancy(id)`, `useUpdateShelfLayout()`.
* **Sesi & Statistik:** `useReadingSessions`, `useStatistics`, `useDashboardStats(books)` (agregasi lokal memoized untuk target tahunan 12 buku, top genre, pie status, & chart penulis), `useYearlyStats(allBooks)`.
* **Akuntansi (`hooks/accounting/`):** `useExpenses`, `useBudgets`, `useExpenseCategories`, `useCurrencyRates`, `useAccountingReports`.
* **Achievement Background Watcher (`useAchievementTracker`):** Memantau jumlah buku, buku selesai, genre unik, jumlah rak, rating 5 bintang, total halaman baca (1.000 & 5.000 halaman), favorit, dan wishlist untuk memicu notifikasi pencapaian secara otomatis.

---

## 5. Mesin Visualisasi Rak 3D & Komponen UI

### 5.1. Hirarki Komponen Rak (`frontend/src/components/shelf/`)
```text
Bookshelf (DndContext + Lighting state + Book distribution by shelfId)
  └── SortableShelf (useSortable @dnd-kit + Grid span selector: 100%..16%)
        └── LibraryShelf (useShelfScroll + DecorationPicker + DeleteShelfModal)
              ├── ShelfWoodFrame (Panel kayu kiri/kanan, LED lighting strip, bayangan)
              ├── ShelfBooksTrack (Scroll horizontal track + Left/Right decoration slots)
              │     └── RealisticBook (React.memo + Framer Motion 3D spring hover/click)
              │           ├── BookSpine (Matte gradient + Canvas weave texture)
              │           └── BookTooltip (Preview info saat hover)
              └── ShelfInfoBar (Nama rak, rasio okupansi %, menu aksi)
```

### 5.2. Sistem Modal Buku Dua Halaman (`BookDetailModal.tsx`)
Menampilkan modal interaktif menyerupai buku terbuka dua halaman:
* **Halaman Kiri (`BookDetailLeftPage`):** Cover / spine visual, lencana status, rating bintang, tombol aksi status, dan metadata buku.
* **Halaman Kanan (`BookDetailRightPage`):** Navigasi 4 tab (`progress`, `session`, `notes`, `info`) yang mengintegrasikan `ReadingProgressSection`, `ReadingSessionTimer` (start/pause/end sesi live), `SessionHistorySection`, dan `BookNotesSection`.

---

## 6. Internasionalisasi (i18n) & SEO

* **Multi-Bahasa (`frontend/src/i18n.ts`):** Menggunakan `i18next` + `i18next-browser-languagedetector` dengan kamus `locales/id/translation.json` dan `locales/en/translation.json`, serta `fallbackLng: "id"`.
* **Metadata SEO (`frontend/src/components/SEO.tsx`):** Menggunakan `react-helmet-async` untuk memperbarui `<title>` dan `<meta name="description">` secara dinamis pada tiap rute halaman.
