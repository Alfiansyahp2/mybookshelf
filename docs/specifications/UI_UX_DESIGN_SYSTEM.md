# UI/UX & Design System Specification
## MyBookshelf Engineering Blueprint

Dokumen ini mendokumentasikan sistem desain visual aktual pada **MyBookshelf**, mencakup isolasi tema ganda (*Dual-Theme*), token warna Tailwind & CSS variables, geometri rak 3D, fisika animasi punggung buku, kendali pencahayaan lampu meja, serta katalog dekorasi rak.

---

## 1. Arsitektur Dual-Theme (Isolasi Warna Ketat)

Aplikasi menerapkan dua identitas visual yang dipisahkan secara tegas berdasarkan area halaman:

### 1.1. Tema Aplikasi Utama: *Warm Wood & Ivory Sanctuary*
Digunakan di seluruh halaman kerja internal (`/dashboard`, `/library`, `/reading`, `/wishlist`, `/accounting`, dll.) dengan fokus warna cokelat kayu hangat tanpa bias warna biru dingin (`frontend/src/index.css` & `tailwind.config.js`):

```css
:root {
    --color-cream: #f8f5f0;          /* Warm Ivory Linen — background aplikasi */
    --color-cream-rgb: 248 245 240;
    --color-dark-brown: #4a3b2f;     /* Deep Espresso — teks utama & heading */
    --color-dark-brown-rgb: 74 59 47;
    --color-walnut: #7a5c42;         /* Warm Walnut — tombol aksi, border, sub-teks */
    --color-walnut-rgb: 122 92 66;
    --color-gold: #d4a574;           /* Warm Amber Teak — highlight & aksen */
    --color-gold-rgb: 212 165 116;
    --color-beige: #e8e0d5;          /* Warm Paper Beige — divider & border lembut */
    --color-beige-rgb: 232 224 213;
}
```

* **Dark Mode Internal (`html.dark body`):** Latar beralih ke kayu mahoni pekat `#1a1612` dengan permukaan kartu `#201a14` dan teks `#f8f5f0`, serta header kaca gelap `rgba(42, 26, 16, 0.9)`.
* **Dinding Halaman `/reading` (`Reading.tsx`):** Menggunakan gradien plaster hangat `linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)` bertekstur garis linen halus (`opacity: 0.18`).
* **Kartu Target Tahunan (`YearlyTargetCards.tsx`):** Header gradien mahoni `linear-gradient(135deg, #2b1810 0%, #3e2417 50%, #2b1810 100%)` dengan grid metrik responsif `sm:grid-cols-2 lg:grid-cols-4`.

### 1.2. Tema Landing Page: *Celestial Midnight*
Diisolasi secara eksklusif pada `LandingPage.tsx` dan `components/landing/*` serta token `night` di `tailwind.config.js`:
* **Light Mode Landing:** `#f0f4f8` dengan teks `#0f172a`.
* **Dark Mode Landing (`night`):** `base: #0a0e1a`, `surface: #131b2e`, `accent: #1e293b`, `text: #f1f5f9`, `muted: #94a3b8` disertai efek radial glow nebula (`indigo-500`, `purple-600`, `sky-500`) dan partikel `LibraryAmbientParticles`.

---

## 2. Geometri & Material Rak Kayu 3D

Didefinisikan pada `frontend/src/components/shelf/shelf-elements/shelfConstants.ts` dan `Bookshelf.tsx`:

### 2.1. Konstanta Dimensi Rak
* `BOOK_AREA_H = 200` (px) — Tinggi ruang rongga peletakan buku.
* `BOARD_H = 14` (px) — Ketebalan papan kayu horizontal rak.
* `INFO_H = 32` (px) — Tinggi bilah informasi kapasitas & aksi di bawah papan.

### 2.2. Palet Gradien Kayu Jati (`WOOD` & `FRAME`)
* **Dinding Belakang Rak (`WOOD.back`):** `linear-gradient(180deg, #b8844a 0%, #a87038 50%, #926030 100%)`.
* **Papan Rak (`WOOD.board`):** `linear-gradient(180deg, #d4a464 0%, #bc8c48 30%, #a07030 65%, #845020 100%)`.
* **Panel Samping (`WOOD.side` / `sideR`):** `linear-gradient(to right, #6a4018 0%, #8a5a28 45%, #7a4e20 70%, #5a3410 100%)` dengan garis serat kayu pada koordinat `SIDE_GRAIN_Y = [14, 32, 52, 80, 115, 154, 186]`.
* **Info Strip (`WOOD.info`):** `linear-gradient(180deg, #3a2008 0%, #2c1606 100%)`.
* **Bingkai Lemari (`Bookshelf.tsx` `FRAME`):** `topRail`, `sideBar`, dan `basePlinth` bernuansa *medium honey-walnut*.

