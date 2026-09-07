/**
 * The demo's single source of truth. Every control changes this state; the screen is rendered
 * from it. The designed Figma frames (section "5 · Create-flow forms") are reachable as presets.
 */

export type Page = 'campaign' | 'landing' | 'create' | 'fork' | 'account' | 'where' | 'pay' | 'sent' | 'room'

export type Overlay =
  | { kind: 'none' }
  | { kind: 'library' }                                // photo library sheet
  | { kind: 'type'; mode: 'aa' | 'color' }             // Type / Image editor, Type tab
  | { kind: 'occasion' }
  | { kind: 'name' }
  | { kind: 'calendar'; months: boolean }              // months = month list open
  | { kind: 'format' }
  | { kind: 'prompt'; typing: boolean }                // typing = own-ask field focused (keyboard up)
  | { kind: 'tray'; tab: 'vibe' | 'animations' }

export type Format = 'montage' | 'slideshow' | 'prompted' | 'story'
export type Delivery = 'card' | 'digital'
export type Destination = 'them' | 'me' | 'quiet'

export type State = {
  page: Page
  card: string                 // asset shown on the card
  text: string                 // caption typed in the Type editor
  font: number                 // 0 Modern · 1 Calligraphy · 2 Decorative · 3 Literature
  color: string                // caption colour
  libraryPick: number | null   // photo highlighted in the library
  occasion: string | null
  name: string
  month: number                // 0–11, 2026
  day: number | null
  vibe: number
  animation: number
  format: Format | null
  promptOpen: number | null    // expanded ask-wall section
  ask: string                  // own ask, as typed
  prompt: string | null        // chosen prompt (own ask or a suggestion)
  delivery: Delivery | null
  destination: Destination | null
  firstName: string
  overlay: Overlay
}

export const PHOTOS = [
  'photo-01.jpg', 'photo-02.jpg', 'photo-03.jpg', 'photo-04.jpg', 'photo-05.jpg', 'photo-06.jpg',
  'photo-07.jpg', 'photo-08b.jpg', 'photo-09.jpg', 'photo-10.jpg', 'photo-11.jpg', 'photo-12.jpg',
  'photo-13.jpg', 'photo-14.jpg', 'photo-15.jpg', 'photo-16.jpg', 'photo-17.jpg', 'photo-18.jpg',
]

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const FORMATS: { id: Format; label: string; title: string; desc: string }[] = [
  { id: 'montage', label: 'Montage', title: 'Video Montage', desc: 'Everyone contributes a video to create a shared montage.' },
  { id: 'slideshow', label: 'Slideshow', title: 'Photo Slideshow', desc: 'Turn your photos into a slideshow with an AI-generated song.' },
  { id: 'prompted', label: 'Prompted', title: 'Prompted Montage', desc: 'Create a video montage based on a specific prompt and your own moments.' },
  { id: 'story', label: 'Story', title: 'Throwback Story', desc: 'Share a throwback photo and add a short message about the story behind it.' },
]

export const ASK_WALL: { label: string; items: string[] }[] = [
  { label: 'FUNNY', items: ['Add the funniest photo of them you have.', 'The photo they would not want us to see.', 'The worst picture of the two of you.'] },
  { label: 'A STORY', items: ['Something they taught you without meaning to.', 'The moment you knew they were one of the good ones.', 'A time they made you laugh when you needed it.'] },
  { label: 'A PARTICULAR PHOTO', items: ['Show us where you two met.', 'The last photo you took together.', 'Them, in their element.'] },
]

export const initial: State = {
  page: 'campaign', card: 'card-cat.jpg', text: '', font: 0, color: '#ffffff', libraryPick: null,
  occasion: null, name: '', month: 7, day: null, vibe: 0, animation: 0,
  format: null, promptOpen: null, ask: '', prompt: null, delivery: null, destination: null, firstName: '',
  overlay: { kind: 'none' },
}

