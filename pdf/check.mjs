// Page-fit checker. Run it after every edit — .page has overflow:hidden, so a
// page that grows past A4 loses content SILENTLY. Nothing else will tell you.
//
//   node pdf/check.mjs
//
// OVERFLOW = content is being clipped. Fix it before shipping.
// VOID     = a gap of 22mm+ inside the page, usually a `margin-top:auto` that
//            pinned a block to the foot and left a hole above it.
//
// An overflow under ~1mm is a sub-pixel rounding artefact of this measurement,
// not real clipping — confirm against the proof PNG before chasing it.

import { chromium } from '../scripts/node_modules/playwright/index.mjs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const FILES = process.argv.length > 2 ? process.argv.slice(2) : ['brochure.html', 'it-requirements.html', 'release-notes.html', 'brand-kit.html']
const PX_PER_MM = 1240 / 210   // the viewport width is one A4 width

const browser = await chromium.launch()
let bad = 0

for (const file of FILES) {
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } })
  await page.goto(pathToFileURL(path.join(HERE, file)).href, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  const rows = await page.evaluate(() => [...document.querySelectorAll('.page')].map((pg, i) => {
    const sheet = pg.querySelector('.sheet')
    if (!sheet) return { page: i + 1, cover: true }
    const sr = sheet.getBoundingClientRect()
    let maxGap = 0, where = '', prev = sr.top
    for (const [k, el] of [...sheet.children].entries()) {
      const r = el.getBoundingClientRect()
      if (r.height <= 0) continue
      const gap = r.top - prev
      if (gap > maxGap) { maxGap = gap; where = `before child ${k + 1}` }
      prev = r.bottom
    }
    const tail = sr.bottom - prev
    if (tail > maxGap) { maxGap = tail; where = 'at bottom' }
    return { page: i + 1, maxGap, where, over: sheet.scrollHeight - sheet.clientHeight }
  }))

  console.log(`\n${file}`)
  for (const r of rows) {
    if (r.cover) { console.log(`  p${String(r.page).padStart(2, '0')}  cover`); continue }
    const mm = v => (v / PX_PER_MM).toFixed(1).padStart(6)
    let flag = ''
    if (r.over > 2) { flag = `  ### OVERFLOW ${mm(r.over).trim()}mm`; bad++ }
    else if (r.maxGap / PX_PER_MM > 22) flag = '  ### VOID'
    console.log(`  p${String(r.page).padStart(2, '0')}  gap ${mm(r.maxGap)}mm  ${r.where.padEnd(16)}${flag}`)
  }
  await page.close()
}

await browser.close()
console.log(bad ? `\n${bad} page(s) overflowing — content is being clipped.` : '\nNo overflow.')
process.exit(bad ? 1 : 0)
