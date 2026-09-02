// Renders the QSAR Flex PDFs and one PNG per page for proofing.
//
//   node pdf/build.mjs            # both documents
//   node pdf/build.mjs brochure   # just the brochure
//   node pdf/build.mjs it         # just the IT guide
//
// Output lands in pdf/out/ (git-ignored): the PDFs plus proof/<doc>/pNN.png.
// Playwright comes from scripts/node_modules — the same one screenshot.js uses.

import { chromium } from '../scripts/node_modules/playwright/index.mjs'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, 'out')

const DOCS = {
  brochure: { src: 'brochure.html',        pdf: 'QSAR Flex 4.0 Release Brochure.pdf' },
  it:       { src: 'it-requirements.html', pdf: 'QSAR Flex IT Requirements.pdf' },
  notes:    { src: 'release-notes.html',    pdf: 'QSAR Flex 4.0 Release Notes.pdf' },
}

const pick = process.argv[2]
const jobs = pick ? { [pick]: DOCS[pick] } : DOCS
if (pick && !DOCS[pick]) {
  console.error(`unknown document "${pick}" — expected one of: ${Object.keys(DOCS).join(', ')}`)
  process.exit(1)
}

fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
let failed = false

for (const [name, job] of Object.entries(jobs)) {
  // Clear stale proofs first — shortening a document used to leave an orphan
  // page behind, which then read as part of the deliverable.
  const proofDir = path.join(OUT, 'proof', name)
  fs.rmSync(proofDir, { recursive: true, force: true })
  fs.mkdirSync(proofDir, { recursive: true })

  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 2 })
  const errs = []
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
  page.on('pageerror', e => errs.push(String(e)))

  await page.goto(pathToFileURL(path.join(HERE, job.src)).href, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  // preferCSSPageSize honours the @page size in system.css; zero margins because
  // every .page draws its own furniture.
  await page.pdf({
    path: path.join(OUT, job.pdf),
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  })

  const sheets = await page.$$('.page')
  for (let i = 0; i < sheets.length; i++) {
    await sheets[i].screenshot({ path: path.join(proofDir, `p${String(i + 1).padStart(2, '0')}.png`) })
  }

  console.log(`${name}: ${sheets.length} pages → out/${job.pdf}`)
  if (errs.length) { failed = true; console.error(`  console errors:\n    ${errs.join('\n    ')}`) }
  await page.close()
}

await browser.close()
if (failed) process.exit(1)
