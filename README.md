# MLJDL Agency — Wedding Invitation (Rizki & Fadia)

A digital wedding invitation for **Rizki & Fadia** built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Leaflet (venue map)
- Lucide React (icons)
- React Router v7 (multi-page routing)

---

## Getting Started

### 1. Environment variables (optional)

```bash
cp .env.example .env
```

| Variable       | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `VITE_API_URL` | Base URL of the backend (only needed if RSVP is wired to API) |

### 2. Install dependencies

```bash
npm ci
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite development server        |
| `npm run build`   | Build for production (`dist/`)       |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

---

## Routes

| Path           | Page              | Description                                                    |
| -------------- | ----------------- | -------------------------------------------------------------- |
| `/`            | `UndanganPage`    | Main wedding invitation (cover + all sections)                 |
| `/daftar-tamu` | `DaftarTamuPage`  | Guest manager: search, add, share WA link, export CSV          |

### Personalised greeting

Append `?to=Name` to the URL so the cover greets the invited guest by name:

```
https://your-domain.com/?to=Bapak%20Andi%20Wijaya
```

The guest manager copies and shares these links via WhatsApp.

---

## Editing Wedding Content

All content is in `src/data/` so you can change details without touching components.

| What to change                  | File to edit               |
| ------------------------------- | -------------------------- |
| Couple names, parents, role     | `src/data/wedding.ts`      |
| Event dates, times, venue       | `src/data/wedding.ts`      |
| Map coordinates                 | `src/data/wedding.ts`      |
| Bank accounts (amplop digital)  | `src/data/bank.ts`         |
| Ayat / Hadith quotes            | `src/data/scripture.ts`    |
| Initial guest list              | `src/data/guests.ts`       |
| Wedding palette colours         | `tailwind.config.js`       |

---

## Project Structure

```
mljdl-undangan-fe/
├─ public/
│  └─ assets/             # floral SVG ornaments
├─ src/
│  ├─ components/         # section + utility components
│  ├─ data/               # static content (couple, events, bank, scripture, guests)
│  ├─ hooks/              # useCountdown, useScrollSpy, useGuestParam
│  ├─ pages/              # UndanganPage, DaftarTamuPage
│  ├─ types/              # shared TypeScript types
│  ├─ App.tsx             # root, BrowserRouter + routes
│  ├─ index.css           # Tailwind + global CSS
│  └─ index.tsx           # Vite entry
├─ legacy/                # archived original HTML (pre-migration)
├─ docs/                  # project documentation
├─ index.html             # Vite HTML template
├─ tailwind.config.js
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
└─ CLAUDE.md              # instructions for Claude Code
```

---

## Deployment

The build output (`dist/`) is fully static. Deploy anywhere:

```bash
npm run build
```

### Vercel

```bash
npx vercel
```

### Netlify

Drag and drop `dist/` into [netlify.com/drop](https://netlify.com/drop).

### GitHub Pages

Use the `gh-pages` package or a GitHub Actions workflow to publish `dist/`.

---

## Documentation

Full documentation is available in the [`docs/`](./docs/) folder:

- [000 — Index](./docs/000_index.md)
- [001 — Architecture](./docs/001_architecture.md)
- [002 — How to Use](./docs/002_how_to_use.md)
- [003 — Next Improvement](./docs/003_next_improvement.md)
