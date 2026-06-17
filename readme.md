# PhotoBoothJs

Aplikasi **photo booth digital** berbasis web. Pelanggan dapat mengambil foto melalui webcam, memilih layout dan bingkai, melakukan pembayaran via Midtrans, dan mengunduh hasil foto resolusi tinggi.

## Fitur

### Client (Booth)
- Wizard 5 langkah: Mulai → Pilih Layout → Pilih Frame → Bayar → Jepret Foto
- Pemilihan layout (grid 1x1, 1x2, 2x2) dari database
- Pemilihan bingkai dengan kustomisasi warna, border, dan teks
- Pembayaran online via **Midtrans**
- Jepretan webcam langsung dengan hitungan mundur 3 detik
- Pratinjau hasil foto secara *real-time*
- Unduh hasil foto sebagai PNG resolusi tinggi (12x)

### Admin Panel
- Dashboard (ringkasan)
- Manajemen **Layout** (CRUD + pratinjau grid)
- Manajemen **Frame/Bingkai** (CRUD + editor visual dengan color picker, border, teks)
- Transaksi (placeholder)
- Laporan Bulanan (placeholder)
- Pengaturan (placeholder)

## Tech Stack

| Lapisan | Teknologi |
|---------|-----------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| Backend | Laravel 12, PHP 8.2+ |
| Database | SQLite (dev) / MySQL (production) |
| Payment | Midtrans (snap) |
| HTTP Client | Axios |
| Routing | React Router DOM v6 |
| Kamera | react-webcam |
| Export Gambar | html-to-image |
| Linting | ESLint + typescript-eslint |
| Testing Backend | PHPUnit |

## Persyaratan Sistem

- **Node.js** 20+
- **PHP** 8.2+
- **Composer**
- **Database** SQLite (bawaan) atau MySQL

## Setup Dasar Proyek

> Instruksi lengkap dari awal hingga aplikasi berjalan.

### 1. Clone Repository

```bash
git clone <url-repository> photoboothjs
cd photoboothjs
```

### 2. Setup Backend (Laravel API)

```bash
cd backend

# Install dependensi PHP
composer install

# Buat file environment
cp .env.example .env

# Generate app key
php artisan key:generate

# Jalankan migrasi database + seeder
php artisan migrate --seed

# (Opsional) Jika pakai SQLite, pastikan DB_CONNECTION=sqlite di .env
# dan database/database.sqlite sudah ada.
```

Setelah selesai, jalankan server backend:

```bash
php artisan serve
```

Backend berjalan di `http://127.0.0.1:8000`.

> **Cek API:** Buka `http://127.0.0.1:8000/api/test` — harusnya返回 `{"message": "API works!"}`.

### 3. Setup Frontend (React SPA)

```bash
cd frontend

# Install dependensi Node.js
npm install

# Jalankan dev server
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

> **Catatan:** Frontend sudah dikonfigurasi proxy Vite (`vite.config.ts`) sehingga request `/api/*` otomatis diteruskan ke backend di `http://127.0.0.1:8000`.

### 4. Akses Aplikasi

| Halaman | URL |
|---------|-----|
| Booth (client) | `http://localhost:5173/` |
| Admin Panel | `http://localhost:5173/admin` |

### Setup Cepat (satu perintah)

Dari folder `backend`:

```bash
composer run setup
```

Perintah ini akan menjalankan: `composer install` → copy `.env` → `key:generate` → `migrate` → `npm install` → `npm run build`.

## Struktur Proyek

```
photoboothjs/
├── frontend/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── main.tsx              # Entry point React
│   │   ├── App.tsx               # Root component (router & toast)
│   │   ├── index.css             # Tailwind CSS v4
│   │   ├── types/                # Type definitions
│   │   ├── pages/
│   │   │   ├── client/BoothPage.tsx    # Wizard photo booth
│   │   │   └── admin/AdminPage.tsx     # Admin panel
│   │   ├── components/
│   │   │   ├── client/steps/     # StartPage, LayoutStep, FrameStep, PayStep, CaptureStep
│   │   │   ├── admin/            # Dashboard, LayoutContent, LayoutForm, FrameContent, FrameEditor
│   │   │   ├── LayoutPreview.tsx
│   │   │   ├── FramePreview.tsx
│   │   │   └── LoadingBar.tsx
│   │   └── assets/               # Gambar, overlay, frames
│   ├── index.html
│   ├── vite.config.ts            # Proxy API ke backend
│   └── package.json
│
└── backend/                      # Laravel 12 API
    ├── app/
    │   ├── Http/Controllers/Api/
    │   │   ├── LayoutController.php    # CRUD Layout
    │   │   └── FrameController.php     # CRUD Frame
    │   └── Models/
    │       ├── Layout.php
    │       └── Frame.php
    ├── config/
    │   └── cors.php              # Konfigurasi CORS
    ├── database/
    │   ├── migrations/           # Skema tabel
    │   └── seeders/              # Data awal
    ├── routes/
    │   └── api.php               # Endpoint API
    ├── tests/                    # PHPUnit (Unit & Feature)
    └── composer.json
```

## API Endpoints

Semua endpoint berada di bawah prefix `/api`.

### Layouts

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/layouts` | Semua layout |
| GET | `/api/layouts/active` | Layout aktif saja |
| GET | `/api/layouts/{id}` | Detail layout |
| POST | `/api/layouts` | Tambah layout |
| PUT | `/api/layouts/{id}` | Ubah layout |
| DELETE | `/api/layouts/{id}` | Hapus layout |

### Frames

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/frames` | Semua frame |
| GET | `/api/frames/{id}` | Detail frame |
| POST | `/api/frames` | Tambah frame |
| PUT | `/api/frames/{id}` | Ubah frame |
| DELETE | `/api/frames/{id}` | Hapus frame |

### Utility

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/test` | Cek koneksi API |

## Testing

### Backend (PHPUnit)

```bash
cd backend
composer test
# atau
php artisan test
```

### Frontend

Belum ada testing framework terkonfigurasi.

## Environment Variables

### Frontend (`frontend/.env`)

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `VITE_API` | `http://127.0.0.1:8000/` | Base URL backend API |

### Backend (`backend/.env`)

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `DB_CONNECTION` | `mysql` | Gunakan `sqlite` untuk development |
| `DB_DATABASE` | `photobooth` | Nama database |
| `ALLOWED_DOMAIN` | `http://localhost:5173` | Domain yang diizinkan CORS |

## Lisensi

Hak cipta milik pengembang. Proyek ini bersifat private/internal.
