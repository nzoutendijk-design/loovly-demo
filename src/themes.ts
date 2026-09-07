/** The 115 theme backgrounds from the handoff (Figma LOV.DESIGN Rounds), mobile crops 390×845 at 1×/2×/3×, web 16:9. */
import data from './themes.json'

export type ThemeCategory = 'basic-gradient' | 'complex-gradient' | 'photo' | 'illustration'
export type Theme = { slug: string; name: string; category: ThemeCategory; ground: string; luma: number; inkDark: boolean }

export const THEMES = data.themes as Theme[]
export const THEME_CATEGORIES: { id: ThemeCategory; label: string }[] = [
  { id: 'basic-gradient', label: 'Basic' },
  { id: 'complex-gradient', label: 'Complex' },
  { id: 'photo', label: 'Photo' },
  { id: 'illustration', label: 'Illustration' },
]
export const themeBySlug = (slug: string | null) => (slug ? THEMES.find((t) => t.slug === slug) ?? null : null)
export const themeMobile = (t: Theme, scale: 1 | 2 | 3) => `./themes/mobile/${t.category}/${t.slug}/bg@${scale}x.webp`
export const themeWeb = (t: Theme, width: 960 | 1440 | 1920) => `./themes/web/${t.category}/${t.slug}/bg-${width}x${width * 9 / 16}.webp`

/** Dark ink when the theme's ground is too light for white text (WCAG AA 4.5:1 boundary, luminance > 0.1836) — same rule as the client's theme tool. */
export const inkDarkFor = (slug: string | null) => themeBySlug(slug)?.inkDark ?? false
