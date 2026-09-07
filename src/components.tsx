/**
 * Shared UI pieces for the Loovly "Create your card" demo.
 * Every coordinate is in Figma frame units (390 × 845). The stage is scaled by App.
 */
import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * Mouse drag-to-scroll for horizontal strips (touch scrolls natively). Accounts for the
 * CSS scale of the stage and suppresses the click that would otherwise fire after a drag.
 */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let dragging = false, moved = false, startX = 0, startLeft = 0
    const scale = () => el.getBoundingClientRect().width / el.offsetWidth || 1
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      dragging = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = (e.clientX - startX) / scale()
      if (Math.abs(dx) > 4) moved = true
      el.scrollLeft = startLeft - dx
    }
    const up = () => { dragging = false }
    const click = (e: MouseEvent) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false } }
    // a plain mouse wheel (vertical only) scrolls the strip sideways; trackpads already scroll horizontally
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      el.scrollLeft += e.deltaY
      e.preventDefault()
    }
    el.addEventListener('wheel', wheel, { passive: false })
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    el.addEventListener('click', click, true)
    return () => {
      el.removeEventListener('wheel', wheel)
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      el.removeEventListener('click', click, true)
    }
  }, [])
  return ref
}

/** Resolves an exported Figma asset. The single-file bundler swaps in data: URIs via window.__INLINE_ASSETS__. */
declare global { interface Window { __INLINE_ASSETS__?: Record<string, string> } }
export const asset = (name: string) => window.__INLINE_ASSETS__?.[name] ?? `./assets/${name}`
const A = asset

/* ----------------------------------------------------------------- base */

export function Background() {
  return (
    <div className="bg">
      <div className="bg-img">
        <img src={A('bg-backrooms.jpg')} alt="" />
        <div className="bg-dim" />
      </div>
      <div className="bg-soft" />
      <div className="bg-dark" />
    </div>
  )
}

export function Nav() {
  return (
    <div className="nav">
      <img className="nav-logo" src={A('logo-loovly.svg')} alt="loovly" />
      <button className="burger-btn" aria-label="Menu">
        <span className="burger b1" />
        <span className="burger b2" />
      </button>
    </div>
  )
}

export function Title() {
  return <h1 className="title">Create your card</h1>
}

export function Description() {
  return (
    <p className="desc">
      Choose who it’s for, what the occasion is, when it’s happening, and how you’d like to create it.
    </p>
  )
}

/* Bottom gradient sitting under the hostbar (Figma "Rectangle" 0,716 390×129) */
export function BottomGradient() {
  return <div className="bottom-gradient" />
}

