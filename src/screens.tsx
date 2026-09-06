/**
 * The 22 screens, in the order they sit left-to-right on the Figma canvas
 * (section "Create Card", node 1:824). Each screen renders the frame 1:1 and
 * wires the natural tap target(s) to the next / previous screen.
 */
import type { ReactNode } from 'react'
import {
  Background, Nav, Title, Description, BottomGradient, CloseX, Card, DetailChips, HostBar, Tray,
  Overlay, Tabs, ImageGrid, UploadCta, TypeField, FontChips, ColorChips, Segmented, Keyboard,
  PhotoLibrary, SheetHeading, Note, OccasionChips, NameField, Calendar,
} from './components'
import type { ChipState } from './components'

export type Navigate = { go: (n: number) => void; next: () => void; back: () => void }

export type Screen = {
  /** 1-based index, matches the order on the Figma canvas */
  id: number
  /** Figma node id of the frame */
  node: string
  name: string
  /** what the presenter taps to move forward */
  hotspot: string
  render: (nav: Navigate) => ReactNode
}

/* Base "Create your card" screen: card + copy + chips + hostbar */
function CreateCard({ card, caption, chips, nav, onPencil, onChip, onVibe, onAnimations, onDone, tray, onThumb }: {
  card: 'cat' | 'cake' | 'photo'; caption?: boolean; chips: ChipState; nav: Navigate
  onPencil?: () => void; onChip?: (k: string) => void; onVibe?: () => void; onAnimations?: () => void; onDone?: () => void
  tray?: string; onThumb?: () => void
}) {
  void nav
  return (
    <>
      <Background />
      <BottomGradient />
      <Nav />
      <Title />
      <Card variant={card} caption={caption} onPencil={onPencil} />
      <Description />
      <DetailChips state={chips} onChip={onChip} rowsVisible={tray ? 1 : 3} />
      {tray && <Tray label={tray} onThumb={onThumb} />}
      <HostBar onVibe={onVibe} onAnimations={onAnimations} onDone={onDone} />
    </>
  )
}

/* Type editor (screens 6–8) */
function TypeEditor({ nav, value, mode, onField, onClose }: { nav: Navigate; value: string; mode: 'aa' | 'color'; onField?: () => void; onClose: () => void }) {
  return (
    <>
      <Background />
      <Nav />
      <Title />
      <Card variant="photo" caption />
      <Overlay kind="picker">
        <CloseX x={24} y={88} onClick={onClose} />
        <Tabs active="type" onImage={() => nav.go(2)} />
        <TypeField value={value} onClick={onField} />
        {mode === 'aa' ? <FontChips /> : <ColorChips />}
        <Segmented active={mode} onAa={() => nav.go(7)} onColor={() => nav.go(8)} />
        <Keyboard onReturn={() => nav.go(9)} />
      </Overlay>
    </>
  )
}

/* Occasion sheet (screens 10–11) */
function OccasionSheet({ nav, selected, onClose, onBirthday }: { nav: Navigate; selected: boolean; onClose: () => void; onBirthday: () => void }) {
  void nav
  return (
    <>
      <Background />
      <Nav />
      <Title />
      <Card variant="photo" />
      <Description />
      <DetailChips state="empty" />
      <Overlay kind="sheet">
        <CloseX x={24} y={494} onClick={onClose} />
        <SheetHeading x={24} y={543.86}>What occasion is this card for?</SheetHeading>
        <OccasionChips selected={selected} onBirthday={onBirthday} />
        <Note x={73} y={809} w={240}>You're doing a birthday! So exciting.</Note>
      </Overlay>
    </>
  )
}

