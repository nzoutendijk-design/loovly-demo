/**
 * The demo's single source of truth. Every control on every screen changes this state;
 * the screen is rendered from it. The 22 designed Figma frames are reachable as presets.
 */

export type Overlay =
  | { kind: 'none' }
  | { kind: 'image' }                                  // Image / Type picker, Image tab
  | { kind: 'library' }                                // photo library sheet
  | { kind: 'type'; mode: 'aa' | 'color' }             // Type tab editor
  | { kind: 'occasion' }
  | { kind: 'name' }
  | { kind: 'calendar' }
  | { kind: 'tray'; tab: 'vibe' | 'animations' }

export type State = {
  card: string                 // asset shown on the card
  text: string                 // caption typed in the Type editor ('' = none)
  font: number                 // 0 Modern · 1 Calligraphy · 2 Decorative · 3 Literature
  color: string                // caption colour
  libraryPick: number | null   // photo highlighted in the library
  occasion: string | null
  name: string | null
  day: number | null           // day in August
  vibe: number
  animation: number
  overlay: Overlay
}

export const PHOTOS = [
  'photo-01.jpg', 'photo-02.jpg', 'photo-03.jpg', 'photo-04.jpg', 'photo-05.jpg', 'photo-06.jpg',
  'photo-07.jpg', 'photo-08b.jpg', 'photo-09.jpg', 'photo-10.jpg', 'photo-11.jpg', 'photo-12.jpg',
  'photo-13.jpg', 'photo-14.jpg', 'photo-15.jpg', 'photo-16.jpg', 'photo-17.jpg', 'photo-18.jpg',
]

export const initial: State = {
  card: 'card-cat.jpg', text: '', font: 0, color: '#ffffff', libraryPick: null,
  occasion: null, name: null, day: null, vibe: 0, animation: 0, overlay: { kind: 'none' },
}

export type Action =
  | { type: 'open'; overlay: Overlay }
  | { type: 'close' }
  | { type: 'pickTile'; card: string }
  | { type: 'pickPhoto'; index: number }
  | { type: 'confirmPhoto' }
  | { type: 'typeText' }                 // staged demo input: fills "Happy Birthday"
  | { type: 'setMode'; mode: 'aa' | 'color' }
  | { type: 'setFont'; font: number }
  | { type: 'setColor'; color: string }
  | { type: 'setOccasion'; occasion: string }
  | { type: 'typeName' }                 // staged demo input: fills "Emily"
  | { type: 'setDay'; day: number }
  | { type: 'setVibe'; index: number }
  | { type: 'setAnimation'; index: number }
  | { type: 'done' }
  | { type: 'preset'; state: State }

export function reduce(s: State, a: Action): State {
  switch (a.type) {
    case 'open': return { ...s, overlay: a.overlay }
    case 'close': return { ...s, overlay: { kind: 'none' } }
    case 'pickTile': return { ...s, card: a.card, overlay: { kind: 'none' } }
    case 'pickPhoto': return { ...s, libraryPick: a.index }
    case 'confirmPhoto':
      if (s.libraryPick === null) return { ...s, overlay: { kind: 'none' } }
      // the design pairs library photo 1 with its own card export; other photos use themselves
      return { ...s, card: s.libraryPick === 0 ? 'card-photo.jpg' : PHOTOS[s.libraryPick], overlay: { kind: 'type', mode: 'aa' } }
    case 'typeText': return s.text ? s : { ...s, text: 'Happy Birthday' }
    case 'setMode': return { ...s, overlay: { kind: 'type', mode: a.mode } }
    case 'setFont': return { ...s, font: a.font }
    case 'setColor': return { ...s, color: a.color }
    case 'setOccasion': return { ...s, occasion: a.occasion }
    case 'typeName': return s.name ? s : { ...s, name: 'Emily' }
    case 'setDay': return { ...s, day: a.day }
    case 'setVibe': return { ...s, vibe: a.index }
    case 'setAnimation': return { ...s, animation: a.index }
    case 'done': return s.overlay.kind === 'tray' ? { ...s, overlay: { kind: 'none' } } : initial
    case 'preset': return a.state
  }
}

/* ------------------------------------------------------------------ the 22 designed frames */

export type Preset = { id: number; node: string; name: string; hotspot: string; state: State }

