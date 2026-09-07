/** Shared motion presets — iOS-like timing: sheets glide, backdrops fade, nothing over ~400 ms. */
export const ease: [number, number, number, number] = [0.32, 0.72, 0, 1]   // the iOS sheet curve

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.22, ease: 'easeOut' as const },
}

export const rise = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: { duration: 0.3, ease },
}

export const slideUp = (distance: number) => ({
  initial: { y: distance },
  animate: { y: 0 },
  exit: { y: distance },
  transition: { duration: 0.38, ease },
})
