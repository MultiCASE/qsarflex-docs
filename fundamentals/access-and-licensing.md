# Access & Licensing

Access to QSAR Flex is controlled by a license issued through the MultiCASE platform. Licenses define who can use the software, which modules they can run, how many evaluations they can run, and for how long.

The license model itself is unchanged in 4.0. What changed is where you see it. Licensing now lives on the **Account** page, a license status chip sits permanently in the navbar, and every test run against your license is recorded in an activity history you can open yourself.

---

## Where licensing lives

Everything about your license is on the Account page at `/profile`.

Three ways to get there:

- Click your avatar in the top-right of the navbar, then **Profile**.
- Click the **license status chip** in the navbar. It opens the License tab directly.
- Press **⌘K / Ctrl+K** and run **Account and license**.

The Account page is headed **Account** — "Manage your profile, security, and license settings." — with a card of tabs down the left:

| Tab | What it holds |
|---|---|
| **Profile** | Your profile photo and display name |
| **Security** | Change password (current, new, confirm) |
| **License** | Your licenses, their details, and the link to activity history |
| **Team** | Your company's users — shown to company administrators only |

The tab you are on is in the URL, so `/profile?tab=license` is a link you can bookmark or send to a colleague.

{% hint style="info" %}
The tab is called **License**. In earlier versions it was "License Information".
{% endhint %}

---

## The license status chip

The navbar carries a license chip on every screen, to the left of the Documentation button. It tells you at a glance whether you can evaluate, and it links to **Profile → License**.

| What the chip shows | What it means |
|---|---|
| A gray placeholder | Still loading. The space is reserved so the navbar does not jump. |
| **Unlimited** with an infinity icon | On-Demand subscription, nothing awaiting billing. |
| **N pending billing** | On-Demand subscription with N tests recorded but not yet invoiced. |
| **N mo left** / **Nd left** | Standard subscription. Months while more than 60 days remain, days below that. |
| **Active** | Standard subscription with no end date recorded. |
| **Expired** | The subscription end date has passed. |
| **123/500 tests** | Pay-per-test. Remaining out of total. It turns amber below 10 remaining. |
| **No active license** | No active license on this account. Evaluation needs one. |
| **License unavailable** | The license service could not be reached. Evaluation will not run until it responds. |

Hover the chip for the detail: type and status always; on a pay-per-test license, remaining tests out of the total; on a standard subscription, the end date. Below 10 remaining tests the tooltip adds a low-tests warning.

{% hint style="info" %}
**No active license** and **License unavailable** are different problems. The first means the account holds no license; the second means we could not ask. Neither is caused by anything you did.
{% endhint %}

---

## License coverage

### Individual

The license is assigned to a single named user. Only that user can sign in and run evaluations under it.

### Enterprise

The license is assigned to a company and covers a configured number of seats. A company administrator manages who fills those seats — inviting users, adjusting roles, and revoking access at any time. At least one assigned user must be a company administrator, and a user can hold only one active seat per product.

Enterprise users who are **not** administrators see the license in read-only form: a **View only** badge sits beside the status badge on the license hero, the action buttons are hidden, and a banner reads "Read-only mode: You can view license information but cannot make changes. Contact your company administrator for modifications."

> See [Enterprise User Management](../license-management/enterprise-user-management.md) for details on managing seats and users.

---

## Billing models

### Subscription

Access is granted for a fixed time period. The number of evaluations is unlimited within that window — run as many as you need. A subscription license is created inactive and has to be activated before you can evaluate.

### On-Demand

A subscription with no fixed end date. It is active as soon as it is issued and never expires. Evaluations are recorded as you run them and invoiced periodically, so usage shows as **pending billing** until the billing run picks it up.

### Pay-per-test

The license has a fixed total test count and no expiry date. It is active as soon as it is issued. Each evaluation consumes tests, and the remaining count is shown both on the License tab and on the navbar chip. When it reaches zero the web app blocks further evaluation until more tests are purchased. The desktop app does not check the remaining count before a run — the usage is still recorded against the license.