/* 10×10 close cross (stroke extends to 11.06) */
export function CloseX({ x, y, onClick }: { x: number; y: number; onClick?: () => void }) {
  return (
    <button className="close-x" style={{ left: x - 0.53, top: y - 0.53 }} onClick={onClick} aria-label="Close">
      <svg width="11.06" height="11.06" viewBox="0 0 11.0607 11.0607" fill="none">
        <path d="M0.53033 0.53033L10.5303 10.5303M0.53033 10.5303L10.5303 0.53033" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/* ----------------------------------------------------------------- card */

export type CardVariant = 'cat' | 'cake' | 'photo'

export function Card({ variant, caption, onPencil }: { variant: CardVariant; caption?: boolean; onPencil?: () => void }) {
  return (
    <div className="card">
      {variant === 'photo' ? (
        <img className="card-fill" src={A('card-photo.jpg')} alt="" />
      ) : (
        <img className="card-img" style={{ left: -15, top: -21, width: 273, height: 380 }} src={A('card-cat.jpg')} alt="" />
      )}
      {variant === 'cake' && (
        <img className="card-img" style={{ left: -7, top: -13, width: 251, height: 353 }} src={A('card-cake.jpg')} alt="" />
      )}
      {caption && <span className="card-caption">happy birthday</span>}
      <button className="card-pencil" onClick={onPencil} aria-label="Edit card">
        <img src={A('card-pencil-bg.svg')} alt="" style={{ left: 0, top: 0, width: 40, height: 40 }} />
        <img src={A('card-pencil.svg')} alt="" style={{ left: 0.32, top: 0, width: 39.04, height: 39.04 }} />
      </button>
      <span className="stroke" />
    </div>
  )
}

/* ----------------------------------------------------------------- detail chips */

export type ChipState = 'empty' | 'occasion' | 'who' | 'when'

type Chip = { icon: string; w: number; h: number; label: string; key: string }

const ICON = {
  pencil: { icon: 'icon-pencil.svg', w: 12, h: 12 },
  paw: { icon: 'icon-paw.svg', w: 12, h: 12 },
  calendar: { icon: 'icon-calendar.svg', w: 10.53, h: 11 },
  format: { icon: 'icon-format.svg', w: 12, h: 10 },
  chat: { icon: 'icon-chat.svg', w: 11, h: 11 },
}

function chipRows(state: ChipState): Chip[][] {
  const occasion = { ...ICON.pencil, key: 'occasion', label: state === 'empty' ? 'Occasion' : 'Birthday' }
  const who = { ...ICON.paw, key: 'who', label: state === 'empty' || state === 'occasion' ? 'Who’s it for' : 'Emily' }
  const when = { ...ICON.calendar, key: 'when', label: state === 'when' ? '28 Aug' : 'When is it' }
  const format = { ...ICON.format, key: 'format', label: 'Format Type' }
  const prompt = { ...ICON.chat, key: 'prompt', label: 'Choose Prompt' }
  return [[occasion, who], [when, format], [prompt]]
}

export function DetailChips({ state, onChip, rowsVisible = 3 }: { state: ChipState; onChip?: (key: string) => void; rowsVisible?: number }) {
  const rows = chipRows(state).slice(0, rowsVisible)
  const tops = [531, 571, 611]
  return (
    <>
      {rows.map((row, i) => (
        <div className="chip-row" style={{ top: tops[i] }} key={i}>
          {row.map((c) => (
            <button className="chip" key={c.key} onClick={onChip ? () => onChip(c.key) : undefined}>
              <img src={A(c.icon)} alt="" style={{ width: c.w, height: c.h }} />
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      ))}
    </>
  )
}

/* ----------------------------------------------------------------- hostbar */

export function HostBar({ onVibe, onAnimations, onSetting, onDone }: { onVibe?: () => void; onAnimations?: () => void; onSetting?: () => void; onDone?: () => void }) {
  return (
    <div className="hostbar">
      <button className="host-tab" style={{ left: 28 }} onClick={onVibe}>
        <img src={A('icon-vibe.svg')} alt="" />
        <span>VIBE</span>
      </button>
      <button className="host-tab" style={{ left: 150 }} onClick={onAnimations}>
        <img src={A('icon-animations.svg')} alt="" />
        <span>ANIMATIONS</span>
      </button>
      <button className="host-tab" style={{ left: 272 }} onClick={onSetting}>
        <img src={A('icon-setting.svg')} alt="" />
        <span>SETTING</span>
      </button>
      <button className="cta" style={{ top: 81 }} onClick={onDone}>
        Done
      </button>
    </div>
  )
}

/* Vibe / Animations tray (screens 19 & 21) */
const VIBES = ['vibe-1.jpg', 'vibe-2.jpg', 'vibe-2.jpg', 'vibe-3.jpg', 'vibe-4.jpg', 'vibe-5.jpg', 'vibe-4.jpg']

export function Tray({ label, onThumb }: { label: string; onThumb?: () => void }) {
  const strip = useDragScroll()
  return (
    <>
      <div className="tray">
        <span className="tray-label">{label}</span>
      </div>
      <div className="tray-thumbs" ref={strip}>
        {VIBES.map((v, i) => (
          <button className={'thumb' + (i === 0 ? ' on' : '')} key={i} onClick={i === 0 ? onThumb : undefined}>
            <img src={A(v)} alt="" />
          </button>
        ))}
      </div>
    </>
  )
}

/* ----------------------------------------------------------------- blurred "Bottom Bars" overlay */

export type OverlayKind = 'picker' | 'sheet' | 'calendar'

export function Overlay({ kind, children }: { kind: OverlayKind; children?: ReactNode }) {
  return <div className={'overlay overlay-' + kind}>{children}</div>
}

/* Image / Type tabs (overlay coords 23.59,127.5) */
export function Tabs({ active, onImage, onType }: { active: 'image' | 'type'; onImage?: () => void; onType?: () => void }) {
  return (
    <div className="tabs">
      <button className={'tab' + (active === 'image' ? ' on' : '')} style={{ width: active === 'image' ? 168 : 174 }} onClick={onImage}>
        Image
      </button>
      <button className={'tab' + (active === 'type' ? ' on' : '')} style={{ width: active === 'type' ? 168 : 174 }} onClick={onType}>
        Type
      </button>
    </div>
  )
}

/* ----------------------------------------------------------------- image picker grid (screen 2) */

type Box = { src: string; l: number; t: number; w: number; h: number }
const GRID: Box[][] = [
  [
    { src: 'card-cake.jpg', l: -9.16, t: -1.17, w: 177, h: 248 },
    { src: 'card-sled.jpg', l: -3.17, t: -1.17, w: 164, h: 206 },
  ],
  [
    { src: 'card-cat.jpg', l: -9.16, t: -22.16, w: 177, h: 246 },
    { src: 'card-sausage.jpg', l: -3.17, t: -1.17, w: 164, h: 206 },
  ],
  [
    { src: 'card-barbie.jpg', l: -1.17, t: -11.16, w: 161, h: 224 },
    { src: 'card-help.jpg', l: -3.17, t: -1.17, w: 164, h: 206 },
  ],
]

export function ImageGrid({ onPick }: { onPick?: (row: number, col: number) => void }) {
  const tops = [176, 391, 606]
  return (
    <>
      {GRID.map((row, r) => (
        <div className="grid-row" style={{ top: tops[r] }} key={r}>
          {row.map((b, c) => (
            <button className="box" key={c} onClick={onPick ? () => onPick(r, c) : undefined}>
              <img src={A(b.src)} alt="" style={{ left: b.l, top: b.t, width: b.w, height: b.h }} />
            </button>
          ))}
        </div>
      ))}
    </>
  )
}

export function UploadCta({ onClick }: { onClick?: () => void }) {
  return (
    <button className="cta upload" style={{ top: 756 }} onClick={onClick}>
      <img src={A('icon-upload.svg')} alt="" style={{ width: 15, height: 14 }} />
      Upload
    </button>
  )
}

/* ----------------------------------------------------------------- type editor (screens 6–8) */

const FONTS = ['Modern', 'Calligraphy', 'Decorative', 'Literature']
const COLORS = ['#ffffff', '#000000', '#ff0000', '#ff9900', '#ffdd00', '#00bb19', '#314db5', '#773bd7', '#e68adc', '#773bd7']

export function TypeField({ value, onClick }: { value: string; onClick?: () => void }) {
  return (
    <button className="type-field" onClick={onClick}>
      <span>{value}</span>
    </button>
  )
}

export function FontChips() {
  const strip = useDragScroll()
  return (
    <div className="chip-strip" style={{ gap: 9.186 }} ref={strip}>
      {FONTS.map((f, i) => (
        <button className={'font-chip' + (i === 0 ? ' on' : '')} style={{ width: i === 0 ? 93.01 : 97 }} key={f}>
          {f}
        </button>
      ))}
    </div>
  )
}

export function ColorChips() {
  const strip = useDragScroll()
  return (
    <div className="chip-strip" style={{ gap: 10.887 }} ref={strip}>
      <button className="color-chip picker" aria-label="Pick a colour">
        <img src={A('icon-eyedropper.svg')} alt="" style={{ width: 17.78, height: 17.78 }} />
      </button>
      {COLORS.map((c, i) => (
        <button className="color-chip" key={i} aria-label={c}>
          <i style={{ background: c, width: i === 3 ? 23.7 : 24.89 }} />
        </button>
      ))}
    </div>
  )
}

export function Segmented({ active, onAa, onColor }: { active: 'aa' | 'color'; onAa?: () => void; onColor?: () => void }) {
  return (
    <div className="segmented">
      <span className="seg-pill" style={{ left: active === 'aa' ? 5.56 : 115.27 }} />
      <button className="seg-label" style={{ left: 5.56 }} onClick={onAa}>
        Aa
      </button>
      <button className="seg-label" style={{ left: 115.27 }} onClick={onColor}>
        Color
      </button>
    </div>
  )
}

export function Keyboard({ onReturn }: { onReturn?: () => void }) {
  return (
    <div className="keyboard">
      <img src={A('keyboard@3x.png')} alt="" />
      {/* return key hotspot (Figma marks the key as a prototype link) */}
      <button className="key-return" onClick={onReturn} aria-label="return" />
    </div>
  )
}

/* ----------------------------------------------------------------- photo library (screens 4–5) */

const PHOTOS = [
  ['photo-01.jpg', 'photo-02.jpg', 'photo-03.jpg'],
  ['photo-04.jpg', 'photo-05.jpg', 'photo-06.jpg'],
  ['photo-07.jpg', 'photo-08b.jpg', 'photo-09.jpg'],
  ['photo-10.jpg', 'photo-11.jpg', 'photo-12.jpg'],
  ['photo-13.jpg', 'photo-14.jpg', 'photo-15.jpg'],
  ['photo-16.jpg', 'photo-17.jpg', 'photo-18.jpg'],
]

export function PhotoLibrary({ selected, onClose, onPhoto, onConfirm }: { selected?: boolean; onClose?: () => void; onPhoto?: () => void; onConfirm?: () => void }) {
  return (
    <div className="library">
      <div className="lib-header">
        <button className="lib-round" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M2 12L12 2" stroke="black" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        <div className="lib-seg">
          <button className="lib-seg-on">Photos</button>
          <button className="lib-seg-off">Albums</button>
        </div>
        <button className="lib-round lib-check" onClick={onConfirm} aria-label="Confirm">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M2 6L6 10L14 2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="lib-grid">
        {PHOTOS.map((row, r) => (
          <div className="lib-row" key={r}>
            {row.map((p, c) => {
              const first = r === 0 && c === 0
              return (
                <button className="lib-cell" key={c} onClick={first ? onPhoto : undefined}>
                  <img src={A(p)} alt="" />
                  {first && selected && (
                    <>
                      <span className="lib-dim" />
                      <img className="lib-ck-circle" src={A('photo-check-circle.svg')} alt="" />
                      <img className="lib-ck" src={A('photo-check.svg')} alt="" />
                    </>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- sheets (occasion / name / calendar) */

export function SheetHeading({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <p className="sheet-heading" style={{ left: x, top: y }}>
      {children}
    </p>
  )
}

export function Note({ x, y, w, children, style }: { x: number; y: number; w: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <p className="note" style={{ left: x, top: y, width: w, ...style }}>
      {children}
    </p>
  )
}

const OCCASIONS: { label: string; w: number; arrow?: boolean }[][] = [
  [{ label: 'Wedding', w: 93.01 }, { label: 'New baby', w: 93.01 }, { label: 'Birthday', w: 93.01 }],
  [{ label: 'Get well', w: 93.01 }, { label: 'Engagement', w: 109 }, { label: 'Graduation', w: 103 }],
  [{ label: 'New Pet', w: 93.01 }, { label: 'New Job', w: 93.01 }, { label: 'Promotion', w: 103 }],
  [{ label: 'Retirement', w: 109 }, { label: 'Farewell', w: 93.01 }, { label: 'Others', w: 93.01, arrow: true }],
]

export function OccasionChips({ selected, onBirthday }: { selected: boolean; onBirthday?: () => void }) {
  return (
    <div className="occasions">
      {OCCASIONS.map((row, r) => (
        <div className="occ-row" style={{ gap: r === 1 ? 7 : 8 }} key={r}>
          {row.map((o) => {
            const isBirthday = o.label === 'Birthday'
            const cls = 'occ-chip' + (isBirthday ? (selected ? ' selected' : ' on') : '')
            return (
              <button className={cls} style={{ width: o.w }} key={o.label} onClick={isBirthday ? onBirthday : undefined}>
                {o.label}
                {o.arrow && <img src={A('icon-others-arrow.svg')} alt="" style={{ width: 7, height: 7.98, marginLeft: 4 }} />}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function NameField({ value, onClick }: { value: string; onClick?: () => void }) {
  return (
    <button className="type-field name-field" onClick={onClick}>
      <span>{value}</span>
    </button>
  )
}

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
// August 2026 starts on a Saturday
const AUG_2026: (number | null)[][] = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, 31, null, null, null, null, null],
]

export function Calendar({ selected, onDay }: { selected: number; onDay?: (d: number) => void }) {
  return (
    <div className="calendar">
      <div className="cal-head">
        <span className="cal-month">
          August
          <img src={A('icon-chevron-down.svg')} alt="" style={{ width: 14, height: 8, marginLeft: 10 }} />
        </span>
        <span className="cal-year">2026</span>
      </div>
      <div className="cal-line" />
      <div className="cal-body">
        <div className="cal-row">
          {WEEK.map((d, i) => (
            <span className="cal-cell cal-wd" key={i}>
              {d}
            </span>
          ))}
        </div>
        {AUG_2026.map((row, r) => (
          <div className="cal-row" key={r}>
            {row.map((d, i) => (
              <button
                className={'cal-cell' + (d === selected ? ' sel' : '')}
                key={i}
                onClick={d && onDay ? () => onDay(d) : undefined}
                disabled={d === null}
              >
                {d ?? ''}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
