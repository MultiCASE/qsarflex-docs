# Loading Compounds

Compounds are managed in the **Library** on the main screen. Click **+ Compound** to open the compound input dialog.

![](.gitbook/assets/library-empty-light.png)

---

## Single Compound

The **Single** tab is active by default.

1. Enter a **compound name**, **CAS number**, or **SMILES** — any one field is enough to start.
2. Click **Autofill** to have QSARFlex fetch missing details (name, CAS, SMILES) from PubChem automatically.
3. Review the populated fields and the structure preview.
4. Click **Add to Library**.

![](.gitbook/assets/add-compound-light.png)

**Autofill** uses the value you typed to search PubChem. It works best with an exact compound name, CAS number, or valid SMILES string.

---

## Batch Upload

Switch to the **Batch** tab to upload a file containing multiple compounds.

![](.gitbook/assets/batch-upload-light.png)

**Supported formats:**

| Format | Extension | Notes |
|---|---|---|
| SMILES | `.smi`, `.smiles`, `.txt` | One compound per line; optional name column |
| SDF / MOL | `.sdf`, `.mol` | Standard structure-data file |
| CSV | `.csv` | Must include a SMILES column |

Drag & drop the file into the upload area or click to browse. Click **Add to Library** to import all compounds.

> If structural issues are detected during import, you can choose to **Add Anyway** or **Fix in DataKurator** to clean the data first.

---

## Library View

All compounds appear in the Library table with their name, CAS, SMILES, and any evaluation results.

![](.gitbook/assets/library-compounds-light.png)

- Click the **eye icon** on any row to preview the 2D structure.
- Click **Delete** (trash icon) to remove a compound.
- Use the **Clear Library** button to remove all entries.

---

## Next Steps

- [DataKurator](../datakurator.md) — validate and clean your compounds before evaluation
- [Evaluation](../evaluation.md) — run prediction modules on your library
