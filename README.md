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

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Isi environment variable berikut:
   - `DATABASE_URL`: connection string PostgreSQL
   - `BETTER_AUTH_SECRET`: secret auth, generate dengan `openssl rand -hex 32`
   - `BETTER_AUTH_URL`: URL aplikasi, contoh `http://localhost:3000`

4. Generate dan migrasi database:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Seed data awal:
   ```bash
   npm run db:seed
   npm run db:seed:admin
   ```

6. Jalankan aplikasi:
   ```bash
   npm run dev
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

## Catatan

- Folder `src/app/(main)/auth` berisi alur login dan layout autentikasi.
- Demo account ditampilkan di halaman login agar mudah testing lokal.
- `npm run build` menggunakan Next.js 16 dan Turbopack.

## Kontribusi

Sebelum commit, jalankan:

```bash
npm run check
npm run build
```
