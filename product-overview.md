# Product Overview

**QSAR Flex** is a computational platform by [MultiCASE](https://multicase.com) for chemical safety assessment and toxicological prediction. It provides high-quality (Q)SAR models, read-across modules, and analysis tools designed for regulatory, pharmaceutical, and environmental science workflows.

---

## Variants

| Variant | Description |
|---|---|
| **Web App** | Browser-based, hosted at [qsarflex.com](https://qsarflex.com). No installation required. |
| **Desktop — Local** | Windows app with a bundled SQLite database. Works fully offline. All evaluation and curation runs on-device. |
| **Desktop — Cloud** | Windows app that connects to MultiCASE's cloud database for enterprise deployments. |

---

## Key Features

### Compound Library
Load compounds from any source and manage them in a searchable library before evaluation.
- Enter individual compounds by name, CAS number, or SMILES
- Batch upload via SDF, SMILES (.smi), CSV, or TXT files
- Autofill missing names and CAS numbers from your SMILES

### DataKurator
Curate and validate your dataset before evaluation. Upload a file, run structural analysis, and export a clean, standardized compound list.
- Detects mixtures, duplicates, invalid atom types, and aromaticity issues
- Optional PubChem lookup to verify names and CAS numbers
- SMILES transform: remove chirality tags, neutralize charges
- Export curated data as SDF or SMILES

### Evaluation
Run licensed prediction modules against your library in one click.
- Select any combination of licensed modules
- Evaluate all compounds simultaneously
- Results appear in the Library table — one column per module
- One-click HTML report generation per compound per module

### Reaction Analysis
Load reaction files for structural analysis.
- Enter reaction SMILES directly
- Upload industry-standard RXN files
- Visualize multi-step reaction diagrams

---

## Downloads

### Desktop — Local (offline)

Works without internet after installation. All QSAR models run locally.

[Download QSARFlex Local Installer (.exe)](https://qsarflex-win-releases.s3.us-east-2.amazonaws.com/releases/local/QSARFlex-Local-win-Setup.exe)

[Download QSARFlex Local Portable (.zip)](https://qsarflex-win-releases.s3.us-east-2.amazonaws.com/releases/local/QSARFlex-Local-win-Portable.zip)

### Desktop — Cloud (enterprise)

Connects to MultiCASE's cloud infrastructure. Requires an active enterprise license.

[Download QSARFlex Cloud Installer (.exe)](https://qsarflex-win-releases.s3.us-east-2.amazonaws.com/releases/cloud/QSARFlex-Cloud-win-Setup.exe)

[Download QSARFlex Cloud Portable (.zip)](https://qsarflex-win-releases.s3.us-east-2.amazonaws.com/releases/cloud/QSARFlex-Cloud-win-Portable.zip)

---

## Supported Toxicological Endpoints

Endpoints available depend on your license. Common modules include:

**N-Nitrosamine / NDSRI**
- CPCA Prediction — carcinogenic potency categorization with AI limits
- Surrogate Search — find nitrosamine surrogates with animal carcinogenicity data
- Cross Similarity — structural similarity scoring across your library

**Ecotoxicity**
- Tetrahymena 48h GC50
- Soil Adsorption

**Physicochemical Properties**
- Water Solubility
- LogP

**Genotoxicity**
- Ames Mutagenicity

See the full [Model Catalog](fundamentals/model-catalog.md) for all available endpoints and coverage details.

---

## Contact

For access, licensing, or support: [support@multicase.com](mailto:support@multicase.com)
