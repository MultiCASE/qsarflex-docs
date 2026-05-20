# Product Overview

**QSAR Flex** is a computational platform by [MultiCASE](https://multicase.com) for chemical safety assessment and toxicological prediction. It provides high-quality (Q)SAR models, read-across modules, and analysis tools designed for regulatory, pharmaceutical, and environmental science workflows.

---

## Variants

QSAR Flex is available in three forms. All three share the same interface and feature set — the differences are in where computation happens and how you access the platform.

| Variant | Description |
|---|---|
| 🌐 **Web App** | Browser-based, hosted at [qsarflex.com](https://qsarflex.com). No installation required. Compound data is processed on MultiCASE servers over HTTPS. |
| 💻 **Desktop — Local** | Windows app with a bundled SQLite database. QSAR model inference runs entirely on your device — compound data is never sent to MultiCASE servers for evaluation. Requires internet for license verification and authentication. |
| ☁️ **Desktop — Cloud** | Windows app with on-device QSAR inference. Filter models run locally — only the reference database (used by the N-Nitrosation and Oral Bioavailability modules) is queried from MultiCASE's cloud. Requires internet for license verification, authentication, and database access. |

> All variants require a valid license — either **individual** or **enterprise**. See [Access & Licensing](fundamentals/access-and-licensing.md) for details.

---

## Key Features

### 🧪 Compound Library
Load compounds from any source and manage them in a searchable library before evaluation.
- Enter individual compounds by name, CAS number, or SMILES
- Batch upload via SDF, SMILES (`.smi`), or TXT files
- Autofill missing names and CAS numbers from PubChem

### ✅ DataKurator
Curate and validate your dataset before evaluation. Upload a file, run structural analysis, and export a clean, standardized compound list.
- Detects mixtures, duplicates, invalid atom types, and aromaticity issues
- CAS and name mismatch detection via PubChem
- Optional PubChem lookup to verify and correct structures
- SMILES transforms: remove chirality tags, neutralize charges
- Manual SMILES editing per row
- Mixture fragment picker — select individual components to split out
- One Step Cure — automated batch fix with configurable options
- Export curated data as SDF or SMILES

### 🔬 Evaluation
Run licensed prediction modules against your library in one click.
- Select any combination of licensed modules
- Evaluate all compounds simultaneously
- Results appear in the Library — one card per compound, one row per module
- One-click HTML report generation per compound per module

### ⚗️ Reaction Analysis
Load reaction files for structural analysis.
- Enter reaction SMILES directly
- Upload industry-standard RXN files
- Visualize multi-step reaction diagrams

---

## Downloads

### 💻 Desktop — Local

QSAR model inference runs on-device — compound structures are not sent to MultiCASE servers for evaluation. Requires internet for license verification, authentication, and optional PubChem lookups.

[Download QSARFlex Local Installer (.exe)](https://qsarflex-win-releases.s3.us-east-2.amazonaws.com/releases/local/QSARFlex-Local-win-Setup.exe)

### ☁️ Desktop — Cloud

Filter models are installed locally and QSAR inference runs on-device — compound data is not sent to MultiCASE servers for evaluation. The reference database (used by the N-Nitrosation and Oral Bioavailability modules) is queried from MultiCASE's cloud. Requires an active individual or enterprise license and internet connection.

[Download QSARFlex Cloud Installer (.exe)](https://qsarflex-win-releases.s3.us-east-2.amazonaws.com/releases/cloud/QSARFlex-Cloud-win-Setup.exe)

---

## Supported Toxicological Endpoints

Endpoints available depend on your license. Common modules include:

**🔴 N-Nitrosamine / NDSRI**
- CPCA Prediction — carcinogenic potency categorization with AI limits
- Surrogate Search — find nitrosamine surrogates with animal carcinogenicity data
- Cross Similarity — structural similarity scoring across your library

**🌿 Ecotoxicity**
- Tetrahymena 48h GC50
- Soil Adsorption

**💧 Physicochemical Properties**
- Water Solubility
- LogP

**🧬 Genotoxicity**
- Ames Mutagenicity

See the full [Model Catalog](fundamentals/model-catalog.md) for all available endpoints and coverage details.

---

## Contact

For access, licensing, or support: [support@multicase.com](mailto:support@multicase.com)
