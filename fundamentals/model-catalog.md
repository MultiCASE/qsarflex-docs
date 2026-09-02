# Model Catalog

The QSAR Flex model catalog lists all available prediction endpoints organized by license bundle. The module catalogue and its bundles are unchanged in 4.0 — 4.0 changed the interface, not the science. Modules are grouped into the bundles below. A licence grants either every QSAR Flex module or a named list of modules — the **License** tab on your Account page shows which. Ask at the support portal, [support.multicase.com](https://support.multicase.com), to add bundles to your account.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.gitbook/assets/evaluate-dialog-dark.png">
  <img src="../.gitbook/assets/evaluate-dialog-light.png" alt="">
</picture></figure>

{% hint style="info" %}
Where another page summarises a bundle in a single line, the tables here carry the detail. What you can actually run is set by your licence — the **Select Modules to Evaluate** dialog and the **License** tab on your Account page are the final word.
{% endhint %}

---

## 🔴 Nitrosamine Bundle

For N-nitrosamine impurity assessment (NDSRIs and related compounds). Covers ICH M7 / EMA CPCA workflows.

| Module | Records | Platform | Description |
|---|---|---|---|
| **CPCA Prediction** | — | Web + Desktop | Carcinogenic Potency Categorization Approach (CPCA) for N-nitrosamines. Finds every N-nitrosamine centre in your structure and assigns each one a potency category from its α-hydrogen count and its activating and deactivating structural features, following ICH M7 and EMA guidance. The most potent centre sets the reported acceptable intake: 18 or 26.5, 100, 400 or 1500 ng/day. A structure with no N-nitrosamine centre returns N/A. The rules run on your structure, so there is no reference set to count. |
| **Surrogate Search** | 209 | Desktop only | Analog-based read-across using nitrosamine local environment similarity measure. Finds N-nitrosamine surrogates with available animal carcinogenicity data for read-across and AI derivation. |
| **N-Nitrosation** | — | Web + Desktop | Nitrosation assessment for both individual compounds and synthetic routes. The rules run on your structure, so there is no single reference set to count. Predicts whether a compound is susceptible to nitrosation — i.e., can form an N-nitrosamine impurity under relevant pharmaceutical manufacturing conditions. |
| **Cross Similarity** | — | Desktop only | Generates a full N×N structural similarity matrix across your entire compound library using fingerprint-based comparison. Useful for grouping NDSRIs by structural class. |

---

## 🌿 Ecotoxicity Bundle

Evaluate various characteristics of adverse impact on the natural environment.

| Module | Records | Platform | Description |
|---|---|---|---|
| **Fathead Minnow 96h LC50** | 920 | Web + Desktop | Acute toxicity to *Pimephales promelas* (96 hrs. of exposure). Predicts the 96-hour lethal concentration for the standard vertebrate aquatic toxicity endpoint. |
| **Daphnia 48h LC50** | 2,124 | Web + Desktop | Acute toxicity to *Daphnia magna* (48 hrs. of exposure). Predicts the 48-hour lethal concentration for the standard freshwater invertebrate ecotoxicity test organism. |
| **Tetrahymena 48h GC50** | 1,898 | Web + Desktop | Acute toxicity to *Tetrahymena pyriformis* (48 hrs. of exposure). Predicts the 48-hour growth concentration causing 50% inhibition. |
| **Algae 72h EC50** | 1,377 | Web + Desktop | Acute toxicity to various algae (72 hrs. of exposure). Predicts the 72-hour effect concentration for algal growth inhibition — required for EU environmental classification. |
| **Bio Concentration Factor** | 563 | Web + Desktop | Ratio of concentration of contaminant in organism to surrounding water. Predicts how readily a compound accumulates in aquatic organisms relative to the ambient water concentration. |
| **Ready Biodegradability** | 1,443 | Web + Desktop | Aerobic biodegradation potential of a chemical substance within 28 days, as per OECD Test 301. |
| **Soil Adsorption** | 651 | Web + Desktop | The organic carbon-sorption coefficient (Koc). Predicts the organic carbon-normalized soil adsorption coefficient for terrestrial environmental fate modeling. |

---

## 💧 Physicochemical Bundle

Evaluate critical components of a chemical's physicochemical characteristics relevant to formulation, bioavailability, and environmental fate.

| Module | Records | Platform | Description |
|---|---|---|---|
| **LogP** | 12,645 | Web + Desktop | Octanol-water partition coefficient — a key indicator of lipophilicity, membrane permeability, and environmental partitioning. |
| **Water Solubility** | 3,800 | Web + Desktop | Water solubility at 25°C — relevant to bioavailability, formulation, and environmental fate modeling. |
| **Vapor Pressure** | 1,829 | Web + Desktop | Vapor pressure at 25°C — relevant for inhalation exposure assessments and environmental volatility. |
| **Boiling Point** | 4,890 | Web + Desktop | Boiling points of organic compounds, predicted using group contribution and QSAR approaches. |

---

## 💊 ADME Bundle

Evaluate the extent to which a chemical is systemically available following oral exposure, and assess key metabolic and transport liabilities.

| Module | Records | Platform | Description |
|---|---|---|---|
| **Oral Bioavailability** | 1,594 | Web + Desktop | Oral-exposure assessment reported four ways side by side — experimental data (database lookup), read-across from close analogs with measured bioavailability, a QSAR model prediction, and a rule-based prediction. The same report adds metabolic-stability (human liver microsome) and CYP3A4 / CYP2D6 / CYP2C9 substrate assessments, MDR1 (P-gp) substrate potential, formulation sensitivity and a BCS class. These are sections of the Oral Bioavailability report, not separately licensed modules. |

---

## 🔍 Checking Your Active Modules

After signing in, open the avatar menu in the top right and choose **Profile** to reach the **Account** page, then select the **License** tab. Under **Validity & usage**, **Modules** reads `all` when your licence covers every module, or `specific` — in which case a **Selected modules** list names the ones you hold. The licence chip in the navbar takes you to the same tab in one click.

Modules you are not licensed for are greyed out and cannot be ticked in the **Select Modules to Evaluate** dialog, which opens from the green **Evaluate** button in the Library toolbar.

Modules marked **Desktop only** above are a separate case. They are not greyed out in the web app — they are not listed at all. Run the desktop app to see them in the dialog.

If you need to add a bundle, raise a request at the support portal, [support.multicase.com](https://support.multicase.com).
