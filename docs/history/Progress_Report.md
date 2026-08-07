# Laporan Progres & Pembaruan Arsitektur (Agustus 2026)

Dokumen ini merangkum sejauh mana basis kode (*codebase*) dan fitur MyBookshelf telah berkembang, khususnya dari sisi restrukturisasi *frontend* yang baru saja diselesaikan.

## 1. Evolusi Arsitektur Kode (Clean Modular Architecture)
Sebelumnya, *frontend* aplikasi ini memiliki banyak komponen yang bertumpuk menjadi satu di dalam *root directory* `src/components/`, termasuk komponen raksasa monolitik yang menangani berbagai macam logika secara bersamaan. 

Kini, kode telah direstrukturisasi secara menyeluruh ke dalam **4 Fase Refactoring**:

* **Fase 1 (Sistem Dekorasi):** Mengisolasi sistem 3D objek (tanaman, *bookend*, kucing *pixel*) dari logika utama rak. *File* usang dibersihkan, dan aset didelegasikan ke folder `src/components/decorations/items/`.
* **Fase 2 (Buku Detail):** Memecah komponen raksasa `BookDetailLeftPage.tsx` dan `BookDetailRightPage.tsx` menjadi pecahan-pecahan kecil sesuai fungsinya (SRP).
  * Bagian kiri (`left/`): Terpecah menjadi *Cover*, *Metadata*, *Progress*, *Rating*, dan aksi-aksi (hapus/baca/edit).
  * Bagian kanan (`right/`): Terpecah menjadi *Reading Session Timer* dan tempat mencatat rincian catatan (*Notes*).
* **Fase 3 (Sistem Rak):** Seluruh manajemen tata letak rak buku ditarik ke dalam modul `src/components/shelf/` beserta modal interaktif untuk mengedit dan menambahkan rak kustom.
* **Fase 4 (Pembersihan Final):** Sisa-sisa *file* yang mengambang telah disapu ke dalam 4 pilar utama:
  * `modals/` (Untuk antarmuka *pop-up*)
  * `layout/` (Untuk kerangka dasar halaman seperti *Header* dan *Menu*)
  * `auth/` (Untuk pelindung *login*)
  * Penghapusan permanen dari fitur *dead code* (seperti file Timeline eksperimental yang tidak jadi dipakai).

## 2. Fitur-Fitur yang Kini Hadir & Optimal
Melalui perombakan di atas, fungsionalitas fitur-fitur di bawah ini menjadi jauh lebih solid karena kode mereka tidak saling tumpang tindih:

- **Sistem Pembukuan (Accounting & Budgeting):** Kini MyBookshelf secara penuh mendukung pemantauan pengeluaran pembelian buku dengan modal khusus (`ExpenseModal.tsx`).
- **Pewaktu Membaca (Reading Timer):** Fitur pelacak sesi membaca beroperasi secara mandiri di halaman kanan buku tanpa harus membebani elemen UI yang lain.
- **Wishlist Management:** Pengguna bisa merencanakan buku apa yang ingin dibeli, lalu mengkonversinya ke perpustakaan utama ketika buku tersebut sudah "dibeli" (terintegrasi dengan pendataan harga/pengeluaran buku).
- **Gamifikasi Tersembunyi:** Modul pencapaian (*achievements*) diam-diam mengamati seluruh perilaku *user* (menyelesaikan buku, membaca dalam durasi tertentu) melalui *hooks* modular `useAchievementTracker.ts`.

## 3. Rencana Selanjutnya (Fase 5)
Secara struktur (folder dan file), kode telah 100% rapi. Langkah evolusi berikutnya (Fase 5) adalah melakukan **Optimasi Performa** (murni pada *state* React):
- Menghentikan perenderan ulang (*re-render*) komponen rak ketika `ReadingSessionTimer` (jam pasir) berdetak setiap detiknya.
- *Lazy Loading* (memuat komponen hanya saat dipanggil) pada ikon-ikon dekorasi 3D agar halaman utama *Library* bisa dimuat lebih cepat.
