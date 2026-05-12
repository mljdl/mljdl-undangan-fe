# 002 — How to Use

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

## 1. Installation

```bash
npm install
```

---

## 2. Development

Start the local dev server with hot reload:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To preview the personalised greeting, open `http://localhost:5173/?to=Bapak%20Andi`.

To preview the guest manager, open `http://localhost:5173/daftar-tamu`.

---

## 3. Build for Production

```bash
npm run build
```

Output is in `dist/`.

---

## 4. Preview Production Build

```bash
npm run preview
```

---

## 5. Linting

```bash
npm run lint
```

---

## 6. Customising Content

| What to change | File to edit |
|----------------|--------------|
| Couple names, parents, birth order | `src/data/wedding.ts` |
| Event dates, times, venue | `src/data/wedding.ts` |
| Map coordinates | `src/data/wedding.ts` (`VENUE`) |
| Bank accounts (amplop) | `src/data/bank.ts` |
| Ayat / Hadith quotes | `src/data/scripture.ts` |
| Initial guest list | `src/data/guests.ts` |
| Cover greeting label | `src/components/CoverSection.tsx` |
| Closing message | `src/components/PenutupSection.tsx` |

---

## 7. Customising Styles

Edit `tailwind.config.js` to change:
- Color palette (under `theme.extend.colors`)
- Fonts (`theme.extend.fontFamily`)
- Animations and shadows

Edit `src/index.css` for global CSS overrides.

---

## 8. Personalised Invitations

The cover greeting reads from the URL query param `?to=Name`. For example:

```
https://your-domain.com/?to=Keluarga%20Bapak%20Andi
```

The guest manager (`/daftar-tamu`) can copy these links and send them via WhatsApp directly.

---

## 9. Deployment

### Vercel
```bash
npx vercel
```

### Netlify
Drag and drop the `dist/` folder into [netlify.com/drop](https://netlify.com/drop).

### GitHub Pages
Use the `gh-pages` package or GitHub Actions to deploy the `dist/` folder.
