## Fitur

- Login dan logout dengan Better Auth
- Dashboard admin berbasis App Router
- Pengelolaan data toko
- Input kinerja manual dan upload data
- Pengaturan bobot kriteria C1, C2, dan C3
- Ranking SPK dan ringkasan hasil
- Tema dan layout yang dapat dikustomisasi
- Notifikasi UI dengan Sonner

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Biome
- Better Auth
- Drizzle ORM
- PostgreSQL
- Zod
- React Hook Form
- Zustand
- shadcn/ui

## Prasyarat

- Node.js 22 atau lebih baru
- npm 10 atau lebih baru
- PostgreSQL, bisa lokal, Supabase, atau service PostgreSQL lain
- Docker dan Docker Compose, hanya jika ingin deploy via container di VPS

## Quick Start Lokal

1. Clone repository:
   ```bash
   git clone https://github.com/muhrobby/spk.git
   cd spk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Isi file `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   BETTER_AUTH_SECRET="generate-dengan-openssl-rand-hex-32"
   BETTER_AUTH_URL="http://localhost:3000"
   NODE_ENV="development"
   N8N_RANKING_WEBHOOK_URL=""
   ```

5. Generate secret auth jika belum punya:
   ```bash
   openssl rand -hex 32
   ```

6. Jalankan migrasi database:
   ```bash
   npm run db:migrate
   ```

7. Seed data awal:
   ```bash
   npm run db:seed
   npm run db:seed:admin
   ```

8. Jalankan development server:
   ```bash
   npm run dev
   ```

9. Buka aplikasi:
   ```text
   http://localhost:3000
   ```

## Akun Demo

Setelah seed admin dijalankan, gunakan akun berikut:

- Email: `admin@example.com`
- Password: `password`

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build production |
| `npm run start` | Menjalankan hasil build |
| `npm run check` | Menjalankan pengecekan Biome |
| `npm run check:fix` | Menjalankan Biome dan auto-fix |
| `npm run format` | Format file dengan Biome |
| `npm run db:generate` | Generate migration Drizzle |
| `npm run db:migrate` | Jalankan migration database |
| `npm run db:studio` | Buka Drizzle Studio |
| `npm run db:seed` | Seed bobot kriteria default |
| `npm run db:seed:admin` | Seed admin demo |

## Environment Variables

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | Ya | Connection string PostgreSQL |
| `BETTER_AUTH_SECRET` | Ya | Secret untuk Better Auth, gunakan `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | Ya | Base URL aplikasi, contoh lokal `http://localhost:3000` |
| `NODE_ENV` | Ya | Gunakan `development` untuk lokal dan `production` untuk deploy |
| `N8N_RANKING_WEBHOOK_URL` | Tidak | Webhook untuk pengiriman email ranking jika fitur email digunakan |

Jangan commit file `.env`. File tersebut sudah di-ignore oleh git.

## Struktur Proyek

```text
src/
  app/
    (main)/
      auth/             # Login layout dan halaman autentikasi
      dashboard/        # Halaman utama admin
      unauthorized/     # Halaman akses ditolak
    api/auth/           # Endpoint Better Auth
  actions/              # Server actions untuk CRUD dan ranking
  components/           # Komponen UI reusable
  db/                   # Koneksi database, schema, dan seed
  lib/                  # Utility, auth, preference, dan helper umum
  stores/               # Zustand store untuk state client
```

## Arsitektur

- Halaman dan komponen diletakkan secara kolokasi di dalam folder route masing-masing.
- `src/lib/auth` menangani konfigurasi auth, session check, dan client auth.
- `src/db` menyimpan konfigurasi koneksi, schema, dan seed data.
- `src/actions` berisi server actions untuk operasi domain seperti toko, bobot, dan ranking.
- `src/stores` menyimpan state client untuk preferensi UI.

## Database Setup

Untuk development lokal, project ini menggunakan PostgreSQL.

Contoh menjalankan PostgreSQL via Docker:

```bash
docker run --name spk-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=spk -p 5432:5432 -d postgres:16
```

Lalu set `DATABASE_URL=postgresql://postgres:password@localhost:5432/spk` di file `.env`.

## Build Production Lokal

Jalankan perintah berikut sebelum deploy untuk memastikan aplikasi bisa dibuild:

```bash
npm run lint
npm run build
```

Setelah build berhasil, jalankan production server:

```bash
npm run start
```

## Deploy ke Vercel

1. Push repository ke GitHub.
2. Import project di Vercel.
3. Set environment variables di Vercel Project Settings:
   ```text
   DATABASE_URL
   BETTER_AUTH_SECRET
   BETTER_AUTH_URL
   N8N_RANKING_WEBHOOK_URL
   ```
4. Pastikan `BETTER_AUTH_URL` memakai domain production, contoh:
   ```text
   https://nama-domain.vercel.app
   ```
5. Deploy dari dashboard Vercel.

Project ini memakai `vercel.json` dengan install command:

```bash
npm ci --include=dev
```

Dev dependencies tetap diinstall saat build karena Next.js membutuhkan toolchain seperti Tailwind/PostCSS dan TypeScript.

## Deploy ke VPS dengan Docker Compose

1. Clone repository di VPS:
   ```bash
   git clone https://github.com/muhrobby/spk.git
   cd spk
   ```

2. Buat file `.env`:
   ```bash
   cp .env.example .env
   ```

3. Isi `.env` untuk production:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   BETTER_AUTH_SECRET="secret-production"
   BETTER_AUTH_URL="http://IP-VPS:3010"
   NODE_ENV="production"
   N8N_RANKING_WEBHOOK_URL=""
   ```

4. Build dan jalankan container:
   ```bash
   docker compose up -d --build
   ```

5. Cek logs:
   ```bash
   docker compose logs -f spk-app
   ```

6. Akses aplikasi:
   ```text
   http://IP-VPS:3010
   ```

Konfigurasi Docker Compose saat ini:

| Setting | Nilai |
| --- | --- |
| Port | `3010:3010` |
| Memory limit | `512m` |
| Swap limit | `512m` |
| CPU limit | `1.0` |
| Restart policy | `unless-stopped` |

Build Docker membutuhkan `.env` karena Next.js membaca konfigurasi auth dan database saat build. Secret dibaca memakai BuildKit secret sehingga tidak disalin ke image layer.

## Update Deploy di VPS

Untuk update aplikasi setelah ada perubahan di GitHub:

```bash
git pull origin main
docker compose up -d --build
```

Untuk restart tanpa rebuild:

```bash
docker compose restart spk-app
```

Untuk menghentikan container:

```bash
docker compose down
```

## Catatan

- Folder `src/app/(main)/auth` berisi alur login dan layout autentikasi.
- Demo account ditampilkan di halaman login agar mudah testing lokal.
- `npm run build` menggunakan Next.js 16 dan Turbopack.
- Jika deploy gagal karena environment variable kosong, pastikan `.env` lokal, Vercel Environment Variables, atau env di VPS sudah diisi.

## Kontribusi

Sebelum commit, jalankan:

```bash
npm run check
npm run build
```
