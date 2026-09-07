/**
 * Renders the current state as one 390 × 845 frame: the shared background, then the page
 * (with a push transition between pages), then the create page's sheets and trays.
 */
import { AnimatePresence, motion } from 'framer-motion'
import {
  AskWall, Background, BottomGradient, Calendar, Card, CloseX, ColorChips, DetailChips, Description, EffectHost, FontChips,
  FormatCard, FormatChips, HostBar, Keyboard, Nav, Note, OccasionChips, Overlay, PhotoLibrary, Segmented, SheetHeading, Tabs, TextInput,
  Title, TopGradient, Tray,
} from './components'
import { Account, Campaign, Fork, Landing, Pay, Room, Sent, Where } from './pages'
import { enter, fade, page as pageMotion } from './motion'
import { FORMATS, MONTHS, dateLabel, zodiac } from './state'
import { inkDarkFor } from './themes'
import type { Action, Overlay as OverlayState, State } from './state'

const E = (i: number) => ({ variants: enter, custom: i, initial: 'hidden' as const, animate: 'shown' as const })
const CARD_RECT = { left: 73, top: 117, width: 244, height: 325.74 }

export function Screen({ s, act }: { s: State; act: (a: Action) => void }) {
  const dark = s.page === 'campaign'
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div className="layer" key={dark ? 'dark' : 'light'} {...fade}><Background dark={dark} theme={s.theme} /></motion.div>
      </AnimatePresence>
      <AnimatePresence initial={false}>
        <motion.div className="page" key={s.page} {...pageMotion}>
          {s.page === 'campaign' && <Campaign s={s} act={act} />}
          {s.page === 'landing' && <Landing s={s} act={act} />}
          {s.page === 'create' && <Create s={s} act={act} />}
          {s.page === 'fork' && <Fork s={s} act={act} />}
          {s.page === 'account' && <Account s={s} act={act} />}
          {s.page === 'where' && <Where s={s} act={act} />}
          {s.page === 'pay' && <Pay s={s} act={act} />}
          {s.page === 'sent' && <Sent s={s} act={act} />}
          {s.page === 'room' && <Room s={s} act={act} />}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

/* ------------------------------------------------------------------ 03 · the create screen and its sheets */

function Create({ s, act }: { s: State; act: (a: Action) => void }) {
  const ov = s.overlay
  const open = (overlay: OverlayState) => act({ type: 'open', overlay })
  const close = () => act({ type: 'close' })

  const editor = ov.kind === 'library' || ov.kind === 'type'
  const showHostbar = ov.kind === 'none' || ov.kind === 'tray'
  const formatLabel = s.format ? FORMATS.find((f) => f.id === s.format)!.label : null
  const promptLabel = s.prompt ? (s.prompt.length > 22 ? s.prompt.slice(0, 21).trimEnd() + '…' : s.prompt) : null
  const them = s.name || 'them'

  return (
    <>
      <TopGradient />
      <AnimatePresence initial={false}>{showHostbar && <BottomGradient key="gradient" />}</AnimatePresence>
      <Nav />
      <Title />

      {/* entrance choreography: card, copy, chips and hostbar ease in on arrival */}
      <motion.div className="layer" {...E(0)}>
        <Card src={s.card} caption={s.text || undefined} color={s.color} onPencil={() => open({ kind: 'type', mode: 'aa' })} />
      </motion.div>
      <motion.div className="layer" {...E(1)}>
        <AnimatePresence initial={false}>
          {!editor && (
            <motion.div className="layer" key="chips" {...fade}>
              <Description />
              <DetailChips
                occasion={s.occasion} who={s.name || null} when={dateLabel(s)} format={formatLabel} prompt={promptLabel}
                rowsVisible={ov.kind === 'tray' ? 1 : 3}
                onChip={(k) => {
                  if (k === 'occasion') open({ kind: 'occasion' })
                  if (k === 'who') open({ kind: 'name' })
                  if (k === 'when') open({ kind: 'calendar', months: false })
                  if (k === 'format') open({ kind: 'format' })
                  if (k === 'prompt') open({ kind: 'prompt', typing: false })
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <EffectHost effect={s.effect} card={CARD_RECT} inkDark={inkDarkFor(s.theme)} />
      <AnimatePresence initial={false}>
        {ov.kind === 'tray' && (
          <Tray key="tray" tab={ov.tab} theme={s.theme} effect={s.effect}
            onTheme={(theme) => act({ type: 'setTheme', theme })} onEffect={(effect) => act({ type: 'setEffect', effect })} />
        )}
      </AnimatePresence>
      <motion.div className="layer" {...E(3)}>
        <AnimatePresence initial={false}>
          {showHostbar && (
            <HostBar key="hostbar"
              onVibe={() => (ov.kind === 'tray' && ov.tab === 'vibe' ? close() : open({ kind: 'tray', tab: 'vibe' }))}
              onAnimations={() => (ov.kind === 'tray' && ov.tab === 'animations' ? close() : open({ kind: 'tray', tab: 'animations' }))}
              onDone={() => act({ type: 'done' })} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Type / Image editor */}
      <AnimatePresence initial={false}>
        {ov.kind === 'type' && (
          <Overlay key="type" kind="picker">
            <CloseX x={24} y={88} onClick={close} />
            <Tabs active="type" onImage={() => open({ kind: 'library' })} />
            <TextInput className="type-field" value={s.text} placeholder="Enter" onChange={(text) => act({ type: 'setText', text })} onSubmit={close} autoFocus />
            <AnimatePresence initial={false}>
              {ov.mode === 'aa' ? (
                <motion.div className="layer layer-ov" key="aa" {...fade}><FontChips selected={s.font} onSelect={(font) => act({ type: 'setFont', font })} /></motion.div>
              ) : (
                <motion.div className="layer layer-ov" key="color" {...fade}><ColorChips selected={s.color} onSelect={(color) => act({ type: 'setColor', color })} /></motion.div>
              )}
            </AnimatePresence>
            <Segmented active={ov.mode} onAa={() => act({ type: 'setMode', mode: 'aa' })} onColor={() => act({ type: 'setMode', mode: 'color' })} />
            <Keyboard onReturn={close} />
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {ov.kind === 'library' && (
          <PhotoLibrary key="library" selected={s.libraryPick}
            onClose={() => open({ kind: 'type', mode: 'aa' })}
            onPhoto={(index) => act({ type: 'pickPhoto', index })}
            onConfirm={() => act({ type: 'confirmPhoto' })} />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {ov.kind === 'occasion' && (
          <Overlay key="occasion" kind="sheet">
            <CloseX x={24} y={494} onClick={close} />
            <SheetHeading x={24} y={543.86}>What occasion is this card for?</SheetHeading>
            <OccasionChips selected={s.occasion} onSelect={(occasion) => act({ type: 'setOccasion', occasion })} />
            <Note x={73} y={809} w={240}>{s.occasion && s.occasion !== 'Birthday' ? `${s.occasion} it is! Lovely.` : 'You’re doing a birthday! So exciting.'}</Note>
          </Overlay>
        )}

        {ov.kind === 'name' && (
          <Overlay key="name" kind="sheet">
            <CloseX x={24} y={279} onClick={close} />
            <SheetHeading x={24} y={316}>Who is this card for?</SheetHeading>
            <TextInput className="type-field name-field" value={s.name} placeholder="Enter" onChange={(name) => act({ type: 'setName', name })} onSubmit={close} autoFocus />
            <Note x={58} y={458} w={270}>{s.name ? `You’re making a ${(s.occasion ?? 'birthday').toLowerCase()} card for ${s.name}! Sweet!` : 'Who’s the lucky one?'}</Note>
            <Keyboard onReturn={close} />
          </Overlay>
        )}

        {ov.kind === 'calendar' && (
          <Overlay key="calendar" kind="calendar">
            <CloseX x={25} y={357} onClick={close} />
            <SheetHeading x={24} y={395}>When will the card be opened?</SheetHeading>
            <Calendar month={s.month} selected={s.day ?? -1} monthsOpen={ov.months}
              onDay={(day) => act({ type: 'setDay', day })}
              onToggleMonths={() => open({ kind: 'calendar', months: !ov.months })}
              onMonth={(month) => act({ type: 'setMonth', month })} />
          </Overlay>
        )}
        {ov.kind === 'calendar' && (
          <Note key="calendar-note" x={73} y={791} w={240}>
            {s.day === null ? `When will ${them} open it?` : `${them} has ${zodiac(s.month, s.day)} energy!`}
          </Note>
        )}

        {ov.kind === 'format' && (
          <Overlay key="format" kind="format">
            <CloseX x={24} y={332} onClick={close} />
            <FormatChips selected={s.format} onSelect={(format) => act({ type: 'setFormat', format })} />
            <FormatCard format={s.format ?? 'montage'} />
          </Overlay>
        )}

        {ov.kind === 'prompt' && (
          <Overlay key="prompt" kind="format">
            <motion.div className="layer layer-ov" animate={{ y: ov.typing ? -169 : 0 }} transition={{ duration: 0.3 }} initial={false}>
              <CloseX x={24} y={379} onClick={close} />
            </motion.div>
            <motion.div className="layer layer-ov" animate={{ y: ov.typing ? -159 : 0 }} transition={{ duration: 0.3 }} initial={false}>
              <p className="ask-heading">YOUR OWN ASK</p>
              <TextInput className="ask-field" value={s.ask} placeholder="write your own ask"
                onChange={(ask) => act({ type: 'setAsk', ask })}
                onFocus={() => act({ type: 'promptTyping', typing: true })}
                onBlur={() => act({ type: 'promptTyping', typing: false })}
                onSubmit={close} />
              <span className="ask-rule" />
            </motion.div>
            <AskWall open={s.promptOpen} typing={ov.typing}
              onToggle={(index) => act({ type: 'togglePromptSection', index })}
              onChoose={(prompt) => { act({ type: 'choosePrompt', prompt }); close() }} />
            <AnimatePresence initial={false}>{ov.typing && <Keyboard key="kb" onReturn={close} />}</AnimatePresence>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  )
}

export { MONTHS }
