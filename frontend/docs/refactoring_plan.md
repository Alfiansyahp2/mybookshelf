# Refactoring Plan: UI & Clean Code Architecture

Dokumen ini merangkum peta jalan (*roadmap*) untuk membersihkan, menstrukturisasi ulang, dan memodernisasi basis kode React (frontend).

## Fase 1: Sistem Dekorasi & Pembersihan Dead Code (SELESAI ✅)
**Tujuan:** Memecah komponen monolitik dan menghapus *file* yang tidak pernah digunakan.
- [x] Mengekstraksi komponen dekorasi dari `DecorationSystem.tsx` (1290 baris -> 38 baris) ke dalam *folder* `src/components/decorations/items/`.
- [x] Memindahkan konstanta (*catalog*) dan definisi tipe data (TypeScript `interfaces`) ke tempat yang semestinya (`src/constants/` & `src/types/`).
- [x] Mengidentifikasi dan **menghapus** komponen yang tak terpakai (*dead code*), termasuk `BookDetailAnimation.tsx` dan beberapa aset lama.

## Fase 2: Modularisasi Book Detail Modal (SELESAI ✅)
**Tujuan:** Mengatasi *file* berukuran raksasa `BookDetailLeftPage.tsx` (528 baris) dan `BookDetailRightPage.tsx` (746 baris) dengan memecahnya ke dalam struktur *folder* baru untuk memisahkan tanggung jawab (SRP - *Single Responsibility Principle*).

**Target Perubahan Struktur (Folder Baru):**
```text
src/components/book-details/
├── left/                             # Folder khusus elemen halaman kiri
│   ├── BookCoverSection.tsx
│   ├── BookMetadataSection.tsx
│   ├── BookActionsSection.tsx
│   ├── BookRatingSection.tsx
│   ├── BookStatsSection.tsx
│   └── BookProgressLeft.tsx
│
├── right/                            # Folder khusus elemen halaman kanan
│   ├── ReadingProgressSection.tsx
│   ├── ReadingSessionTimer.tsx
│   ├── BookNotesSection.tsx
│   └── ReadingSessionsModal.tsx
│
├── BookDetailLeftPage.tsx            # Hanya bertugas sebagai Container/Layout Kiri
└── BookDetailRightPage.tsx           # Hanya bertugas sebagai Container/Layout Kanan
```

**Langkah Eksekusi Fase 2:**
1. Mengelompokkan ulang komponen *orphaned* (yang sempat terbuat tapi tak terpakai) ke dalam direktori `left/` dan `right/`.
2. Memodifikasi `BookDetailLeftPage.tsx` untuk memanggil (*import*) komponen-komponen kecil dari folder `left/`, dan menghapus kode UI bawaannya yang *hardcoded*.
3. Memodifikasi `BookDetailRightPage.tsx` untuk memanggil komponen-komponen kecil dari folder `right/`.
4. Menghapus sisa *dead code* berupa modal/tampilan usang (`LibraryRoom.tsx`, `BookDetailDrawer.tsx`, dll).

## Fase 3: Modularisasi Pengaturan Rak / Shelf (ONGOING 🚧)
**Tujuan:** Mengelompokkan komponen yang berhubungan dengan rak buku (*shelf*) dan pengaturannya ke dalam satu direktori terpusat, memisahkan fungsionalitas UI terkait manajemen rak dari akar folder `components/`.

**Target Perubahan Struktur (Folder Baru):**
```text
src/components/shelf/
├── Bookshelf.tsx            # (dari src/components/Bookshelf.tsx)
├── Shelf.tsx                # (dari src/components/Shelf.tsx)
├── SortableShelf.tsx        # (dari src/components/SortableShelf.tsx)
├── AddShelfModal.tsx        # (dari src/components/modals/AddShelfModal.tsx)
└── EditShelfModal.tsx       # (dari src/components/modals/EditShelfModal.tsx)
```

**Langkah Eksekusi Fase 3:**
1. Membuat direktori `src/components/shelf/`.
2. Memindahkan kelima komponen di atas ke dalam folder tersebut.
3. Memperbarui jalur *import* pada komponen lain yang bergantung pada mereka.
4. Menghapus *dead code* `src/components/AddShelfModal.tsx` yang usang.

## Fase 4: Optimasi State & Performa (Direncanakan)
**Tujuan:** Mengurangi *re-render* yang tidak perlu pada saat Timer Membaca (`ReadingSessionTimer`) berjalan.
- Mengubah arsitektur *state management* agar detak pewaktu (*timer tick*) tidak memaksa seluruh halaman buku ikut me-*render* ulang.
- *Lazy loading* komponen yang berat.
