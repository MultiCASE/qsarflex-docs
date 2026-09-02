# Screenshot register — 4.0

**Not published.** Deliberately absent from `SUMMARY.md`, so GitBook does not render it.

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
| Web UI (92 files, 46 light/dark pairs) | **Re-captured 2026-09-02** against the 4.0 UI, after the catalog correction |
| Install guides (17 files) | **Re-captured 2026-09-01** from the **beta** channel |
| Support portal (23 files, `assets/support/`) | Current; shot 2026-06-03 against the 4.0-era portal |

## Install guides — captured from beta, re-do at 4.0 stable

Captured 2026-09-01 with `CHANNEL=beta` on both platforms, because the branded **stable**
installer URLs still return HTTP 403 — the 4.0 tag has not run `build-release.yml` yet.

Consequences to be aware of, and to fix when stable exists:

- **Title bars read a beta version**, and the two platforms are not even on the same
  build: macOS shot `v3.9.0-beta.19`, Windows shot `v3.9.0-beta.32`. Both will read
  `4.0` once the stable installers are published and these are re-run without
  `CHANNEL=beta`.
- **The frames use a real MultiCASE account**, not the demo fixtures the web pass uses
  (`scripts/.env.local` → `QSARFLEX_EMAIL` / `QSARFLEX_PASS`). Its avatar photo and its
  licence chip — `∞ 4720 pending billing` — are visible in `install-mac-06-app-ready`
  and `install-win-08-app-ready`. If that should not be public, re-shoot those two with
  a demo account.

Re-run with:

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
| `seed.sql` | `Modules` had no `OwnerCompanyId`; `VisibleModulesQuery` threw `42703`, so every licensed-module lookup 500d and the navbar read *Licence unavailable* | Column added |
| `screenshot.js` | Gated DataKurator on a `Run Analysis` button 4.0 no longer shows — it analyses on load. The script warned once and returned, silently skipping all 16 DataKurator frames | Waits for the analysed action bar; clicks `Run Analysis` only if present |
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
command bar open, the licence chip in each state, the Account tab rail, the licence
activity table, and the library drop overlay mid-drag.
