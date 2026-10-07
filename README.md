# QSAR Flex

**Version 4.0**

**QSAR Flex** is a computational platform by [MultiCASE](https://multicase.com) for chemical safety assessment and toxicological prediction. It provides high-quality (Q)SAR models, read-across modules, and analysis tools — built for regulatory, pharmaceutical, and environmental science workflows.

Available as a **web application** and as a **desktop application for Windows and macOS**. Both run the same interface and need an internet connection — **none of them works offline**, the desktop app included. A license check runs at every launch, and every evaluation needs a live entitlement check before you can select a module. The desktop app keeps you signed in between launches; the browser sign-in is asked for only when the session has ended.

{% hint style="success" %}
**New in 4.0: ChemiGraphy is built in.** Draw a compound instead of typing it, or open a flagged compound and correct it on the canvas — **Load ▾ → Draw…**, or **Edit structure** on any row. The same engine that checks and evaluates your compounds reads what you draw, and ChemiGraphy draws every structure you see, on screen and in every report. See [Drawing Structures](structure-editor.md).
{% endhint %}

{% hint style="info" %}
One workspace holds the compounds and reactions you are working on. Every compound is checked as it arrives and wears its curation verdict; you fix what the check flags in place, draw or correct structures in ChemiGraphy, and run the modules from the same table. A ⌘K command bar reaches any action from anywhere, and an Account page holds your license.
{% endhint %}

---

## 🚀 What Can QSAR Flex Do?

- **🔬 Predict toxicological endpoints** — N-nitrosamine CPCA and nitrosation risk, ecotoxicity, physicochemical properties and ADME
- **➕ Load compounds** — Enter SMILES, InChI, names or registry numbers; load files (SMILES, SDF, MOL, TXT, CSV); drop files onto the workspace or paste structures straight in
- **✏️ Draw structures** — ChemiGraphy, MultiCASE's structure editor, inside the workspace: draw a new compound, or correct one the check flagged
- **✅ Curate your dataset** — Every compound is checked as it arrives; [fix what the check flags](curation.md) in place, one row at a time or the whole set with One Step Cure
- **⚗️ Evaluate reactions** — Submit reaction SMILES or RXN files for structural analysis
- **📄 Generate reports** — Detailed reports per compound per module, one click from the Results column, saved as PDF from the report itself
- **⌨️ Reach any action by name** — Press ⌘K (Ctrl+K on Windows) to open the command bar

---

## Deployments

| | 🌐 Web App | 💻 Desktop |
|---|---|---|
| **Platforms** | Any modern browser | Windows (64-bit) and macOS 12+ (Apple Silicon) |
| **Get it** | [qsarflex.multicase.com](https://qsarflex.multicase.com) | [Installing on Windows](install-win.md) · [Installing on macOS](install-mac.md) |
| **Compound loading** | ✓ | ✓ |
| **Batch upload** | ✓ | ✓ |
| **Curation** | ✓ | ✓ |
| **Structure editor (ChemiGraphy)** | ✓ | ✓ |
| **Evaluation** | ✓ | ✓ |
| **Reaction loading** | ✓ | ✓ |
| **Where evaluation runs** | MultiCASE servers | On your machine |
| **Where curation runs** | MultiCASE servers | On your machine |
| **Reference database** | MultiCASE servers | Encrypted database on your machine (~4 GB, downloaded on first launch and again whenever MultiCASE publishes new data) |
| **Internet required** | Always | Always |
| **Surrogate Search** | — | ✓ |
| **Cross Similarity** | — | ✓ |

> **Web App** does the work on MultiCASE servers. The structures you load are sent to the QSAR Flex service for evaluation, curation, report generation, the structure editor's session, and the structure drawings you see on screen. They are not retained after the request.

> **Desktop** runs the models, the curation engine and the structure editor on your machine against a local encrypted copy of the reference database — compound structures are never sent to MultiCASE servers for evaluation. The first launch downloads that database (about 4 GB), and it is downloaded again whenever MultiCASE publishes new reference data. Your license is checked every time the app starts; your sign-in is kept between launches.

{% hint style="info" %}
The desktop app is the same application as the web app, wrapped in a native shell. If you are choosing between the two, the deciding question is whether your structures may leave the workstation. See [Installing on Windows](install-win.md) or [Installing on macOS](install-mac.md).
{% endhint %}

---

## Get Started

1. 🆕 [What's New in 4.0](whats-new-4-0.md) — what changed in this release
2. 🔐 [Getting Started](getting-started.md) — log in and run your first evaluation
3. 🖥️ [The QSAR Flex Window](interface.md) — the navigation bar, the Load and Curate menus, the command bar, and the license status chip
4. 💾 [Installing on Windows](install-win.md) / [Installing on macOS](install-mac.md) — set up the desktop app
5. ➕ [Loading Compounds](product-guide/loading-compounds.md) — all ways to add compounds to the workspace
6. ✅ [Curating Compounds](curation.md) — the verdicts, the row panel and One Step Cure
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

The navigation bar also carries a **license status chip**, so you can see where your license stands without leaving the page you are on — tests remaining on a pay-per-test license, time left on a subscription, **Unlimited** on an on-demand one, or **No active license** when there is none. Hover it for the license type and the rest of the detail; click it to open the License tab. See [Access & Licensing](fundamentals/access-and-licensing.md).

---

## Support

Support runs through the MultiCASE support portal: **[support.multicase.com](https://support.multicase.com)**.

Sign in with the same MultiCASE account you use for QSAR Flex — there is no separate login — and raise a ticket for access, licensing, bundles, or anything that is not working. See [Getting Support](support.md) for a walkthrough.
