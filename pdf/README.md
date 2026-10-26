# QSAR Flex PDFs — release brochure and IT guide

**Not published.** Nothing here is listed in `SUMMARY.md`, so GitBook ignores the whole
folder. It lives in this repo because the PDFs restate what the docs say, and the two
should not drift apart.

Two documents, both A4, both built from hand-written HTML rendered by headless Chromium:

| File | Output | What it is |
|---|---|---|
| `brochure.html` | *QSAR Flex 4.0 Release Brochure.pdf* | 6pp. Sales-facing: what the product does, what is new, the model catalog, deployment and licensing. |
| `it-requirements.html` | *QSAR Flex IT Requirements.pdf* | 9pp. For a customer's IT reviewer: requirements, installation, data paths, network rules, licensing, a checklist. |
| `release-notes.html` | *QSAR Flex 4.0 Release Notes.pdf* | 1 page. Plain text: what changed, what did not, how to get it. No figures, by request of the team (October 2026). |

`release-notes.html` is the only one of the three that pulls a product screenshot: section 01 references
`../.gitbook/assets/workspace-table-light.png` directly, not through `images.css`. The build renders
over `file://`, so the relative path resolves and Chromium embeds the raster in the PDF. Re-shoot that
frame and the notes pick it up on the next build — check the proof, because the figure is sized by its own
aspect ratio and a taller frame will push section 01 past the page.

## Build