const T: State = { ...initial, card: 'card-photo.jpg', text: 'Happy Birthday', libraryPick: 0 }
const O: State = { ...T, occasion: 'Birthday' }
const N: State = { ...O, name: 'Emily' }
const D: State = { ...N, day: 28 }

export const PRESETS: Preset[] = [
  { id: 1, node: '1:879', name: 'Create your card — empty (cat card)', hotspot: 'pencil on the card', state: initial },
  { id: 2, node: '1:1212', name: 'Image picker', hotspot: 'top-left tile (cake)', state: { ...initial, overlay: { kind: 'image' } } },
  { id: 3, node: '1:970', name: 'Create your card — cake card', hotspot: 'pencil on the card', state: { ...initial, card: 'card-cake.jpg' } },
  { id: 4, node: '1:1062', name: 'Photo library', hotspot: 'first photo', state: { ...initial, card: 'card-cake.jpg', overlay: { kind: 'library' } } },
  { id: 5, node: '1:1135', name: 'Photo library — photo selected', hotspot: 'blue ✓', state: { ...initial, card: 'card-cake.jpg', libraryPick: 0, overlay: { kind: 'library' } } },
  { id: 6, node: '1:1427', name: 'Type — empty field', hotspot: 'the "Enter" field', state: { ...T, text: '', overlay: { kind: 'type', mode: 'aa' } } },
  { id: 7, node: '1:1486', name: 'Type — "Happy Birthday"', hotspot: '"Color" segment', state: { ...T, overlay: { kind: 'type', mode: 'aa' } } },
  { id: 8, node: '1:1545', name: 'Type — colour picker', hotspot: 'a swatch, then × or return', state: { ...T, overlay: { kind: 'type', mode: 'color' } } },
  { id: 9, node: '1:2260', name: 'Create your card — photo card', hotspot: '"Occasion" chip', state: T },
  { id: 10, node: '1:3012', name: 'Occasion sheet', hotspot: 'any occasion', state: { ...T, overlay: { kind: 'occasion' } } },
  { id: 11, node: '1:2902', name: 'Occasion sheet — Birthday selected', hotspot: '×', state: { ...O, overlay: { kind: 'occasion' } } },
  { id: 12, node: '1:2349', name: 'Create your card — Birthday set', hotspot: '"Who’s it for" chip', state: O },
  { id: 13, node: '1:1610', name: 'Recipient sheet — empty field', hotspot: 'the "Enter" field', state: { ...O, overlay: { kind: 'name' } } },
  { id: 14, node: '1:1744', name: 'Recipient sheet — "Emily"', hotspot: 'return key or ×', state: { ...N, overlay: { kind: 'name' } } },
  { id: 15, node: '1:2438', name: 'Create your card — Emily set', hotspot: '"When is it" chip', state: N },
  { id: 16, node: '1:1878', name: 'Calendar', hotspot: 'any day', state: { ...N, overlay: { kind: 'calendar' } } },
  { id: 17, node: '1:2069', name: 'Calendar — 28 Aug', hotspot: '×', state: { ...D, overlay: { kind: 'calendar' } } },
  { id: 18, node: '1:2528', name: 'Create your card — 28 Aug set', hotspot: '"VIBE" tab', state: D },
  { id: 19, node: '1:2617', name: 'Vibe tray', hotspot: 'a vibe, then Done', state: { ...D, overlay: { kind: 'tray', tab: 'vibe' } } },
  { id: 20, node: '1:2724', name: 'Create your card — vibe chosen', hotspot: '"ANIMATIONS" tab', state: D },
  { id: 21, node: '1:825', name: 'Animations tray', hotspot: 'an animation, then Done', state: { ...D, overlay: { kind: 'tray', tab: 'animations' } } },
  { id: 22, node: '1:2813', name: 'Create your card — complete', hotspot: 'Done → starts over', state: D },
]

const key = (s: State) => JSON.stringify(s)
const PRESET_KEYS = PRESETS.map((p) => key(p.state))

/** Index (1-based) of the designed frame the state currently matches, preferring `preferred` when several frames are identical. */
export function matchPreset(s: State, preferred: number): number | null {
  const k = key(s)
  if (PRESET_KEYS[preferred - 1] === k) return preferred
  const i = PRESET_KEYS.indexOf(k)
  return i === -1 ? null : i + 1
}

/* ------------------------------------------------------------------ derived copy */

export const zodiac = (day: number) => (day <= 22 ? 'Leo' : 'Virgo')   // August
