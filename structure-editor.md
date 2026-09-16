# Drawing Structures

✏️ QSAR Flex draws structures in **ChemiGraphy**, MultiCASE's structure editor, opened in a dialog inside the workspace. Use it to add a compound you would rather draw than type, or to correct one that is already loaded.

There are two ways in:

- **Add ▾ → Draw in ChemiGraphy…** (or **Draw in ChemiGraphy** on the empty workspace) opens an empty canvas. **Use this structure** adds what you drew as a new compound.
- **Edit structure** — in a row's ⋮ menu, or in the panel — opens the canvas on that compound. **Use this structure** replaces its SMILES.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/editor-new-dark.png">
  <img src=".gitbook/assets/editor-new-light.png" alt="">
</picture></figure>

---

## The dialog

The editor fills the dialog: the element and bond palettes on the left, the canvas in the middle, the tools on the right — select, lasso, erase, text, undo and redo, label size, bond width, zoom, clear, and the canvas theme. It is the ChemiGraphy editor, with its file menu and settings left out: a structure drawn here is handed to the workspace and nowhere else.

Two things are worth knowing before you start:

- **Escape belongs to the editor.** It cancels the bond being drawn, drops the selection, closes a popover — it does not close the dialog. Nor does clicking outside it: a drag that ends past the dialog's edge is not a request to throw the drawing away. The dialog closes on **Cancel**, the **✕**, or **Use this structure**.
- **The editor's undo is its own.** ⌘ Z inside the dialog undoes a stroke on the canvas; the workspace's history is untouched until you use the structure.

While the editor starts, the canvas reads *Starting the editor…*. The first open fetches the editor once; later opens are immediate.

---

## Editing an existing compound

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/editor-edit-dark.png">
  <img src=".gitbook/assets/editor-edit-light.png" alt="">
</picture></figure>

The canvas opens on the compound **as QSAR Flex reads it**: the engine that checks and evaluates your compounds reads the SMILES and hands the editor the atoms and bonds. What you see is the molecule QSAR Flex thinks the compound is — which is the one worth correcting.

On the way back the same engine reads the drawing and writes the SMILES, so the string that reaches the workspace is one the engine produced from atoms and bonds it read itself. That is why the SMILES may be spelled differently from what you typed — a benzene ring comes back Kekulé, `C1=CC=CC=C1` — without being a different molecule.

What happens when you press **Use this structure**:

| The drawing is | What happens |
|---|---|
| The same molecule you opened | Nothing. *The structure is unchanged.* The verdict and the evaluation results stand. |
| A different molecule | The row's SMILES is replaced; it becomes **Not checked** — *Edited — re-check to validate* — and its evaluation results, which belonged to the old structure, are cleared. The step is named *Edit structure — &lt;name&gt;* and can be undone. |
| Empty | *Nothing has been drawn yet.* The dialog stays open. |

A compound whose SMILES the engine cannot read — a row the check calls **Fatal** — opens on an empty canvas with a note: *QSAR Flex could not read this compound's SMILES, so the canvas starts empty. Draw the structure and use it to replace the SMILES.*

{% hint style="warning" %}
Stereochemistry travels through the editor only as it is drawn. A compound that arrives with chiral tags in its SMILES is drawn without wedges; if you change it and use the structure, the SMILES that comes back has no stereo marks unless you drew them with the wedge bonds. Leaving the structure as it is keeps the original SMILES, tags included.
{% endhint %}

---

## Drawing a new compound

**Use this structure** on a new drawing adds it to the workspace as a compound with no name, checked like any other — the toast reads *1 compound added from ChemiGraphy.* Name it from the panel with **Rename**, and fill in a CAS number the same way. The structure editor never contacts PubChem: a name pasted onto the canvas is not looked up.

---

## Where the editor runs

The canvas you draw on is in your browser, but the drawing itself is kept by an editing session on the same side as the chemistry:

| Deployment | Where the session lives |
|---|---|
| 🌐 **Web app** | On the QSAR Flex service. Opening the editor starts a session (`POST /sketcher/start`), each stroke is relayed to it (`/sketcher/message`), **Use this structure** asks it for the SMILES (`/sketcher/smiles`), and closing the dialog ends it (`/sketcher/end`). A session left open is discarded after 30 minutes. The structure you open on is sent with the start request; nothing is kept after the session ends. |
| 💻 **Desktop** | Inside the app, in-process. Nothing leaves the workstation. |

See [Security](security.md) for the full data-handling picture.
