# 003 — Next Improvement Roadmap

## Priority Levels
- High — core functionality or UX
- Medium — enhancement
- Low — nice to have

---

## Phase 1 — Content & UX

| Priority | Improvement | Description |
|----------|-------------|-------------|
| High | Background music | Add `<audio>` element with autoplay-after-open behavior, plus toggle button |
| High | Better couple portraits | Replace initial avatars with real photos or the original SVG silhouettes |
| High | RSVP backend | Wire up RSVP form to a serverless endpoint (Vercel Function, Firebase, or sheet API) so submissions persist |
| Medium | Scroll progress bar | Add slim top progress indicator |
| Medium | Petal animation overlay | Port the falling sakura petals from the legacy HTML |
| Medium | Distance calculator | Detect user location and show distance to venue |
| Low | Photo gallery / love story | Add timeline or gallery section |

---

## Phase 2 — Performance

| Priority | Improvement | Description |
|----------|-------------|-------------|
| High | Image / SVG optimisation | Inline only the SVGs actually used; preload critical ones |
| Medium | Code splitting | Lazy-load `DaftarTamuPage` and `LokasiSection` (Leaflet) |
| Medium | Lighthouse audit | Target 90+ for Performance, Accessibility, SEO |
| Low | PWA | Add manifest + service worker for offline access |

---

## Phase 3 — Guest Manager

| Priority | Improvement | Description |
|----------|-------------|-------------|
| High | Persistent storage | Save guest list to localStorage or a remote DB |
| Medium | Bulk import | Paste CSV / WhatsApp contacts to add many at once |
| Medium | RSVP linkage | Show which invited guests have submitted RSVP |
| Low | Auth | Restrict `/daftar-tamu` behind a passphrase |

---

## Phase 4 — Tech Improvements

| Priority | Improvement | Description |
|----------|-------------|-------------|
| Medium | Unit tests | Add Vitest + React Testing Library for hooks and components |
| Medium | i18n | Support Bahasa Indonesia and English toggle |
| Low | Storybook | Document components in isolation |

---

## Completed

- [x] Migrated from static HTML to React 18 + TypeScript + Vite + Tailwind
- [x] Component-based architecture (`src/components/`, `src/pages/`)
- [x] Countdown to 13 Juni 2026
- [x] Bank account "salin" with toast feedback
- [x] Personalised cover greeting via `?to=` URL param
- [x] Guest manager page with search, CSV export, WhatsApp share
- [x] Leaflet map integration
- [x] Project documentation (`docs/`) and `CLAUDE.md`