/* Recipient name sheet (screens 13–14) */
function NameSheet({ value, onClose, onField, onReturn }: { value: string; onClose: () => void; onField?: () => void; onReturn: () => void }) {
  return (
    <>
      <Background />
      <Nav />
      <Title />
      <Card variant="photo" caption />
      <Description />
      <DetailChips state="empty" />
      <Overlay kind="sheet">
        <CloseX x={24} y={279} onClick={onClose} />
        <SheetHeading x={24} y={316}>What occasion is this card for?</SheetHeading>
        <NameField value={value} onClick={onField} />
        <Note x={58} y={458} w={270}>You're making a birthday card for Emily! Sweet!</Note>
        <Keyboard onReturn={onReturn} />
      </Overlay>
    </>
  )
}

/* Calendar sheet (screens 16–17) */
function CalendarSheet({ selected, onClose, onDay }: { selected: number; onClose: () => void; onDay: () => void }) {
  return (
    <>
      <Background />
      <Nav />
      <Title />
      <Card variant="photo" caption />
      <Description />
      <DetailChips state="who" />
      <Overlay kind="calendar">
        <CloseX x={25} y={357} onClick={onClose} />
        <SheetHeading x={24} y={395}>When will the card be opened?</SheetHeading>
        <Calendar selected={selected} onDay={onDay} />
      </Overlay>
      <Note x={73} y={791} w={240}>Emily has Leo energy!</Note>
    </>
  )
}

