/**
 * Renders the current state as one 390 × 845 frame. Layer order follows the Figma frames:
 * background → gradient → nav → title → card → copy + chips → tray → hostbar → sheet/overlay.
 */
import {
  Background, Nav, Title, Description, BottomGradient, CloseX, Card, DetailChips, HostBar, Tray,
  Overlay, Tabs, ImageGrid, UploadCta, TypeField, FontChips, ColorChips, Segmented, Keyboard,
  PhotoLibrary, SheetHeading, Note, OccasionChips, Calendar,
} from './components'
import { zodiac } from './state'
import type { Action, Overlay as OverlayState, State } from './state'

export function Screen({ s, act }: { s: State; act: (a: Action) => void }) {
  const ov = s.overlay
  const open = (overlay: OverlayState) => act({ type: 'open', overlay })
  const close = () => act({ type: 'close' })

  const editor = ov.kind === 'image' || ov.kind === 'library' || ov.kind === 'type'
  const showHostbar = ov.kind === 'none' || ov.kind === 'tray'
  const caption = s.text || undefined

  const chips = !editor && (
    <>
      <Description />
      <DetailChips
        occasion={s.occasion}
        who={s.name}
        when={s.day === null ? null : `${s.day} Aug`}
        rowsVisible={ov.kind === 'tray' ? 1 : 3}
        onChip={(k) => {
          if (k === 'occasion') open({ kind: 'occasion' })
          if (k === 'who') open({ kind: 'name' })
          if (k === 'when') open({ kind: 'calendar' })
        }}
      />
    </>
  )

  const hostbar = showHostbar && (
    <HostBar
      onVibe={() => (ov.kind === 'tray' && ov.tab === 'vibe' ? close() : open({ kind: 'tray', tab: 'vibe' }))}
      onAnimations={() => (ov.kind === 'tray' && ov.tab === 'animations' ? close() : open({ kind: 'tray', tab: 'animations' }))}
      onDone={() => act({ type: 'done' })}
    />
  )

  return (
    <>
      <Background />
      {showHostbar && <BottomGradient />}
      <Nav />
      <Title />
      {ov.kind !== 'library' && <Card src={s.card} caption={caption} color={s.color} onPencil={() => open({ kind: 'image' })} />}
      {chips}
      {ov.kind === 'tray' && (
        <Tray
          label={ov.tab === 'vibe' ? 'Vibe' : 'Animations'}
          selected={ov.tab === 'vibe' ? s.vibe : s.animation}
          onSelect={(i) => act(ov.tab === 'vibe' ? { type: 'setVibe', index: i } : { type: 'setAnimation', index: i })}
        />
      )}
      {hostbar}

      {ov.kind === 'image' && (
        <>
          <Overlay kind="picker">
            <CloseX x={24} y={88} onClick={close} />
            <Tabs active="image" onType={() => open({ kind: 'type', mode: 'aa' })} />
          </Overlay>
          <ImageGrid onPick={(card) => act({ type: 'pickTile', card })} />
          <UploadCta onClick={() => open({ kind: 'library' })} />
        </>
      )}

      {ov.kind === 'library' && (
        <PhotoLibrary
          selected={s.libraryPick}
          onClose={() => open({ kind: 'image' })}
          onPhoto={(index) => act({ type: 'pickPhoto', index })}
          onConfirm={() => act({ type: 'confirmPhoto' })}
        />
      )}

      {ov.kind === 'type' && (
        <Overlay kind="picker">
          <CloseX x={24} y={88} onClick={close} />
          <Tabs active="type" onImage={() => open({ kind: 'image' })} />
          <TypeField value={s.text || 'Enter'} placeholder={!s.text} onClick={() => act({ type: 'typeText' })} />
          {ov.mode === 'aa' ? (
            <FontChips selected={s.font} onSelect={(font) => act({ type: 'setFont', font })} />
          ) : (
            <ColorChips selected={s.color} onSelect={(color) => act({ type: 'setColor', color })} />
          )}
          <Segmented active={ov.mode} onAa={() => act({ type: 'setMode', mode: 'aa' })} onColor={() => act({ type: 'setMode', mode: 'color' })} />
          <Keyboard onReturn={close} />
        </Overlay>
      )}

      {ov.kind === 'occasion' && (
        <Overlay kind="sheet">
          <CloseX x={24} y={494} onClick={close} />
          <SheetHeading x={24} y={543.86}>What occasion is this card for?</SheetHeading>
          <OccasionChips selected={s.occasion} onSelect={(occasion) => act({ type: 'setOccasion', occasion })} />
          <Note x={73} y={809} w={240}>
            {s.occasion && s.occasion !== 'Birthday' ? `${s.occasion} it is! Lovely.` : 'You’re doing a birthday! So exciting.'}
          </Note>
        </Overlay>
      )}

      {ov.kind === 'name' && (
        <Overlay kind="sheet">
          <CloseX x={24} y={279} onClick={close} />
          <SheetHeading x={24} y={316}>What occasion is this card for?</SheetHeading>
          <TypeField className="name-field" value={s.name ?? 'Enter'} placeholder={!s.name} onClick={() => act({ type: 'typeName' })} />
          <Note x={58} y={458} w={270}>
            {s.name ? `You’re making a ${(s.occasion ?? 'birthday').toLowerCase()} card for ${s.name}! Sweet!` : 'Who’s the lucky one?'}
          </Note>
          <Keyboard onReturn={close} />
        </Overlay>
      )}

      {ov.kind === 'calendar' && (
        <>
          <Overlay kind="calendar">
            <CloseX x={25} y={357} onClick={close} />
            <SheetHeading x={24} y={395}>When will the card be opened?</SheetHeading>
            <Calendar selected={s.day ?? 27} onDay={(day) => act({ type: 'setDay', day })} />
          </Overlay>
          <Note x={73} y={791} w={240}>{`${s.name ?? 'This one'} has ${zodiac(s.day ?? 27)} energy!`}</Note>
        </>
      )}
    </>
  )
}
