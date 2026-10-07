# Screenshot register — 4.0

**Not published.** Deliberately absent from `SUMMARY.md`, so GitBook does not render it.

## 2026-10-07 — re-shot for the two review rounds (9/28 and 10/6)

The workspace scene follows the interface as it ships in the current beta: the empty card's
**Load from a file / Enter a compound / Draw / Load a reaction**, the **Load ▾** menu (was Add) with
**Clear workspace…** at its foot, the page heading with the undo / redo / **Clear** pack, the Element
Vault's **Periodic table…** popover in the editor (new frame `editor-periodic-table-*`), the **Results**
column listing each row's modules as report links, the panel's green **Evaluation results** block with
its "Click 📄 to view detailed reports" hint, and the report sheet with **Save as PDF** only.

Frame changes: `workspace-add-menu-*` → `workspace-load-menu-*`; `workspace-not-checked-*` is now taken
after the PubChem correction (a SMILES edit is checked at once, so it no longer produces that state) and
the edited row's frame is the new `workspace-after-edit-*`; `editor-periodic-table-*` is new. The results
frame scrolls to the top first so the heading and the Clear pack are in it. 66 workspace frames (33 pairs).

Known blemish, not a docs problem: at the 1440 px viewport the table is 64 px wider than its container
once the Results column appears (column sizes sum to 1294 px), so `workspace-results-*` shows a sliver
of table past the sticky chip row. Re-shoot that pair when the column widths change.

## 2026-09-17 — install guides: the "app ready" frames are the web frame now

`install-mac-06-app-ready.png` and `install-win-08-app-ready.png` were deleted. Both install guides
end on the `workspace-empty-light/dark.png` pair instead, which is the same interface (the desktop
hosts the same front end) without the native title bar. That removes the last two published frames
that carried a pre-release version string and a real account's avatar and licence chip. The other
15 install frames are installer chrome and browser sign-in pages and are unchanged.
`capture-mac-install.sh` still writes `06-app-ready`; nothing publishes it.

## 2026-09-16 — re-shot for the single workspace and ChemiGraphy

The Library and DataKurator frames are gone with the screens they showed. `screenshot.js` now has one
`screenshotWorkspace` scene that walks the merged workspace end to end: empty state, the Add / Curate /
Download menus and the command bar, Type a compound with Auto Fill, ChemiGraphy on an empty canvas and
on an existing compound, the loaded table, the row panel, the structure viewer, Edit SMILES and the
Not-checked state, tautomers, the mixture picker and the split, the PubChem consent and result, One Step
Cure and its summary, reactions typed and from .rxn files, the module dialog, results, the panel's
Evaluation section and a report. 62 workspace frames (31 pairs) plus the licence and profile sets.

Two things the harness needed: the workspace persists in IndexedDB, so `clearLibrary` deletes the
origin's databases; and the environment is started with `HOLD=1 ./scripts/start.sh` (added this day) so
scenes can be re-run with `ONLY=workspace node screenshot.js` without rebuilding the containers.

The user-manager container (arm64 publish) died with SIGILL once mid-run; every frame after that showed
**License unavailable** in the chip. `docker start` brought it back. Check the chip on the first frame
before trusting a run.

## 2026-09-02 — re-shot for the catalog correction

All 92 web frames re-captured. The fixture had been seeding an **Ames Mutagencity** result and a
**Genotoxicity** bundle into the demo library; neither is a QSAR Flex module. Ames belongs to CASE
Ultra's "Bacterial Mutagenicity (ICH M7)" bundle — confirmed against the production `admindb`, where
QSAR Flex has exactly 16 modules in 4 bundles. `seed.sql` and the `PRECOMPUTED_RESULTS` block in
`screenshot.js` were corrected (Ames → Boiling Point) before re-shooting.

Frames that had visibly shown it: `evaluate-dialog-*` (a Genotoxicity group in the module picker),
`library-with-results-*`, `eval-results-*`, `eval-report-*`, `library-with-reaction-*`.

**Running the harness on this Mac.** `docker compose up --build` cannot compile .NET here — the
stock SDK image dies with `csc.dll exited with code 132` (SIGILL) on arm64. Publish on the host and
mount the output instead; `compose.override.yaml` (local, git-ignored) documents the exact commands.
qsarflex-be must be `linux-x64` under `platform: linux/amd64` because QSARFlex.Core carries linux-x64
native libraries. Pull the amd64 runtime image under its **own tag** — Docker otherwise keeps
resolving the arm64 image already sitting on `mcr.microsoft.com/dotnet/aspnet:9.0`.


