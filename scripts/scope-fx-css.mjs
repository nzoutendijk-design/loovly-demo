// Rewrites vendor/loovly-handoff/effects/fx/fx.css so every rule only applies inside `.fx-host`.
// `:root`, `html` and `body` selectors become `.fx-host` itself and keep only their custom properties.
// @keyframes / @font-face / @property are copied verbatim; @media / @supports / @container / @layer recurse.
import { readFileSync, writeFileSync } from 'node:fs'

const SCOPE = '.fx-host'
const raw = readFileSync(new URL('../vendor/loovly-handoff/effects/fx/fx.css', import.meta.url), 'utf8')
// comments first (several carry braces and would desync the brace parser); brace-less at-rules would swallow the next selector
const src = raw.replace(/^﻿/, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/@(tailwind|import|charset)[^;]*;/g, '')

function splitTop(s, ch) {
  const out = []; let depth = 0, cur = ''
  for (const c of s) { if (c === '(' || c === '[') depth++; if (c === ')' || c === ']') depth--; if (c === ch && depth === 0) { out.push(cur); cur = '' } else cur += c }
  out.push(cur); return out
}
const rooted = /^(:root|html|body)(?![\w-])/
const isRooted = (sel) => rooted.test(sel.trim())
function scopeSelector(sel) {
  sel = sel.trim(); if (!sel) return sel
  if (rooted.test(sel)) return sel.replace(rooted, SCOPE).replace(/^\.fx-host\s+(html|body)(?![\w-])/, SCOPE)
  return SCOPE + ' ' + sel
}
/** html/body/:root rules become the host itself, but only their custom properties may apply — never margins, backgrounds or fonts. */
const rootBody = (body) => body.split(';').map((d) => d.trim()).filter((d) => d.startsWith('--')).join(';\n  ')

function walk(css) {
  let out = '', i = 0
  while (i < css.length) {
    const open = css.indexOf('{', i)
    if (open === -1) { out += css.slice(i); break }
    const h = css.slice(i, open).trim()
    let depth = 1, j = open + 1
    while (j < css.length && depth) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++ }
    const body = css.slice(open + 1, j - 1)
    if (/^@(media|supports|container|layer)\b/.test(h)) out += '\n' + h + '{' + walk(body) + '}\n'
    else if (h.startsWith('@')) out += '\n' + h + '{' + body + '}\n'
    else {
      const sels = splitTop(h, ',')
      const allRooted = sels.every(isRooted)
      const b = allRooted ? rootBody(body) : body
      if (!allRooted || b) out += '\n' + sels.map(scopeSelector).join(',') + '{' + b + '}\n'
    }
    i = j
  }
  return out
}
const scoped = walk(src)
writeFileSync(new URL('../public/fx/fx.css', import.meta.url), '/* LOV.DESIGN effects — generated from vendor/loovly-handoff/effects/fx/fx.css by scripts/scope-fx-css.mjs; do not edit */\n' + scoped)
console.log(`scoped fx.css: ${(scoped.length / 1024).toFixed(0)} KB`)
