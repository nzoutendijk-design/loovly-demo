import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Screen } from './Screen'
import { asset } from './components'
import { PHOTOS, PRESETS, initial, matchPreset, reduce } from './state'

const N = PRESETS.length
const W = 390
const H = 845

function readHash() {
  const n = parseInt(location.hash.slice(1), 10)
  return n >= 1 && n <= N ? n : 1
}

const ASSETS = [
  'bg-backrooms.jpg', 'card-cat.jpg', 'card-cake.jpg', 'card-photo.jpg', 'card-sled.jpg', 'card-sausage.jpg', 'card-barbie.jpg', 'card-help.jpg',
  'keyboard@3x.png', 'vibe-1.jpg', 'vibe-2.jpg', 'vibe-3.jpg', 'vibe-4.jpg', 'vibe-5.jpg',
  ...PHOTOS, 'photo-08a.jpg',
]

export default function App() {
  const [s, dispatch] = useReducer(reduce, undefined, () => PRESETS[readHash() - 1]?.state ?? initial)
  const lastPreset = useRef(readHash())
  const [scale, setScale] = useState(1)
  const [desktop, setDesktop] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)

  // which designed frame (if any) the live state currently equals
  const matched = matchPreset(s, lastPreset.current)

  const go = useCallback((n: number) => {
    const c = ((n - 1 + N) % N) + 1
    lastPreset.current = c
    dispatch({ type: 'preset', state: PRESETS[c - 1].state })
  }, [])
  const step = useCallback((d: number) => go((matched ?? lastPreset.current) + d), [go, matched])

  // state → hash (only while on a designed frame), hash → state (back/forward, deep links)
  useEffect(() => {
    if (matched) { lastPreset.current = matched; history.replaceState(null, '', '#' + matched) }
    else history.replaceState(null, '', location.pathname)
  }, [matched])
  useEffect(() => {
    const h = () => { const n = readHash(); if (location.hash && n !== matched) go(n) }
    addEventListener('hashchange', h)
    return () => removeEventListener('hashchange', h)
  }, [matched, go])

  // ← / → keys step through the designed sequence
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') step(1)
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') step(-1)
      if (e.key === 'Home') go(1)
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [step, go])

  // fit the 390×845 stage into whatever viewport we have (safe-area aware)
  useEffect(() => {
    const el = viewportRef.current!
    const fit = () => {
      const w = el.clientWidth - padX(el)
      const h = el.clientHeight - padY(el)
      const isDesktop = matchMedia('(pointer: fine)').matches && w >= 600 && h >= 700
      setDesktop(isDesktop)
      if (isDesktop) setScale(Math.min((w - 48) / (W + 24), (h - 72) / (H + 24), 1))
      else setScale(Math.min(w / W, h / H))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // iOS Safari only applies :active (pressed) styles when a touchstart listener is present
  useEffect(() => {
    const noop = () => {}
    document.addEventListener('touchstart', noop, { passive: true })
    return () => document.removeEventListener('touchstart', noop)
  }, [])

  // warm the image cache so state changes don't flash
  useEffect(() => {
    ASSETS.forEach((a) => { const i = new Image(); i.src = asset(a) })
  }, [])

  const preset = matched ? PRESETS[matched - 1] : null
  const boxW = desktop ? W + 24 : W
  const boxH = desktop ? H + 24 : H

  return (
    <div className={'viewport' + (desktop ? ' desktop' : '')} ref={viewportRef}>
      <div
        className="stage-box"
        style={{ transform: `scale(${scale})`, width: boxW, height: boxH }}
        onTouchStart={(e) => {
          // touches that start inside a scrollable surface scroll it; they never flip the screen
          touch.current = (e.target as Element).closest('.chip-strip, .tray-thumbs, .library') ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }}
        onTouchEnd={(e) => {
          const t = touch.current; touch.current = null
          if (!t) return
          const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y
          if (Math.abs(dx) > 70 && Math.abs(dy) < 60) step(dx < 0 ? 1 : -1)
        }}
      >
        <div className="stage" data-screen={matched ?? ''} data-figma-node={preset?.node ?? ''} data-overlay={s.overlay.kind}>
          <Screen s={s} act={dispatch} />
        </div>
      </div>
      {desktop && (
        <div className="hint">
          {preset ? (
            <><b>{preset.id}/{N}</b> · {preset.name} — tap: {preset.hotspot} · <b>←</b>/<b>→</b> keys to step</>
          ) : (
            <>free navigation · <b>←</b>/<b>→</b> return to the designed sequence</>
          )}
        </div>
      )}
    </div>
  )
}

const padX = (el: Element) => { const s = getComputedStyle(el); return parseFloat(s.paddingLeft) + parseFloat(s.paddingRight) }
const padY = (el: Element) => { const s = getComputedStyle(el); return parseFloat(s.paddingTop) + parseFloat(s.paddingBottom) }
