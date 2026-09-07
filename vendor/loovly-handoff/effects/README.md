# Loovly Effects — handoff package

20 animated screen effects from the LOV.DESIGN Rounds board, as running code.
Everything is static — open any file straight from this folder, no server.

## What's inside

- `index.html` — the review page: every effect on one screen, Mobile / Web tabs.
- `mobile/<id>.html` — one effect per page on a **390x845 pt** portrait stage
  (the iPhone frame the effects were authored for, running 1:1).
- `web/<id>.html` — the same effect on a **480x270 unit** 16:9 stage carrying
  the wide-screen adjustments (side plantings, resized falls/laps, coin sizes).
  The stage scales uniformly to the window, so the proportions hold at any
  resolution — treat the units as a 16:9 design space, not device pixels.
- `fx/fx.js` — all 20 effects bundled as one script (global `LoovlyFX`,
  images and fonts inlined). `fx/fx.css` — every animation and sprite style.

**The effect layers are transparent.** The gray on every page is a viewing
mat; drop the same markup over your own theme, photo, or UI and the effect
composites onto it. Backgrounds ship separately in `loovly-themes.zip`.

## Integrate in five lines

```html
<link rel="stylesheet" href="fx/fx.css">
<div class="stage phone-body" style="position:relative;overflow:hidden">
  <div class="phone-scr"><i class="cin-art" style="display:none"></i></div>
  <div class="fxroot"></div>
</div>
<script src="fx/fx.js"></script>
<script>
  const idx = LoovlyFX.EFFECTS.findIndex(e => e.id === "clover");
  LoovlyFX.mount(document.querySelector(".fxroot"), idx);
</script>
```

Rules that matter:

- The container needs the `phone-body` class and the hidden `.cin-art`
  marker — `fx.css` hides all effects on a screen that has no card art
  (`.phone-body:not(:has(.cin-art)) .fx { display:none }`).
- One `LoovlyFX.mount(element, index)` per effect layer;
  `LoovlyFX.unmount(element)` removes it, `LoovlyFX.reset()` clears all.
- `scratch` and `tape` are card-bound: also call
  `LoovlyFX.mountCard(cardElement, index)` on the element the effect should
  frame or paint (see their standalone pages for the anchor markup).
- Each standalone page inlines exactly the extra CSS/JS its own effect
  needs — copy from there, it is the whole recipe.
- Effects respect `prefers-reduced-motion` (they slow to a hold).

## The effects

| id | name | description |
|----|------|-------------|
| `glitter` | Glitter | light catching across the screen |
| `scratch` | Scratch-off | the card is silver until you rub it — interactive — rub the silver card to erase it |
| `claw` | Claw machine | the claw comes down and grips the card |
| `arcade` | Arcade | pixel monsters fall and the jet shoots them — web shrinks the face coins to 72.25% (design call) |
| `balloons` | Balloons | a rush of them up from the foot of the screen |
| `wish` | Obsession | the box behind the card, and stickers stamped on it |
| `hand` | Handwriting | words written across the theme, one at a time — includes a page script that respots each word randomly at its rewrite seam |
| `tape` | Backrooms | blue painter's tape marked out around the card — the tape frames an invisible centred box (`.tapebox`); size/scale it to your card |
| `flowers` | Flowers | ink daisies growing up from the foot and opening — web adds two mirrored side plantings (`.fxside` wrappers) |
| `disney` | Disney | the man in the gown, dancing down the screen |
| `spooky` | Spooky | pumpkin balloons and little ghosts up from the foot |
| `pacman` | Pac-Man | he laps the screen in square turns, the man queued up behind — web page carries its own lap keyframes (`pcPathW`/`pcHeadW`) sized to the stage |
| `pokeball` | Pokéball | capsule balls rain down and burst open on the man — even 9.6s cadence, six dealt phases, 10% smaller; web carries its own fall (`pbFallW`) |
| `clover` | Clover | four-leaf clovers pop up all over, at every size — pop spots are % of the stage (recut), so any stage size sees every pop |
| `kitten` | Kitten | the green-screen kitten, dancing down the screen |
| `bubble` | Bubbles | soap bubbles drifting slowly across, right to left |
| `petal` | Petals | pink petals scattering across, right to left |
| `goldfish` | Goldfish | goldfish swimming across the screen, tails going |
| `vintage` | Vintage | old scraps pinned up behind the card, trading places |
| `pop` | POP | retro stickers slapping on and off all over the screen |

Source of truth: the D0NI board build (`src/effects.tsx`), bundled with
esbuild. Clover pop spots, pokeball cadence/size, pac-man containment and
handwriting placement follow the Sep 2026 review round.
