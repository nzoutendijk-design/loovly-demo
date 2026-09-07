// Turns dist/ into one self-contained HTML file with every asset inlined as a data: URI.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'

const dist = new URL('../dist/', import.meta.url).pathname
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
const dataUri = (file) => `data:${mime[extname(file)]};base64,${readFileSync(file).toString('base64')}`

let html = readFileSync(join(dist, 'index.html'), 'utf8')

// CSS (with the woff2 fonts inlined)
let css = ''
for (const f of readdirSync(join(dist, 'assets')).filter((f) => f.endsWith('.css'))) css += readFileSync(join(dist, 'assets', f), 'utf8')
css = css.replace(/url\((["']?)([^)"']*?([^/)"']+\.woff2))\1\)/g, (_, __, ___, f) => `url('${dataUri(join(dist, 'fonts', f))}')`)
html = html.replace(/<link rel="stylesheet"[^>]*assets\/[^>]*\.css[^>]*>/, '')
html = html.replace('</head>', () => `<style>${css}</style></head>`) // replacer fn: '$&' etc. in the payload must stay literal

// JS, preceded by a map of every image as a data: URI (read by asset() in src/components.tsx)
let js = ''
for (const f of readdirSync(join(dist, 'assets')).filter((f) => f.endsWith('.js'))) js += readFileSync(join(dist, 'assets', f), 'utf8')
const images = readdirSync(join(dist, 'assets')).filter((f) => /\.(png|jpg|svg)$/.test(f))
const map = Object.fromEntries(images.map((img) => [img, dataUri(join(dist, 'assets', img))]))
html = html
  .replace(/<script type="module"[^>]*><\/script>/, '')
  .replace('</body>', () => `<script>window.__INLINE_ASSETS__=${JSON.stringify(map)}</script><script type="module">${js}</script></body>`)

writeFileSync(join(dist, 'loovly-demo.html'), html)
console.log(`dist/loovly-demo.html — ${(html.length / 1e6).toFixed(1)} MB`)
