# Access & Licensing

Access to QSAR Flex is controlled by a license issued through the MultiCASE platform. Licenses define who can use the software, how many evaluations can be run, and for how long.

---

## License coverage

### Individual

The license is assigned to a single named user. Only that user can sign in and run evaluations.

### Enterprise

The license is assigned to a company and covers a configured number of seats. An administrator manages who fills those seats — inviting users, adjusting roles, and revoking access at any time.

> See [Enterprise User Management](../license-management/enterprise-user-management.md) for details on managing seats and users.

---

## Billing models

### Subscription

Access is granted for a fixed time period. The number of evaluations is unlimited within that window — run as many as you need.

### Pay-per-test

The license has a fixed total test count with no expiry date. Each evaluation consumes tests based on what you run. Remaining tests are shown on the License page.

> **1 test = 1 compound × 1 module.** Evaluating 10 compounds with 3 modules selected consumes 30 tests.

### On-Demand

A subscription with no fixed end date. Evaluations are tracked and billed periodically. Pending usage counts are visible on the License page.

---

## Your license page

Navigate to **Profile → License** to view your current license details. What you see depends on your license type — the sections below show each variant and explain what to look for.

### Individual licenses

Individual licenses are tied to your account. Only you can sign in and run evaluations under this license.

#### Subscription

<figure><picture><source srcset="../.gitbook/assets/profile-license-individual-subscription-dark.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/profile-license-individual-subscription-light.png" alt="Individual subscription license"></picture></figure>

Your license card shows a **Valid from** and **Valid to** date. As long as today's date falls within that window and the status reads **Active**, you have full access to run evaluations with no cap on how many you can run. When the subscription window expires, the status changes to **Expired** and access is suspended until the license is renewed.

#### Pay-per-test

<figure><picture><source srcset="../.gitbook/assets/profile-license-individual-paypertest-dark.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/profile-license-individual-paypertest-light.png" alt="Individual pay-per-test license"></picture></figure>

Your license card shows **Remaining tests** out of the total you purchased. There is no expiry date — the tests stay in your account until used. Keep an eye on your remaining count; when it reaches zero, evaluations are blocked until you purchase additional tests.

> **1 test = 1 compound × 1 module.** Evaluating 10 compounds with 3 modules selected consumes 30 tests.

#### On-Demand

<figure><picture><source srcset="../.gitbook/assets/profile-license-individual-ondemand-dark.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/profile-license-individual-ondemand-light.png" alt="Individual on-demand license"></picture></figure>

Your license has no fixed end date and no test cap — you can run evaluations at any time. Usage is tracked continuously and billed at the end of each billing cycle. The license page shows how many tests have been run since the last billing date. Contact [info@multicase.com](mailto:info@multicase.com) if you have questions about your current billing period.

---

### Enterprise licenses

Enterprise licenses work the same way as individual licenses in terms of billing — the same three models apply. The key difference is that the license belongs to your company, not a single user. A seat count controls how many users can be active at once, and a company administrator manages who those users are.

The license page for enterprise users shows all the same billing details, plus an **Assigned users** table listing everyone currently holding a seat.

#### Subscription

<figure><picture><source srcset="../.gitbook/assets/profile-license-enterprise-subscription-dark.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/profile-license-enterprise-subscription-light.png" alt="Enterprise subscription license"></picture></figure>

The subscription window (Valid from / to) applies to all users on the license simultaneously. When the subscription expires, everyone loses access at the same time — the administrator should arrange renewal before the end date to avoid interruption.

#### Pay-per-test

<figure><picture><source srcset="../.gitbook/assets/profile-license-enterprise-paypertest-dark.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/profile-license-enterprise-paypertest-light.png" alt="Enterprise pay-per-test license"></picture></figure>

The test bank is shared across all assigned users. Every evaluation run by any user on the license draws from the same pool of remaining tests. Administrators can see the running total on the license page and should monitor usage across the team.

#### On-Demand

<figure><picture><source srcset="../.gitbook/assets/profile-license-enterprise-ondemand-dark.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/profile-license-enterprise-ondemand-light.png" alt="Enterprise on-demand license"></picture></figure>

Usage is tracked across all assigned users and billed collectively at the end of each billing cycle. The license page shows the combined pending usage for the whole team since the last billing date.

> For managing users, inviting new team members, and adjusting seat assignments, see [Enterprise User Management](../license-management/enterprise-user-management.md).

---

## Activating a license

When MultiCASE assigns a license to your account, it appears on the Profile → License page with an **Inactive** status and an **Activate** button. You activate it yourself — no license key needed.

1. Go to **Profile → License**
2. Find the inactive license and click **Activate**
3. Confirm in the dialog

<figure><picture><source srcset="../.gitbook/assets/license-activate-dark.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/license-activate-light.png" alt="License activation confirmation dialog"></picture></figure>

The license status changes to **Active** immediately and you can start running evaluations.

> If you don't see any license listed, your account hasn't been provisioned yet. Contact [info@multicase.com](mailto:info@multicase.com) to get one.

---

## Module bundles

Modules are sold in bundles — purchasing a bundle unlocks all endpoints within it. Available bundles:

| Bundle | Includes |
|---|---|
| 🔴 **Nitrosamine** | N-Nitrosation, CPCA Prediction, Surrogate Search, Cross Similarity |
| 🌿 **Ecotoxicity** | Bio Concentration Factor, Daphnia 48h LC50, Algae 72h EC50, Fathead Minnow 96h LC50, Ready Biodegradability, Tetrahymena 48h GC50, Soil Adsorption |
| 💧 **Physicochemical** | Boiling Point, Vapor Pressure, LogP, Water Solubility |
| 🧬 **Genotoxicity** | Ames Mutagenicity |
| 💊 **ADME** | Oral Bioavailability |

See the full [Model Catalog](model-catalog.md) for detailed descriptions of each endpoint.

---

## Desktop application downloads

The Windows desktop application is available to all licensed users.

**QSARFlex Local** — QSAR model inference runs on-device. Compound structures are never sent to MultiCASE servers for evaluation. Requires internet for license verification and authentication.

[⬇️ Download QSARFlex Local for Windows](https://downloads.multicase.com/qsarflex/local/QSARFlex-Local-Installer.exe)

**QSARFlex Cloud** — Inference runs on-device; the reference database (N-Nitrosation and Oral Bioavailability modules) is queried from MultiCASE's cloud. Requires an active license and internet connection throughout use.

[⬇️ Download QSARFlex Cloud for Windows](https://downloads.multicase.com/qsarflex/cloud/QSARFlex-Cloud-Installer.exe)

The installer does not require administrator rights. After installation the application updates automatically in the background when new versions are released.

---

> 📬 **Need a license?** Contact [info@multicase.com](mailto:info@multicase.com).