{% hint style="info" %}
**How a test is counted.** One test is one item in your library against one **bundle** — not one module. Tests = library items × the number of distinct bundles among the modules you selected. Evaluating 10 compounds against three modules that all belong to the Ecotoxicity bundle consumes 10 tests. Evaluating the same 10 compounds against one Ecotoxicity module and one Physicochemical module consumes 20.
{% endhint %}

---

## Your license page

Go to **Profile → License**. Licenses are grouped under **Active**, **Inactive** and **Expired**; the Inactive and Expired groups appear only when you have licenses in them. Expired licenses are listed in a compact table rather than as full cards.

Every license card is built the same way.

**The hero** carries the product name, the status badge (Active, Inactive or Expired), the **View only** badge where it applies, and a line reading *product · coverage · type*. On the right sit the actions: **View activity**, and **Activate** on an inactive subscription.

**License details** shows:

| Field | Notes |
|---|---|
| Software | The licensed product |
| Status | Active, Inactive or Expired |
| Coverage | Individual or Enterprise |
| Number of users | The seat count. Enterprise licenses only. |
| Type | Subscription, On demand, or Pay-per-test |
| On-Demand | Subscription licenses only — either **On-Demand · Never expires** or **Standard Subscription** |

**Validity & usage** shows the fields that apply to your type:

| Field | Shown for |
|---|---|
| Valid from / Valid to | Standard subscription |
| Valid period — *Never expires* | On-Demand and pay-per-test |
| Total tests | Pay-per-test |
| Remaining tests | Pay-per-test. Turns red at zero. |
| Pending billing | On-Demand, when tests are awaiting invoicing |
| Modules | **all** or **specific** |
| Selected modules | The named modules, listed as chips, when Modules is *specific* |

**Assigned users** lists everyone holding a seat, with columns ID, Email, Company admin and a row menu offering **Edit**. Company administrators also get **Update users** (opens *Edit assigned users*) and **Invite user** (opens *Invite a new user*). On an individual license the table simply shows you.

{% hint style="info" %}
If the Pending billing figure could not be fetched it says "Couldn't be loaded" rather than showing zero. A billing number is never guessed.
{% endhint %}

### Individual licenses

Individual licenses are tied to your account. Only you can sign in and run evaluations under this license.

#### Subscription

<figure><picture><source media="(prefers-color-scheme: dark)" srcset="../.gitbook/assets/profile-license-individual-subscription-dark.png"><img src="../.gitbook/assets/profile-license-individual-subscription-light.png" alt="Individual subscription license"></picture></figure>

Validity & usage shows a **Valid from** and **Valid to** date. As long as today falls inside that window and the status reads **Active**, you have full access with no cap on how many evaluations you run. When the window closes the status becomes **Expired**, the navbar chip reads *Expired*, and access is suspended until the license is renewed.

#### Pay-per-test

<figure><picture><source media="(prefers-color-scheme: dark)" srcset="../.gitbook/assets/profile-license-individual-paypertest-dark.png"><img src="../.gitbook/assets/profile-license-individual-paypertest-light.png" alt="Individual pay-per-test license"></picture></figure>

Validity & usage shows **Total tests** and **Remaining tests** against a **Valid period** of *Never expires*. The tests stay in your account until used. Watch the navbar chip — it turns amber below 10 remaining. At zero, Remaining tests turns red and the web app blocks further evaluation until you purchase more.

#### On-Demand

<figure><picture><source media="(prefers-color-scheme: dark)" srcset="../.gitbook/assets/profile-license-individual-ondemand-dark.png"><img src="../.gitbook/assets/profile-license-individual-ondemand-light.png" alt="Individual on-demand license"></picture></figure>

