# AI Art Instagram Agent 🎨

Agent AI untuk menghasilkan gambar seni potret manusia dan mengunggahnya ke Instagram secara otomatis.

## Fitur

- ✨ Generate gambar seni potret manusia menggunakan DALL-E 3
- 🎨 Berbagai gaya seni (Renaissance, Impresionisme, Digital Modern, dll)
- 📸 Upload otomatis ke Instagram
- 🖼️ Preview gambar sebelum upload
- 💫 Interface yang mudah digunakan

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment Variables

Copy `.env.local.example` ke `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dan tambahkan kredensial Anda.

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000

## Deploy ke Vercel

```bash
vercel deploy --prod
```

Jangan lupa tambahkan environment variables di Vercel dashboard.
