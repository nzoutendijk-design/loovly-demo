# Navigation

The demo is **state-driven**: one card state (image, caption, font, colour, occasion, recipient,
date, format, prompt, vibe, animation, delivery, destination, first name, and which sheet is open)
is rendered as the current screen. Every control changes that state from wherever you are.

## The creator story (Figma section “5 · Create-flow forms”)

```
01 The campaign ─ Learn more ─▶ 02 The landing ─ Make one ─▶ 03 Create your card
     ▲                                                              │ Done
     └──────────────────────── the room (13) ◀─ Start asking people ─┘─▶ 07 Digital, or the Card
                                   ▲                                      │ Continue
                                   │ (digital only)                       ▼
                                   └──────────────────────── 08 Create account ─ Text me a code
                                                                          │ (the Loovly Card)
                                              11 It’s on its way ◀─ 10 Pay ◀─ 09 Where does their card go?
```

| Control | Does |
|---|---|
| Pencil on the card | opens the Type / Image editor (Type tab first, as designed) |
| Type field · font chips · swatches · eyedropper | real typing; the caption lands on the card as you type |
| Image tab | opens the photo library; tap a photo, then ✓ puts it on the card |
| Occasion / Who’s it for / When is it / Format Type / Choose Prompt | open their sheet; the chip shows what you picked |
| Any occasion · the name field · any day · a format · a prompt | set the value; ✕ or return closes the sheet |
| August ▾ | opens a month grid; the calendar and the chip follow the chosen month |
| Your own ask | real typing; the sheet lifts while the keyboard is up |
| VIBE tab | opens the theme tray: 115 backgrounds in four categories (Basic · Complex · Photo · Illustration); a tile sets the screen background everywhere, None restores the default |
| ANIMATIONS tab | opens the effects tray: the 20 LOV.DESIGN screen effects, running live over the card; None clears |
| Done | continues to the digital-versus-printed fork |
| Fork cards · destination rows | select; Continue moves on |
| First name · Text me a code | real typing; goes to the address step (printed) or straight to the room (digital) |
| Pay with Apple Pay · Start asking people | continue to “It’s on its way” and the room |
| Pencil on the room card | back to the editor |

The **40 designed frames** are presets of that state. `#n` in the URL, ←/→ keys and swiping step
through them in canvas order (top row, then bottom row), so the intended sequence can still be
presented. Off the sequence the caption reads “free navigation”; ←/→ jump back in.

| # | Frame | Figma node | # | Frame | Figma node |
|---|---|---|---|---|---|
| 1 | The campaign | `12:1121` | 21 | Create your card | `12:3207` |
| 2 | The landing | `12:1151` | 22 | Animations tray | `12:3435` |
| 3 | Create your card — empty | `12:1166` | 23 | Create your card | `12:3297` |
| 4 | Type editor — empty | `12:1847` | 24 | Format — Montage | `12:1411` |
| 5 | Photo library | `12:1259` | 25 | Format — Slideshow | `12:1483` |
| 6 | Photo library — selected | `12:1332` | 26 | Format — Prompted | `12:1557` |
| 7 | Type editor — photo, empty | `12:1900` | 27 | Format — Story | `12:1636` |
| 8 | Type editor — “Happy Birthday” | `12:1959` | 28 | Create your card — format set | `12:3387` |
| 9 | Type editor — colour | `12:2018` | 29 | Prompt sheet | `12:1714` |
| 10 | Create your card — photo | `12:2737` | 30 | Prompt sheet — FUNNY open | `12:1758` |
| 11 | Occasion sheet | `12:3657` | 31 | Prompt sheet — typing | `12:1804` |
| 12 | Occasion sheet — Birthday | `12:3547` | 32 | Create your card — complete | `12:3411` |
| 13 | Create your card — Birthday set | `12:2828` | 33 | Digital, or the Card | `12:3846` |
| 14 | Recipient sheet — empty | `12:2083` | 34 | Digital, or the Card — digital | `12:3767` |
| 15 | Recipient sheet — Emily | `12:2217` | 35 | Create account | `12:3867` |
| 16 | Create your card — Emily set | `12:2918` | 36 | Where does their card go? | `12:3787` |
| 17 | Calendar | `12:2353` | 37 | Where — To them | `12:3801` |
| 18 | Calendar — 28 Aug | `12:2544` | 38 | Pay | `12:3817` |
| 19 | Create your card — date set | `12:3009` | 39 | It’s on its way | `12:3830` |
| 20 | Vibe tray | `12:3099` | 40 | The room — invites are out | `12:3879` |

## Motion

- Pages push in from the right (36 ms curve `0.32, 0.72, 0, 1`); the card, copy, chips and hostbar ease
  in on arrival with a 70 ms stagger.
- Sheets: the layer underneath dims and blurs while the sheet content rises from the bottom; the
  keyboard and photo library slide up as their own layers. Nothing cross-fades through anything.
- Reduce Motion is honoured (instant switches).

## Themes and effects

Both come from the client's handoff package (`loovly-handoff.vercel.app`, September 2026 build):

- **Themes** — `public/themes/mobile/<category>/<slug>/bg@{1,2,3}x.webp` (390×845 crops, picked by device pixel ratio) and `public/themes/web/…` (16:9 crops, kept for a future desktop layout). Index in `src/themes.json`.
- **Effects** — `public/fx/fx.js` is the package's `LoovlyFX` bundle as delivered; `public/fx/fx.css` is generated from the package stylesheet by `npm run fx`, scoped under `.fx-host` so it cannot restyle the app. Timing and easing are the package's own. `src/effects.ts` lists the ids; `EffectHost` in `src/components.tsx` mounts through the documented API (`mount`, `mountCard` for the two card-bound effects, `unmount`).
- The effect layer sits above the card and chips and below trays, hostbar and sheets. Scratch-off is interactive (rub the card).

## Not in the file yet (drawn by me, see DESIGN-NOTES.md)

Theme tray category filters and tile labels · effect tray glyph tiles (no thumbnail art delivered) · month grid in the calendar · expanded/collapsed ask-wall sections · typing states of every field ·
selected states for fork cards and destination rows · the digital-only path skipping the address step.
