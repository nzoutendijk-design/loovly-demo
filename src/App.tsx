import { useCallback, useEffect, useRef, useState } from 'react'
import { SCREENS } from './screens'
import type { Navigate } from './screens'

const N = SCREENS.length
const W = 390
const H = 845

function readHash() {
  const n = parseInt(location.hash.slice(1), 10)
  return n >= 1 && n <= N ? n : 1
}

const ASSETS = [
  'bg-backrooms.jpg', 'card-cat.jpg', 'card-cake.jpg', 'card-photo.jpg', 'card-sled.jpg', 'card-sausage.jpg', 'card-barbie.jpg', 'card-help.jpg',
  'keyboard@3x.png', 'vibe-1.jpg', 'vibe-2.jpg', 'vibe-3.jpg', 'vibe-4.jpg', 'vibe-5.jpg',
  ...Array.from({ length: 18 }, (_, i) => `photo-${String(i + 1).padStart(2, '0')}.jpg`), 'photo-08a.jpg', 'photo-08b.jpg',
]

export default function App() {
  const [idx, setIdx] = useState(readHash)
  const [scale, setScale] = useState(1)
  const [desktop, setDesktop] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)

  const go = useCallback((n: number) => {
    const c = ((n - 1 + N) % N) + 1
    setIdx(c)
    history.replaceState(null, '', '#' + c)
  }, [])
  const nav: Navigate = { go, next: () => go(idx + 1), back: () => go(idx - 1) }

  // hash → state (back/forward, deep links)
  useEffect(() => {
    const h = () => setIdx(readHash())
    addEventListener('hashchange', h)
    return () => removeEventListener('hashchange', h)
  }, [])

  // ← / → keys for presenting on a desktop
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(idx + 1)
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(idx - 1)
      if (e.key === 'Home') go(1)
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [idx, go])

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

  // warm the image cache so screen changes don't flash
  useEffect(() => {
    ASSETS.forEach((a) => { const i = new Image(); i.src = `./assets/${a}` })
  }, [])

  const screen = SCREENS[idx - 1]
  const boxW = desktop ? W + 24 : W
  const boxH = desktop ? H + 24 : H

  return (
    <div className={'viewport' + (desktop ? ' desktop' : '')} ref={viewportRef}>
      <div
        className="stage-box"
        style={{ transform: `scale(${scale})`, width: boxW, height: boxH }}
        onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }}
        onTouchEnd={(e) => {
          const t = touch.current; touch.current = null
          if (!t) return
          const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y
          if (Math.abs(dx) > 70 && Math.abs(dy) < 60) go(dx < 0 ? idx + 1 : idx - 1)
        }}
      >
        <div className="stage" key={screen.id} data-screen={screen.id} data-figma-node={screen.node}>
          {screen.render(nav)}
        </div>
      </div>
      {desktop && (
        <div className="hint">
          <b>{screen.id}/{N}</b> · {screen.name} — tap: {screen.hotspot} · <b>←</b>/<b>→</b> keys to step
        </div>
      )}
    </div>
  )
}

const padX = (el: Element) => { const s = getComputedStyle(el); return parseFloat(s.paddingLeft) + parseFloat(s.paddingRight) }
const padY = (el: Element) => { const s = getComputedStyle(el); return parseFloat(s.paddingTop) + parseFloat(s.paddingBottom) }
