/**
 * Shared UI pieces for the Loovly creator demo. Coordinates are Figma frame units (390 × 845);
 * sheet contents use the "Bottom Bars" overlay space (origin 18 px above the frame).
 */
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASK_WALL, FORMATS, MONTHS, MONTHS_SHORT, PHOTOS, daysIn, firstWeekday } from './state'
import type { Format } from './state'
import { dim, fade, sheet, slideUp } from './motion'
import { THEMES, THEME_CATEGORIES, themeBySlug, themeMobile } from './themes'
import type { ThemeCategory } from './themes'
import { EFFECTS, effectIndex } from './effects'

/** Resolves an exported Figma asset. The single-file bundler swaps in data: URIs via window.__INLINE_ASSETS__. */
declare global { interface Window { __INLINE_ASSETS__?: Record<string, string> } }
export const asset = (name: string) => window.__INLINE_ASSETS__?.[name] ?? (name.includes('/') ? `./${name}` : `./assets/${name}`)
const A = asset

/** Mouse drag-to-scroll for horizontal strips (touch scrolls natively); wheel scrolls sideways. */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let dragging = false, moved = false, startX = 0, startLeft = 0
    const scale = () => el.getBoundingClientRect().width / el.offsetWidth || 1
    const down = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; dragging = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft }
    const move = (e: PointerEvent) => { if (!dragging) return; const dx = (e.clientX - startX) / scale(); if (Math.abs(dx) > 4) moved = true; el.scrollLeft = startLeft - dx }
    const up = () => { dragging = false }
    const click = (e: MouseEvent) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false } }
    const wheel = (e: WheelEvent) => { if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; el.scrollLeft += e.deltaY; e.preventDefault() }
    el.addEventListener('wheel', wheel, { passive: false })
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    el.addEventListener('click', click, true)
    return () => {
      el.removeEventListener('wheel', wheel); el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up)
      el.removeEventListener('click', click, true)
    }
  }, [])
  return ref
}

/* ----------------------------------------------------------------- base */

