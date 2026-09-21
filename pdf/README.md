# QSAR Flex PDFs — release brochure and IT guide

**Not published.** Nothing here is listed in `SUMMARY.md`, so GitBook ignores the whole
folder. It lives in this repo because the PDFs restate what the docs say, and the two
should not drift apart.

Two documents, both A4, both built from hand-written HTML rendered by headless Chromium:

| File | Output | What it is |
|---|---|---|
| `brochure.html` | *QSAR Flex 4.0 Release Brochure.pdf* | 6pp. Sales-facing: what the product does, what is new, the model catalog, deployment and licensing. |
| `it-requirements.html` | *QSAR Flex IT Requirements.pdf* | 9pp. For a customer's IT reviewer: requirements, installation, data paths, network rules, licensing, a checklist. |
| `release-notes.html` | *QSAR Flex 4.0 Release Notes.pdf* | 4pp. For customers on 3.x. Reuses the brochure's cover system. |

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

**Any change to `.head`, `.sec` or the block spacing changes every page's budget.** An earlier
edition added ~5mm to the section head and clipped two IT-guide pages that had previously fit.
After touching shared vertical metrics in `system.css`, re-run `check.mjs` over ALL THREE
documents, not just the one you were working on.

## The design system: the MultiCASE document standard

`system.css` holds it. It exists because the previous edition looked like every other
AI-assisted document of 2026: Geist, tracked uppercase eyebrows, pill chips, numbered circles,
rounded cards on a tinted ground. Shri saw the same look on conference booths and asked for
something that could only be ours. Three decisions do that work, and every future MultiCASE
document should keep them:

1. **A typeface nobody defaults to.** Body, headings, tables and running heads are all
   **Literata** (variable, roman and italic, optical sizes on). Anything typed into a machine
   (paths, hostnames, commands, key caps) is **Fragment Mono**. Nothing else. Both are embedded
   as base64 in `fonts.css` so the render never touches the network; `tools/embed-fonts.py`
   regenerates it. Google's Literata subset carries no small caps or old-style figures, so
   labels are *italic*, never small caps or tracked capitals.
2. **The molecule is the only ornament.** Every drawing in `assets/art/` is ChemiGraphy's own,
   produced by `tools/molart` (below): a large structure on each cover, a small one in the margin
   of a section, alert atoms marked in the product's green exactly as a report marks them. No
   icons, no illustrations, no stock imagery.
3. **A publisher's page, not a web page printed out.** White paper; a 112mm text column with a
   54mm margin column for notes, figures and the section number; running head in italic with a
   hairline; tables ruled like a journal (rule above, rule under the header, rule below, hairlines
   between rows, no fills); lists with an en dash or a green numeral; notes as marginalia with a
   bold run-in. No chips, pills, cards, tinted boxes, eyebrows, icon grids, dark bands, rounded
   corners or gradients. Emphasis is italic or bold; grouping is a rule or white space.

```
--ink     #141414   text and rules            --green    #00AE5A  marked atoms only
--ink-3   #5C5C5C   the floor for type        --green-d  #04914E  section numbers, list numerals
--hair    #C8C8C8   hairlines between rows
```

Green appears in exactly three places: marked atoms in a drawing, the section number, and the
numeral of an ordered list. Do not add a fourth.

**Structure.** A page is `.head` (running head), `.sheet` and `.foot`. Inside the sheet, content is
a stack of `.blk` rows, each with a `.main` (the text column) and a `.side` (the margin column);
`.blk.full` spans both. `.blk.sec` opens a section: title in the column, `Section N` in the margin.
`.blk.push` pins a closing block to the foot. A margin figure is `.fig` with an `<img>` and a `.cap`.
Covers are `.page.cover`: `.head`, `.art` (the drawing and its caption), `.titling` (pushed to the
bottom: product line, document title, strap, lede, and whatever the document opens with), `.imprint`.

## The drawings: `tools/molart`

A small .NET console that draws SMILES through **ChemiGraphy.Embedded**, the same renderer the
product uses, so the documents carry the product's own drawing and nothing else. `art.json` lists
every figure: name, SMILES, the box it is fitted to, and optional `marks`, each a SMARTS and a
colour, matched by Indigo against the same molecule and handed to ChemiGraphy by atom index.

```bash
cd pdf/tools/molart
dotnet run -c Release -- art.json ../../assets/art "#141414"
# with a checkout of the ChemiGraphy repository to hand, build against it instead:
dotnet run -c Release -p:ChemiGraphyRepo=~/RiderProjects/ChemiGraphy -- art.json ../../assets/art "#141414"
```

The package comes from the MultiCASE GitHub Packages feed (`nuget.config` beside the project;
`PRIVATE_NUGET_GITHUB_TOKEN` in the environment). Two things the tool does to ChemiGraphy's output:
it rewrites the SVG's own `width`/`height` to the drawing's viewBox, so an `<img>` given a width
keeps the molecule's aspect ratio rather than the box's; and it replaces `#000000` with the ink
colour, leaving marks alone. Rings are Kekulé (`dearomatize`) so they read as a chemist draws them.

**The box sets the stroke.** ChemiGraphy thickens a bond only when the requested box would squeeze
it under about a pixel. Cover art is generated in a 1100×640 box and keeps the editor's own weight;
margin art is generated in a 130×80 box so the strokes are heavy enough to survive 15 to 30mm on
paper. If a small figure prints pale, the box was too large. Sizes in the HTML are set per drawing
(`style="width:…mm"`) so a strip of four molecules shares one bond length; read the viewBoxes and
scale by a common factor rather than fitting each to the same height.

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

All three covers use the shared `.cover` rules in `system.css`; only what each document opens with
(bundles, an at-a-glance grid, the applies-to row and contents) is local to the file.

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

Rules the client set, all easy to breach by accident:

- **No em dashes in prose.** They read as machine-written. The same goes for arrows in prose. Use a comma, a colon, a semicolon, a full
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
