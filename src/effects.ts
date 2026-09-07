/**
 * The 20 LOV.DESIGN screen effects, delivered as `fx/fx.js` (global `LoovlyFX`) + `fx/fx.css`
 * in the client's handoff package. Names and descriptions follow the package README.
 */
export type FxApi = {
  EFFECTS: { id: string; nm: string; ds: string }[]
  mount(el: Element, index: number): void
  mountCard(el: Element, index: number): void
  unmount(el: Element): void
  reset(): void
}
declare global { interface Window { LoovlyFX?: FxApi } }

export type Effect = { id: string; name: string; desc: string; glyph: string; cardBound?: boolean }

export const EFFECTS: Effect[] = [
  { id: 'none', name: 'None', desc: 'the screen, plain', glyph: '–' },
  { id: 'glitter', name: 'Glitter', desc: 'light catching across the screen', glyph: '✦' },
  { id: 'scratch', name: 'Scratch-off', desc: 'the card is silver until you rub it', glyph: '🪙', cardBound: true },
  { id: 'claw', name: 'Claw machine', desc: 'the claw comes down and grips the card', glyph: '🕹️' },
  { id: 'arcade', name: 'Arcade', desc: 'pixel monsters fall and the jet shoots them', glyph: '👾' },
  { id: 'balloons', name: 'Balloons', desc: 'a rush of them up from the foot of the screen', glyph: '🎈' },
  { id: 'wish', name: 'Obsession', desc: 'the box behind the card, and stickers stamped on it', glyph: '📦' },
  { id: 'hand', name: 'Handwriting', desc: 'words written across the theme, one at a time', glyph: '✍️' },
  { id: 'tape', name: 'Backrooms', desc: 'blue painter’s tape marked out around the card', glyph: '🟦', cardBound: true },
  { id: 'flowers', name: 'Flowers', desc: 'ink daisies growing up from the foot and opening', glyph: '🌼' },
  { id: 'disney', name: 'Disney', desc: 'the man in the gown, dancing down the screen', glyph: '👗' },
  { id: 'spooky', name: 'Spooky', desc: 'pumpkin balloons and little ghosts up from the foot', glyph: '🎃' },
  { id: 'pacman', name: 'Pac-Man', desc: 'he laps the screen in square turns', glyph: '🟡' },
  { id: 'pokeball', name: 'Pokéball', desc: 'capsule balls rain down and burst open', glyph: '⚪' },
  { id: 'clover', name: 'Clover', desc: 'four-leaf clovers pop up all over', glyph: '🍀' },
  { id: 'kitten', name: 'Kitten', desc: 'the green-screen kitten, dancing down the screen', glyph: '🐱' },
  { id: 'bubble', name: 'Bubbles', desc: 'soap bubbles drifting slowly across', glyph: '🫧' },
  { id: 'petal', name: 'Petals', desc: 'pink petals scattering across', glyph: '🌸' },
  { id: 'goldfish', name: 'Goldfish', desc: 'goldfish swimming across the screen', glyph: '🐟' },
  { id: 'vintage', name: 'Vintage', desc: 'old scraps pinned up behind the card, trading places', glyph: '🖼️' },
  { id: 'pop', name: 'POP', desc: 'retro stickers slapping on and off all over the screen', glyph: '💥' },
]

export const effectIndex = (id: string) => window.LoovlyFX?.EFFECTS.findIndex((e) => e.id === id) ?? -1
