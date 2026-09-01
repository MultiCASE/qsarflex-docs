# QSAR Flex PDFs — release brochure and IT guide

**Not published.** Nothing here is listed in `SUMMARY.md`, so GitBook ignores the whole
folder. It lives in this repo because the PDFs restate what the docs say, and the two
should not drift apart.

Two documents, both A4, both built from hand-written HTML rendered by headless Chromium:

| File | Output | What it is |
|---|---|---|
| `brochure.html` | *QSAR Flex 4.0 Release Brochure.pdf* | 6pp. Sales-facing: what the product does, what is new, the model catalog, deployment and licensing. |
| `it-requirements.html` | *QSAR Flex IT Requirements.pdf* | 19pp. For a customer's IT reviewer: requirements, installation, data paths, network rules, licensing, a checklist. |

## Build

```bash
node pdf/build.mjs              # both → pdf/out/
node pdf/build.mjs brochure     # one
node pdf/check.mjs              # page-fit check — run after EVERY edit
```

`build.mjs` writes the PDFs to `pdf/out/` and a proof PNG per page to
`pdf/out/proof/<doc>/pNN.png`. Look at the proofs. The checker catches clipping, not
ugliness.

Playwright is reused from `scripts/node_modules` — no separate install. If it is missing:
`cd scripts && npm install`.

## Read this before editing

**`.page` is `overflow: hidden`.** A page that grows past A4 does not spill onto the next
page and does not error — it silently loses whatever fell off the bottom. `check.mjs`
exists solely to catch that:

- `### OVERFLOW` — content is being clipped. Fix before shipping.
- `### VOID` — a 22mm+ gap inside a page. Usually a `margin-top:auto` pinning a block to
  the foot and leaving a hole. Add content or drop the pin.
- An overflow under ~1mm is a rounding artefact of the measurement, not real clipping.
  Confirm against the proof PNG before chasing it.

Page furniture — running foot, page number, section number — is drawn per page by the
markup, not by CSS paged media. Renumbering after inserting or moving a page is manual;
`check.mjs` will not catch a wrong number, so re-read the proofs.

**Any change to `.pg-head` changes every page's budget.** Moving the section number from a
baseline-aligned column to an eyebrow above the title added ~5mm of head height, which was
enough to clip two IT-guide pages that had previously fit. After touching shared vertical
metrics in `system.css`, re-run `check.mjs` over BOTH documents, not just the one you were
working on.

## The design system

`system.css` holds it. It is deliberately **not** the Seqtara look — that pack is a
dark-navy poster system with a green ribbon, and the client asked explicitly that these
not copy its design or its language. This one is a "bench sheet": warm paper, graphite
ink, the product's own green, and data set in mono.

```
--paper  #F6F6F3   warm off-white ground      --green    #00AE5A  chateau green 600
--sheet  #FFFFFF   cards sit ON the ground    --green-d  #0A5D37  deep, for headings on tint
--ink    #14171A   graphite, never navy       --green-l  #EEFFF6  tinted card fill
--ink-2  #3B4248   body text                  --amber    #B4700A  warnings only
--ink-3  #6B747C   secondary — the FLOOR for type
--ink-4  #98A0A7   hairlines and the checkbox stroke ONLY, never type (2.45:1 on paper)
```

Type is **Geist** and **Geist Mono** — the product's own typefaces, embedded as base64 so
the render never touches the network. Mono carries every number, path, hostname, key cap
and eyebrow label; the sans carries prose. Do not mix that up: the mono is what makes the
documents read as instrumentation rather than marketing.

Useful classes: `.page` / `.sheet` / `.pg-head` / `.pg-foot` for structure; `.card`
(`.tint`, `.ink`, `.flush`) for panels; `.eyebrow`, `.h-sec`, `.h-sub`, `.body`, `.small`
for type; `.note` (`.warn`) for callouts; `.bul`, `.checklist`, `.steps` for lists;
`.pathblock` for file paths; `.chip`, `.plat` for labels.

Two rules learned the hard way:

- **Bullets and checklist rows are `display: block` with an absolutely positioned marker.**
  They used to be flex containers, which turned every inline `<b>` and `<code>` inside a
  bullet into its own flex item and shredded the line into vertical word-columns.
- **`.pathblock` must not `word-break: break-all`.** It split paths mid-token
  (`reference d` / `ata`). It is `overflow-wrap: anywhere` now, and long paths get short
  lines with the annotation on its own line instead.

Callout arrows/badges are **off** by design in the screenshots (`DRAW_MARKERS` in
`scripts/screenshot.js`) and there is no equivalent here — the prose names every control.

## Regenerating the embedded assets

Only needed if the typeface or a logo changes:

