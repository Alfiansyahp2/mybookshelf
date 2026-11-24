# UI/UX & Design System Specification
## MyBookshelf Engineering Blueprint

Dokumen ini mendokumentasikan spesifikasi desain visual, sistem token warna, geometri rak 3D, pemodelan matematis punggung buku (*book spine*), dan tipografi pada antarmuka pengguna **MyBookshelf**.

---

## 1. Filosofi Desain: The Tactile Reading Sanctuary

Antarmuka MyBookshelf mengusung konsep **Sanctuary Pembaca Fisik** yang diwujudkan secara digital:
* **Kehangatan Material Alami:** Menggunakan rona kayu jati (*warm teak*), kenari (*walnut*), dan kertas krem (*warm ivory*) untuk menciptakan ruang baca yang tenang tanpa distraksi cahaya biru dingin.
* **Taktil & Skeuomorfisme Modern:** Buku dan rak memiliki tekstur serat kain tenun (*canvas weave*), pantulan cahaya lembut, dan bayangan realistis tanpa membebani performa browser.
* **Pemisahan Suasana (Dual-Theme):**
  * **Landing Page:** Nuansa *Celestial Midnight* (biru langit malam kosmik) untuk memukau pengunjung pertama kali.
  * **Aplikasi Utama (Dashboard, Library, Reading, Wishlist):** Nuansa *Warm Wood & Parchment* (100% bebas dari warna biru slate).

---

## 2. Token Warna & Variabel Desain

### 2.1. Variabel Global Aplikasi Utama (`frontend/src/index.css`)

```css
:root {
    --color-cream: #F8F5F0;          /* Warm Ivory Linen (Latar belakang utama aplikasi) */
    --color-cream-rgb: 248 245 240;
    
    --color-dark-brown: #4A3B2F;     /* Deep Espresso (Teks judul & elemen penegas) */
    --color-dark-brown-rgb: 74 59 47;
    
    --color-walnut: #7A5C42;         /* Warm Walnut (Border, tombol utama, sub-teks) */
    --color-walnut-rgb: 122 92 66;
    
    --color-gold: #D4A574;           /* Warm Amber Teak (Highlight emas & status bintang) */
    --color-gold-rgb: 212 165 116;
    
    --color-beige: #E8E0D5;          /* Warm Paper Beige (Divider & kartu statistik) */
    --color-beige-rgb: 232 224 213;
}
```

### 2.2. Mode Gelap Aplikasi Utama (*Mahogany Nightfall*)
Berbeda dari dark mode biasa yang menggunakan hitam keabuan atau navy, MyBookshelf menggunakan latar kayu mahoni pekat:
* **Body Background:** `#1A1612` *(Deep Mahogany Wood)*
* **Surface Cards:** `#201A14` *(Dark Walnut Surface)*
* **Card Borders:** `rgba(122, 92, 66, 0.25)` *(Subtle Walnut Border)*
* **Primary Text:** `#F8F5F0` *(Warm Parchment)*

### 2.3. Palet Rak Kayu Jati (`shelfConstants.ts`)
```typescript
export const WOOD = {
    // Dinding belakang rak: Tekstur kayu jati vertikal
    back: "linear-gradient(180deg, #b8844a 0%, #a87038 50%, #926030 100%)",
    backDark: "linear-gradient(180deg, #9a6e3a 0%, #8a5e2c 50%, #7a5025 100%)",
    
    // Papan atas rak tempat bertumpunya buku
    board: "linear-gradient(180deg, #d4a464 0%, #bc8c48 30%, #a07030 65%, #845020 100%)",
    
    // Panel samping kiri & kanan rak (memberikan kedalaman 3D)
    side:  "linear-gradient(to right, #6a4018 0%, #8a5a28 45%, #7a4e20 70%, #5a3410 100%)",
    sideR: "linear-gradient(to left,  #6a4018 0%, #8a5a28 45%, #7a4e20 70%, #5a3410 100%)",
    
    // Jalur informasi di bawah papan rak
    info: "linear-gradient(180deg, #3a2008 0%, #2c1606 100%)",
} as const;
```

---

## 3. Geometri Rak & Fisika Buku 3D

### 3.1. Dimensi Fisik Rak
Konstanta baku rendering ruang rak didefinisikan pada `shelfConstants.ts`:
* `BOOK_AREA_H = 200px`: Tinggi ruang rongga buku (*book cavity*).
* `BOARD_H = 14px`: Ketebalan papan kayu rak.
* `INFO_H = 32px`: Tinggi bilah informasi keterisian buku di bawah papan.

### 3.2. Pemodelan Matematis Punggung Buku (*Book Spine*)

Punggung buku dihitung secara prosedural berdasarkan ketebalan halaman fisik:

$$\text{Spine Width (px)} = \text{clamp}(24\text{px},\, \text{pages} \times 0.08\text{px},\, 58\text{px})$$

* **Buku tipis (< 150 halaman):** Dibatasi minimum $24\text{px}$ agar teks judul vertikal tetap terbaca dengan jelas.
* **Buku tebal (> 700 halaman):** Dibatasi maksimum $58\text{px}$ agar tidak mendominasi ruang rak secara berlebih.

#### Shading & Tekstur Permukaan Matte:
Punggung buku disimulasikan menggunakan multi-layer CSS:
1. **Gradien Pembengkokan Binding:**
   ```css
   linear-gradient(to right,
       var(--c2) 0%,
       rgba(0,0,0,0.14) 9%,
       var(--c0) 18%,
       var(--c1) 78%,
       rgba(0,0,0,0.10) 93%,
       var(--c2) 100%)
   ```
2. **Tekstur Serat Kain (*Canvas Weave*):**
   Disusun dari dua lapis `repeating-linear-gradient` (0 derajat dan 90 derajat) dengan opasitas `0.14` untuk menciptakan sensasi raba kain jilid buku fisik.

---

## 4. Tipografi

Sistem tipografi MyBookshelf menggabungkan keanggunan literatur klasik dengan keterbacaan data modern:

| Tipe Font | Family | Penggunaan | Karakteristik |
| :--- | :--- | :--- | :--- |
| **Serif Literer** | `Playfair Display`, `Georgia`, `serif` | Judul Halaman, Nama Buku di Spine, Label Rak, Heading Kartu | Klasik, elegan, berbobot intelektual |
| **Modern Sans** | `Inter`, `system-ui`, `sans-serif` | Angka Metrik, Deskripsi, Formulir, Tombol Aksi, Navigasi | Bersih, sangat mudah dibaca (*high legibility*) |
| **Monospace** | `Courier New`, `monospace` | Timestamp sesi baca, kode identifikasi buku | Presisi teknis |

---

## 5. Sistem Grid Responsif

* **Rak Buku (`SortableShelf`):** Menggunakan sistem 12 kolom responsif (`grid-column: span var(--shelf-span, 12)`). Pada mobile selalu memenuhi 12 kolom, pada desktop dapat diatur 6 kolom (setengah lebar) atau 12 kolom (penuh).
* **Kartu Target Membaca (`YearlyTargetCards`):** Menggunakan sistem grid dinamis `sm:grid-cols-2 lg:grid-cols-4 gap-3.5` pada tablet/desktop agar seluruh kartu terdistribusi simetris tanpa terpotong di tepi layar.
