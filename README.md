# Loovly — “Create your card” click-through demo

A pixel-faithful, clickable web reproduction of the 22 iPhone frames in the Figma file
[Loovly-test › Create Card](https://www.figma.com/design/GQApxxZ9dQvh453nfbF7gR/Loovly-test?node-id=1-824).
Each screen is rebuilt in HTML/CSS at the design’s native 390 × 845 pt and scaled to fit
whatever device opens it. Tapping the natural control on each screen advances to the next one —
see [docs/NAVIGATION.md](docs/NAVIGATION.md) for the full flow.

**Live demo:** https://nzoutendijk-design.github.io/loovly-demo/ (open on an iPhone → Share → *Add to Home Screen* for full-screen).

No design changes were made; no features beyond click-through navigation were added.

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript — all MIT-licensed, no UI libraries.
- Plain CSS (`src/styles.css`). Fonts are self-hosted from Google Fonts: **Geist** 400/500/600 and
  **Caveat** 700 (SIL Open Font License).
- Card artwork, photos, icons and the iOS keyboard are exported straight from the Figma file into
  `public/assets/` (photos downscaled to ≤1200 px for the web).

## Run it locally

```bash
npm install
npm run dev          # http://localhost:5173
```

Open the URL on your Mac, or on an iPhone on the same Wi-Fi via `npm run dev -- --host`.

## Build for sharing

```bash
npm run build        # static site in dist/ — drop it on any static host
npm run bundle       # dist/loovly-demo.html — a single self-contained file (assets inlined)
```

`dist/` uses relative paths, so it works from a sub-folder (GitHub Pages, Netlify, S3, a shared
folder…). `dist/loovly-demo.html` can be e-mailed or opened directly from Files on an iPhone.

```bash
npm run deploy       # build + push dist/ to the gh-pages branch → GitHub Pages
```

## Viewing on an iPhone

Open the link in Safari → Share → **Add to Home Screen**. Launching it from the Home Screen runs
it full-screen (no Safari chrome, status-bar-safe), which is the closest match to the Figma frames.

## Navigating

| Input | Action |
| --- | --- |
| Tap the highlighted control (see the flow doc) | next screen |
| Tap ✕ / back-style controls | previous screen |
| Swipe left / right | next / previous |
| ← / → keys (desktop) | previous / next |
| `#n` in the URL | jump straight to screen *n* (1–22) |

Every control has a hover state (pointer devices) and a pressed state (all devices). The Figma file
defines neither, so they follow its glass style: lighter fill and brighter stroke on hover, a 95 % scale
and lighter fill while pressed.

On a desktop browser the app renders inside an iPhone bezel with a caption showing the current
screen, its name and what to tap.

## Project layout

```
src/
  App.tsx          stage scaling, hash routing, swipe + keyboard navigation
  screens.tsx      the 22 screens in Figma canvas order, with their hotspots
  components.tsx   shared pieces: background, nav, card, chips, hostbar, overlays, sheets…
  styles.css       all styling, in Figma frame units
public/
  assets/          exported Figma assets
  fonts/           Geist + Caveat (woff2)
docs/
  NAVIGATION.md    screen-by-screen flow and hotspot map
scripts/
  bundle-single-file.mjs   builds dist/loovly-demo.html
  deploy-pages.sh          publishes dist/ to GitHub Pages
```

Every screen element carries `data-screen` / `data-figma-node` attributes so any screen can be
traced back to its Figma frame.
