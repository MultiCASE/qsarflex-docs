# Getting Started

QSAR Flex is available as a **web application** and as a **desktop application** for Windows and macOS. All three share the same interface and the same workflow: sign in, add compounds, run **Evaluate**, open a report.

---

## 1. 🔐 Sign In

**Web:** Go to [qsarflex.multicase.com](https://qsarflex.multicase.com). The sign-in page asks you to *Use your MultiCASE account to continue* — click **Sign in with Cognito** and you are taken to MultiCASE Accounts at `auth.multicase.com` to enter your credentials.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/signin-dark.png">
  <img src=".gitbook/assets/signin-light.png" alt="">
</picture></figure>

The same MultiCASE account signs you in to QSAR Flex, to the desktop app and to the support portal.

**Desktop:** Install the app and launch it. Sign-in opens in your default browser and hands you back to the app when it finishes, so the desktop app needs a network connection at every launch.

- 💻 Windows — see [Installing on Windows](install-win.md) for the installer
- 🍎 macOS (Apple Silicon) — see [Installing on macOS](install-mac.md) for the installer

The **desktop app** runs the prediction models on your own machine, and the reference database sits there too: it downloads on first launch — an encrypted file of about 4 GB — and stays on disk. The model files download on first launch as well, and the app needs internet for sign-in and license verification.

The **desktop app** keeps the structures you evaluate on your own machine. In the **web application**, structures go to the QSAR Flex service at `qsarflex-be.multicase.com` for evaluation, report generation, structure depiction, curation and the structure editor's session. They are not persisted after the request.

Two steps reach a third party on either deployment, the desktop app included. **Auto Fill** sends the name, CAS number or SMILES you typed to PubChem at NCBI to look up the rest. One Step Cure's *Verify structures against PubChem* and a row's **PubChem** lookup send names, CAS numbers and SMILES there as well. You have to ask for both, and curation asks you to confirm before it runs. On the desktop these are the only steps that send your structures anywhere. Sign-in, the license check at launch, a usage record per evaluation and update checks still reach MultiCASE — none of them carries a structure.

{% hint style="info" %}
Don't have an account yet, or need a license? See [Access & Licensing](fundamentals/access-and-licensing.md), or raise a request at [support.multicase.com](https://support.multicase.com).
{% endhint %}

---

## 2. ➕ Add Compounds

A brand-new account opens on an empty workspace: a single card headed **Start with a compound or a file**, with four buttons — **Add from a file**, **Type a compound**, **Draw in ChemiGraphy** and **Add a reaction**. Under them is the line *You can also drop files here, or paste SMILES with ⌘ V.* — on Windows the same line reads *Ctrl + V*.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/workspace-empty-dark.png">
  <img src=".gitbook/assets/workspace-empty-light.png" alt="">
</picture></figure>

The same routes are always in the navbar's **Add ▾** menu, and **Evaluate** is the green button on the bar's right.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/workspace-add-menu-dark.png">
  <img src=".gitbook/assets/workspace-add-menu-light.png" alt="">
</picture></figure>

**Type a compound** — the dialog has three fields: *SMILES or InChI*, *Name* and *Registry Number*. Fill in whichever you know and click **Auto Fill** to look up the rest from PubChem, then **Add to workspace**.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/add-compound-dark.png">
  <img src=".gitbook/assets/add-compound-light.png" alt="">
</picture></figure>
<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/add-compound-autofill-dark.png">
  <img src=".gitbook/assets/add-compound-autofill-light.png" alt="">
</picture></figure>

**Draw it instead** — **Draw in ChemiGraphy** opens MultiCASE's structure editor on an empty canvas. Pick elements and bonds from the palettes, or type a name into **Compound Corner** and press **Go** to place a known compound; **Use this structure** adds the drawing to the workspace as a compound. See [Drawing Structures](structure-editor.md).

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/editor-new-dark.png">
  <img src=".gitbook/assets/editor-new-light.png" alt="">
</picture></figure>

**Add from a file** — pick one file or several. Supported extensions are `.smi`, `.smiles`, `.txt`, `.csv`, `.tsv`, `.tab`, `.dat`, `.sdf` and `.mol`. A `.smi` file takes one compound per line, formatted `SMILES ↹ Name(optional) ↹ Reg No(optional)`.

**Drop or paste instead** — you do not have to open a dialog at all. Drop files anywhere on the page, or paste SMILES from the clipboard. Files are sorted by extension, so compound files and `.rxn` reaction files can be dropped together and each goes to the right importer; anything unsupported is called out in a message.

Compounds appear as rows in the workspace table, each with its curation badge — **Clean**, or what the check found — beside its name, CAS and SMILES. Click a row to see its structure and everything about it in the panel on the left. Add as many as you need before evaluating.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/workspace-table-dark.png">
  <img src=".gitbook/assets/workspace-table-light.png" alt="">
</picture></figure>

{% hint style="info" %}
If the check finds something — a mixture, a duplicate, an unreadable SMILES — the toast says how many rows have issues and the row wears the verdict. Fix it from the row's panel, or run **Curate ▾ → One Step Cure** on the whole set; see [Curating Compounds](curation.md).
{% endhint %}

---

## 3. 🔬 Evaluate

Click the green **Evaluate** button on the right of the navbar. The **Select Modules to Evaluate** dialog opens, listing modules grouped by bundle. Only modules your license covers can be selected, and you must select at least one. If the check could not read some structures, the dialog names them: they will be skipped.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/evaluate-dialog-dark.png">
  <img src=".gitbook/assets/evaluate-dialog-light.png" alt="">
</picture></figure>

Tick the modules you want and click **Evaluate**. A progress overlay covers the page while the run proceeds, and you can cancel it. When it finishes, the table gains a **Results** column: **View results** on a row opens its panel on the outcomes, one per module.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/workspace-results-dark.png">
  <img src=".gitbook/assets/workspace-results-light.png" alt="">
</picture></figure>
<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/workspace-panel-results-dark.png">
  <img src=".gitbook/assets/workspace-panel-results-light.png" alt="">
</picture></figure>

Click a module's row in the panel to generate the full report for that compound and module. It opens in a panel on the right titled *&lt;module&gt; — Report*, with two icon buttons in its toolbar — a download icon (**Download HTML**) and a printer icon (**Print / Save as PDF**).

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/eval-report-dark.png">
  <img src=".gitbook/assets/eval-report-light.png" alt="">
</picture></figure>

{% hint style="info" %}
Reports are HTML. **Download HTML** saves the report as a single self-contained file; there is no direct PDF export — use **Print / Save as PDF** and choose *Save as PDF* in your browser's print dialog.
{% endhint %}

---

## Two things worth knowing early

- **⌘K / Ctrl+K opens the command bar**, not the Evaluate dialog. It finds any action by name — *Load compounds from a file*, *Evaluate*, *One Step Cure*, *Clear the workspace*, *Sign out* — from any page, and tells you where each one lives.
- **The Documentation button** in the top right of the navbar opens these docs in a new tab.

---

## What's Next

- [Loading Compounds](product-guide/loading-compounds.md) — all supported file formats and autofill details
- [Loading Reactions](loading-reactions.md) — submit reaction SMILES and RXN files
- [Curating Compounds](curation.md) — the verdicts, the row panel and One Step Cure
- [Evaluation](evaluation.md) — module selection, results, and report generation
- [License Management](license-management/enterprise-user-management.md) — manage users and license seats
- [Getting Support](support.md) — how to reach us through [support.multicase.com](https://support.multicase.com)
