# Task Tracker Frontend

Frontend aplikasi Task Tracker berbasis Vue 3 untuk mengelola proyek dan task dengan UI modern.

## ✨ Highlights

- Authentication flow (login/register)
- Dashboard, daftar proyek, dan detail task
- Create/Edit Project dan Create/Edit Task
- Profile management
- Responsive layout dengan Vue component architecture

## 🧰 Tech Stack

- Vue 3 + TypeScript
- Vue Router
- Pinia
- Axios
- Vite
- Tailwind CSS + PostCSS

## 📦 Requirements

- Node.js `^20.19.0` atau `>=22.12.0`
- npm (disarankan versi terbaru)

## 🚀 Getting Started

1. Install dependencies

```bash
npm install
```

2. Jalankan development server

```bash
npm run dev
```

3. Buka URL yang muncul di terminal (biasanya `http://localhost:5173`)

## 🧪 Available Scripts

- `npm run dev` → menjalankan app di mode development
- `npm run build` → type-check lalu build production
- `npm run build-only` → build production tanpa type-check terpisah
- `npm run type-check` → cek TypeScript dengan `vue-tsc`
- `npm run preview` → preview hasil build production
- `npm run format` → format kode pada folder `src`

## 🗂️ Struktur Folder (Ringkas)

```text
frontend/
├─ public/
├─ src/
│  ├─ components/
│  ├─ composables/
│  ├─ router/
│  ├─ services/
│  ├─ stores/
│  └─ views/
├─ index.html
├─ package.json
└─ vite.config.ts
```

## 🔌 Backend API

Project ini terhubung ke backend Laravel (`TaskTracker`) melalui Axios di layer `services`/`composables`.
Pastikan backend berjalan dan endpoint API sudah sesuai sebelum testing flow create/edit/delete.

## 🛠️ Rekomendasi Development Tools

- VS Code
- Vue - Official (Volar)
- Vue.js DevTools (browser extension)

## 📄 License

Private project untuk kebutuhan pengembangan internal/portofolio.
