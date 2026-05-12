# CLAUDE.md — Project Instructions for Claude Code

This file contains instructions and context for Claude Code when working on the MLJDL Agency wedding invitation (undangan) project.

## Project Overview

- **Name**: MLJDL Agency Wedding Invitation (Rizki & Fadia)
- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS
- **Type**: Static digital wedding invitation (no backend, no database)
- **Routes**:
  - `/` — main invitation (`UndanganPage`)
  - `/daftar-tamu` — guest manager (`DaftarTamuPage`)

## Key Conventions

### Code Style
- Use **functional components** with TypeScript (`FC` type or inline return type)
- Use **Tailwind utility classes** for all styling. Avoid inline styles or separate CSS files unless necessary.
- Keep each component in its own file under `src/components/`
- No shared global state. Use props and local `useState` only.

### Naming
- Component files: `PascalCase.tsx` (e.g., `MempelaiSection.tsx`)
- Variables and functions: `camelCase`
- Tailwind config extensions: `kebab-case`

### File Structure
- Section components live in `src/components/`
- `App.tsx` is the root that composes routes and global UI helpers
- Page-level orchestration goes in `src/pages/`
- Do not create sub-folders inside `src/components/` unless adding a major new feature.

## Important Paths

| Path | Purpose |
|------|---------|
| `src/index.tsx` | Vite entry, mounts `<App />` |
| `src/App.tsx` | Root component, defines routes |
| `src/components/` | All section components |
| `src/pages/` | Page-level compositions (Undangan, DaftarTamu) |
| `src/data/` | Static content (couple, events, bank, guests, scripture) |
| `src/hooks/` | Reusable hooks (countdown, scroll spy, guest param) |
| `src/types/index.ts` | Shared TypeScript types |
| `src/index.css` | Global styles + Tailwind directives |
| `tailwind.config.js` | Wedding palette + custom fonts/animations |
| `public/assets/` | Floral SVG ornaments |
| `legacy/` | Archived original HTML files (pre-migration) |
| `docs/` | Project documentation |

## Documentation

Always keep the `docs/` folder updated when making significant changes:

- [docs/001_architecture.md](./docs/001_architecture.md) — update if structure changes
- [docs/002_how_to_use.md](./docs/002_how_to_use.md) — update if setup steps change
- [docs/003_next_improvement.md](./docs/003_next_improvement.md) — move items to "Completed" when done

## Wedding Content

To edit invitation content, edit data files first before touching components:

| What to change | File to edit |
|----------------|--------------|
| Couple names, parents, role | `src/data/wedding.ts` |
| Event dates, times, venue | `src/data/wedding.ts` |
| Bank accounts (amplop) | `src/data/bank.ts` |
| Ayat / Hadith quotes | `src/data/scripture.ts` |
| Initial guest list | `src/data/guests.ts` |
| Wedding palette colors | `tailwind.config.js` |

## What NOT to Do

- Do not add a state management library (Redux, Zustand). Not needed for a static page.
- Do not create backend or API routes. This is a frontend-only project.
- Do not modify `node_modules/`
- Do not commit `.env` files or secrets
- Do not edit files in `legacy/`. That folder is for reference only.

## Common Tasks

### Add a new section
1. Create `src/components/NewSection.tsx`
2. Import and add it to `src/pages/Undangan.tsx` in the correct order
3. Update `docs/001_architecture.md`

### Change colors or fonts
- Edit `tailwind.config.js` under `theme.extend`

### Deploy
```bash
npm run build
# upload dist/ to Vercel / Netlify / GitHub Pages
```
