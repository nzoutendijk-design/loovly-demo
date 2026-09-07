// Turns dist/ into one self-contained HTML file with every asset inlined as a data: URI.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'

const dist = new URL('../dist/', import.meta.url).pathname
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' }
const dataUri = (file) => `data:${mime[extname(file)]};base64,${readFileSync(file).toString('base64')}`

let html = readFileSync(join(dist, 'index.html'), 'utf8')

// CSS (with the woff2 fonts inlined)
let css = ''
for (const f of readdirSync(join(dist, 'assets')).filter((f) => f.endsWith('.css'))) css += readFileSync(join(dist, 'assets', f), 'utf8')
css = css.replace(/url\((["']?)([^)"']*?([^/)"']+\.woff2))\1\)/g, (_, __, ___, f) => `url('${dataUri(join(dist, 'fonts', f))}')`)
html = html.replace(/<link rel="stylesheet"[^>]*assets\/[^>]*\.css[^>]*>/, '')
html = html.replace('</head>', () => `<style>${css}</style></head>`) // replacer fn: '$&' etc. in the payload must stay literal

// the LoovlyFX runtime (already scoped) goes inline too
const fxCss = readFileSync(join(dist, 'fx/fx.css'), 'utf8')
const fxJs = readFileSync(join(dist, 'fx/fx.js'), 'utf8')
html = html.replace(/<link rel="stylesheet"[^>]*fx\/fx\.css[^>]*>/, '').replace(/<script src="[^"]*fx\/fx\.js[^"]*"><\/script>/, '')
html = html.replace('</head>', () => `<style>${fxCss}</style></head>`)

// JS, preceded by a map of every image as a data: URI (read by asset() in src/components.tsx)
let js = ''
for (const f of readdirSync(join(dist, 'assets')).filter((f) => f.endsWith('.js'))) js += readFileSync(join(dist, 'assets', f), 'utf8')
const images = readdirSync(join(dist, 'assets')).filter((f) => /\.(png|jpg|svg)$/.test(f))
const map = Object.fromEntries(images.map((img) => [img, dataUri(join(dist, 'assets', img))]))
// theme backgrounds: the 1× mobile crops only (the 2×/3× and web crops stay on the static site)
import('node:fs').then(() => {})
const walk = (dir, rel = '') => readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? walk(join(dir, d.name), rel + d.name + '/') : [rel + d.name])
try { for (const f of walk(join(dist, 'themes')).filter((f) => f.endsWith('bg@1x.webp'))) map['themes/' + f] = dataUri(join(dist, 'themes', f)) } catch { /* no themes in dist */ }
html = html
  .replace(/<script type="module"[^>]*><\/script>/, '')
  .replace('</body>', () => `<script>window.__INLINE_ASSETS__=${JSON.stringify(map)}</script><script>${fxJs}</script><script type="module">${js}</script></body>`)

writeFileSync(join(dist, 'loovly-demo.html'), html)
console.log(`dist/loovly-demo.html — ${(html.length / 1e6).toFixed(1)} MB`)
