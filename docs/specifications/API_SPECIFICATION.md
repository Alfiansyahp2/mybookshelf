# RESTful API Specification (v1)
## MyBookshelf Engineering Blueprint

Dokumen ini merupakan spesifikasi antarmuka pemrograman aplikasi (API) resmi versi 1 (`/api/v1/`) untuk backend MyBookshelf yang dibangun di atas Laravel 12.

---

## 1. Standar Komunikasi & Autentikasi

* **Base URL:** `http://localhost:8000/api/v1` (atau domain produksi)
* **Format:** `application/json`
* **Header Autentikasi:**
  ```http
  Authorization: Bearer <personal_access_token>
  Accept: application/json
  Content-Type: application/json
  ```
* **Format Respons Standar:**
  ```json
  {
    "success": true,
    "message": "Deskripsi status operasi",
    "data": { ... }
  }
  ```

---

## 2. Katalog Endpoint API

### 2.1. Autentikasi (`/auth`)

| Metode | Path | Deskripsi | Akses |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Login user, mengembalikan token Sanctum & profil user | Publik (Throttled 5/min) |
| `POST` | `/auth/logout` | Mencabut (*revoke*) token akses aktif saat ini | Terproteksi (`auth:sanctum`) |
| `GET` | `/auth/me` | Mengambil data profil user yang sedang login | Terproteksi (`auth:sanctum`) |
| `PUT` | `/user/profile` | Memperbarui nama dan email pengguna | Terproteksi (`auth:sanctum`) |
| `PUT` | `/user/password`| Mengganti kata sandi akun | Terproteksi (`auth:sanctum`) |

#### Contoh Payload `POST /auth/login`:
```json
{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

---

### 2.2. Manajemen Buku (`/books`)

| Metode | Path | Deskripsi | Parameter Query / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/books` | Mengambil daftar koleksi buku | `status`, `favorite`, `search`, `shelf_id` |
| `POST` | `/books` | Menambahkan buku baru | `title`, `author`, `pages`, `shelf_id`, dll. |
| `GET` | `/books/{id}` | Detail spesifik sebuah buku | - |
| `PUT` | `/books/{id}` | Memperbarui atribut buku | Objek data buku terupdate |
| `DELETE` | `/books/{id}` | Menghapus buku dari sistem | - |
| `POST` | `/books/{id}/start` | Mengubah status buku menjadi `reading` | - |
| `POST` | `/books/{id}/finish`| Mengubah status buku menjadi `finished` | - |
| `PATCH` | `/books/{id}/progress`| Update halaman baca terakhir & hitung persentase | `{"current_page": 120}` |
| `PATCH` | `/books/{id}/favorite`| Toggle status buku favorit (true/false) | - |
| `PATCH` | `/books/{id}/shelf` | Memindahkan buku ke rak lain | `{"shelf_id": 4}` |
| `POST` | `/books/{id}/cover` | Upload berkas gambar sampul | `multipart/form-data` (`cover`) |
| `GET` | `/books/{id}/timeline`| Riwayat aktivitas membaca buku | - |

---

### 2.3. Manajemen Rak 3D (`/shelves`)

| Metode | Path | Deskripsi | Parameter / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/shelves` | Mengambil daftar rak beserta buku di dalamnya | - |
| `POST` | `/shelves` | Membuat rak buku baru | `name`, `capacity`, `span` |
| `PUT` | `/shelves/{id}` | Update nama, kapasitas, atau dekorasi rak | Objek konfigurasi rak |
| `DELETE` | `/shelves/{id}` | Menghapus rak (buku dipindah ke status unassigned)| - |
| `PUT` | `/shelves/layout` | Memperbarui urutan penataan rak vertikal | `{"shelves": [{"id": 1, "order": 0}, ...]}` |
| `GET` | `/shelves/{id}/occupancy` | Mengambil persentase keterisian fisik rak | - |

---

### 2.4. Sesi Membaca Waktu Nyata (`/books/{id}/reading-sessions`)

| Metode | Path | Deskripsi | Parameter / Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/books/{id}/reading-sessions/start` | Memulai timer sesi membaca baru | - |
| `PATCH`| `/books/{id}/reading-sessions/{sessionId}/pause`| Jeda / resume timer sesi baca | `{"is_paused": true}` |
| `PUT` | `/books/{id}/reading-sessions/{sessionId}/end` | Mengakhiri sesi membaca dan mencatat progres | `{"end_page": 145, "duration_seconds": 1800}` |
| `GET` | `/books/{id}/reading-sessions` | Histori sesi membaca untuk buku tertentu | - |
| `POST` | `/books/{id}/read-again` | Mengulang baca buku yang sudah berstatus finished | - |

---

### 2.5. Statistik & Prestasi (`/statistics`, `/achievements`)

| Metode | Path | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/statistics` | Agregasi total halaman, jam baca, tren mingguan, genre breakdown |
| `GET` | `/achievements` | Daftar pencapaian lencana baca dan status unlock |
| `POST`| `/achievements/{id}/unlock` | Trigger pembukaan pencapaian secara manual/sistem |

---

### 2.6. Modul Akuntansi Buku (`/accounting`)

| Metode | Path | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/accounting/expenses` | Riwayat transaksi pembelian buku |
| `POST`| `/accounting/expenses` | Tambah catatan pengeluaran baru |
| `POST`| `/accounting/expenses/{id}/receipt` | Upload struk / nota pembayaran |
| `GET` | `/accounting/expenses/by-category` | Laporan distribusi belanja per kategori buku |
| `GET` | `/accounting/budgets` | Pengaturan pagu anggaran belanja buku bulanan |
| `POST`| `/accounting/budgets` | Set / perbarui anggaran bulan tertentu |
| `GET` | `/accounting/reports/summary` | Neraca ringkasan belanja vs anggaran per tahun/bulan |

---

## 3. Kode Status Respons HTTP

* `200 OK`: Permintaan berhasil dieksekusi.
* `201 Created`: Sumber daya data baru berhasil dibuat.
* `400 Bad Request`: Format payload salah atau tidak lengkap.
* `401 Unauthorized`: Token Sanctum tidak disertakan, kedaluwarsa, atau tidak valid.
* `403 Forbidden`: Pengguna tidak memiliki akses terhadap sumber daya data milik user lain.
* `404 Not Found`: ID data (buku/rak/sesi) tidak ditemukan di database.
* `422 Unprocessable Content`: Gagal validasi data input (detail error per field dikembalikan).
* `429 Too Many Requests`: Melebihi batasan rate limiter.
* `500 Internal Server Error`: Kesalahan logika tidak terduga pada server.
