# Loovly — “Create your card” click-through demo

A pixel-faithful, working web build of the creator story in the Figma file
[Loovly-test › 5 · Create-flow forms](https://www.figma.com/design/GQApxxZ9dQvh453nfbF7gR/Loovly-test?node-id=12-1120):
campaign → landing → create your card (image, caption, occasion, recipient, date, format, prompt,
vibe, animations) → digital or printed → account → address → pay → on its way → the room.
Each screen is rebuilt in HTML/CSS at the design’s native 390 × 845 pt and scaled to fit
whatever device opens it. The demo is state-driven: every control changes the card state from
wherever you are, text fields are real, and the 40 designed frames remain reachable as presets —
see [docs/NAVIGATION.md](docs/NAVIGATION.md). Gaps and decisions found on the way are tracked in
[docs/DESIGN-NOTES.md](docs/DESIGN-NOTES.md).

**Live demo:** https://nzoutendijk-design.github.io/loovly-demo/ (open on an iPhone → Share → *Add to Home Screen* for full-screen).

No design changes were made; no features beyond click-through navigation were added.

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript — all MIT-licensed, no UI libraries.
- Plain CSS (`src/styles.css`). Fonts are self-hosted from Google Fonts: **Geist** 400/500/600 and
  **Caveat** 700 (SIL Open Font License).
- Card artwork, photos, icons and the iOS keyboard are exported straight from the Figma file into
  `public/assets/` (photos downscaled to ≤1200 px for the web).
- **Themes and effects** come from the client's handoff package: 115 theme backgrounds in
  `public/themes/` (mobile 1×/2×/3× and web crops, ~65 MB) and the 20 LOV.DESIGN screen effects in
  `public/fx/` (`fx.js` as delivered, `fx.css` scoped under `.fx-host` by `npm run fx`). The raw
  package files live in `vendor/loovly-handoff/`.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:5173
```

Open the URL on your Mac, or on an iPhone on the same Wi-Fi via `npm run dev -- --host`.

## Build for sharing

```bash
npm run build        # static site in dist/ — drop it on any static host
npm run bundle       # dist/loovly-demo.html — a single self-contained file (assets + 1× themes + effects inlined)
npm run fx           # regenerate public/fx from vendor/loovly-handoff after a package update
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
| Tap any control | changes the card state (opens a sheet, sets a value, closes it…) |
| Swipe left / right | previous / next designed frame |
| ← / → keys (desktop) | previous / next designed frame |
| `#n` in the URL | jump straight to designed frame *n* (1–40) |

Every control has a hover state (pointer devices) and a pressed state (all devices). The Figma file
defines neither, so they follow its glass style: lighter fill and brighter stroke on hover, a 95 % scale
and lighter fill while pressed.

On a desktop browser the app renders inside an iPhone bezel with a caption showing the current
screen, its name and what to tap.

## Project layout

```
src/
  App.tsx          stage scaling, preset routing (#n), swipe + keyboard stepping
  state.ts         the card state, reducer, and the 40 designed frames as presets
  Screen.tsx       the shared background, page transitions, and the create screen with its sheets
  pages.tsx        campaign, landing, fork, account, where, pay, on its way, the room
  motion.ts        timing and easing presets
  themes.ts/json   the 115 theme backgrounds
  effects.ts       the 20 LoovlyFX effects and the runtime's API type
  components.tsx   shared pieces: background, nav, card, chips, hostbar, overlays, sheets…
  styles.css       all styling, in Figma frame units
public/
  assets/          exported Figma assets
  fonts/           Geist + Caveat (woff2; @font-face lives in src/styles.css)
docs/
  NAVIGATION.md    flow, control map, preset table
  DESIGN-NOTES.md  running list of design-system gaps and decisions
scripts/
  bundle-single-file.mjs   builds dist/loovly-demo.html
  deploy-pages.sh          publishes dist/ to GitHub Pages
```

Every screen element carries `data-screen` / `data-figma-node` attributes so any screen can be
traced back to its Figma frame.
