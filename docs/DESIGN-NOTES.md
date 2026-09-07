# Design-system notes — running list

What I hit while building section 5 that needs a decision, a frame, or a cleanup. Items are
grouped so the Sunspell designer can work through them; the ones marked **decide** need the
client. Figma node ids refer to `GQApxxZ9dQvh453nfbF7gR`.

## Copy

- [ ] **“Occassion”** is misspelt on every create-flow chip (e.g. `12:1200`). Built as “Occasion”.
- [ ] Recipient sheet heading reads “What occasion is this card for?” (`12:2210`). Built as “Who is this card for?”. **decide**
- [ ] Checkout copy is hard-coded to “David / him / his” (`12:3827`, `12:3841`, `12:3843`) while the flow’s recipient is Emily. Built with the recipient’s name and “them / their”. **decide** on gendered vs neutral pronouns.
- [ ] Calendar note says “Emily has Leo energy!” for 28 Aug, which is Virgo. Built to compute the real sign. **decide** whether the sign should be real.
- [ ] Prompt items mix 16 px and 17 px (`12:1793` vs `12:1794`). Built at 16.
- [ ] “them’s address” in the destination row (`12:3793`) is placeholder grammar. Built as “Emily’s address”.

## Frames that are missing or inconsistent

- [ ] Format chip row has “Story” twice (`12:1479`, `12:1481`). Built with the four unique formats.
- [ ] No frame for the **month picker** (the “August ▾” chevron). Built a month grid in the sheet’s chip style.
- [ ] No frame for **Format Type / Choose Prompt chips once chosen**; the create screen always shows the default labels. Built to show the chosen format and a truncated prompt.
- [ ] No **selected state** for the destination rows beyond `12:3801`’s brighter stroke; built as stroke 50 + glass-press fill, same as the fork cards.
- [ ] No **digital-only** path after “Create account”: the file goes Account → Where → Pay → On its way, which only makes sense for the printed card. Built: digital skips to the room. **decide**
- [ ] No **empty / error / disabled** states for any field or CTA (empty name, no format chosen, Continue with nothing selected). Built permissive; needs a rule.
- [ ] The **Type editor** shows the caption on the card before anything is typed (`12:1432`). Built to show it once text exists.
- [ ] The library’s selected photo (`12:1332`) and the photo that lands on the card (`12:1900`) are different images. Built to pair photo 1 with the card export so the designed sequence holds.
- [ ] Hidden leftover layers in `12:2083` (a “What / Who / When / Theme / Effect” chip set and a “prism” sentence) — an older or newer direction? **decide**
- [ ] The cover-treatment / setting frames (`12:3009`–`12:3297`, labelled “cover treatment · setting/vibe”) are visually identical to the earlier create screens; whatever they were meant to show isn’t drawn yet.
- [ ] SETTING tab, menu icon, Albums, Others (occasion), eyedropper result, and every vibe/animation beyond a selection ring have no destination or effect drawn.
- [ ] The prompt sheet’s ask wall is vertically centred (`12:1789`), so its position jumps as sections expand. Built as designed; a top-anchored list would be calmer. **decide**

## Components and tokens

- [ ] `ds/cta-light` is still used on Create account (`12:3873`) although deprecated in favour of `ds/cta`.
- [ ] Glass surfaces are built with plain rgba fills; the file’s GLASS effect (refraction / dispersion) has no CSS equivalent. Close enough on dark backgrounds; worth a look on the new lighter background.
- [ ] The **iOS keyboard** is a 3× PNG of the file’s component on pointer devices; touch devices use the real keyboard. Any keyboard-adjacent layout (prompt sheet, recipient sheet) should be checked on a phone.
- [ ] Fonts: Decorative and Literature have no font assigned in the file; the chips select but the caption stays Caveat. **decide** the two faces.
- [ ] Tokens now exist in code as `--lov-*` (`src/styles.css`), named after the file’s variables where they exist. The file exposes only a handful (`text-primary`, `stroke-card`, `radius-cta`, `space-32`, `size-section`); the rest are hard-coded rgba values in the frames and should become variables.

## Themes and effects (handoff package)

- [ ] The effects tray has no thumbnail art in either the Figma file or the package; built as glyph tiles with labels. **decide** whether the designer draws 20 thumbs or the tiles stay as glyphs.
- [ ] The theme tray needed a way through 115 items; built with category filter chips (Basic · Complex · Photo · Illustration) in the tray header and tile labels. Not in the file.
- [ ] Theme names in the package are inconsistent in case and carry duplicates (three “Ribbon”, two “Flowers”, two “rainbow fish”, two “pixel night”, two “lotus”, “sorbet” twice across categories). Labels are shown as delivered.
- [ ] Several package names look like typos: “screeming woman”, “skateboard granma”, “lizard&mokeys”, “racoons”. Shown as delivered.
- [ ] `fx.css` is a whole-product stylesheet (792 classes, `body`/`button`/`input` rules, `@tailwind` directives left in) rather than an effects-only sheet. It is scoped under `.fx-host` at build time; the package would be safer to ship as effects-only CSS.
- [ ] Effect assets and three fonts are loaded from `sunos.fm` at runtime by the package; if that host goes away the effects lose their art. Worth asking for them inlined or delivered as files.
- [ ] Effects are authored for the 390×845 stage and the 16:9 web stage; the app is phone-shaped on desktop too, so only the mobile variants are used. Web crops and web effect pages are kept for a future desktop layout.
- [ ] The package’s Scratch-off covers the card, so the pencil is unreachable while it is on. Fine for a demo; needs a rule in the real product.
- [ ] Vibe and animations both apply globally (the chosen theme follows into checkout and the room). The frames only show them on the create screen. **decide**

## Not in this Figma file

- Sections 1 Room / Feed, 2 Card Player, 3 Composer, 4 Contributor Gate are **not in this file**; only section 5 is. The room states that do exist (`13 Empty` → `R5 remove confirm`, 25 frames at the end of section 5) are the Room/Feed and will be the next build once the client confirms where the other sections live.