The license never expires and has no test cap, so Validity & usage shows **Valid period — Never expires** and, when there is anything outstanding, **Pending billing**. Everything you run is recorded and invoiced later. Open **View activity** to see exactly which runs are still pending. Ask about a billing period through the support portal at [support.multicase.com](https://support.multicase.com).

---

### Enterprise licenses

Enterprise licenses bill exactly like individual ones — the same three models apply. The difference is that the license belongs to your company. A seat count controls how many users can be active at once, an administrator manages who those users are, and **Assigned users** lists them.

#### Subscription

<figure><picture><source media="(prefers-color-scheme: dark)" srcset="../.gitbook/assets/profile-license-enterprise-subscription-dark.png"><img src="../.gitbook/assets/profile-license-enterprise-subscription-light.png" alt="Enterprise subscription license"></picture></figure>

The **Valid from** / **Valid to** window applies to everyone on the license at once. When it closes, everyone loses access together, so arrange renewal before the end date.

#### Pay-per-test

<figure><picture><source media="(prefers-color-scheme: dark)" srcset="../.gitbook/assets/profile-license-enterprise-paypertest-dark.png"><img src="../.gitbook/assets/profile-license-enterprise-paypertest-light.png" alt="Enterprise pay-per-test license"></picture></figure>

The test bank is shared. Every evaluation run by any assigned user draws from the same **Remaining tests** figure, and every assigned user sees the same number on their navbar chip. **View activity** breaks the usage down per user.

#### On-Demand

<figure><picture><source media="(prefers-color-scheme: dark)" srcset="../.gitbook/assets/profile-license-enterprise-ondemand-dark.png"><img src="../.gitbook/assets/profile-license-enterprise-ondemand-light.png" alt="Enterprise on-demand license"></picture></figure>

Usage is recorded across all assigned users and invoiced collectively. **Pending billing** is the combined figure for the whole team.

> For managing users, inviting new team members, and adjusting seat assignments, see [Enterprise User Management](../license-management/enterprise-user-management.md).

---

## Activating a license

Pay-per-test and On-Demand licenses are active as soon as MultiCASE issues them. A standard subscription arrives with status **Inactive** and an **Activate** button on its hero — you activate it yourself, and no license key is involved.

1. Go to **Profile → License**.
2. Find the license under **Inactive** and click **Activate**.
3. Confirm in the **Activate license?** dialog.

<figure><picture><source media="(prefers-color-scheme: dark)" srcset="../.gitbook/assets/license-activate-dark.png"><img src="../.gitbook/assets/license-activate-light.png" alt="License activation confirmation dialog"></picture></figure>

The button shows *Activating…* while the request is in flight, then the license moves to **Active** and you can evaluate. On an enterprise license, only a company administrator can activate.

If the License tab shows **Get a license to start evaluating**, your account has not been provisioned yet. Raise it at [support.multicase.com](https://support.multicase.com).

{% hint style="info" %}
If the tab instead reads **Couldn't load your licenses**, it says why underneath: "We couldn't reach the licensing service. Your licenses are unaffected — this is a display problem." Nothing has happened to your licenses. Use **Retry**.
{% endhint %}

---

## License activity and usage history

Every evaluation writes a usage record against the license it ran under. Click **View activity** on any license hero to open **License activity** — "Every test run against this license, and whether it has been billed."

| Column | What it shows |
|---|---|
| **ID** | The activity record. Click it to open the full detail. |
| **User** | The email address of the person who ran the evaluation |
| **License** | The license the run was charged to |
| **Tests used** | Tests consumed by that run |
| **Modules used** | How many modules were selected |
| **Activity time** | When the run was recorded |
| **Billed** | **Billed** or **Pending** |
| **Invoice reference** | The invoice the run appears on, once one exists |

**Billed** and **Pending** mean this:

- **Billed** — the run has been accounted for. Pay-per-test runs are billed immediately and decrement your remaining tests; standard subscription runs are billed immediately too, since the subscription itself is what you paid for.
- **Pending** — an On-Demand run that has been recorded but not yet invoiced. The periodic billing run flips it to Billed and fills in the invoice reference.

Clicking a row ID opens **Activity detail** — "A single recorded use of this license." — with the user, the license, the tests used, the named modules, the activity time, the billing status and the invoice reference.

Before anything has been run, the page reads "Activity appears here after the first test".

> The full walkthrough, including what administrators can see across a team, is in [License Activity](../license-management/license-activity.md).

{% hint style="info" %}
Usage follows the license, not the person. Moving a user between seats or companies does not move their past activity records off the license they ran under.
{% endhint %}

---

## Module bundles

Modules are sold in bundles — purchasing a bundle unlocks every endpoint within it. Your license either covers **all** modules or a **specific** list, and that list is shown under Modules on the License tab.

| Bundle | Includes |
|---|---|
| 🔴 **Nitrosamine** | CPCA Prediction, Surrogate Search, N-Nitrosation, Cross Similarity |
| 🌿 **Ecotoxicity** | Fathead Minnow 96h LC50, Daphnia 48h LC50, Tetrahymena 48h GC50, Algae 72h EC50, Bio Concentration Factor, Ready Biodegradability, Soil Adsorption |
| 💧 **Physicochemical** | LogP, Water Solubility, Vapor Pressure, Boiling Point |
| 💊 **ADME** | Oral Bioavailability |

The Oral Bioavailability report also covers metabolic stability, CYP3A4 / CYP2D6 / CYP2C9 substrate potential, MDR1 (P-gp) substrate potential, formulation sensitivity and a BCS class. Those are sections of one module, not separately licensed ones.

See the full [Model Catalog](model-catalog.md) for record counts, platform availability and a description of each endpoint.

Bundles matter for two reasons: they are what a pay-per-test evaluation is priced by, and they are how the **Select Modules to Evaluate** dialog is grouped. Modules your license does not cover appear in that dialog but cannot be ticked.

To add a bundle, raise a request at [support.multicase.com](https://support.multicase.com).

---

## When evaluation is blocked

The **Select Modules to Evaluate** dialog is explicit about which of three things went wrong:

| Message | What it means |
|---|---|
| "The module catalog could not be loaded, so there is nothing to evaluate against." | The catalog did not arrive. Check your connection and reopen the dialog. |
| "Your licensed modules could not be checked right now… This is not a license problem — try again shortly." | Your entitlements could not be read. Your license is fine. |
| "No license found / License not activated" | The account genuinely holds no active license. |

Canceling a run mid-flight reports "Evaluation canceled. Your library is unchanged; tests already started may still be billed." Tests already in progress are not refunded by canceling.

Curation is not metered. DataKurator does not consume tests and does not need an active license — only evaluation and report generation do.

---

## Desktop application downloads

The desktop application is available to all licensed users, on Windows and on macOS (Apple Silicon, macOS 12 or later). It checks for an active license at launch and will not start without one.

The app runs the prediction models on your workstation, and the reference database lives on the machine: on first run the app downloads an encrypted copy of roughly 4 GB. The structures you evaluate never leave the workstation, but the app is **not** usable offline: an internet connection is needed for sign-in and the license check at every launch, and for the entitlement check that runs each time you open the module picker.

- [⬇️ Download QSAR Flex for Windows](https://downloads.multicase.com/qsarflex/local/QSARFlex-Local-Installer.exe)
- [⬇️ Download QSAR Flex for macOS](https://downloads.multicase.com/qsarflex/mac/local/QSARFlex-Local-Installer.dmg)

{% hint style="info" %}
The web application sends your structures to the QSAR Flex service at `qsarflex-be.multicase.com` — for evaluation, report generation, structure depiction and DataKurator curation. They are not persisted after the request. If your structures must stay on your own hardware, the **desktop application** is the one that keeps them there.
{% endhint %}

The Windows app installs per user, into your own account rather than machine-wide. The app checks for application and reference-data updates when it starts and every 15 minutes after that, and offers the update in a dialog when one is available.

Usage from the desktop app is recorded against the same license and appears in the same activity history as usage from the web app.

See [Installing on Windows](../install-win.md) and [Installing on macOS](../install-mac.md) for step-by-step guides.

---

> 📬 **Need a license, more tests, another bundle, or extra seats?** Raise a request at [support.multicase.com](https://support.multicase.com). Sign in with the same MultiCASE account you use for QSAR Flex.
