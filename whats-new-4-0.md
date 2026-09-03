# What's New in 4.0

QSAR Flex 4.0 replaces the interface. The models, the endpoints and the numbers they produce are unchanged — a compound you evaluated in 3.x returns the same result in 4.0.

Most readers are coming from the **QSAR Flex 3.x desktop for Windows**, a WinForms program with menus, toolbars and an interface of its own that never ran the web interface. 4.0 does not rearrange that interface; it replaces it. The application you install now wraps the interface QSAR Flex runs in the browser, in a native window for Windows and, for the first time, macOS. Nothing carries over visually, so read the sections below as a description of a new application rather than a list of things that moved.

| | |
|---|---|
| **Interface** | Entirely new. One navbar, a command bar, light and dark themes. |
| **Platform** | Windows and macOS. The Apple Silicon build is new in 4.0. |
| **Library** | Card-based, with drag-and-drop and paste. |
| **DataKurator** | Rebuilt in two steps, with 50 levels of named undo and bulk correction in one dialog. |
| **Licensing** | An Account page, and per-license activity you can read back. |
| **Support** | A portal at support.multicase.com, replacing email. |
| **Chemistry** | Unchanged. No data migration, no license re-issue. |

---

## QSAR Flex runs on macOS

Until 4.0 the desktop was Windows only. There is now a native **Apple Silicon** build for macOS 12 Monterey or later, signed by Apple and notarized. It installs by dragging it to Applications and needs no administrator rights.

It is the same application as the Windows one — the same interface, the same modules, the same reports — and it is covered by the license you already hold. Windows remains 64-bit.

Both builds evaluate on your own machine, as 3.x did. On first run the application downloads its encrypted model files and a reference database, about 4.0 GB. Neither the desktop nor the web app works offline: each needs an internet connection at launch to sign in and check your license, and again at every evaluation.

See [Installing on macOS](install-mac.md) and [Installing on Windows](install-win.md).

---

## One bar, and two screens

**The navbar.** A single 48-pixel bar runs across the top of the window and carries everything. There are no menus above it and no toolbars below it. Page content starts immediately underneath.

**Library and DataKurator.** On the left of the navbar, next to the logo, two tabs — **Library** and **DataKurator** — show which of the two workspaces you are in. The active tab is a raised surface against a recessed track, so it reads at a glance in both themes. Work is kept on both: moving between them does not discard what you have loaded.

**A command bar.** In the center of the navbar is a **Search** control with a **⌘K** / **Ctrl+K** key cap and the tooltip *Find any action by name*. Press the shortcut from anywhere in the app — except while you are typing in a text field — and it opens. It is the fastest way to reach a control you cannot see, and it is worth learning first if you are new to this interface.

The command bar lists 13 commands in four groups:

| Group | Commands |
|---|---|
| **Library** | Add compounds · Add a reaction · Evaluate · Clear the library |
| **DataKurator** | Clear DataKurator · Export curated structures |
| **Go to** | Library · DataKurator · Account and license |
| **QSAR Flex** | Switch to dark mode (or Switch to light mode) · Match my system appearance · User guide · Sign out |

Every command is offered from every page. Run **Export curated structures** while you are standing in the Library and QSAR Flex takes you to DataKurator and opens the **Download** menu on arrival. Commands that cannot run right now are still listed — grayed, with the reason on the row (*Nothing in the library*, *Nothing loaded*, *Already following your system*) — so you never have to guess whether a command exists. Each row also names where the control lives, for example *Library*, *Top left*, *Top right* or *Account menu*.

