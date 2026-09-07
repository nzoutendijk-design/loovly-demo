import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Appends a content hash to the LoovlyFX runtime URLs so a redeploy can never serve a cached stylesheet or script. */
const fxCacheBust = () => ({
  name: 'fx-cache-bust',
  transformIndexHtml(html: string) {
    const h = (f: string) => createHash('md5').update(readFileSync(new URL(`./public/fx/${f}`, import.meta.url))).digest('hex').slice(0, 8)
    return html.replace('./fx/fx.css"', `./fx/fx.css?v=${h('fx.css')}"`).replace('./fx/fx.js"', `./fx/fx.js?v=${h('fx.js')}"`)
  },
})

// base './' so the build works from any static host or sub-path (GitHub Pages, Netlify drop, S3…)
export default defineConfig({
  plugins: [react(), fxCacheBust()],
  base: './',
})