```bash
node pdf/build.mjs              # all three → pdf/out/
node pdf/build.mjs brochure     # one (brochure | it | notes)
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
- **Do not dismiss a sub-1mm overflow as a rounding artefact.** An earlier pass assumed that
  and shipped a page whose last two lines were sliced in half by the footer rule at 0.8mm.
  Every reported overflow is real until the proof PNG says otherwise — and the proof is the
  arbiter, not the number. Both documents should read `No overflow.` before shipping.

Page furniture — running foot, page number, section number — is drawn per page by the
markup, not by CSS paged media. Renumbering after inserting or moving a page is manual;
`check.mjs` will not catch a wrong number, so re-read the proofs.

**Any change to `.pg-head` changes every page's budget.** Moving the section number from a
baseline-aligned column to an eyebrow above the title added ~5mm of head height, which was
enough to clip two IT-guide pages that had previously fit. After touching shared vertical
metrics in `system.css`, re-run `check.mjs` over BOTH documents, not just the one you were
working on.

## The design system

Two stylesheets. `system.css` is the base (page geometry, the colour tokens, tables, lists,
code); `vendor.css`, loaded after it by all three sources, is the look: the **vendor
document**, the way a BIOVIA datasheet or a Simulations Plus release note is put together.

- **Cover**: the MultiCASE logo large at top-left, a plain title (`QSAR Flex` with the version in
  green), a "Document type · Month Year" line, one paragraph, one real screenshot with a caption,
  the address at the foot. Nothing else: no tagline, no chips, no at-a-glance grid, no watermark.
- **Interior**: a running head (small logo left, document name right), green `h2.sec` / `h3.top`
  headings, black body text (`p.t`, `ul.t`). Two columns (`.two` / `.col`) where the prose is long.
  Numbered figures (`figure.fig`, "Figure N:" in green) cropped out of the 1440×900 docs
  screenshots with `.crop` (a viewport div and an oversized, offset `img`). Plain ruled tables
  (`table.plain`). Callouts are a 1pt left rule, no fill (`p.callout`, amber for warnings).
- **Footer**: "Product · document" and a plain page number. The IT guide carries a contents list
  with page numbers on its cover.

```
--text   #111417   body                      --head   #04914E  headings, figure numbers, the version
--text-2 #3B4248   secondary / table cells   --amber  #B4700A  warning callouts only
--text-3 #6B747C   labels, running head      --line   #D9DBD6  rules
```

Type is **Libre Franklin** for everything read and **Source Code Pro** only for things typed into a
machine: URLs, paths, registry keys, commands. Both are embedded as base64 (`fonts.css`) so the
render never touches the network. They were chosen because they are *not* the faces the models
default to (Geist, Inter, IBM Plex); do not swap them for one of those.

What is deliberately absent, because it reads as machine-made: tracked uppercase mono "eyebrow"
labels, pill chips, rounded or tinted cards, dark hero bands, watermark logos, a brand colour used
as a system colour, and decorative molecule art. The client rejected all of these in October 2026.
Removing them alone gives "minimal", which was not wanted either; what carries the pages is the
company logo and real product screenshots.

Two rules learned the hard way:

- **Bullets and checklist rows are `display: block` with an absolutely positioned marker.**
  Flex containers turned every inline `<b>` and `<code>` inside a bullet into its own flex item
  and shredded the line into vertical word-columns.
- **`.pathblock` must not `word-break: break-all`.** It split paths mid-token
  (`reference d` / `ata`). It is `overflow-wrap: anywhere` now.

Callout arrows/badges are **off** by design in the screenshots (`DRAW_MARKERS` in
`scripts/screenshot.js`) and there is no equivalent here; the captions name every control.

## The Word documents are the master

Colleagues edit the `.docx`; translators work in it; the PDF that goes to customers is saved from
it. The HTML sources remain the generator that produces a fresh Word file when the design or the
English text changes wholesale, and `build.mjs` still renders them to the fixed-layout PDFs for
proofing.

```bash
./pdf/build-docx.sh                 # HTML -> out/*.docx, styled to the design
./pdf/render-docx.sh                # .docx -> PDF via LibreOffice -> page PNGs + contact sheets, for proofing
./pdf/docx-to-pdf.sh out/X.docx     # the customer PDF from an edited Word file (Word's own Save As PDF works too)
```

How the Word file is made: `tools/docx-pre.py` rewrites the HTML for pandoc (callouts to divs,
column widths into a `<colgroup>`), `tools/docx-filter.lua` drops the page furniture, marks the
two-column regions, turns figures into a cropped picture plus caption, and maps the steps,
contents list and applies-to row to Word structure; `tools/docx-style.py` (python-docx) applies the
look: Libre Franklin with every theme-font reference removed (otherwise Word falls back to Aptos),
green headings, the title's version in green, ruled tables with explicit column proportions, real
picture crops (`srcRect`) matching the HTML crops, the logo and document name in the header, page
numbers in the footer, two-column sections, bundle rows in green.

Fonts: the eight TrueType files land in `out/fonts/` on each build; install them (double-click, or
copy to `~/Library/Fonts`) before opening or exporting the Word files, or Word substitutes a
different sans. LibreOffice on this Mac needs them in its own folder too:
`/Applications/LibreOffice.app/Contents/Resources/fonts/truetype/`.

Build flags in `build-docx.sh`: `--compact` for the one-page release notes (smaller logo and type so Word keeps it to one page); `--section-pages` (off) starts each H2 on a new page.

Lessons from the LibreOffice proofs (they apply to Word too): a theme font reference on any run
overrides the explicit face, so every `rFonts` loses its theme attributes; keep-with-next on the
first paragraph of a table cell makes Writer keep the whole row with the next block, so pair cells
never set it; keep-with-next on a repeating header row made Writer drop body rows at a page break;
a one-cell "figure" table is what pandoc 3 writes for every figure unless the image paragraph holds
another character. Fonts are embedded as obfuscated `.odttf` parts (tools/docx-embed-fonts.py) so a
machine without Libre Franklin still shows it.

Word reflows: page counts differ from the HTML PDFs and a figure may land in the other column.
That is expected. What must hold: every heading, paragraph, table, figure and caption present once
and in order; tables keep their rules and proportions; figures keep their crops.

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

1. **Re-verify every number against the production licensing database — not against
   `scripts/seed.sql`, which is a screenshot fixture, and not against the previous edition.**
   The catalog of record is the `Bundles` / `Modules` / `Softwares` tables in `admindb`; the
   connection string is in `multicase-user-manager-be/.env`:

   ```sql
   SELECT b."Name" AS bundle, m."Name" AS module
   FROM "Modules" m
   JOIN "Softwares" s ON s."Id" = m."SoftwareId"
   LEFT JOIN "Bundles" b ON b."Id" = m."BundleId"
   WHERE s."Name" ILIKE '%qsar%' ORDER BY b."Name", m."Name";
   ```

   As of 4.0 that returns **16 modules in 4 bundles** — Nitrosamine 4, Ecotoxicity 7,
   Physicochemical 4, ADME 1. The 4.0 pass also found the ADME bundle listed as eight modules
   when it is one whose report has eight sections.
2. **Keep the two documents and the GitBook pages agreeing.** Where a fact appears in
   both, change both. The deployment story especially: there are **two** deployments, the
   web application and the desktop application. **Desktop — Cloud was never released** —
   if you find it anywhere, it is stale. And **neither deployment works offline**: the
   Evaluate module picker needs a live entitlement fetch before every run.
3. **Bump the version** in the cover, the running feet and the document-control block.
4. `node pdf/check.mjs`, then read every proof PNG.
5. Ship the PDFs from `pdf/out/`.

## Three documents, one system

All three sources load `vendor.css`, so a change to the cover or page treatment is made once. Each
file keeps a short `<style>` block for what only it needs (the brochure's step row and catalog
table, the IT guide's contents list and path blocks).

**Know who the reader is before writing a word of it.** The 3.x desktop was a WinForms application
that never ran the web interface, and almost no customer has used the web application. So for
practically every reader, 4.0 is a **new application**, not a rebuilt one: nothing they know carries
over, and macOS is new too — the Windows-only WinForms build had no Mac counterpart.

The first draft got this wrong by taking its structure from `whats-new-4-0.md`, which describes the
**web application's** 3.x → 4.0 change. That produced a "where your buttons moved" mapping addressed
to people who never had those buttons. The tell was there to catch: `⌘K` is a Mac shortcut, and the
old desktop was Windows only.

So the document orients rather than diffs: what the new interface is, a **task-based** "where to do
what you used to do" table (never a control-level one, which cannot be written honestly without the
old build), what is genuinely new, what has not changed, and an introduction to the web application
as something most readers have never opened. `whats-new-4-0.md` remains the changelog, but it is a
source for facts, not for structure.

## House style

Two rules the client set, both easy to breach by accident:

- **No em dashes in prose.** They read as machine-written. Use a comma, a colon, a semicolon, a full
  stop or brackets, whichever the sentence actually wants. The only em dashes left in either
  document are the standalone `—` glyphs that mean "not applicable" in a table cell
  (`<td class="n">—</td>` and the catalog's Records column). Check with
  `grep -c ' — ' pdf/*.html` — it must be 0.
- **Do not explain the obvious to an IT reader.** The guide had "Twenty workstations on the same
  morning is twenty simultaneous 4 GB transfers", which spells out arithmetic for a professional
  audience and reads as condescension. State the constraint (one connection, two-hour ceiling,
  ~5 Mbit/s) and stop. The same applies to "which is the practical argument for…", "note that…",
  "in other words…" and similar throat-clearing.

## Keeping it to nine pages

The guide was 18pp and was cut to 9 by merging sections and deleting duplication, not by dropping
requirements. What went, and why — reinstate any of it only if a customer actually asks:

- **Per-platform install walkthroughs** ("what the installer does", "what the user sees on first
  launch"). That is user-guide material and lives in the GitBook install pages; the IT guide keeps
  only what a reviewer approves — paths, rights, signing, detection rule, uninstall.
- **The separate rule-set table.** It listed the same hosts as the hostname table with a port column
  in which every value was 443. The two are now one table: host, desktop, web, purpose.
- **Callout notes that restated a table** — the "deploy the desktop if structures may not leave"
  note, the PubChem note, a paragraph about the document's own reliability, and rollout advice.
- **The standalone summary checklist and contact pages**, folded together with the open questions
  into one closing section.

Section numbering is regenerated in document order by a small script when sections move; the cover
contents and every "section NN" cross-reference must be re-audited afterwards, because `check.mjs`
cannot see a wrong number.

## Facts that were wrong before round 4, and are easy to get wrong again

Every one of these was stated confidently in an earlier draft and disproved by reading the
product. Re-check them, do not re-assert them:

- **The desktop is not "structures never leave"** — Add Compound's Auto Fill sends a SMILES
  to PubChem, un-gated. Only One Step Cure's PubChem lookup asks first. Say "not for evaluation",
  never "never".
- **Blocking `pubchem.ncbi.nlm.nih.gov` does nothing for the web app** — the browser calls the
  QSAR Flex backend, which makes the PubChem call server-side.
- **`d35fy2f4trk71w.cloudfront.net` is a required egress host** for both deployments
  (`next.config.ts`, `NEXT_PUBLIC_ASSETS`). It was missing from both hostname tables.
- **The compound library lives in the web view's local storage**, not in a file or a database —
  `%APPDATA%\QSARFlex\WebView2Main` (roaming) and `~/Library/WebKit/<build>/`. It survives
  uninstall, has no export, and sign-out clears it. On macOS the folder is named for the .NET
  build (`com.MultiCASE_Inc..QSARFlex_Local`), **not** the `Info.plist` bundle id — check the
  real directory before printing a literal.
- **The catalog's N-Nitrosation record count could not be reproduced** from the shipped resource
  set. Both catalogs now print an em dash, explained the way CPCA's is — the rules run on your
  structure, so there is no single reference set to count. If MultiCASE can source the old 1,238
  figure, it can go back into both.
- **`Ames Mutagencity` is a CASE Ultra module, not a QSAR Flex one.** It sat in the inherited
  GitBook catalog and in the screenshot fixture for months. In `admindb` it belongs to CASE
  Ultra's "Bacterial Mutagenicity (ICH M7)" bundle. A model file shipping in `FilterModels/`
  proves nothing — that set is a superset shared across products, and also carries
  `LHASA TD50` and `Immunogenicity_quant`, which are likewise not QSAR Flex modules.

One claim that survived review but is **false**: that not all model files ship encrypted. Every
extension in the shipped set (`.filter .json .txt .txtdb .csv`) is in `PublishData`'s
`encryptedExts`, and a `.txtdb` on disk is ciphertext. No `.sdf` or `.bin` ships.

## Known gaps, carried from 4.0

- **No model performance figures anywhere** — no sensitivity, specificity or concordance.
  The catalog says validation statistics are available from MultiCASE on request, because
  none could be found in the repositories. A regulatory reader will ask.
- **The IT guide flags two things it cannot answer**: the installer URLs (they 403 until
  the stable tag runs `build-release.yml`) and the evaluation hostname if a dedicated
  endpoint has been provisioned. Section 13 exists to hold that kind of question honestly
  rather than bluff it.
