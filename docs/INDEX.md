# Dokumentasi Teknis & Spesifikasi Rekayasa MyBookshelf

Selamat datang di repositori dokumentasi rekayasa perangkat lunak resmi untuk **MyBookshelf** — platform perpustakaan digital dan pelacak bacaan modern dengan visualisasi rak buku 3D interaktif.

Dokumentasi ini disusun dengan standar spesifikasi rekayasa (*system engineering specification*) berbasis kode nyata, bebas dari teks generik, mencakup arsitektur sistem, skema basis data, spesifikasi API, pemodelan matematis UI/UX, dan keputusan teknis (*Architecture Decision Records*).

---

## 1. Arsitektur & Cetak Biru Sistem (`architecture/`)
Dokumentasi tingkat tinggi mengenai arsitektur sistem, integrasi subsistem, aliran data, dan keputusan desain fundamental.

* 🏛️ **[Spesifikasi Arsitektur Sistem](architecture/SYSTEM_ARCHITECTURE.md)**  
  *Cetak biru arsitektur Decoupled (Laravel 12 REST API + React 19 SPA), diagram kontainer C4, metrik target latensi P95 (<120ms), dan kebijakan keamanan Sanctum.*

* 📋 **[Rekam Keputusan Arsitektur (ADR)](architecture/DECISION_RECORDS.md)**  
  *Catatan historis alasan teknis dan trade-off di balik adopsi decoupled architecture, PostgreSQL 16+, dual state management (Zustand + TanStack Query), engine 3D berbasis CSS transforms, dan `@dnd-kit`.*

---

## 2. Spesifikasi Teknis Inti (`specifications/`)
Spesifikasi teknis mendalam yang menjadi acuan pengkodean, integrasi data, dan standarisasi antarmuka.

* 🌳 **[Susunan & Organisasi Proyek](specifications/PROJECT_STRUCTURE.md)**  
  *Peta pohon direktori monorepo/decoupled, pembagian tanggung jawab modul backend Laravel (`app/`) dan frontend React (`frontend/src/components`).*

* 🗄️ **[Skema Basis Data & Model Data](specifications/DATABASE_SCHEMA.md)**  
  *Diagram relasi entitas (ERD), spesifikasi tipe data kolom, nullability, indeks, cascade constraints, dan model Eloquent di PostgreSQL.*

* 🔌 **[Spesifikasi RESTful API v1](specifications/API_SPECIFICATION.md)**  
  *Katalog lengkap endpoint `/api/v1/` untuk autentikasi, siklus hidup buku, kontrol rak 3D, timer sesi membaca real-time, dan modul akuntansi.*

* 🎨 **[Spesifikasi UI/UX & Design System](specifications/UI_UX_DESIGN_SYSTEM.md)**  
  *Filosofi "Tactile Reading Sanctuary", sistem token warna (Warm Teak Wood & Ivory Linen vs Cosmic Midnight), pemodelan matematis ketebalan punggung buku 3D, shader tekstur matte, dan grid responsif.*

---

## 3. Panduan Fitur Fungsional (`features/`)
Dokumentasi cara kerja modul fitur utama dari sudut pandang alur fungsional sistem.

* 📚 **[Kustomisasi Rak Buku 3D](features/Kustomisasi_Rak_Buku.md)**  
  *Panduan rendering rak fisik, kontrol pencahayaan meja (*table lamp*), dan katalog dekorasi rak (tanaman, lilin, jam digital, kucing pixel).*

* ⏱️ **[Sistem Membaca & Timer Sesi](features/Sistem_Membaca.md)**  
  *Mekanisme pelacakan durasi membaca waktu-nyata, auto-pause, kalkulasi halaman, dan agregasi statistik tahunan.*

* 💰 **[Manajemen Keuangan & Anggaran](features/Manajemen_Keuangan.md)**  
  *Sistem pembukuan buku internal untuk logging anggaran belanja (*budget*), pencatatan transaksi (*expenses*), dan konversi multi-mata uang.*

---

## 4. Referensi Teknis Pendukung & Log Evolusi

* 🖼️ **[Arsitektur Sistem Modal Dialog](technical/Modal_System_Architecture.md)** — Pola perancangan dialog pop-up modular di frontend.
* 🔐 **[Log Perbaikan Autentikasi](technical/Authentication_Fix_Log.md)** — Rekam jejak resolusi rute terproteksi Sanctum.
* 📦 **[Panduan Data Seeder](technical/Book_Seeder_Guide.md)** — Mekanisme injeksi dataset buku katalog awal.
* 📈 **[Laporan Refactoring & Evolusi](history/Progress_Report.md)** — Laporan tahapan refactoring modularisasi kode.
