# Arsitektur Sistem Modal Dialog — Implementasi Aktual
## MyBookshelf Technical Reference

Dokumen ini memetakan arsitektur sistem modal dialog yang **benar-benar terimplementasi** di `frontend/src/components/` beserta alur state, event bus, dan interaksi API-nya.

---

## 1. Inventaris Modal Terimplementasi

### 1.1. Modal Buku & Aktivitas (`frontend/src/components/modals/`)

| Komponen | Peran & Fitur | Pemicu / Pengelola State |
| :--- | :--- | :--- |
| **`BookDetailModal.tsx`** | Modal buku terbuka dua halaman (*left/right page*) dengan 4 tab kanan: `progress`, `session` (live `ReadingSessionTimer` & `SessionHistorySection`), `notes`, `info`. | `useBookstore` (`isBookDetailOpen`, `selectedBookId`) di `AppLayout.tsx` |
| **`EditBookModal.tsx`** | Formulir edit metadata buku lengkap, cover upload, harga beli, dan status. | `isEditBookModalOpen` di `AppLayout.tsx` |
| **`AddBookModal.tsx`** | Penambahan buku baru langsung ke rak terpilih (`shelfId`, `shelfName`). | Local state di `Library.tsx` |
| **`AddWishlistBookModal.tsx`** | Penambahan buku khusus status `wishlist`. | Local state di `Wishlist.tsx` |
| **`ReadingCalendarModal.tsx`** | Visualisasi kalender aktivitas & riwayat sesi baca. | Local state di `Dashboard.tsx` & `Library.tsx` |
| **`DemoBookDetailModal.tsx`** | Modal pratinjau buku demo untuk pengunjung publik tanpa akun. | Komponen showcase landing |

### 1.2. Modal Rak, Sesi, & Akuntansi (Domain-Scoped)

| Komponen | Lokasi | Peran |
| :--- | :--- | :--- |
| **`AddShelfModal.tsx`** | `components/shelf/` | Membuat rak baru pada ruangan pengguna (`AppLayout.tsx`). |
| **`EditShelfModal.tsx`** | `components/shelf/` | Mengubah nama dan kapasitas rak terpilih (`AppLayout.tsx`). |
| **`DeleteShelfModal.tsx`** | `components/shelf/shelf-elements/` | Konfirmasi penghapusan rak di dalam `LibraryShelf` (`Shelf.tsx`). |
| **`ReadingSessionsModal.tsx`**| `components/book-details/right/` | Tampilan rincian/riwayat sesi membaca dari buku aktif. |
| **`ExpenseModal.tsx`** | `components/accounting/` | Form tambah/edit transaksi pengeluaran buku di `Accounting.tsx`. |

---

## 2. Arsitektur Komunikasi & State Trigger

Sistem modal memadukan **Zustand Global UI State** dengan **Custom DOM Events** untuk mencegah *prop drilling* melalui hierarki rak 3D (`Bookshelf` -> `SortableShelf` -> `LibraryShelf` -> `ShelfInfoBar`):

```mermaid
flowchart TD
    BookClick["Klik Buku (RealisticBook)"] -->|toggleBookDetail(bookId)| Store["useBookstore (Zustand)"]
    Store -->|isBookDetailOpen + selectedBookId| AppLayout["AppLayout.tsx"]
    AppLayout -->|useBook(selectedBookId)| BookDetail["BookDetailModal.tsx"]
    BookDetail -->|onEdit| EditBook["EditBookModal.tsx"]

    ShelfAction["Menu Rak (ShelfInfoBar)"] -->|window.dispatchEvent| EventBus["CustomEvent: 'editShelf' / 'deleteShelf'"]
    EventBus -->|addEventListener| AppLayout
    AppLayout -->|selectedShelfForEdit| EditShelf["EditShelfModal.tsx"]
    AppLayout -->|deleteShelf.mutate| ShelfAPI["useDeleteShelf()"]
```

---

## 3. Alur Sinkronisasi Cache Pasca-Aksi Modal

Setiap mutasi di dalam modal (contoh: memperbarui halaman di `BookDetailModal`, mengubah metadata di `EditBookModal`, atau menghapus buku) memanggil hook TanStack Query (`useUpdateProgress`, `useUpdateBook`, `useDeleteBook`) yang otomatis melakukan `invalidateQueries` pada `["books"]`, `["books", id]`, dan `["shelves"]` agar visualisasi rak 3D langsung merefleksikan data terbaru.
