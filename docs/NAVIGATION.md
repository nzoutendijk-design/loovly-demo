# Navigation

The demo is **state-driven**, not a fixed sequence. One card state (image, caption, font, colour,
occasion, recipient, date, vibe, animation, and which sheet is open) is rendered as the current
screen, and every control changes that state from wherever you are:

| Control | Does |
|---|---|
| Pencil on the card | opens the Image / Type picker |
| Image tab · a tile | puts that illustration on the card |
| Upload | opens the photo library; tap a photo, then ✓ puts it on the card |
| Type tab · the field | enters the caption (staged as “Happy Birthday” until the real keyboard lands) |
| Font chips · colour swatches · eyedropper | select a font, recolour the caption |
| Occasion / Who’s it for / When is it chips | open their sheet; the chip shows what you picked |
| Any occasion · the name field · any day | set the value; ✕ or return closes the sheet |
| VIBE / ANIMATIONS tabs | open (or close) their tray from any card screen; thumbnails select |
| Done | closes an open tray; otherwise starts a fresh card |

The **22 designed frames** below are presets of that state. `#n` in the URL, ←/→ keys and swiping
step through them in Figma canvas order, so the intended sequence can still be presented. Once you
tap anything that leaves the sequence the caption reads “free navigation”; ←/→ jump back in.

| # | Screen | Figma node | Tap to go forward | Other links |
|---|---|---|---|---|
| 1 | Create your card — empty (cat card) | `1:879` | pencil on the card | |
| 2 | Image picker | `1:1212` | top-left tile (cake) | **Upload** → 4 · **Type** tab → 6 · ✕ → 1 |
| 3 | Create your card — cake card | `1:970` | pencil on the card | |
| 4 | Photo library | `1:1062` | first photo | blue ✓ → 6 · ✕ → 3 |
| 5 | Photo library — photo selected | `1:1135` | blue ✓ | ✕ → 3 |
| 6 | Type — empty field | `1:1427` | the **Enter** field | **Image** tab → 2 · **Color** → 8 · ✕ → 5 |
| 7 | Type — “Happy Birthday” | `1:1486` | **Color** segment | ✕ → 6 |
| 8 | Type — color picker | `1:1545` | ✕ or the **return** key | **Aa** → 7 |
| 9 | Create your card — photo card | `1:2260` | **Occasion** chip | |
| 10 | Occasion sheet | `1:3012` | **Birthday** chip | ✕ → 9 |
| 11 | Occasion sheet — Birthday selected | `1:2902` | ✕ (or Birthday again) | |
| 12 | Create your card — Birthday set | `1:2349` | **Who’s it for** chip | |
| 13 | Recipient sheet — empty field | `1:1610` | the **Enter** field | return → 15 · ✕ → 12 |
| 14 | Recipient sheet — “Emily” | `1:1744` | **return** key or ✕ | |
| 15 | Create your card — Emily set | `1:2438` | **When is it** chip | |
| 16 | Calendar — 27 Aug | `1:1878` | day **28** | ✕ → 15 |
| 17 | Calendar — 28 Aug | `1:2069` | ✕ (or any day) | |
| 18 | Create your card — 28 Aug set | `1:2528` | **VIBE** tab | ANIMATIONS → 21 |
| 19 | Vibe tray | `1:2617` | first vibe thumbnail | Done → 20 · ANIMATIONS → 21 |
| 20 | Create your card — vibe chosen | `1:2724` | **ANIMATIONS** tab | VIBE → 19 |
| 21 | Animations tray | `1:825` | first animation thumbnail | Done → 22 · VIBE → 19 |
| 22 | Create your card — complete | `1:2813` | **Done** → restarts at 1 | VIBE → 19 · ANIMATIONS → 21 |

Deep-link to any preset with `#n`, e.g. `…/#16` opens the calendar.

## Notes for the designer

- The calendar note computes the real star sign for the chosen day (Leo to 22 Aug, Virgo after),
  so 28 Aug reads “Virgo energy”, not the frame’s “Leo energy”. Easy to pin back to the frame’s copy.
- Frame 6 shows the “happy birthday” caption on the card before any text is entered; the state model
  shows the caption once text exists, so preset 6 renders without it.
- Frame 5 selects one library photo but frame 6 shows a different photo on the card; the demo pairs
  that first library photo with the card image from the frames so the designed sequence still holds.

- Screens 13–14 (recipient name) reuse the heading “What occasion is this card for?” from the
  occasion sheet. Reproduced as designed; probably intended to read “Who is this card for?”.
- Screens 10–11 are the only photo-card screens without the “happy birthday” caption on the card
  (it is under the sheet and blurred, so this is barely visible). Reproduced as designed.
- The font/colour strips, the vibe/animation tray and the photo library scroll (the frames clip
  them at the edge). Scrolling never triggers the screen-swipe gesture.
- The iOS keyboard is the Figma **Keyboard – iPhone** component exported at 3×, since it is a
  system component and SF Pro isn’t available outside Apple platforms.