export type Action =
  | { type: 'go'; page: Page }
  | { type: 'open'; overlay: Overlay }
  | { type: 'close' }
  | { type: 'pickPhoto'; index: number }
  | { type: 'confirmPhoto' }
  | { type: 'setText'; text: string }
  | { type: 'setMode'; mode: 'aa' | 'color' }
  | { type: 'setFont'; font: number }
  | { type: 'setColor'; color: string }
  | { type: 'setOccasion'; occasion: string }
  | { type: 'setName'; name: string }
  | { type: 'setMonth'; month: number }
  | { type: 'setDay'; day: number }
  | { type: 'setVibe'; index: number }
  | { type: 'setAnimation'; index: number }
  | { type: 'setFormat'; format: Format }
  | { type: 'togglePromptSection'; index: number }
  | { type: 'setAsk'; ask: string }
  | { type: 'choosePrompt'; prompt: string }
  | { type: 'promptTyping'; typing: boolean }
  | { type: 'setDelivery'; delivery: Delivery }
  | { type: 'setDestination'; destination: Destination }
  | { type: 'setFirstName'; firstName: string }
  | { type: 'done' }
  | { type: 'preset'; state: State }

const none: Overlay = { kind: 'none' }

export function reduce(s: State, a: Action): State {
  switch (a.type) {
    case 'go': return { ...s, page: a.page, overlay: none }
    case 'open': return { ...s, overlay: a.overlay }
    case 'close': return { ...s, overlay: none }
    case 'pickPhoto': return { ...s, libraryPick: a.index }
    case 'confirmPhoto':
      if (s.libraryPick === null) return { ...s, overlay: { kind: 'type', mode: 'aa' } }
      // the design pairs library photo 1 with its own card export; other photos use themselves
      return { ...s, card: s.libraryPick === 0 ? 'card-photo.jpg' : PHOTOS[s.libraryPick], overlay: { kind: 'type', mode: 'aa' } }
    case 'setText': return { ...s, text: a.text }
    case 'setMode': return { ...s, overlay: { kind: 'type', mode: a.mode } }
    case 'setFont': return { ...s, font: a.font }
    case 'setColor': return { ...s, color: a.color }
    case 'setOccasion': return { ...s, occasion: a.occasion }
    case 'setName': return { ...s, name: a.name }
    case 'setMonth': {
      const days = daysIn(a.month)
      return { ...s, month: a.month, day: s.day !== null && s.day > days ? days : s.day, overlay: { kind: 'calendar', months: false } }
    }
    case 'setDay': return { ...s, day: a.day }
    case 'setVibe': return { ...s, vibe: a.index }
    case 'setAnimation': return { ...s, animation: a.index }
    case 'setFormat': return { ...s, format: a.format }
    case 'togglePromptSection': return { ...s, promptOpen: s.promptOpen === a.index ? null : a.index }
    case 'setAsk': return { ...s, ask: a.ask, prompt: a.ask || null }
    case 'choosePrompt': return { ...s, prompt: a.prompt, ask: '' }
    case 'promptTyping': return { ...s, overlay: { kind: 'prompt', typing: a.typing } }
    case 'setDelivery': return { ...s, delivery: a.delivery }
    case 'setDestination': return { ...s, destination: a.destination }
    case 'setFirstName': return { ...s, firstName: a.firstName }
    case 'done':
      if (s.overlay.kind === 'tray') return { ...s, overlay: none }
      return { ...s, page: 'fork', delivery: s.delivery ?? 'card', overlay: none }
    case 'preset': return a.state
  }
}

/* ------------------------------------------------------------------ calendar helpers (2026) */

export const daysIn = (month: number) => new Date(2026, month + 1, 0).getDate()
export const firstWeekday = (month: number) => new Date(2026, month, 1).getDay()   // 0 = Sunday