/** The screen background: the BGS-Light texture, or the chosen theme (mobile crop, 1×/2×/3×). */
export function Background({ dark, theme }: { dark?: boolean; theme?: string | null }) {
  if (dark) return <div className="bg" />
  const t = themeBySlug(theme ?? null)
  const inlined = !!window.__INLINE_ASSETS__   // the single-file build carries the 1× crops only
  return (
    <div className="bg">
      <div className="bg-img"><img src={A('bg-light.jpg')} alt="" /></div>
      <div className="bg-soft" />
      <div className="bg-dark" />
      <AnimatePresence initial={false}>
        {t && (
          <motion.img
            key={t.slug}
            className="bg-theme"
            src={A(themeMobile(t, 1).replace('./', ''))}
            srcSet={inlined ? undefined : `${themeMobile(t, 1)} 1x, ${themeMobile(t, 2)} 2x, ${themeMobile(t, 3)} 3x`}
            alt=""
            {...fade}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
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

export function Title({ children = 'Create your card' }: { children?: ReactNode }) {
  return <h1 className="title">{children}</h1>
}

export function Description() {
  return <p className="desc">Choose who it’s for, what the occasion is, when it’s happening, and how you’d like to create it.</p>
}

export function TopGradient() { return <div className="top-gradient" /> }
export function BottomGradient() { return <motion.div className="bottom-gradient" {...fade} /> }

export function CloseX({ x, y, onClick }: { x: number; y: number; onClick?: () => void }) {
  return (
    <button className="close-x" style={{ left: x - 0.53, top: y - 0.53 }} onClick={onClick} aria-label="Close">
      <svg width="11.06" height="11.06" viewBox="0 0 11.0607 11.0607" fill="none">
        <path d="M0.53033 0.53033L10.5303 10.5303M0.53033 10.5303L10.5303 0.53033" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/** ds/cta — Primary glass button, centred unless `left` is given */
export function Cta({ children, onClick, top, left, width, disabled }: { children: ReactNode; onClick?: () => void; top: number; left?: number; width?: number; disabled?: boolean }) {
  const style: CSSProperties = { top, width }
  if (left !== undefined) { style.left = left; style.transform = 'none' }
  return (
    <button className={'cta' + (disabled ? ' disabled' : '')} style={style} onClick={disabled ? undefined : onClick} aria-disabled={disabled}>
      {children}
    </button>
  )
}

/** Plain text input styled as the design's underlined field. Enter blurs and submits. */
export function TextInput({ value, onChange, placeholder, onSubmit, onFocus, onBlur, className = '', autoFocus, style }: {
  value: string; onChange: (v: string) => void; placeholder?: string; onSubmit?: () => void; onFocus?: () => void; onBlur?: () => void
  className?: string; autoFocus?: boolean; style?: CSSProperties
}) {
  return (
    <input
      className={'ti ' + className}
      style={style}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); onSubmit?.() } }}
      autoFocus={autoFocus}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="done"
    />
  )
}

/* ----------------------------------------------------------------- card */

const CROPS: Record<string, CSSProperties> = {
  'card-cat.jpg': { left: -15, top: -21, width: 273, height: 380 },
  'card-cake.jpg': { left: -7, top: -13, width: 251, height: 353 },
}

export function Card({ src, caption, color, onPencil, top = 117, className = '' }: { src: string; caption?: string; color?: string; onPencil?: () => void; top?: number; className?: string }) {
  const crop = CROPS[src]
  return (
    <div className={'card ' + className} style={{ top }}>
      <AnimatePresence initial={false}>
        {crop ? (
          <motion.img key={src} className="card-img" style={crop} src={A(src)} alt="" {...fade} />
        ) : (
          <motion.img key={src} className="card-fill" src={A(src)} alt="" {...fade} />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {caption && <motion.span key="caption" className="card-caption" style={{ color }} {...fade}>{caption}</motion.span>}
      </AnimatePresence>
      <button className="card-pencil" onClick={onPencil} aria-label="Edit card">
        <img src={A('card-pencil-bg.svg')} alt="" style={{ left: 0, top: 0, width: 40, height: 40 }} />
        <img src={A('card-pencil.svg')} alt="" style={{ left: 0.32, top: 0, width: 39.04, height: 39.04 }} />
      </button>
      <span className="stroke" />
    </div>
  )
}

/* ----------------------------------------------------------------- detail chips */

export type ChipKey = 'occasion' | 'who' | 'when' | 'format' | 'prompt'
type Chip = { icon: string; w: number; h: number; label: string; key: ChipKey }

export function DetailChips({ occasion, who, when, format, prompt, onChip, rowsVisible = 3 }: {
  occasion: string | null; who: string | null; when: string | null; format: string | null; prompt: string | null
  onChip?: (key: ChipKey) => void; rowsVisible?: number
}) {
  const all: Chip[][] = [
    [
      { icon: 'icon-pencil.svg', w: 12, h: 12, key: 'occasion', label: occasion ?? 'Occasion' },
      { icon: 'icon-paw.svg', w: 12, h: 12, key: 'who', label: who ?? 'Who’s it for' },
    ],
    [
      { icon: 'icon-calendar.svg', w: 10.53, h: 11, key: 'when', label: when ?? 'When is it' },
      { icon: 'icon-format.svg', w: 12, h: 10, key: 'format', label: format ?? 'Format Type' },
    ],
    [{ icon: 'icon-chat.svg', w: 11, h: 11, key: 'prompt', label: prompt ?? 'Choose Prompt' }],
  ]
  const rows = all.slice(0, rowsVisible)
  const tops = [530, 571, 613]
  return (
    <AnimatePresence initial={false}>
      {rows.map((row, i) => (
        <motion.div className="chip-row" style={{ top: tops[i] }} key={i} {...fade}>
          {row.map((c) => (
            <button className="chip" key={c.key} onClick={onChip ? () => onChip(c.key) : undefined}>
              <img src={A(c.icon)} alt="" style={{ width: c.w, height: c.h }} />
              <motion.span key={c.label} className="chip-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>{c.label}</motion.span>
            </button>
          ))}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

/* ----------------------------------------------------------------- hostbar + tray */

export function HostBar({ onVibe, onAnimations, onSetting, onDone }: { onVibe?: () => void; onAnimations?: () => void; onSetting?: () => void; onDone?: () => void }) {
  return (
    <motion.div className="hostbar" {...fade}>
      <button className="host-tab" style={{ left: 28 }} onClick={onVibe}><img src={A('icon-vibe.svg')} alt="" /><span>VIBE</span></button>
      <button className="host-tab" style={{ left: 150 }} onClick={onAnimations}><img src={A('icon-animations.svg')} alt="" /><span>ANIMATIONS</span></button>
      <button className="host-tab" style={{ left: 272 }} onClick={onSetting}><img src={A('icon-setting.svg')} alt="" /><span>SETTING</span></button>
      <button className="cta" style={{ top: 81 }} onClick={onDone}>Done</button>
    </motion.div>
  )
}

type TrayItem = { id: string; label: string; thumb?: string; glyph?: string }

/** The tray behind the hostbar: a label, optional filter chips, and a strip of tiles. */
function TrayShell({ label, filters, filter, onFilter, items, selected, onSelect }: {
  label: string; filters?: { id: string; label: string }[]; filter?: string; onFilter?: (id: string) => void
  items: TrayItem[]; selected: string; onSelect?: (id: string) => void
}) {
  const strip = useDragScroll()
  useEffect(() => { strip.current?.scrollTo({ left: 0 }) }, [filter, strip])
  return (
    <motion.div className="layer layer-tray" {...slideUp(124)}>
      <div className="tray">
        <AnimatePresence initial={false}>
          <motion.span key={label} className="tray-label" {...fade}>{label}</motion.span>
        </AnimatePresence>
        {filters && (
          <div className="tray-filters">
            {filters.map((f) => (
              <button className={'tray-filter' + (f.id === filter ? ' on' : '')} key={f.id} onClick={() => onFilter?.(f.id)} aria-pressed={f.id === filter}>{f.label}</button>
            ))}
          </div>
        )}
      </div>
      <div className="tray-thumbs" ref={strip}>
        {items.map((it) => (
          <button className={'thumb' + (it.id === selected ? ' on' : '') + (it.glyph ? ' glyph' : '')} key={it.id} onClick={onSelect ? () => onSelect(it.id) : undefined} aria-pressed={it.id === selected} title={it.label}>
            {it.thumb ? <img src={it.thumb} alt="" loading="lazy" decoding="async" /> : <span className="thumb-glyph">{it.glyph}</span>}
            <span className="thumb-label">{it.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

/** VIBE: the 115 theme backgrounds, filtered by category. */
export function ThemeTray({ selected, onSelect }: { selected: string | null; onSelect?: (slug: string | null) => void }) {
  const current = themeBySlug(selected)
  const [filter, setFilter] = useState<ThemeCategory>(current?.category ?? 'basic-gradient')
  const items: TrayItem[] = [
    { id: '__none', label: 'None', glyph: '–' },
    ...THEMES.filter((t) => t.category === filter).map((t) => ({ id: t.slug, label: t.name, thumb: A(themeMobile(t, 1).replace('./', '')) })),
  ]
  return (
    <TrayShell label="Vibe" filters={THEME_CATEGORIES} filter={filter} onFilter={(id) => setFilter(id as ThemeCategory)}
      items={items} selected={selected ?? '__none'} onSelect={(id) => onSelect?.(id === '__none' ? null : id)} />
  )
}

/** ANIMATIONS: the 20 LOV.DESIGN effects. */
export function EffectTray({ selected, onSelect }: { selected: string; onSelect?: (id: string) => void }) {
  return <TrayShell label="Animations" items={EFFECTS.map((e) => ({ id: e.id, label: e.name, glyph: e.glyph }))} selected={selected} onSelect={onSelect} />
}

/**
 * Mounts a LoovlyFX effect over the screen through the package's documented API:
 * a `.phone-body` host with the `.cin-art` marker, a `.fxroot` layer, and for the two
 * card-bound effects (tape, scratch) a `.cardfx` anchor placed exactly over the card.
 */
export function EffectHost({ effect, card }: { effect: string; card: { left: number; top: number; width: number; height: number } }) {
  const root = useRef<HTMLDivElement>(null)
  const cardfx = useRef<HTMLDivElement>(null)
  const meta = EFFECTS.find((e) => e.id === effect)
  const bound = !!meta?.cardBound
  useEffect(() => {
    const FX = window.LoovlyFX, el = root.current, cf = cardfx.current
    if (!FX || !el || effect === 'none') return
    const idx = effectIndex(effect)
    if (idx < 0) return
    FX.mount(el, idx)
    if (bound && cf) FX.mountCard(cf, idx)
    return () => {
      try { FX.unmount(el) } catch { /* already gone */ }
      if (cf) { try { FX.unmount(cf) } catch { /* already gone */ } }
    }
  }, [effect, bound])
  if (effect === 'none') return null
  return (
    <div className="fx-host phone-body" data-effect={effect}>
      <div className="phone-scr">
        {bound ? (
          <div className={(effect === 'tape' ? 'tapebox' : 'scratchbox') + ' cin-art'} style={card}><div className="cardfx" ref={cardfx} /></div>
        ) : (
          <i className="cin-art" style={{ display: 'none' }} />
        )}
      </div>
      <div className="fxroot" ref={root} />
    </div>
  )
}

/* ----------------------------------------------------------------- blurred "Bottom Bars" sheet */

export type OverlayKind = 'picker' | 'sheet' | 'calendar' | 'format'

/** Backdrop dims + blurs the layer underneath while the content rises from the bottom. */
export function Overlay({ kind, children }: { kind: OverlayKind; children?: ReactNode }) {
  return (
    <motion.div className={'overlay overlay-' + kind} {...dim}>
      <motion.div className="sheet-content" {...sheet}>{children}</motion.div>
    </motion.div>
  )
}

export function Tabs({ active, onType, onImage }: { active: 'type' | 'image'; onType?: () => void; onImage?: () => void }) {
  return (
    <div className="tabs">
      <button className={'tab' + (active === 'type' ? ' on' : '')} style={{ width: 168 }} onClick={onType}>Type</button>
      <button className={'tab' + (active === 'image' ? ' on' : '')} style={{ width: 174 }} onClick={onImage}>Image</button>
    </div>
  )
}

/* ----------------------------------------------------------------- type editor */

export const FONTS = ['Modern', 'Calligraphy', 'Decorative', 'Literature']
const COLORS = ['#ffffff', '#000000', '#ff0000', '#ff9900', '#ffdd00', '#00bb19', '#314db5', '#773bd7', '#e68adc', '#773bd7']

export function FontChips({ selected, onSelect }: { selected: number; onSelect?: (i: number) => void }) {
  const strip = useDragScroll()
  return (
    <div className="chip-strip" style={{ gap: 9.186 }} ref={strip}>
      {FONTS.map((f, i) => (
        <button className={'font-chip' + (i === selected ? ' on' : '')} style={{ width: i === 0 ? 93.01 : 97 }} key={f} onClick={onSelect ? () => onSelect(i) : undefined} aria-pressed={i === selected}>{f}</button>
      ))}
    </div>
  )
}

export function ColorChips({ selected, onSelect }: { selected: string; onSelect?: (c: string) => void }) {
  const strip = useDragScroll()
  const input = useRef<HTMLInputElement>(null)
  return (
    <div className="chip-strip" style={{ gap: 10.887 }} ref={strip}>
      <button className="color-chip picker" aria-label="Pick a colour" onClick={() => input.current?.click()}>
        <img src={A('icon-eyedropper.svg')} alt="" style={{ width: 17.78, height: 17.78 }} />
        <input ref={input} type="color" value={selected} onChange={(e) => onSelect?.(e.target.value)} tabIndex={-1} aria-hidden />
      </button>
      {COLORS.map((c, i) => (
        <button className={'color-chip' + (c === selected ? ' on' : '')} key={i} aria-label={c} onClick={onSelect ? () => onSelect(c) : undefined} aria-pressed={c === selected}>
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
      <button className="seg-label" style={{ left: 5.56 }} onClick={onAa}>Aa</button>
      <button className="seg-label" style={{ left: 115.27 }} onClick={onColor}>Color</button>
    </div>
  )
}

/** The iOS keyboard from the file — shown on pointer devices only; touch devices get the real one. */
export function Keyboard({ onReturn }: { onReturn?: () => void }) {
  return (
    <motion.div className="keyboard" {...slideUp(326)}>
      <img src={A('keyboard@3x.png')} alt="" />
      <button className="key-return" onClick={onReturn} aria-label="return" />
    </motion.div>
  )
}

/* ----------------------------------------------------------------- photo library */

export function PhotoLibrary({ selected, onClose, onPhoto, onConfirm }: { selected: number | null; onClose?: () => void; onPhoto?: (i: number) => void; onConfirm?: () => void }) {
  const rows = Array.from({ length: PHOTOS.length / 3 }, (_, r) => PHOTOS.slice(r * 3, r * 3 + 3))
  return (
    <motion.div className="library" {...slideUp(800)}>
      <div className="lib-header">
        <button className="lib-round" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M2 12L12 2" stroke="black" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </button>
        <div className="lib-seg"><button className="lib-seg-on">Photos</button><button className="lib-seg-off">Albums</button></div>
        <button className="lib-round lib-check" onClick={onConfirm} aria-label="Confirm">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M2 6L6 10L14 2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="lib-grid">
        {rows.map((row, r) => (
          <div className="lib-row" key={r}>
            {row.map((p, c) => {
              const i = r * 3 + c
              const on = i === selected
              return (
                <button className="lib-cell" key={p} onClick={onPhoto ? () => onPhoto(i) : undefined} aria-pressed={on}>
                  <img src={A(p)} alt="" />
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span key="check" className="lib-selected" {...fade}>
                        <span className="lib-dim" />
                        <img className="lib-ck-circle" src={A('photo-check-circle.svg')} alt="" />
                        <img className="lib-ck" src={A('photo-check.svg')} alt="" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ----------------------------------------------------------------- sheet text */

export function SheetHeading({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <p className="sheet-heading" style={{ left: x, top: y }}>{children}</p>
}

export function Note({ x, y, w, children }: { x: number; y: number; w: number; children: ReactNode }) {
  return <motion.p className="note" style={{ left: x, top: y, width: w }} {...fade}>{children}</motion.p>
}

/* ----------------------------------------------------------------- occasion */

const OCCASIONS: { label: string; w: number; arrow?: boolean }[][] = [
  [{ label: 'Wedding', w: 93.01 }, { label: 'New baby', w: 93.01 }, { label: 'Birthday', w: 93.01 }],
  [{ label: 'Get well', w: 93.01 }, { label: 'Engagement', w: 109 }, { label: 'Graduation', w: 103 }],
  [{ label: 'New Pet', w: 93.01 }, { label: 'New Job', w: 93.01 }, { label: 'Promotion', w: 103 }],
  [{ label: 'Retirement', w: 109 }, { label: 'Farewell', w: 93.01 }, { label: 'Others', w: 93.01, arrow: true }],
]

export function OccasionChips({ selected, onSelect }: { selected: string | null; onSelect?: (o: string) => void }) {
  return (
    <div className="occasions">
      {OCCASIONS.map((row, r) => (
        <div className="occ-row" style={{ gap: r === 1 ? 7 : 8 }} key={r}>
          {row.map((o) => (
            <button className={'occ-chip' + (o.label === selected ? ' selected' : '')} style={{ width: o.w }} key={o.label} onClick={onSelect ? () => onSelect(o.label) : undefined} aria-pressed={o.label === selected}>
              {o.label}
              {o.arrow && <img src={A('icon-others-arrow.svg')} alt="" style={{ width: 7, height: 7.98, marginLeft: 4 }} />}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ----------------------------------------------------------------- calendar (2026) */

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function Calendar({ month, selected, monthsOpen, onDay, onToggleMonths, onMonth }: {
  month: number; selected: number; monthsOpen: boolean; onDay?: (d: number) => void; onToggleMonths?: () => void; onMonth?: (m: number) => void
}) {
  const first = firstWeekday(month), days = daysIn(month)
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
  return (
    <div className="calendar">
      <div className="cal-head">
        <button className={'cal-month' + (monthsOpen ? ' open' : '')} onClick={onToggleMonths} aria-expanded={monthsOpen}>
          {MONTHS[month]}
          <img src={A('icon-chevron-down.svg')} alt="" style={{ width: 14, height: 8, marginLeft: 10 }} />
        </button>
        <span className="cal-year">2026</span>
      </div>
      <div className="cal-line" />
      <div className="cal-body">
        <AnimatePresence initial={false} mode="wait">
          {monthsOpen ? (
            <motion.div className="cal-months" key="months" {...fade}>
              {MONTHS_SHORT.map((m, i) => (
                <button className={'occ-chip' + (i === month ? ' selected' : '')} key={m} onClick={() => onMonth?.(i)} aria-pressed={i === month}>{m}</button>
              ))}
            </motion.div>
          ) : (
            <motion.div key={'m' + month} {...fade}>
              <div className="cal-row cal-week">
                {WEEK.map((d, i) => <span className="cal-cell cal-wd" key={i}>{d}</span>)}
              </div>
              {weeks.map((row, r) => (
                <div className="cal-row" key={r}>
                  {row.map((d, i) => (
                    <button className={'cal-cell' + (d === selected ? ' sel' : '')} key={i} onClick={d && onDay ? () => onDay(d) : undefined} disabled={d === null} aria-pressed={d === selected}>
                      {d === selected && <motion.span className="cal-sel-pill" layoutId="cal-sel" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                      <span className="cal-day">{d ?? ''}</span>
                    </button>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- format sheet */

export function FormatChips({ selected, onSelect }: { selected: Format | null; onSelect?: (f: Format) => void }) {
  const strip = useDragScroll()
  return (
    <div className="format-chips" ref={strip}>
      {FORMATS.map((f) => (
        <button className={'occ-chip format-chip' + (f.id === selected ? ' selected' : '')} key={f.id} onClick={() => onSelect?.(f.id)} aria-pressed={f.id === selected}>{f.label}</button>
      ))}
    </div>
  )
}

export function FormatCard({ format }: { format: Format }) {
  const f = FORMATS.find((x) => x.id === format)!
  return (
    <div className="format-card">
      <div className="format-preview">
        <AnimatePresence initial={false} mode="wait">
          <motion.div key={format} className="format-art" {...fade}>
            {format === 'montage' && (<><img className="fp-play" src={A('icon-play.svg')} alt="" /><span className="fp-time">00:05</span></>)}
            {format === 'slideshow' && (<><span className="fp-slide s1" /><span className="fp-slide s2" /><span className="fp-slide s3" /></>)}
            {format === 'prompted' && <span className="fp-rec"><i />0:07</span>}
            {format === 'story' && (<><span className="fp-story">Happy Birthday!</span><span className="fp-rule" /></>)}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false} mode="wait">
        <motion.div key={format} className="format-copy" {...fade}>
          <p className="format-title">{f.title}</p>
          <p className="format-desc">{f.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ----------------------------------------------------------------- prompt sheet (ask wall) */

export function AskWall({ open, typing, onToggle, onChoose }: { open: number | null; typing: boolean; onToggle?: (i: number) => void; onChoose?: (p: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [h, setH] = useState(210)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <motion.div className="askwall" ref={ref} animate={{ top: typing ? 365 : 667 - h / 2 }} transition={{ duration: 0.3 }} initial={false}>
      {ASK_WALL.map((sec, i) => (
        <div className="ask-section" key={sec.label}>
          <button className="ask-label" onClick={() => onToggle?.(i)} aria-expanded={open === i}>
            {sec.label}
            <img src={A('icon-chevron-small.svg')} alt="" style={{ width: 8, height: 5, transform: open === i ? 'rotate(180deg)' : 'none' }} />
          </button>
          <AnimatePresence initial={false}>
            {(open === i ? sec.items : sec.items.slice(0, 1)).map((item) => (
              <motion.button className="ask-item" key={item} onClick={() => onChoose?.(item)} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
                {item}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  )
}

/* ----------------------------------------------------------------- checkout + room pieces */

export function OptionRow({ title, desc, selected, onClick, top, height = 84 }: { title: string; desc: string; selected: boolean; onClick?: () => void; top: number; height?: number }) {
  return (
    <button className={'option-row' + (selected ? ' selected' : '')} style={{ top, height }} onClick={onClick} aria-pressed={selected}>
      <span className="option-title">{title}</span>
      <span className="option-desc">{desc}</span>
    </button>
  )
}

export function Table({ rows, top, height }: { rows: [string, string][]; top: number; height: number }) {
  return (
    <div className="table" style={{ top, height }}>
      {rows.map(([k, v], i) => (
        <div className="table-row" key={k}>
          {i > 0 && <span className="table-rule" />}
          <span className="table-k">{k}</span>
          <span className="table-v">{v}</span>
        </div>
      ))}
    </div>
  )
}

export function StatusPill({ label, x, y }: { label: string; x: number; y: number }) {
  return <div className="status-pill" style={{ left: x, top: y }}><i />{label}</div>
}
