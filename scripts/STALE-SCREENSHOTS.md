# Screenshot register — 4.0

**Not published.** Deliberately absent from `SUMMARY.md`, so GitBook does not render it.

## Status

| Set | State |
|---|---|
| Web UI (92 files, 46 light/dark pairs) | **Re-captured 2026-09-01** against the 4.0 UI |
| Install guides (17 files) | **Still 3.9.0-beta** — blocked, see below |
| Support portal (23 files, `assets/support/`) | Current; shot 2026-06-03 against the 4.0-era portal |

## Install guides — blocked, not forgotten

Six frames show the app's own pre-4.0 UI and need re-shooting:

`install-mac-03-signin`, `install-mac-05-data-download`, `install-mac-06-app-ready`,
`install-win-05-signin`, `install-win-07-data-download`, `install-win-08-app-ready`

Two more show the web app's `/auth/desktop-return` page and should be re-checked:
`install-mac-04-desktop-return`, `install-win-06-desktop-return`

The rest are OS and installer chrome and are unaffected by the 4.0 UI.

**Why they could not be re-shot on 2026-09-01:**

1. `capture-mac-install.sh` downloads the **stable** DMG, and the branded stable URLs
   still return HTTP 403 — the 4.0 tag has not run `build-release.yml` yet. The script
   supports `CHANNEL=beta`, but a beta title bar reading `v3.9.0-beta.N` is worse in a
   4.0 guide than a stale frame.
2. It also performs a full clean-slate uninstall and reinstall of QSAR Flex on the Mac
   running it — not something to do as a side effect of a docs pass.
3. The Windows set needs the Parallels VM and an interactive-logon scheduled task.

**Do them once the 4.0 stable installers are live**, and run them **after** any web pass
(see the hazard below).

## Hazards, still true

1. **`screenshot.js` deletes every top-level PNG in `.gitbook/assets` before it starts.**
   The install captures live in that same flat directory, so a web run destroys all 17.
   Run the web pass **first**, then the install captures. `assets/support/` survives.
2. Failures are swallowed by `try`/`catch`, so a run can report success while producing
   nothing. Always check the frame count and read the log.

## Fixed on 2026-09-01

| Where | Problem | Fix |
|---|---|---|
| `seed.sql` | `Modules` had no `OwnerCompanyId`; `VisibleModulesQuery` threw `42703`, so every licensed-module lookup 500d and the navbar read *Licence unavailable* | Column added |
| `screenshot.js` | Gated DataKurator on a `Run Analysis` button 4.0 no longer shows — it analyses on load. The script warned once and returned, silently skipping all 16 DataKurator frames | Waits for the analysed action bar; clicks `Run Analysis` only if present |
| `screenshot.js` | Waited on `PubChem Batch Correct`, a button that no longer exists | PubChem captured where it lives now: the checkbox inside One Step Cure, then the *Send data to PubChem?* consent dialog |
| `screenshot.js` | Clicked `/proceed|next|export/i` to reach a third Export screen that was removed | Captures the `Download` menu on the Curate screen |
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
