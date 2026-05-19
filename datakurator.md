# DataKurator

DataKurator is a built-in curation tool that validates and standardizes your compound dataset before running predictions. It detects structural problems, verifies identifiers against PubChem, and lets you clean SMILES in bulk — all before evaluation.

---

## Workflow

DataKurator is a three-step process: **Upload → Curate → Export**.

![](.gitbook/assets/datakurator-upload-light.png)

---

## Step 1 — Upload

Navigate to **DataKurator** from the left navigation bar.

Drag & drop or click to select your compound file. Supported formats:
- SMILES (`.smi`, `.smiles`, `.txt`)
- SDF (`.sdf`)
- CSV (`.csv`)

You can upload multiple files — compounds will be merged into one list.

Click **Run Analysis** to parse the file and run structural analysis. QSARFlex checks each compound for common issues without contacting any external service at this stage.

![](.gitbook/assets/datakurator-file-selected-light.png)

---

## Step 2 — Curate

After upload, results appear in a table with one row per compound.

![](.gitbook/assets/datakurator-results-light.png)

**Error types detected:**

| Error | Meaning |
|---|---|
| **None** | Compound passed all checks |
| **Mixture** | SMILES contains multiple components (dot notation) |
| **Duplicate** | Same structure found more than once in the dataset |
| **Atom Type** | Contains unsupported or unusual atom types |
| **Aromaticity** | Aromaticity perception failed |
| **CAS Mismatch** | CAS number does not match the SMILES structure |
| **Name Mismatch** | Compound name does not match the SMILES structure |
| **Fatal** | Structure could not be parsed at all |

### PubChem Lookup

Click **PubChem Lookup** to verify names and CAS numbers against [PubChem's REST API](https://pubchem.ncbi.nlm.nih.gov/rest/pug/). For each compound, QSARFlex fetches the canonical SMILES, preferred name, and CAS number from PubChem and flags any mismatches.

> PubChem Lookup sends compound SMILES to the PubChem REST API (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/`). Review [PubChem's terms of use](https://www.ncbi.nlm.nih.gov/home/about/policies/) before use.

### SMILES Transforms

Click **Transform SMILES** to apply bulk standardization:

- **Remove chiral tags** — strips `@` and `@@` stereocenters and cis/trans bond markers
- **Neutralize negative charges** — protonates negatively charged atoms (e.g., carboxylates)
- **Neutralize positive nitrogen** — removes formal charge on quaternary nitrogens

After applying transforms, a summary shows which compounds were changed.

### Manual Corrections

Click the **edit icon** on any row to manually correct the SMILES, name, or CAS for a single compound.

---

## Step 3 — Export

Once curation is complete, proceed to the Export step.

![](.gitbook/assets/datakurator-export-light.png)

Choose your output format:

- **SMILES file** (`.smi`) — one compound per line with name
- **SDF file** (`.sdf`) — standard structure-data format with all fields

Click **Download** to save the curated file. You can then import it directly into the Library for evaluation.
