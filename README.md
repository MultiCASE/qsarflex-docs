# QSAR Flex

**QSAR Flex** is a computational platform by [MultiCASE](https://multicase.com) for chemical safety assessment and toxicological prediction. It provides high-quality (Q)SAR models, read-across modules, and analysis tools — built for regulatory, pharmaceutical, and environmental science workflows.

Available as a **web application** and a **Windows desktop application**. All variants require an active license (individual or enterprise) and an internet connection.

---

## 🚀 What Can QSAR Flex Do?

- **🔬 Predict toxicological endpoints** — Ames mutagenicity, N-nitrosamine CPCA, ecotoxicity, physicochemical properties, ADME, and more
- **📂 Load and curate compounds** — Enter SMILES, names, or CAS numbers; upload batch files (SDF, SMI, CSV, TXT)
- **✅ Curate your dataset** — Use [DataKurator](datakurator.md) to detect and fix structural issues before evaluation
- **⚗️ Evaluate reactions** — Submit reaction SMILES or RXN files for structural analysis
- **📄 Generate reports** — One-click detailed HTML reports per compound per module

---

## Variants

| | 🌐 Web App | 💻 Desktop — Local | ☁️ Desktop — Cloud |
|---|---|---|---|
| **Access** | [qsarflex.com](https://qsarflex.com) | Windows installer | Windows installer |
| **Compound loading** | ✓ | ✓ | ✓ |
| **Batch upload** | ✓ | ✓ | ✓ |
| **DataKurator** | ✓ | ✓ | ✓ |
| **Evaluation** | ✓ | ✓ | ✓ |
| **Reaction loading** | ✓ | ✓ | ✓ |
| **Model inference** | MultiCASE servers | On-device | MultiCASE cloud |
| **Internet required** | Always | License/auth only | Always |
| **Surrogate Search** | — | ✓ | ✓ |
| **Cross Similarity** | — | ✓ | ✓ |

> **Desktop — Local** runs QSAR model inference on-device — compound structures are never sent to MultiCASE servers for evaluation. Internet is still required for license verification and authentication.

---

## Get Started

1. 🔐 [Getting Started](getting-started.md) — log in and run your first evaluation
2. ➕ [Loading Compounds](product-guide/loading-compounds.md) — all ways to add compounds to your library
3. ✅ [DataKurator](datakurator.md) — clean and validate your dataset before evaluation
4. 🔬 [Evaluation](evaluation.md) — select modules and generate results
5. ⚗️ [Loading Reactions](loading-reactions.md) — submit reaction SMILES and RXN files
6. 📋 [Model Catalog](fundamentals/model-catalog.md) — all available endpoints by bundle
7. 👥 [License Management](license-management/enterprise-user-management.md) — manage users and seats

---

## Contact

For access, licensing, or support: [support@multicase.com](mailto:support@multicase.com)
