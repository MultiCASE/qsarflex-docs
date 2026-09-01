# Stale screenshots — 4.0 re-capture register

**Not published.** This file is deliberately absent from `SUMMARY.md`, so GitBook does not render it.

The 4.0 documentation text was rewritten against the new UI on **2026-09-01**. The screenshots were
**not** re-captured in that pass. Everything below still shows the pre-4.0 interface and needs a
capture run before the space can be considered finished.

## Before you run anything

Three things will bite you, in this order:

1. **`screenshot.js` deletes every top-level PNG in `.gitbook/assets` before it starts.** The macOS and
   Windows install captures live in that same flat directory, so a web capture run destroys all 17 of
   them. Run the web pass **first**, then `capture-mac-install.sh` and `capture-win.sh`. The
   `assets/support/` subfolder survives — only top-level `*.png` are unlinked.
2. **`screenshot.js` targets controls the 4.0 UI no longer has**, and most of its failures are swallowed
   by `try`/`catch`, so a run can report success while producing stale or missing frames. Fix the
   selectors listed under *Script repairs needed* before trusting a run.
3. **`capture-reactions.js` and `capture-reaction-library.js` write to `../images`**, a directory that no
   longer exists (assets moved to `.gitbook/assets` in commit `144d55a`). They also sign in as a real
   named user rather than the demo fixtures, and depend on five Lisinopril `.RXN` files under
   `~/Downloads` that are not vendored into the repo.

## Script repairs needed before re-capturing

| Script | Problem | Fix |
|---|---|---|
| `screenshot.js` | Clicks a button matching `/proceed\|next\|export/i` to reach a DataKurator export screen | That screen no longer exists — export is a `Download` dropdown on the Curate screen |
| `screenshot.js` | Waits on `button:has-text("PubChem Batch Correct")` | No such button — PubChem is a checkbox inside the One Step Cure dialog |
| `screenshot.js` | Places library-empty callouts on the `Compounds` / `Reaction` toolbar buttons | The toolbar is hidden while the library is empty; the empty-state card carries `Add Compounds` / `Add Reaction` |
| `screenshot.js` | Hardcodes five absolute `.RXN` paths under `~/Downloads` | Vendor the files into `scripts/samples/` alongside `dk_demo.smi` and `test_compounds.smi` |
| `screenshot.js` | Stamped `Run evaluation  ⌘K` on the Evaluate button for `library-compounds-{light,dark}` | Wrong shortcut — ⌘K/Ctrl+K opens the command bar, and the button's tooltip is just `Run evaluation`. Label corrected in the script; the shipped PNGs still show the old badge until re-captured |
| `capture-reactions.js`, `capture-reaction-library.js` | `OUT = ../images` | Point at `../.gitbook/assets` |
| `capture-reactions.js`, `capture-reaction-library.js` | Sign in as a real named user | Use the seeded demo fixtures like `screenshot.js` does |

## 1. Web UI — all stale (90 files, 45 light/dark pairs)

Every top-level PNG produced by `screenshot.js` was captured on 2026-07-27, against the pre-redesign
frontend. All of it needs re-shooting.

- **Sign-in:** `signin`
- **Library:** `library-empty`, `library-compounds`, `library-with-results`, `library-with-reaction`
- **Add compounds:** `add-compound`, `add-compound-autofill`, `batch-upload`, `batch-upload-with-file`
- **Reactions:** `reactions-smiles-tab`, `reactions-smiles-result`, `reactions-files-tab`,
  `reactions-rxn-uploaded`, `reactions-rxn-visualized`
- **Evaluation:** `evaluate-dialog`, `eval-results`, `eval-report`
- **DataKurator (16 pairs):** `datakurator-upload`, `-file-selected`, `-results`, `-structure-hover`,
  `-structure-viewer`, `-row-menu`, `-fragment-picker`, `-fragments-selected`, `-after-split`,
  `-edit-smiles`, `-osc-dialog`, `-osc-summary`, `-pubchem-warning`, `-pubchem-results`, `-export`
- **Account and licensing:** `profile`, `profile-license`, `profile-license-assign-users`,
  `profile-invite-user`, `profile-users`, `profile-users-invite-dialog`, `license-activate`, and the six
  `profile-license-{individual,enterprise}-{subscription,paypertest,ondemand}` pairs

### Photographs flows that no longer exist — delete rather than re-shoot

- `datakurator-export-*` — there is no third export step in 4.0
- `datakurator-pubchem-warning-*`, `datakurator-pubchem-results-*` — re-shoot from inside the One Step
  Cure dialog instead of from the removed standalone button

### Not yet captured at all — new 4.0 surfaces with no screenshots

`whats-new-4-0.md`, `interface.md` and `license-management/license-activity.md` were written without
figures. Worth capturing when the rest is re-shot:

- The navbar, whole-width: segmented Library / DataKurator control, command bar, licence status chip
- The command bar open, showing the four command groups
- The licence status chip in each state: remaining tests, `Unlimited`, `Expired`, no active licence
- The Account page tab rail (Profile / Security / License / Team)
- The licence activity table with rows
- The library drop overlay mid-drag
- Undo/redo tooltips naming a step, e.g. `Undo One Step Cure`

## 2. Install guides — partially stale (6 of 17 files)

Re-capture — these show the app's own UI:

`install-mac-03-signin`, `install-mac-05-data-download`, `install-mac-06-app-ready`,
`install-win-05-signin`, `install-win-07-data-download`, `install-win-08-app-ready`

Re-check — these show the web app's `/auth/desktop-return` page, which lives in the redesigned frontend:

`install-mac-04-desktop-return`, `install-win-06-desktop-return`

Still valid — OS and installer chrome, unaffected by the 4.0 UI:

`install-mac-01-dmg-window`, `install-mac-02-gatekeeper`, `install-win-01-welcome`,
`install-win-02-installing`, `install-win-04-complete`, and the four Cognito browser frames
(`install-mac-04-login-form`, `install-mac-04-password`, `install-win-06-login-form`,
`install-win-06-password`)

## 3. Support portal — probably fine (23 files)

`.gitbook/assets/support/` was captured on 2026-06-03 against the support portal itself, which is
4.0-era. It does not need re-shooting for the product redesign. Note there is **no capture script** for
this set — it was taken by hand, so any refresh has no automation behind it.

One known gap: `support/support-tickets-empty-dark.png` was referenced but never existed (only the
`-light` variant is present). `support/support-ticket-status-{dark,light}.png` sit unused in the folder.