**A license status chip.** The right side of the navbar carries a persistent chip showing the state of your license: tests remaining for a pay-per-test license, **Unlimited** for an on-demand subscription, time left or **Expired** for a dated subscription. It turns amber when a pay-per-test license drops below 10 remaining tests. Clicking it takes you straight to your license. It also distinguishes **License unavailable** (the license service could not be reached) from **No active license** (there genuinely isn't one), so a transient outage does not look like a licensing problem.

**A Documentation button.** Next to the chip, the book icon opens this documentation space away from the page you are on — a new browser tab in the web app, your default browser on the macOS build, a separate window on the Windows build.

**Light and dark themes.** The theme control offers **Light**, **Dark** and **System**. The trigger shows the theme you are actually seeing; the menu shows the setting. You can also flip themes from the command bar.

See [The QSAR Flex Window](interface.md).

---

## The Library

The Library holds the compounds and reactions you are working on, and it is where you evaluate.

**Drag and drop, or paste.** There is no dialog to open first. Drop files anywhere on the Library page, or paste SMILES from the clipboard with **⌘+V** / **Ctrl+V**. While you drag, a full-screen overlay confirms the target: *Drop to add to your library — SMILES, SDF, MOL, TXT, CSV or RXN — compounds and reactions are sorted automatically.*

**Compounds and reactions are routed for you.** The file extension decides which importer runs. `.rxn` files become reactions; `.smi`, `.smiles`, `.txt`, `.csv`, `.tsv`, `.tab`, `.dat`, `.sdf` and `.mol` become compounds. Drop a mixed selection and both are added in one go — you do not pick an importer first. Anything else raises an explicit message rather than failing quietly. Dropped and pasted structures go through the same parser and the same curation check as the **+ Compounds** dialog, so the *Curation issues detected* prompt — **Add Anyway** or **Fix in DataKurator** — still applies. Reactions are not curated, on this route or in the **+ Reaction** dialog.

**Empty states that tell you what to do.** An empty Library shows one card: *Start with a compound or a file*, with **Add Compounds** and **Add Reaction** buttons and the line *You can also drop files here, or paste SMILES with ⌘ V.* On Windows that line reads *Ctrl + V*. The heading and toolbar appear once there is something to act on.

**One card per compound.** Each card carries its position number, name, CAS chip, copy-SMILES and delete controls, a structure thumbnail and a **Module** / **Outcome** results table. Before you evaluate, the results pane reads *Ready to evaluate — Run Evaluate to see outcomes* rather than sitting blank.

**A reaction dialog sized for the scheme.** Clicking a reaction's scheme opens it in a much larger dialog than a single molecule gets, and the scheme keeps its natural layout instead of being scaled down to fit a molecule-shaped box.

**Structures follow the theme.** Depictions are drawn by the engine in the current text color, so structures are near-black on light and white on dark, and a depiction is legible on paper and on a dark screen.

**Reports.** Click an outcome to generate the HTML report, which opens in a right-side panel with **Download HTML** and **Print / Save as PDF**. The report content comes from the same engine as 3.x.

See [Loading Compounds](product-guide/loading-compounds.md), [Loading Reactions](loading-reactions.md) and [Evaluation](evaluation.md).

---

## DataKurator

DataKurator is where you clean a set before it reaches the Library.

**Two steps.** DataKurator is Upload, then Curate. Loading a file takes you straight into Curate — there is no separate run step and no separate export screen. Compounds are analyzed as soon as they load.

**Export lives on the Curate screen.** The **Download** dropdown sits in the Curate action bar and offers two labeled sections — *Clean only* and *Everything* — each exporting SMILES (`.smi`) or SDF (`.sdf`), with the counts shown before you commit. The green primary action at the right-hand end of the same bar is **Load N into library**, which hands the clean compounds to the evaluation Library in one click.

**Real undo and redo.** Curate keeps a 50-step history, and every step is named. The buttons' tooltips say what will come back — *Undo One Step Cure*, *Undo Split into 3 components*, *Undo Edit SMILES — <name>* — and undoing confirms with *Undid: <label>.* Deletes, renames, SMILES edits, splits, PubChem lookups, re-analysis and One Step Cure are all reversible.

**One Step Cure is a single dialog.** Bulk correction is one dialog with four counted decisions — **Mixtures/Salts**, **Duplicates**, **Atom type errors** and **Other errors** — plus a **More curation steps** section of checkboxes: verify structures against PubChem, remove chiral tags, neutralize negative charges, neutralize positive charge on nitrogen. PubChem verification is an option inside this dialog, off by default.

**PubChem is opt-in and explicit.** It is skipped on the initial curation pass, and any lookup — batch or single row — asks first, in a dialog titled *Send data to PubChem?* that names exactly what will leave your machine and the endpoint it goes to.

**Change summaries.** Bulk runs do not just redraw the table. They finish in a summary dialog listing what changed and what needs attention, grouped by source, filterable by **All** / **Changed** / **Needs attention**, and opened on **Needs attention** when there is anything there.

**Long runs are legible and cancelable.** One Step Cure and library evaluation run behind a progress overlay that names the phase it is in rather than showing a percentage. File loading names its phase on the dropzone card itself — *Reading your file…*, then *Curating N compounds…* — with a **Cancel** button under it. All three can be canceled, and canceling says what was left alone (*One Step Cure canceled — nothing was changed.*).

{% hint style="info" %}
**Where curation runs.** In the web app, DataKurator sends your structures to the QSAR Flex service for curation over HTTPS; they are not persisted after the request. The desktop app curates in the application process, so structures do not leave the machine during curation. See [Security](security.md).
{% endhint %}

See [DataKurator](datakurator.md).

---

## License and account

**A full Account page.** It opens with the heading **Account** and a vertical tab rail: **Profile**, **Security**, **License**, and **Team** for company admins. The tab is in the URL, so you can link straight to a section.

**License activity and billing history.** Each license has its own activity page, reached from **View activity** on the license card. It lists every test run against that license — ID, User, License, Tests used, Modules used, Activity time, Billed, Invoice reference — so an admin can see where the tests went and what has been invoiced, which is what an invoice reconciles against. Before the first run it reads *Activity appears here after the first test*.

**The license card.** The **License** tab shows software, coverage and license type in a hero row, then **License details** (software, status, coverage, number of users, type, on-demand) and **Validity & usage** (valid period, total tests, remaining tests — shown in red at zero, modules, and the selected-module list where a license covers specific modules), plus assigned users and any expired licenses.

**Enterprise administration.** Company admins assign and remove seats and create users themselves, without involving MultiCASE. Enterprise users who are not company admins see an explicit **View only** badge on the license card, and the editing actions are hidden rather than shown-and-then-refused.

See [Access & Licensing](fundamentals/access-and-licensing.md) and [Enterprise User Management](license-management/enterprise-user-management.md).

---

## Support

Support has moved to the portal at [support.multicase.com](https://support.multicase.com). Sign in with the same MultiCASE account you use for QSAR Flex — there is no separate login — and open a ticket for anything: access, licensing, bundles, seats, bugs or questions. Replies come back in the ticket thread.

The portal is a separate website, opened in a browser. QSAR Flex has no ticket form of its own: the book icon in the navbar opens this documentation, and support is raised at the portal.

Use the portal instead of emailing support or info at multicase.com. See [Getting Support](support.md).

---

## You also have a web application

The interface in 4.0 is the one QSAR Flex runs in the browser, and your license covers it. Sign in at [qsarflex.multicase.com](https://qsarflex.multicase.com) with the same account: nothing to install and nothing to download, and it stays current on its own. It suits people who move between machines, or a colleague who needs occasional access without a deployment.

Two differences are worth knowing:

- The web app **sends your structures to MultiCASE** to be evaluated. The desktop evaluates them on your own machine and sends none.
- **Surrogate Search** and **Cross Similarity** are desktop-only, because they read across the whole reference database rather than fetching one record.

If structures may not leave your network, stay on the desktop. See [Product Overview](product-overview.md) and [Security](security.md).

---

## What has not changed

- **The models.** The same statistical models, expert alerts, read-across and rule-based methods, with the same applicability-domain and uncertainty handling.
- **The endpoints.** The module catalog and its bundles are unchanged. See the [Model Catalog](fundamentals/model-catalog.md).
- **The scientific results.** Predictions, reports and their supporting evidence are produced by the same engine. 4.0 changed the interface around it, not the chemistry.
- **The license types.** Coverage is still Individual or Enterprise; the types are still Subscription, On-Demand Subscription and Pay-Per-Test, with module and bundle entitlements and enterprise seats managed by a company admin. What changed is where you see them.
- **Sign-in and data.** Still your MultiCASE account, still the same account across QSAR Flex and the support portal. There is no data migration and no license re-issue.
