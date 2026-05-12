# 001 — Architecture

## Tech Stack

- **React 18** with TypeScript
- **Vite 5** for dev server and bundling
- **Tailwind CSS 3** for styling
- **react-router-dom v7** for client routing
- **Leaflet** for the venue map
- **lucide-react** for icons

## Folder Structure

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
├─ legacy/                # archived original HTML
├─ docs/                  # this folder
├─ index.html             # Vite HTML template
├─ tailwind.config.js
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
└─ CLAUDE.md
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `UndanganPage` | Main wedding invitation with all sections |
| `/daftar-tamu` | `DaftarTamuPage` | Guest manager (search, add, share link, export CSV) |

## Section Composition (UndanganPage)

The invitation renders in this order:

1. **`CoverSection`** — opening greeting with guest name (`?to=` URL param)
2. **`PembukaanSection`** — Bismillah and salam
3. **`AyatSection`** — Q.S. Ar-Rum : 21
4. **`HadithSection`** — Sabda Rasulullah
5. **`MempelaiSection`** — bride & groom cards
6. **`CountdownSection`** — countdown to 13 Juni 2026 + save to calendar
7. **`AcaraSection`** — Akad & Resepsi details
8. **`LokasiSection`** — venue address + Leaflet map
9. **`RsvpSection`** — attendance form + ucapan list
10. **`AmplopSection`** — digital envelope (bank accounts)
11. **`PenutupSection`** — closing message and signature

## Utility Components

- **`Preloader`** — Bismillah splash on first load
- **`AnimationObserver`** — adds `is-in` to `.reveal` elements as they scroll into view
- **`ScrollToTop`** — restores scroll on route change
- **`Toast`** — global toast for copy / actions feedback

## Hooks

- **`useCountdown(targetIso)`** — returns `{ days, hours, minutes, seconds, isOver }`
- **`useScrollSpy(ids, offset)`** — returns the currently visible section id
- **`useGuestParam()`** — extracts `?to=` from the URL for personalisation

## Data Layer

All content lives in `src/data/`:

- `wedding.ts` — couple bios, events, venue
- `bank.ts` — bank accounts for amplop digital
- `scripture.ts` — ayat & hadith
- `guests.ts` — initial guest list for the manager page

## Styling Notes

- Wedding palette is defined in `tailwind.config.js` under `theme.extend.colors`
- Custom utilities (`.eyebrow`, `.section-title`, `.body-text`, `.btn-gold`, `.reveal`) live in `src/index.css`
- The watercolor backdrop is rendered with `body::before` in `src/index.css`
