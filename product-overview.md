# Product Overview

**QSAR Flex** is a computational platform by [MultiCASE](https://multicase.com) for chemical safety assessment and toxicological prediction. It provides high-quality (Q)SAR models, read-across modules, and analysis tools designed for regulatory, pharmaceutical, and environmental science workflows.

{% hint style="info" %}
**New in 4.0** — a rebuilt interface, a two-step DataKurator, a card-based Library with drag-and-drop, and the ⌘K command bar. See [What's New in 4.0](whats-new-4-0.md).
{% endhint %}

---

## Deployments

QSAR Flex is available in two forms. Both share the same interface — the differences are in where computation happens, how you access the platform, and two modules (Surrogate Search and Cross Similarity) that run on the desktop only.

| Deployment | Description |
|---|---|
| 🌐 **Web App** | Browser-based, hosted at [qsarflex.multicase.com](https://qsarflex.multicase.com). No installation required. Your structures go to the QSAR Flex service over HTTPS for evaluation, report generation, structure depiction and DataKurator curation. They are not persisted after the request. |
| 💻 **Desktop** | Windows and macOS app that evaluates on your machine. Your structures are not sent anywhere for evaluation. On first run it downloads its encrypted model files and a reference database (~4.0 GB). |

The desktop app ships for **Windows** (64-bit) and **macOS** (Apple Silicon, macOS 12 Monterey or later). **Neither deployment works offline.** Both need an internet connection at launch to sign in and check your license, and again at every evaluation — the module picker fetches your licensed modules before you can select one.

> Both deployments require a valid license — either **individual** or **enterprise**. See [Access & Licensing](fundamentals/access-and-licensing.md) for details.

---

## Key Features

### 🧪 Compound Library
Load compounds from any source and manage them as cards before evaluation.
- Enter a single compound by **SMILES or InChI**, with optional Name and Registry Number
- **Auto Fill** the missing name, registry number or structure from PubChem
- Batch upload SDF, MOL, SMILES (`.smi`, `.smiles`), TXT, CSV, TSV, TAB and DAT files
- **Drag and drop** files anywhere on the Library page, or **paste SMILES** with ⌘+V / Ctrl+V — compounds and reactions are sorted automatically by file type
- Compounds that fail curation on import offer **Fix in DataKurator** instead of loading quietly
- Every structure is drawn in the card and clicks through to a larger view
- The **command bar** (⌘K / Ctrl+K) finds any action by name — add, evaluate, curate, export, navigate — from any page

### ✅ DataKurator
Curate and validate your dataset before evaluation, in two steps: load, then curate. Compounds are checked as soon as they load — there is no separate run step, and no separate export step.
- Detects mixtures, duplicates, invalid atom types and aromaticity problems on load
- Flags CAS and name mismatches once you run the optional PubChem verification
- Inline editing per row — rename, edit SMILES, delete
- **Pick components** on a mixture row to split it into one row per component
- **One Step Cure** — a single dialog that applies your choices for mixtures/salts, duplicates, atom type errors and other errors in one pass, with optional extras: verify structures against PubChem, remove chiral tags, neutralize negative charges, neutralize positive charge on nitrogen
- **Undo and redo** every change, with each step named ("Undo One Step Cure")
- Export straight from the Curate screen: **Clean only** or **Everything**, as SMILES (`.smi`) or SDF (`.sdf`)
- Hand the clean compounds to the evaluation library with one button

{% hint style="info" %}
Inside DataKurator, PubChem is never contacted silently. Any lookup — single row or batch — first raises a **Send data to PubChem?** dialog naming exactly what will leave your system. Import and curation on load never touch PubChem at all.

The one place that queries PubChem immediately is the Library's **Auto Fill** button. It sends whatever you have typed as soon as you press it.
{% endhint %}

### 🔬 Evaluation
Run licensed prediction modules against your library in one click.
- Select any combination of licensed modules — unlicensed modules are shown but disabled
- Evaluate every compound and reaction in the library in a single run, cancelable while it runs — reactions are scored by the N-Nitrosation module only, and every other module reports `N/A` on a reaction row
- Results appear in the Library — one card per compound, one row per module
- One-click HTML report per compound per module, opened in a side panel with **Download HTML** and **Print / Save as PDF**

### ⚗️ Reaction Analysis
Load reaction files for structural analysis.
- Enter reaction SMILES directly
- Upload industry-standard RXN files
- Visualize multi-step reaction schemes, click-to-enlarge

---

## Downloads

### 💻 Desktop

Evaluation runs on your machine. No structure is sent anywhere to be evaluated. Auto Fill and DataKurator's PubChem verification still contact PubChem when you ask them to. On first run the app downloads its encrypted model files and reference database (~4.0 GB). The desktop app still is not usable offline: sign-in and a license check run at every launch, and every evaluation checks your entitlements before you can pick a module.

- [Download for Windows (.exe)](https://downloads.multicase.com/qsarflex/local/QSARFlex-Local-Installer.exe)
- [Download for macOS (.dmg)](https://downloads.multicase.com/qsarflex/mac/local/QSARFlex-Local-Installer.dmg)

Install steps, screenshots and first-run sign-in are covered in [Installing on Windows](install-win.md) and [Installing on macOS](install-mac.md).

---

## Supported Toxicological Endpoints

The models and endpoints are unchanged in 4.0. Which ones you can run depends on your license. Highlights:

**🔴 Nitrosamine**
- CPCA Prediction — assigns NDSRIs to an AI potency category
- N-Nitrosation — nitrosation susceptibility for single compounds and synthetic routes
- Surrogate Search — nitrosamine surrogates with animal carcinogenicity data (Desktop only)
- Cross Similarity — N×N structural similarity matrix across your library (Desktop only)

**🌿 Ecotoxicity**
- Fathead Minnow 96h LC50, Daphnia 48h LC50, Tetrahymena 48h GC50, Algae 72h EC50
- Bio Concentration Factor, Ready Biodegradability, Soil Adsorption

**💧 Physicochemical Properties**
- LogP, Water Solubility, Vapor Pressure, Boiling Point

**💊 ADME**
- Oral bioavailability — experimental database, analog-based read-across, a QSAR model and a rule-based prediction. The same report adds human liver microsomal stability, CYP3A4 / CYP2D6 / CYP2C9 substrate assessments and MDR1 (P-gp) substrate potential. These are sections of that report, not separately licensed modules.

See the full [Model Catalog](fundamentals/model-catalog.md) for all available endpoints and coverage details.

---

## Support

For access, licensing, or support, use the support portal at [support.multicase.com](https://support.multicase.com). Sign in with the same MultiCASE account you use for QSAR Flex. See [Getting Support](support.md).
