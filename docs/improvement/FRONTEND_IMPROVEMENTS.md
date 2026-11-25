# Audit & Rencana Perbaikan Frontend (React 19 + TypeScript)
## MyBookshelf Improvement Specification

Dokumen ini mencatat hasil audit teknis pada seluruh lapisan antarmuka klien di `frontend/src/` mencakup sinkronisasi API, kelengkapan halaman, hasil linting `oxlint`, keamanan tipe TypeScript, ukuran bundle Vite, dan kebersihan kode.

---

## 1. Integrasi API Putus & Fitur Belum Selesai

### 1.1. Endpoint `rooms` Tidak Tersedia di Backend
* **Temuan:** [`useRooms.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/hooks/useRooms.ts) mendefinisikan `roomsApi` yang memanggil `/v1/rooms` dan `/v1/rooms/{id}`, namun di [`routes/api.php`](file:///c:/laragon/www/mybookshelf/routes/api.php) tidak terdapat rute maupun `RoomController` untuk endpoint tersebut (seluruh pemanggilan akan mengembalikan `404 Endpoint not found`).
* **Perbaikan:** Implementasikan `RoomController` + rute `/api/v1/rooms` di backend jika fitur multi-ruangan akan diaktifkan, atau hapus/arsipkan `useRooms.ts` hingga fitur siap.

### 1.2. Empat Halaman Terdaftar di Router Masih Berupa Stub
Rute-rute berikut sudah terpasang di dalam `<ProtectedRoute>` pada [`App.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/App.tsx), tetapi isinya baru teks *"Coming soon..."*:
* [`BorrowLoan.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/BorrowLoan.tsx) — padahal endpoint `borrow` dan `return` sudah siap di `BookController`.
* [`Collections.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/Collections.tsx) — padahal `CollectionController` dan [`useCollections.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/hooks/useCollections.ts) sudah tersedia.
* [`Notes.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/Notes.tsx) — padahal field `personal_notes` dan `PATCH /books/{id}/notes` sudah ada.
* [`Statistics.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/Statistics.tsx) — padahal endpoint `GET /v1/statistics` dan grafik Recharts sudah berjalan di `Dashboard.tsx`.

### 1.3. Handler Kosong di [`Reading.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/Reading.tsx)
* Pada baris 78–81, `handleAddBook` hanya menjalankan `console.log("Add book to shelf:", shelfId, shelfName)` dengan `// TODO: Implement add book functionality`.

---

## 2. Kualitas Kode TypeScript & Hasil Linter (`oxlint`)

### 2.1. Hasil Eksekusi `npm run lint` (193 Warnings)
Menjalankan `oxlint` di `frontend/` pada 199 berkas menghasilkan **0 errors dan 193 warnings**, dengan kategori utama:
* **Unused imports & parameters (`eslint/no-unused-vars`):** Contoh pada [`Reading.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/Reading.tsx) (`useRef`, `useShelves`), [`Login.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/Login.tsx) (`useRef`), [`Achievements.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/Achievements.tsx) (`Icon`), komponen dekorasi (`PlantHanging.tsx`, `VaseRound.tsx`, `Mug.tsx`), serta [`LayoutPicker.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/components/ui/LayoutPicker.tsx) (`active`).
* **React Hooks Dependency Warnings (`react-hooks/exhaustive-deps`):** Contoh pada [`Achievements.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/pages/Achievements.tsx) di mana `books` tidak di-memoize sehingga memicu re-evaluasi `useMemo` di setiap render, serta missing dependency `t` dan `unlockMutation`.

### 2.2. Penggunaan Tipe `any` (59 Kemunculan) & Ketiadaan `tsc` Check
* Ditemukan **59 kemunculan** `: any` / `as any` di `frontend/src/` (termasuk di `useDashboardStats.ts`, `useYearlyStats.ts`, `books.ts`, `useShelves.ts`, `AppLayout.tsx`).
* Skrip di [`frontend/package.json`](file:///c:/laragon/www/mybookshelf/frontend/package.json) langsung menjalankan `vite build` tanpa type-checking (`tsc -b` atau `tsc --noEmit`), sehingga error tipe TypeScript tidak terdeteksi saat build maupun CI.

---

## 3. Kebocoran Debug Logging & Optimasi Bundle

### 3.1. 66 Pemanggilan `console.log/warn/error` di Source Frontend
* Audit grep menemukan **66 baris `console.*`** di seluruh `frontend/src/`, termasuk logging respons API mentah dan potongan token CSRF di [`apiClient.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/lib/apiClient.ts), [`useAuth.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/hooks/useAuth.ts), [`useReadingSessions.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/hooks/useReadingSessions.ts), dan [`useShelves.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/hooks/useShelves.ts).
* Terdapat dua berkas utilitas debug manual di folder produksi (`src/lib/`): [`authTest.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/lib/authTest.ts) dan [`debugBooks.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/lib/debugBooks.ts).
* **Perbaikan:** Hapus atau bungkus debug logging dengan `if (import.meta.env.DEV)` dan pindahkan/hapus utilitas testing manual dari `src/lib/`.

### 3.2. Ukuran Bundle Produksi Besar (`~1.6 MB` Single Chunk)
* Hasil `vite build` saat ini menghasilkan satu bundle JavaScript berukuran **`1,607.84 kB` (`455.30 kB` gzip)** dan memicu peringatan chunk > 500 kB dari Vite/Rolldown.
* **Perbaikan:**
  1. Terapkan `React.lazy()` + `<Suspense>` pada komponen rute halaman besar di `App.tsx` (seperti `Accounting`, `Dashboard`, `LandingPage`).
  2. Konfigurasi `build.rolldownOptions.output.manualChunks` di [`vite.config.ts`](file:///c:/laragon/www/mybookshelf/frontend/vite.config.ts) untuk memisahkan vendor berat (`recharts`, `framer-motion`, `animejs`, `@dnd-kit`).

---

## 4. Sinkronisasi Sesi Auth & Encoding UI

* **Auth Gate via `localStorage("user")`:** [`ProtectedRoute.tsx`](file:///c:/laragon/www/mybookshelf/frontend/src/components/auth/ProtectedRoute.tsx) dan flag `enabled` di [`useBooks.ts`](file:///c:/laragon/www/mybookshelf/frontend/src/hooks/useBooks.ts) bergantung pada `localStorage.getItem("user")`. Jika user menghapus storage browser meski cookie sesi Sanctum masih valid (atau sebaliknya), sinkronisasi bisa terlambat 1 siklus render. Disarankan mengandalkan query `useAuthUser()` sebagai *single source of truth* status autentikasi.
* **Sisa Mojibake UTF-8:** Beberapa komponen masih memiliki artefak karakter rusak pada komentar/ikon string (seperti `useLighting.ts`, `BookSpine.tsx`, `ShelfBooksTrack.tsx`, `bookConstants.ts`, `useDashboardStats.ts`) yang perlu dinormalisasi ke UTF-8 murni.
