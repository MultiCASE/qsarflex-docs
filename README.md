# QSAR Flex

**Version 4.0**

**QSAR Flex** is a computational platform by [MultiCASE](https://multicase.com) for chemical safety assessment and toxicological prediction. It provides high-quality (Q)SAR models, read-across modules, and analysis tools — built for regulatory, pharmaceutical, and environmental science workflows.

Available as a **web application** and as a **desktop application for Windows and macOS**. Both run the same interface and need an internet connection — **none of them works offline**, the desktop app included. Sign-in and a license check run at every launch, and every evaluation needs a live entitlement check before you can select a module.

{% hint style="info" %}
**New in 4.0.** The interface has been rebuilt end to end — a new navigation bar, a ⌘K command bar, a redesigned Library, a two-step DataKurator, and a full Account page for your license. The models and endpoints are unchanged. See [What's New in 4.0](whats-new-4-0.md).
{% endhint %}

---

## 🚀 What Can QSAR Flex Do?

- **🔬 Predict toxicological endpoints** — N-nitrosamine CPCA and nitrosation risk, ecotoxicity, physicochemical properties and ADME
- **📂 Load and curate compounds** — Enter SMILES, InChI, names, or registry numbers; upload batch files (SMILES, SDF, MOL, TXT, CSV); drop files onto the library or paste structures straight in
- **✅ Curate your dataset** — Use [DataKurator](datakurator.md) to detect and fix structural issues before evaluation
- **⚗️ Evaluate reactions** — Submit reaction SMILES or RXN files for structural analysis
- **📄 Generate reports** — Detailed HTML reports per compound per module, which you can download or print to PDF
- **⌨️ Reach any action by name** — Press ⌘K (Ctrl+K on Windows) to open the command bar

---

## Deployments

| | 🌐 Web App | 💻 Desktop |
|---|---|---|
| **Platforms** | Any modern browser | Windows (64-bit) and macOS 12+ (Apple Silicon) |
| **Get it** | [qsarflex.multicase.com](https://qsarflex.multicase.com) | [Installing on Windows](install-win.md) · [Installing on macOS](install-mac.md) |
| **Compound loading** | ✓ | ✓ |
| **Batch upload** | ✓ | ✓ |
| **DataKurator** | ✓ | ✓ |
| **Evaluation** | ✓ | ✓ |
| **Reaction loading** | ✓ | ✓ |
| **Where evaluation runs** | MultiCASE servers | On your machine |
| **Where curation runs** | MultiCASE servers | On your machine |
| **Reference database** | MultiCASE servers | Encrypted database on your machine (~4 GB, downloaded on first launch and again whenever MultiCASE publishes new data) |
| **Internet required** | Always | Always |
| **Surrogate Search** | — | ✓ |
| **Cross Similarity** | — | ✓ |

> **Web App** does the work on MultiCASE servers. The structures you load are sent to the QSAR Flex service for evaluation, DataKurator curation, report generation, and the structure drawings you see on screen. They are not retained after the request.

> **Desktop** runs the models and DataKurator on your machine against a local encrypted copy of the reference database — compound structures are never sent to MultiCASE servers for evaluation. The first launch downloads that database (about 4 GB), and it is downloaded again whenever MultiCASE publishes new reference data. You sign in and have your license checked every time the app starts.

{% hint style="info" %}
The desktop app is the same application as the web app, wrapped in a native shell. If you are choosing between the two, the deciding question is whether your structures may leave the workstation. See [Installing on Windows](install-win.md) or [Installing on macOS](install-mac.md).
{% endhint %}

---

## Get Started

1. 🆕 [What's New in 4.0](whats-new-4-0.md) — what changed in this release
2. 🔐 [Getting Started](getting-started.md) — log in and run your first evaluation
3. 🖥️ [The QSAR Flex Window](interface.md) — the navigation bar, the command bar, and the license status chip
4. 💾 [Installing on Windows](install-win.md) / [Installing on macOS](install-mac.md) — set up the desktop app
5. ➕ [Loading Compounds](product-guide/loading-compounds.md) — all ways to add compounds to your library
6. ✅ [DataKurator](datakurator.md) — clean and validate your dataset before evaluation
7. 🔬 [Evaluation](evaluation.md) — select modules and generate results
8. ⚗️ [Loading Reactions](loading-reactions.md) — submit reaction SMILES and RXN files
9. 📋 [Model Catalog](fundamentals/model-catalog.md) — all available endpoints by bundle
10. 🔑 [Access & Licensing](fundamentals/access-and-licensing.md) — the Account page, your license details, and usage history
11. 👥 [Enterprise User Management](license-management/enterprise-user-management.md) — manage users and seats
12. 💬 [Getting Support](support.md) — raise a ticket on the support portal

---

## Your Account and License

Everything about your account now lives in one place. Click your avatar in the top-right and choose **Profile**. The page it opens is headed **Account** and has four tabs:

- **Profile** — display name and profile photo
- **Security** — change your password
- **License** — your license details, validity, remaining tests, assigned users, and a **View activity** link to the full usage history
- **Team** — your company's users, shown to company admins only; seat assignments are on the **License** tab

The navigation bar also carries a **license status chip**, so you can see where your license stands without leaving the page you are on — tests remaining on a pay-per-test license, time left on a subscription, **Unlimited** on an on-demand one, or **No active licence** when there is none. Hover it for the license type and the rest of the detail; click it to open the License tab. See [Access & Licensing](fundamentals/access-and-licensing.md).

---

## Support

Support runs through the MultiCASE support portal: **[support.multicase.com](https://support.multicase.com)**.

Sign in with the same MultiCASE account you use for QSAR Flex — there is no separate login — and raise a ticket for access, licensing, bundles, or anything that is not working. See [Getting Support](support.md) for a walkthrough.
