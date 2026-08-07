# Refactoring Plan: UI & Clean Code Architecture

Dokumen ini merangkum peta jalan (*roadmap*) untuk membersihkan, menstrukturisasi ulang, dan memodernisasi basis kode React (frontend).

## Fase 1: Sistem Dekorasi & Pembersihan Dead Code (SELESAI ✅)
**Tujuan:** Memecah komponen monolitik dan menghapus *file* yang tidak pernah digunakan.
- [x] Mengekstraksi komponen dekorasi dari `DecorationSystem.tsx` (1290 baris -> 38 baris) ke dalam *folder* `src/components/decorations/items/`.
- [x] Memindahkan konstanta (*catalog*) dan definisi tipe data (TypeScript `interfaces`) ke tempat yang semestinya (`src/constants/` & `src/types/`).
- [x] Mengidentifikasi dan **menghapus** komponen yang tak terpakai (*dead code*), termasuk `BookDetailAnimation.tsx` dan beberapa aset lama.

## Fase 2: Modularisasi Book Detail Modal (ONGOING 🚧)
**Tujuan:** Mengatasi *file* berukuran raksasa `BookDetailLeftPage.tsx` (528 baris) dan `BookDetailRightPage.tsx` (746 baris) dengan memecahnya ke dalam struktur *folder* baru untuk memisahkan tanggung jawab (SRP - *Single Responsibility Principle*).

**Target Perubahan Struktur (Folder Baru):**
```text
src/components/book-details/
├── left/                             # Folder khusus elemen halaman kiri
│   ├── BookCoverSection.tsx
│   ├── BookMetadataSection.tsx
│   ├── BookActionsSection.tsx
│   ├── BookRatingSection.tsx
│   ├── BookPurchaseInfo.tsx
│   └── BookStatusBadge.tsx
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

## Fase 3: Optimasi State & Performa (Direncanakan)
**Tujuan:** Mengurangi *re-render* yang tidak perlu pada saat Timer Membaca (`ReadingSessionTimer`) berjalan.
- Mengubah arsitektur *state management* agar detak pewaktu (*timer tick*) tidak memaksa seluruh halaman buku ikut me-*render* ulang.
- *Lazy loading* komponen yang berat.