/** Western zodiac for a 2026 date. */
export function zodiac(month: number, day: number) {
  const m = month + 1
  const signs: [number, number, string][] = [
    [1, 19, 'Capricorn'], [2, 18, 'Aquarius'], [3, 20, 'Pisces'], [4, 19, 'Aries'], [5, 20, 'Taurus'], [6, 20, 'Gemini'],
    [7, 22, 'Cancer'], [8, 22, 'Leo'], [9, 22, 'Virgo'], [10, 22, 'Libra'], [11, 21, 'Scorpio'], [12, 21, 'Sagittarius'], [12, 31, 'Capricorn'],
  ]
  return (signs.find(([mm, dd]) => m < mm || (m === mm && day <= dd)) ?? signs[signs.length - 1])[2]
}

export const ordinal = (n: number) => { const r = n % 100; return n + (r >= 11 && r <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th') }

export const dateLabel = (s: State) => (s.day === null ? null : `${s.day} ${MONTHS_SHORT[s.month]}`)

/* ------------------------------------------------------------------ the designed frames */

export type Preset = { id: number; node: string; name: string; hotspot: string; state: State }

const C: State = { ...initial, page: 'create' }
const T: State = { ...C, card: 'card-photo.jpg', text: 'Happy Birthday', libraryPick: 0 }
const O: State = { ...T, occasion: 'Birthday' }
const N: State = { ...O, name: 'Emily' }
const D: State = { ...N, day: 28 }
const F: State = { ...D, format: 'montage' }
const P: State = { ...F, prompt: 'Funniest photos' }
const K: State = { ...P, page: 'fork', delivery: 'card' }
const A: State = { ...K, page: 'account' }
const W: State = { ...A, page: 'where', firstName: 'Nick' }

export const PRESETS: Preset[] = [
  { id: 1, node: '12:1121', name: 'The campaign', hotspot: 'Learn more', state: initial },
  { id: 2, node: '12:1151', name: 'The landing', hotspot: 'Make one', state: { ...initial, page: 'landing' } },
  { id: 3, node: '12:1166', name: 'Create your card — empty', hotspot: 'pencil on the card', state: C },
  { id: 4, node: '12:1847', name: 'Type editor — empty', hotspot: 'type, or the Image tab', state: { ...C, overlay: { kind: 'type', mode: 'aa' } } },
  { id: 5, node: '12:1259', name: 'Photo library', hotspot: 'a photo', state: { ...C, overlay: { kind: 'library' } } },
  { id: 6, node: '12:1332', name: 'Photo library — selected', hotspot: 'blue ✓', state: { ...C, libraryPick: 0, overlay: { kind: 'library' } } },
  { id: 7, node: '12:1900', name: 'Type editor — photo, empty', hotspot: 'type a caption', state: { ...T, text: '', overlay: { kind: 'type', mode: 'aa' } } },
  { id: 8, node: '12:1959', name: 'Type editor — "Happy Birthday"', hotspot: 'Color', state: { ...T, overlay: { kind: 'type', mode: 'aa' } } },
  { id: 9, node: '12:2018', name: 'Type editor — colour', hotspot: 'a swatch, then return', state: { ...T, overlay: { kind: 'type', mode: 'color' } } },
  { id: 10, node: '12:2737', name: 'Create your card — photo', hotspot: 'Occasion chip', state: T },
  { id: 11, node: '12:3657', name: 'Occasion sheet', hotspot: 'an occasion', state: { ...T, overlay: { kind: 'occasion' } } },
  { id: 12, node: '12:3547', name: 'Occasion sheet — Birthday', hotspot: '×', state: { ...O, overlay: { kind: 'occasion' } } },
  { id: 13, node: '12:2828', name: 'Create your card — Birthday set', hotspot: 'Who’s it for chip', state: O },
  { id: 14, node: '12:2083', name: 'Recipient sheet — empty', hotspot: 'type a name', state: { ...O, overlay: { kind: 'name' } } },
  { id: 15, node: '12:2217', name: 'Recipient sheet — Emily', hotspot: 'return', state: { ...N, overlay: { kind: 'name' } } },
  { id: 16, node: '12:2918', name: 'Create your card — Emily set', hotspot: 'When is it chip', state: N },
  { id: 17, node: '12:2353', name: 'Calendar', hotspot: 'a day, or the month', state: { ...N, overlay: { kind: 'calendar', months: false } } },
  { id: 18, node: '12:2544', name: 'Calendar — 28 Aug', hotspot: '×', state: { ...D, overlay: { kind: 'calendar', months: false } } },
  { id: 19, node: '12:3009', name: 'Create your card — date set', hotspot: 'VIBE', state: D },
  { id: 20, node: '12:3099', name: 'Vibe tray', hotspot: 'a vibe, then Done', state: { ...D, overlay: { kind: 'tray', tab: 'vibe' } } },
  { id: 21, node: '12:3207', name: 'Create your card', hotspot: 'ANIMATIONS', state: D },
  { id: 22, node: '12:3435', name: 'Animations tray', hotspot: 'an animation, then Done', state: { ...D, overlay: { kind: 'tray', tab: 'animations' } } },
  { id: 23, node: '12:3297', name: 'Create your card', hotspot: 'Format Type chip', state: D },
  { id: 24, node: '12:1411', name: 'Format — Montage', hotspot: 'a format', state: { ...F, overlay: { kind: 'format' } } },
  { id: 25, node: '12:1483', name: 'Format — Slideshow', hotspot: 'a format', state: { ...D, format: 'slideshow', overlay: { kind: 'format' } } },
  { id: 26, node: '12:1557', name: 'Format — Prompted', hotspot: 'a format', state: { ...D, format: 'prompted', overlay: { kind: 'format' } } },
  { id: 27, node: '12:1636', name: 'Format — Story', hotspot: '×', state: { ...D, format: 'story', overlay: { kind: 'format' } } },
  { id: 28, node: '12:3387', name: 'Create your card — format set', hotspot: 'Choose Prompt chip', state: F },
  { id: 29, node: '12:1714', name: 'Prompt sheet', hotspot: 'a section or a prompt', state: { ...F, overlay: { kind: 'prompt', typing: false } } },
  { id: 30, node: '12:1758', name: 'Prompt sheet — FUNNY open', hotspot: 'a prompt, or your own ask', state: { ...F, promptOpen: 0, overlay: { kind: 'prompt', typing: false } } },
  { id: 31, node: '12:1804', name: 'Prompt sheet — typing', hotspot: 'return', state: { ...F, ask: 'Funniest photos', prompt: 'Funniest photos', overlay: { kind: 'prompt', typing: true } } },
  { id: 32, node: '12:3411', name: 'Create your card — complete', hotspot: 'Done', state: P },
  { id: 33, node: '12:3846', name: 'Digital, or the Card', hotspot: 'a card, then Continue', state: K },
  { id: 34, node: '12:3767', name: 'Digital, or the Card — digital', hotspot: 'Continue', state: { ...P, page: 'fork', delivery: 'digital' } },
  { id: 35, node: '12:3867', name: 'Create account', hotspot: 'type a name, Text me a code', state: A },
  { id: 36, node: '12:3787', name: 'Where does their card go?', hotspot: 'an option, then Continue', state: W },
  { id: 37, node: '12:3801', name: 'Where — To them', hotspot: 'Continue', state: { ...W, destination: 'them' } },
  { id: 38, node: '12:3817', name: 'Pay', hotspot: 'Pay with Apple Pay', state: { ...W, destination: 'them', page: 'pay' } },
  { id: 39, node: '12:3830', name: 'It’s on its way', hotspot: 'Start asking people', state: { ...W, destination: 'them', page: 'sent' } },
  { id: 40, node: '12:3879', name: 'The room — invites are out', hotspot: 'end of the spine', state: { ...W, destination: 'them', page: 'room' } },
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
