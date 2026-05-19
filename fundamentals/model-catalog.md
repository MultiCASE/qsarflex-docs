# Model Catalog

The QSAR Flex model catalog lists all available prediction endpoints organized by license bundle. Modules are licensed in bundles — purchasing a bundle unlocks all endpoints within it. Contact [support@multicase.com](mailto:support@multicase.com) to add bundles to your account.

![](../.gitbook/assets/evaluate-dialog-light.png)

---

## 🔴 Nitrosamine Bundle

For N-nitrosamine impurity assessment (NDSRIs and related compounds). Covers ICH M7 / EMA CPCA workflows.

| Module | Platform | Description |
|---|---|---|
| **N-Nitrosation** | Web + Desktop | Predicts whether a compound is susceptible to nitrosation — i.e., can form an N-nitrosamine impurity under relevant pharmaceutical manufacturing conditions. |
| **CPCA Prediction** | Web + Desktop | Assigns N-nitrosamine impurities (including NDSRIs) to a carcinogenic potency category with acceptable intake (AI) limits, following ICH M7 and EMA guidance. Includes reasoning based on structural alerts and potency analogues. |
| **Surrogate Search** | Desktop only | Finds N-nitrosamine surrogates with available animal carcinogenicity data for read-across and AI derivation. Retained alongside CPCA for workflows requiring direct animal data citations. |
| **Cross Similarity** | Desktop only | Generates a full NxN structural similarity matrix across your entire compound library using fingerprint-based comparison. Useful for grouping NDSRIs by structural class. |

---

## 🌿 Ecotoxicity Bundle

Aquatic and terrestrial toxicity endpoints for environmental hazard and risk assessment.

| Module | Platform | Description |
|---|---|---|
| **Bio Concentration Factor** | Web + Desktop | Predicts the bioconcentration factor (BCF) — how readily a compound accumulates in aquatic organisms relative to water. |
| **Daphnia 48h LC50** | Web + Desktop | Predicts 48-hour lethal concentration (LC50) for *Daphnia magna* — a standard freshwater invertebrate ecotoxicity test organism. |
| **Algae 72h EC50** | Web + Desktop | Predicts 72-hour effect concentration (EC50) for algal growth inhibition — required for EU environmental classification. |
| **Fathead Minnow 96h LC50** | Web + Desktop | Predicts 96-hour LC50 for *Pimephales promelas* (fathead minnow) — a standard vertebrate aquatic toxicity endpoint. |
| **Ready Biodegradability** | Web + Desktop | Predicts whether a compound is readily biodegradable under OECD 301 test conditions. |
| **Tetrahymena 48h GC50** | Web + Desktop | Predicts 48-hour growth concentration causing 50% inhibition in *Tetrahymena pyriformis*. |
| **Soil Adsorption** | Web + Desktop | Predicts the organic carbon-normalized soil adsorption coefficient (Koc) for terrestrial environmental fate. |

---

## 💧 Physicochemical Bundle

Key physicochemical properties relevant to formulation, bioavailability, and environmental fate.

| Module | Platform | Description |
|---|---|---|
| **Boiling Point** | Web + Desktop | Predicts the normal boiling point (°C) using group contribution and QSAR approaches. |
| **Vapor Pressure** | Web + Desktop | Predicts vapor pressure (mmHg or Pa) at 25°C — relevant for inhalation exposure assessments and environmental volatility. |
| **LogP** | Web + Desktop | Predicts the octanol-water partition coefficient — a key indicator of lipophilicity, membrane permeability, and environmental partitioning. |
| **Water Solubility** | Web + Desktop | Predicts aqueous solubility (mg/mL) — relevant to bioavailability, formulation, and environmental fate modeling. |

---

## 🧬 Genotoxicity Bundle

Genotoxicity hazard endpoints required for ICH M7 and standard safety evaluation packages.

| Module | Platform | Description |
|---|---|---|
| **Ames Mutagenicity** | Web + Desktop | Predicts bacterial reverse mutation (Ames test) outcome. A primary endpoint in ICH M7 and pharmaceutical genotoxicity assessments. |

---

## 💊 ADME Bundle

Pharmacokinetic properties for drug discovery and pharmaceutical development workflows.

| Module | Platform | Description |
|---|---|---|
| **Oral Bioavailability** | Web + Desktop | Predicts the fraction of an orally administered compound that reaches systemic circulation — a key early-stage drug development filter. |

---

## 🔍 Checking Your Active Modules

After signing in, go to **Profile → License Information** to see which bundles and modules are active on your account. Modules you are not licensed for appear grayed out in the Evaluate dialog.

If you need to add a bundle, contact [support@multicase.com](mailto:support@multicase.com).