export const SCREENS: Screen[] = [
  {
    id: 1, node: '1:879', name: 'Create your card — empty (cat card)', hotspot: 'Pencil on the card',
    render: (nav) => <CreateCard nav={nav} card="cat" chips="empty" onPencil={nav.next} />,
  },
  {
    id: 2, node: '1:1212', name: 'Image picker', hotspot: 'Top-left tile (cake) · Upload → photo library · × → back',
    render: (nav) => (
      <>
        <Background />
        <Card variant="cat" />
        <BottomGradient />
        <Nav />
        <Title />
        <Overlay kind="picker">
          <CloseX x={24} y={88} onClick={nav.back} />
          <Tabs active="image" onType={() => nav.go(6)} />
        </Overlay>
        <ImageGrid onPick={(r, c) => { if (r === 0 && c === 0) nav.next() }} />
        <UploadCta onClick={() => nav.go(4)} />
      </>
    ),
  },
  {
    id: 3, node: '1:970', name: 'Create your card — cake card', hotspot: 'Pencil on the card',
    render: (nav) => <CreateCard nav={nav} card="cake" chips="empty" onPencil={nav.next} />,
  },
  {
    id: 4, node: '1:1062', name: 'Photo library', hotspot: 'First photo · × → back',
    render: (nav) => (
      <>
        <Background />
        <Nav />
        <Title />
        <PhotoLibrary onClose={() => nav.go(3)} onPhoto={nav.next} onConfirm={() => nav.go(6)} />
      </>
    ),
  },
  {
    id: 5, node: '1:1135', name: 'Photo library — photo selected', hotspot: 'Blue ✓ button · × → back',
    render: (nav) => (
      <>
        <Background />
        <Nav />
        <Title />
        <PhotoLibrary selected onClose={() => nav.go(3)} onPhoto={nav.next} onConfirm={nav.next} />
      </>
    ),
  },
  {
    id: 6, node: '1:1427', name: 'Type — empty field', hotspot: 'The "Enter" field · × → back',
    render: (nav) => <TypeEditor nav={nav} value="Enter" mode="aa" onField={nav.next} onClose={nav.back} />,
  },
  {
    id: 7, node: '1:1486', name: 'Type — "Happy Birthday"', hotspot: '"Color" segment · × → back',
    render: (nav) => <TypeEditor nav={nav} value="Happy Birthday" mode="aa" onClose={nav.back} />,
  },
  {
    id: 8, node: '1:1545', name: 'Type — color picker', hotspot: '× or the return key · "Aa" → back',
    render: (nav) => <TypeEditor nav={nav} value="Happy Birthday" mode="color" onClose={nav.next} />,
  },
  {
    id: 9, node: '1:2260', name: 'Create your card — photo card', hotspot: '"Occasion" chip',
    render: (nav) => <CreateCard nav={nav} card="photo" caption chips="empty" onChip={(k) => { if (k === 'occasion') nav.next() }} />,
  },
  {
    id: 10, node: '1:3012', name: 'Occasion sheet', hotspot: '"Birthday" chip · × → back',
    render: (nav) => <OccasionSheet nav={nav} selected={false} onClose={nav.back} onBirthday={nav.next} />,
  },
  {
    id: 11, node: '1:2902', name: 'Occasion sheet — Birthday selected', hotspot: '× (or Birthday again)',
    render: (nav) => <OccasionSheet nav={nav} selected onClose={nav.next} onBirthday={nav.next} />,
  },
  {
    id: 12, node: '1:2349', name: 'Create your card — Birthday set', hotspot: '"Who’s it for" chip',
    render: (nav) => <CreateCard nav={nav} card="photo" caption chips="occasion" onChip={(k) => { if (k === 'who') nav.next() }} />,
  },
  {
    id: 13, node: '1:1610', name: 'Recipient sheet — empty field', hotspot: 'The "Enter" field · × → back',
    render: (nav) => <NameSheet value="Enter" onClose={nav.back} onField={nav.next} onReturn={() => nav.go(15)} />,
  },
  {
    id: 14, node: '1:1744', name: 'Recipient sheet — "Emily"', hotspot: 'Return key or ×',
    render: (nav) => <NameSheet value="Emily" onClose={nav.next} onReturn={nav.next} />,
  },
  {
    id: 15, node: '1:2438', name: 'Create your card — Emily set', hotspot: '"When is it" chip',
    render: (nav) => <CreateCard nav={nav} card="photo" caption chips="who" onChip={(k) => { if (k === 'when') nav.next() }} />,
  },
  {
    id: 16, node: '1:1878', name: 'Calendar — 27 Aug', hotspot: 'Day 28 · × → back',
    render: (nav) => <CalendarSheet selected={27} onClose={nav.back} onDay={nav.next} />,
  },
  {
    id: 17, node: '1:2069', name: 'Calendar — 28 Aug', hotspot: '× (or any day)',
    render: (nav) => <CalendarSheet selected={28} onClose={nav.next} onDay={nav.next} />,
  },
  {
    id: 18, node: '1:2528', name: 'Create your card — 28 Aug set', hotspot: '"VIBE" tab',
    render: (nav) => <CreateCard nav={nav} card="photo" caption chips="when" onVibe={nav.next} onAnimations={() => nav.go(21)} />,
  },
  {
    id: 19, node: '1:2617', name: 'Vibe tray', hotspot: 'First vibe thumbnail (or Done)',
    render: (nav) => <CreateCard nav={nav} card="photo" caption chips="when" tray="Vibe" onThumb={nav.next} onDone={nav.next} onAnimations={() => nav.go(21)} />,
  },
  {
    id: 20, node: '1:2724', name: 'Create your card — vibe chosen', hotspot: '"ANIMATIONS" tab',
    render: (nav) => <CreateCard nav={nav} card="photo" caption chips="when" onAnimations={nav.next} onVibe={() => nav.go(19)} />,
  },
  {
    id: 21, node: '1:825', name: 'Animations tray', hotspot: 'First animation thumbnail (or Done)',
    render: (nav) => <CreateCard nav={nav} card="photo" caption chips="when" tray="Animations" onThumb={nav.next} onDone={nav.next} onVibe={() => nav.go(19)} />,
  },
  {
    id: 22, node: '1:2813', name: 'Create your card — complete', hotspot: 'Done → restarts at screen 1',
    render: (nav) => <CreateCard nav={nav} card="photo" caption chips="when" onDone={() => nav.go(1)} onVibe={() => nav.go(19)} onAnimations={() => nav.go(21)} />,
  },
]