---

## 3. Dimensi Buku & Fisika Interaksi 3D

Didefinisikan pada `frontend/src/components/shelf/book-elements/bookConstants.ts`, `Book.tsx`, dan `BookSpine.tsx`:

### 3.1. Kalkulasi Dimensi Deterministik (`getBookDimensions`)
Berbeda dari estimasi kontinyu, ukuran fisik punggung buku dipetakan melalui konstanta diskrit agar proporsi visual di rak tetap harmonis:

```typescript
export const HEIGHT_RATIO: Record<string, number> = {
    short: 0.72,   // 144px jika bookAreaHeight = 200px
    medium: 0.86,  // 172px
    tall: 0.96,    // 192px
};

export const THICKNESS_PX: Record<string, number> = {
    thin: 18,
    regular: 26,
    thick: 38,
};
// Default fallback: ratio = 0.86, bookW = 28px
```

### 3.2. Tekstur Matte & Animasi Spring 3D
* **Shader Punggung Buku (`BookSpine.tsx`):**
  * Gradien 3-warna (`c0`, `c1`, `c2`) dengan penggelapan lipatan penjilidan di tepi kiri `9%` (`rgba(0,0,0,0.14)`) dan kanan `93%` (`rgba(0,0,0,0.10)`).
  * Lapisan tekstur tenun kanvas (*canvas/cloth weave*) menggunakan dua `repeating-linear-gradient` (0° dan 90°, `opacity: 0.14`).
* **Fisika Framer Motion (`Book.tsx`):**
  * Menggunakan `transformStyle: "preserve-3d"`, `transformOrigin: "center bottom"`, dan transisi pegas `{ type: "spring", stiffness: 280, damping: 24 }`.
  * **Hover State:** Mengangkat buku `y: -(bookAreaHeight * 0.06)` dan `scale: 1.02` (`zIndex: 40`).
  * **Clicked State:** Menarik buku lebih tinggi `y: -(bookAreaHeight * 0.14)`, memutar `rotateY: 10`, dan `scale: 1.06` (`zIndex: 60`).

---

## 4. Sistem Pencahayaan & Dekorasi Rak

### 4.1. Lighting Engine (`frontend/src/hooks/useLighting.ts`)
Menyediakan 5 preset temperatur warna strip LED di bagian atas rongga rak (persisted ke `mybookshelf_lighting`, default `on: true`, `brightness: 80`, `colorTemp: "warm"`):

| Preset | Strip Hex | Glow RGBA Prefix | Label UI |
| :--- | :--- | :--- | :--- |
| `warm` | `#FFB020` | `rgba(255,176,32,` | Warm |
| `neutral` | `#FFD878` | `rgba(255,216,120,` | Netral |
| `cool` | `#E8F4FF` | `rgba(220,240,255,` | Sejuk |
| `rose` | `#FFB0C0` | `rgba(255,176,192,` | Rose |
| `mint` | `#A0FFD0` | `rgba(160,255,208,` | Mint |

### 4.2. Katalog Dekorasi (`frontend/src/types/decorations.ts`)
Setiap rak memiliki slot `left` dan `right` yang mendukung **15 jenis dekorasi**:
`candle`, `candle_pair`, `plant_pot`, `plant_hanging`, `vase_tall`, `vase_round`, `frame_photo`, `bookend_L`, `clock_small`, `clock_digital`, `mug`, `lantern`, `succulent`, `cat_sleep`, `cat_sit`.

---

## 5. Tipografi, Transisi Halaman, & Grid

* **Font Family (`tailwind.config.js`):**
  * `serif`: `Playfair Display`, `Georgia`, `serif` (judul, nama buku, heading kartu).
  * `sans`: `Inter`, `system-ui`, `sans-serif` (teks UI, metrik angka, form).
  * `mono`: `Courier New`, `monospace`.
* **Transisi Antar Halaman (`AppLayout.tsx`):** Animasi kubus/membalik halaman 3D dengan `perspective: "1200px"`, `transformOrigin: "50% 50% 50vw"`, dan `rotateY: -90 -> 0 -> 90` selama `0.6s`.
* **Grid Responsif:**
  * Rak buku (`SortableShelf`): Mendukung resize lebar kolom (`100%` / span 12, `50%` / span 6, `33%` / span 4, `25%` / span 3, `16%` / span 2) pada layar `md:` ke atas (`.sortable-shelf-grid`).
  * Indikator okupansi rak (`getShelfCapacity`): Hijau `#34d399` (<70%), Kuning `#fbbf24` (70–89%), Merah `#f87171` (>=90%), mengabaikan buku berstatus `borrowed`.