## Status

| Set | State |
|---|---|
| Web UI (workspace, licence, profile; light/dark pairs) | Workspace set **re-captured 2026-10-07** for the review rounds; licence and profile sets from 2026-09-16 |
| Install guides (15 files) | Captured 2026-09-01; installer and sign-in screens only, no version strings. The two "app ready" frames were replaced by the web `workspace-empty` pair on 2026-09-17 |
| Support portal (23 files, `assets/support/`) | Current; shot 2026-06-03 against the 4.0-era portal |

## The beta channel is closed — never name it in customer-facing text

The pre-release channel is not offered to the public, so **no published page or PDF may mention a
beta or a release channel**. The IT guide's "Release channels" note was removed on 2026-09-02; both
PDFs and every published page now contain zero references. When editing, check text only — the
capture scripts here still take `CHANNEL=beta` and that is fine, because `scripts/` is absent from
`SUMMARY.md` and never publishes.

No published frame shows a version string any more. The two that did (`install-*-app-ready`) were
replaced on 2026-09-17 by the web `workspace-empty` pair. The remaining 15 install frames are installer
chrome or browser sign-in pages.

## Re-doing the install captures

Captured 2026-09-01 with `CHANNEL=beta` on both platforms, because the branded **stable**
installer URLs still returned HTTP 403 at the time. The installer and sign-in frames carry no
version string and no account details, so there is no pressing reason to re-shoot them. If the
installers themselves change, re-run with:

    ./scripts/capture-mac-install.sh          # stable, once the DMG is live
    ./scripts/capture-win.sh                  # stable, once the EXE is live

Both do a **full clean-slate uninstall and reinstall**, and the desktop build then
re-downloads its ~4.0 GB reference database. Budget the time and the bandwidth.

## Hazards, still true

1. ~~**`screenshot.js` deletes every top-level PNG in `.gitbook/assets` before it starts.**~~
   **Fixed 2026-09-02.** The cleanup now skips `install-win-*` / `install-mac-*` (see the
   `KEEP` regex in `screenshot.js`). It had already destroyed all 17 install frames once,
   silently, on a routine web re-run — both published install guides were left pointing at
   missing images and only a review caught it. `assets/support/` was never affected because
   it is a subdirectory. Re-running the web pass is now safe in any order.
2. Failures are swallowed by `try`/`catch`, so a run can report success while producing
   nothing. Always check the frame count and read the log.

## Fixed on 2026-09-01

| Where | Problem | Fix |
|---|---|---|
| `seed.sql` | `Modules` had no `OwnerCompanyId`; `VisibleModulesQuery` threw `42703`, so every licensed-module lookup 500d and the navbar read *License unavailable* | Column added |
| `screenshot.js` | Gated DataKurator on a `Run Analysis` button 4.0 no longer shows — it analyzes on load. The script warned once and returned, silently skipping all 16 DataKurator frames | Waits for the analyzed action bar; clicks `Run Analysis` only if present |
| `screenshot.js` | Waited on `PubChem Batch Correct`, a button that no longer exists | PubChem captured where it lives now: the checkbox inside One Step Cure, then the *Send data to PubChem?* consent dialog |
| `screenshot.js` | Clicked `/proceed\|next\|export/i` to reach a third Export screen that was removed | Captures the `Download` menu on the Curate screen |
| `screenshot.js` | Library-empty callouts pointed at a toolbar that is hidden while the library is empty | Empty-state card is shot directly |
| `screenshot.js` | Callout badges landed on top of the controls and copy they pointed at | `DRAW_MARKERS = false` — clean screenshots; the prose names every control |
| `screenshot.js` | `Run evaluation  ⌘K` badge on the Evaluate button — ⌘K opens the command bar | Label corrected (now moot with markers off) |

## Still unfixed

`capture-reactions.js` and `capture-reaction-library.js` write to `../images`, which no
longer exists; they sign in as a real named user rather than the demo fixtures, and depend
on five Lisinopril `.RXN` files under `~/Downloads` that are not vendored into the repo.
`screenshot.js` hardcodes the same five absolute paths. Vendor them into
`scripts/samples/` before relying on either script.

## Not captured at all

`whats-new-4-0.md`, `interface.md` and `license-management/license-activity.md` were
written without figures. Worth shooting when convenient: the navbar full-width, the
command bar open, the license chip in each state, the Account tab rail, the license
activity table, and the library drop overlay mid-drag.