```bash
python3 pdf/tools/embed-fonts.py     # rewrites fonts.css  (needs network)
python3 pdf/tools/embed-images.py    # rewrites images.css (needs Pillow)
```

`assets/qsarflex-logo.svg` is fetched verbatim from the public assets CDN —
`https://d35fy2f4trk71w.cloudfront.net/QSAR%20flex%20Logo.svg`, the same file the product
serves — so the documents and the product cannot drift apart. Keep it **vector**: it is set
at 21mm on the cover and as a 172mm watermark, where the old PNG showed its edges, and the
switch also took `images.css` from 592 KB to 217 KB.

`assets/multicase-hex.png` is the MultiCASE hexagon with its white wordmark cropped off so
it can sit on any ground; `assets/multicase-logo.png` is the full lockup used in the
brochure foot.

## Updating for a new release

1. **Re-verify every number against the code — do not trust the previous edition.** The
   4.0 pass found the catalog claiming 24 modules when the licensing backend has 17
   (`scripts/seed.sql`, and the Evaluate dialog), Ames described as a statistical model
   when it is an exact-structure lookup over a set of N-nitroso compounds, and the ADME
   bundle listed as eight modules when it is one whose report has eight sections.
2. **Keep the two documents and the GitBook pages agreeing.** Where a fact appears in
   both, change both. The deployment story especially: **Desktop — Cloud runs the models
   locally but queries a MultiCASE-hosted PostgreSQL over TCP 5432, and some lookups carry
   the structure as a SMILES query parameter.** It is not "evaluation in the cloud", and
   **no build works offline** — the Evaluate module picker needs a live entitlement fetch.
3. **Bump the version** in the cover, the running feet and the document-control block.
4. `node pdf/check.mjs`, then read every proof PNG.
5. Ship the PDFs from `pdf/out/`.

## Facts that were wrong before round 4, and are easy to get wrong again

Every one of these was stated confidently in an earlier draft and disproved by reading the
product. Re-check them, do not re-assert them:

- **The Cloud build does download data on first launch** — the model files, ≈27 MB
  (`DataUpdateService.DownloadDataAsync`: `DownloadFilterModelsAsync` is unconditional, only
  `DownloadSqliteDbAsync` is gated on `_isSqlite`). Only the ≈4 GB database is Local-only.
- **Desktop — Local is not "structures never leave"** — Add Compound's Auto Fill sends a SMILES
  to PubChem on every build, un-gated. Only DataKurator's lookups ask first. Say "not for
  evaluation", never "never".
- **Blocking `pubchem.ncbi.nlm.nih.gov` does nothing for the web app** — the browser calls the
  QSAR Flex backend, which makes the PubChem call server-side.
- **The 5432 session is not HTTPS and is not verified TLS** — no `SslMode` is set anywhere, so
  Npgsql's `Prefer` default applies: TLS if offered, plaintext if not, no certificate check.
- **`d35fy2f4trk71w.cloudfront.net` is a required egress host** on all three builds
  (`next.config.ts`, `NEXT_PUBLIC_ASSETS`). It was missing from both hostname tables.
- **The compound library lives in the web view's local storage**, not in a file or a database —
  `%APPDATA%\QSARFlex\WebView2Main` (roaming) and `~/Library/WebKit/<build>/`. It survives
  uninstall, has no export, and sign-out clears it. On macOS the folder is named for the .NET
  build (`com.MultiCASE_Inc..QSARFlex_Local`), **not** the `Info.plist` bundle id — check the
  real directory before printing a literal.
- **The catalog's N-Nitrosation record count could not be reproduced** from the shipped resource
  set, so the brochure prints an em dash. `fundamentals/model-catalog.md` still says 1,238;
  confirm it with MultiCASE or drop it there too.

One claim that survived review but is **false**: that not all model files ship encrypted. Every
extension in the shipped set (`.filter .json .txt .txtdb .csv`) is in `PublishData`'s
`encryptedExts`, and a `.txtdb` on disk is ciphertext. No `.sdf` or `.bin` ships.

## Known gaps, carried from 4.0

- **No model performance figures anywhere** — no sensitivity, specificity or concordance.
  The catalog says validation statistics are available from MultiCASE on request, because
  none could be found in the repositories. A regulatory reader will ask.
- **ICH M7 wants two complementary methodologies**, one expert rule-based and one
  statistical. The brochure states the Ames endpoint's role without claiming M7 compliance,
  because whether the module returns both could not be established from the encrypted
  model files.
- **The IT guide flags two things it cannot answer**: the installer URLs (they 403 until
  the stable tag runs `build-release.yml`) and the evaluation hostname if a dedicated
  endpoint has been provisioned. Section 13 exists to hold that kind of question honestly
  rather than bluff it.
