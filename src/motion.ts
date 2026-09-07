/** Shared motion presets — iOS-like timing: sheets glide, backdrops fade, nothing over ~450 ms. */
export const ease: [number, number, number, number] = [0.32, 0.72, 0, 1]   // the iOS sheet curve

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.22, ease: 'easeOut' as const },
}

/** backdrop of a sheet: dims the layer underneath as the sheet comes up */
export const dim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
}

/** sheet content: rises from below the frame */
export const sheet = {
  initial: { y: 120, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 90, opacity: 0 },
  transition: { duration: 0.4, ease },
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

/** page push: new page slides in from the right, old one drifts left */
export const page = {
  initial: { x: 48, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -32, opacity: 0 },
  transition: { duration: 0.36, ease },
}

/** entrance choreography for a page's elements */
export const enter = {
  hidden: { opacity: 0, y: 18 },
  shown: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: 0.08 + i * 0.07 } }),
}
