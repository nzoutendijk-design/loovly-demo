# Navigation flow

Screens follow the left-to-right order of the frames in the Figma section **Create Card**
(node `1:824`). Every screen has one primary tap target that moves forward; ✕ moves back where
the design has one. Swipe left/right and ←/→ also step through the sequence.

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

Deep-link to any screen with `#n`, e.g. `…/#16` opens the calendar.

## Notes for the designer

- Screens 13–14 (recipient name) reuse the heading “What occasion is this card for?” from the
  occasion sheet. Reproduced as designed; probably intended to read “Who is this card for?”.
- Screens 10–11 are the only photo-card screens without the “happy birthday” caption on the card
  (it is under the sheet and blurred, so this is barely visible). Reproduced as designed.
- The iOS keyboard is the Figma **Keyboard – iPhone** component exported at 3×, since it is a
  system component and SF Pro isn’t available outside Apple platforms.
