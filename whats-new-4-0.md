# What's New in 4.0

QSAR Flex 4.0 is a rebuild of the interface. The models, the endpoints and the numbers they produce are unchanged — a compound you evaluated in 3.x returns the same result in 4.0. What has changed is everything around that: the shell you work in, how you get structures into the Library, how DataKurator is laid out, and where you go to see your licence.

The same interface now ships in all three places — the web app at [qsarflex.multicase.com](https://qsarflex.multicase.com), the Windows desktop app and the macOS desktop app.

{% hint style="warning" %}
**One change to know about first:** **⌘K** / **Ctrl+K** no longer opens the Evaluate dialog. It opens the new command bar. See [Behaviour changes](#behaviour-changes) below.
{% endhint %}

---

## A rebuilt interface

**One slim navbar.** The old top navigation is gone. Everything now sits in a single 48-pixel bar across the top of the window, with the page content below it.

**Library and DataKurator are a segmented control.** On the left of the navbar, next to the logo, two tabs — **Library** and **DataKurator** — show which of the two workspaces you are in. The active tab is a raised surface against a recessed track, so it reads at a glance in both themes.

**A command bar.** In the centre of the navbar is a **Search** control with a **⌘K** / **Ctrl+K** key cap and the tooltip *Find any action by name*. Press the shortcut from anywhere in the app — except while you are typing in a text field — and it opens.

The command bar lists 13 commands in four groups:

| Group | Commands |
|---|---|
| **Library** | Add compounds · Add a reaction · Evaluate · Clear the library |
| **DataKurator** | Clear DataKurator · Export curated structures |
| **Go to** | Library · DataKurator · Account and licence |
| **QSAR Flex** | Switch to dark mode (or Switch to light mode) · Match my system appearance · User guide · Sign out |

Every command is offered from every page. Run **Export curated structures** while you are standing in the Library and QSAR Flex takes you to DataKurator and opens the **Download** menu on arrival. Commands that cannot run right now are still listed — greyed, with the reason on the row (*Nothing in the library*, *Nothing loaded*, *Already following your system*) — so you never have to guess whether a command exists. Each row also names where the control lives, for example *Library*, *Top left*, *Top right* or *Account menu*.

**A licence status chip.** The right side of the navbar carries a persistent chip showing the state of your licence: tests remaining for a pay-per-test licence, **Unlimited** for an on-demand subscription, time left or **Expired** for a dated subscription. It turns amber when a pay-per-test licence drops below 10 remaining tests. Clicking it takes you straight to your licence. It also distinguishes **Licence unavailable** (the licence service could not be reached) from **No active licence** (there genuinely isn't one), so a transient outage no longer looks like a licensing problem.

**A Documentation button.** Next to the chip, the book icon opens this documentation space in a new tab.

**Light and dark themes.** The theme control offers **Light**, **Dark** and **System**. The trigger shows the theme you are actually seeing; the menu shows the setting. You can also flip themes from the command bar.

---

## A rebuilt Library

**Drag and drop, or paste.** You no longer have to open a dialog to load structures. Drop files anywhere on the Library page, or paste SMILES from the clipboard with **⌘+V** / **Ctrl+V**. While you drag, a full-screen overlay confirms the target: *Drop to add to your library — SMILES, SDF, MOL, TXT, CSV or RXN — compounds and reactions are sorted automatically.*

**Compounds and reactions are routed for you.** The file extension decides which importer runs. `.rxn` files become reactions; `.smi`, `.smiles`, `.txt`, `.csv`, `.tsv`, `.tab`, `.dat`, `.sdf` and `.mol` become compounds. Drop a mixed selection and both are added in one go — you do not pick an importer first. Anything else raises an explicit message rather than failing quietly. Dropped and pasted structures go through the same parser and the same curation check as the **+ Compounds** dialog, so the *Curation issues detected* prompt — **Add Anyway** or **Fix in DataKurator** — still applies. Reactions are not curated, on this route or in the **+ Reaction** dialog.

**New empty states.** An empty Library no longer shows an empty toolbar. It shows one card: *Start with a compound or a file*, with **Add Compounds** and **Add Reaction** buttons and the line *You can also drop files here, or paste SMILES with ⌘ V.* On Windows that line reads *Ctrl + V*. The heading and toolbar appear once there is something to act on.

**Redrawn cards.** Compound and reaction cards were rebuilt for figure-and-ground contrast in both themes, with the dead vertical padding removed. Each card carries its position number, name, CAS chip, copy-SMILES and delete controls, a structure thumbnail and a **Module** / **Outcome** results table. Before you evaluate, the results pane reads *Ready to evaluate — Run Evaluate to see outcomes* rather than sitting blank.

**A reaction dialog sized for the scheme.** Clicking a reaction's scheme opens it in a much larger dialog than a single molecule gets, and the scheme keeps its natural layout instead of being scaled down to fit a molecule-shaped box.

**Structures follow the theme.** Depictions are drawn by the engine in the current text colour, so structures are near-black on light and white on dark — no more black-on-black drawings in dark mode.

Reports are unchanged in substance: click an outcome to generate the HTML report, which opens in a right-side panel with **Download HTML** and **Print / Save as PDF**.

See [Loading Compounds](product-guide/loading-compounds.md), [Loading Reactions](loading-reactions.md) and [Evaluation](evaluation.md).

---

## A rebuilt DataKurator

**Two steps instead of three.** DataKurator was Upload → Curate → Export. It is now Upload → Curate. Loading a file takes you straight into Curate — there is no intermediate **Run Analysis** click on first load, and no third screen. Sessions that were saved on the old export step reopen on Curate.

**Export lives on the Curate screen.** The **Download** dropdown sits in the Curate action bar and offers two labelled sections — *Clean only* and *Everything* — each exporting SMILES (`.smi`) or SDF (`.sdf`), with the counts shown before you commit. The green primary action at the right-hand end of the same bar is **Load N into library**, which hands the clean compounds to the evaluation Library.

**Real undo and redo.** Curate now keeps a 50-step history, and every step is named. The buttons' tooltips say what will come back — *Undo One Step Cure*, *Undo Split into 3 components*, *Undo Edit SMILES — <name>* — and undoing confirms with *Undid: <label>.* Deletes, renames, SMILES edits, splits, PubChem lookups, re-analysis and One Step Cure are all reversible.

**One Step Cure is a single dialog.** Bulk correction is now one dialog with four counted decisions — **Mixtures/Salts**, **Duplicates**, **Atom type errors** and **Other errors** — plus a **More curation steps** section of checkboxes: verify structures against PubChem, remove chiral tags, neutralize negative charges, neutralize positive charge on nitrogen. The separate PubChem batch button is gone; PubChem verification is an option inside this dialog, off by default.

**PubChem is still opt-in and still explicit.** It is skipped on the initial curation pass, and any lookup — batch or single row — asks first, in a dialog titled *Send data to PubChem?* that names exactly what will leave your machine and the endpoint it goes to.

**Change summaries.** Bulk runs no longer just redraw the table. They finish in a summary dialog listing what changed and what needs attention, grouped by source, filterable by **All** / **Changed** / **Needs attention**, and opened on **Needs attention** when there is anything there.

**Long runs are legible and cancellable.** One Step Cure and library evaluation run behind a progress overlay that names the phase it is in rather than showing a fake percentage. File loading names its phase on the dropzone card itself — *Reading your file…*, then *Curating N compounds…* — with a **Cancel** button under it. All three can be cancelled, and cancelling says what was left alone (*One Step Cure cancelled — nothing was changed.*).

{% hint style="info" %}
**Correction to earlier documentation:** in the web app, DataKurator sends your structures to the QSAR Flex service for curation, over HTTPS; they are not persisted after the request. The desktop app curates in the application process, so structures do not leave the machine during curation. See [Security](security.md).
{% endhint %}

See [DataKurator](datakurator.md).

---

## Licence and account

**Profile is now a full Account page.** It opens with the heading **Account** and a vertical tab rail: **Profile**, **Security**, **License**, and **Team** for company admins. The tab is in the URL, so you can link straight to a section.

**Licence activity and billing history.** Each licence now has its own activity page, reached from **View activity** on the licence card. It lists every test run against that licence — ID, User, License, Tests used, Modules used, Activity time, Billed, Invoice reference — so an admin can see where the tests went and what has been invoiced. Before the first run it reads *Activity appears here after the first test*.

**More on the licence card.** The **License** tab shows software, coverage and licence type in a hero row, then **License details** (software, status, coverage, number of users, type, on-demand) and **Validity & usage** (valid period, total tests, remaining tests — shown in red at zero, modules, and the selected-module list where a licence covers specific modules), plus assigned users and any expired licences.

**A "View only" badge.** Enterprise users who are not company admins now see an explicit **View only** badge on the licence card, and the editing actions are hidden rather than shown-and-then-refused.

See [Access & Licensing](fundamentals/access-and-licensing.md) and [Enterprise User Management](license-management/enterprise-user-management.md).

---

## Support

Support has moved to the portal at [support.multicase.com](https://support.multicase.com). Sign in with the same MultiCASE account you use for QSAR Flex — there is no separate login — and open a ticket for anything: access, licensing, bundles, seats, bugs or questions. Replies come back in the ticket thread.

Use the portal instead of emailing support or info at multicase.com. See [Getting Support](support.md).

---

## Behaviour changes

**⌘K no longer opens Evaluate.** In 3.x, **⌘K** / **Ctrl+K** was the keyboard shortcut for the Evaluate dialog. In 4.0 it opens the command bar. To evaluate from the keyboard, press **⌘K**, type `evaluate`, and press Enter — the **Evaluate** command runs from any page, navigating to the Library first if you are not there. The green **Evaluate** button in the Library toolbar is unchanged.

**The Library toolbar is hidden while the Library is empty.** The **+ Compounds**, **+ Reaction**, **Evaluate** and **Clear all** controls appear once there is at least one item. Until then, use the buttons on the empty-state card.

**"PubChem Batch Correct" is gone as a button.** It is a checkbox inside the One Step Cure dialog.

**"Proceed to Export" is gone.** Export is on the Curate screen.

---

## What has not changed

- **The models.** The same statistical models, expert alerts, read-across and rule-based methods, with the same applicability-domain and uncertainty handling.
- **The endpoints.** The module catalogue and its bundles are unchanged. See the [Model Catalog](fundamentals/model-catalog.md).
- **The scientific results.** Predictions, reports and their supporting evidence are produced by the same engine. 4.0 changed the interface around it, not the chemistry.
- **The licence types.** Coverage is still Individual or Enterprise; the types are still Subscription, On-Demand Subscription and Pay-Per-Test, with module and bundle entitlements and enterprise seats managed by a company admin. What changed is where you see them.
- **Sign-in.** Still your MultiCASE account, still the same account across QSAR Flex and the support portal.
