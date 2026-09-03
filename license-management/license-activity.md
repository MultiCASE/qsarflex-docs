# License Activity & Usage History

Every evaluation you run is written to your license as an activity record. QSAR Flex 4.0 shows you those records: which runs consumed tests, how many, who ran them, and whether the usage has been billed yet.

This is a new surface in 4.0. Nothing about how tests are counted or billed has changed — what is new is that you can now see it for yourself instead of asking.

---

## Opening the activity history

1. Open the avatar menu at the top right and choose **Profile**. The page it opens is titled **Account**.
2. Select the **License** tab. Clicking the license chip in the navbar takes you straight there.
3. On the license card at the top of the tab, click **View activity**.

That opens the history for that one license — the card you clicked from. Each license keeps its own history; the active and inactive license cards on the tab each carry their own **View activity** button. Expired licenses are listed in a table further down the tab and are not linked to their history from there.

The back arrow beside the page title returns you to **Account → License**.

{% hint style="info" %}
On an enterprise license, only a company admin sees the actions on the license card. If your card carries a **View only** badge, the **View activity** button is not shown — ask your company admin, who sees the usage for the whole license including yours.
{% endhint %}

---

## What the table shows

The page is titled **License activity**, with the line *"Every test run against this license, and whether it has been billed."* Below it is one row per evaluation run, newest first.

| Column | What it means |
|---|---|
| **ID** | The activity record, shortened to its first and last four characters. Click it to open the full record. |
| **User** | The account that ran the evaluation. On an enterprise license every seat reports to the same history, so this is how you tell one person's usage from another's. |
| **License** | The license the run was charged to, shortened the same way. |
| **Tests used** | How many tests that single run consumed. See [How a test is counted](#how-a-test-is-counted) below. |
| **Modules used** | How many modules were selected for that run. This is *not* the number of tests charged — several modules can cost a single test. |
| **Activity time** | When the run happened, shown in your computer's time zone. |
| **Billed** | **Billed** or **Pending**. See [Billed and Pending](#billed-and-pending). |
| **Invoice reference** | The invoice the usage was billed on. This applies to On-Demand usage; a dash means no invoice reference has been recorded for the row. |

The table has the standard QSAR Flex table controls:

- A **Search** box that matches every column — including module names, which the *Modules used* cell shows only as a count, and the words *Billed* and *Pending*.
- Click a column heading to sort by it; the arrow beside the heading shows the current sort. The **License** and **Modules used** columns do not sort.
- The **⋮** menu on a heading pins the column left or right, or hides it.
- **Rows per page** at the foot of the table, from 10 up to 50.

### When there is nothing to show

A license that has never been used shows **Activity appears here after the first test** — *"Once tests are run against this license they will appear here."* Records are written when an evaluation finishes, so a brand-new license is empty until the first run.

If the licensing service cannot be reached the page shows **Couldn't load activity history** with a **Retry** button. Nothing has been lost — this is a display problem, and your usage records are unaffected.

---

## Opening a single record

Clicking an **ID** opens **Activity detail** — *"A single recorded use of this license."* The card at the top reads, for example, *"chemist@example.com used 20 tests"*, with the date and a **Billed** or **Not billed** badge.

Below it, **Activity details** lists:

- **Activity ID** — quote this when you have a question about a specific charge.
- **User** — the account that ran the evaluation.
- **License** — the software name and the license the run was charged to.
- **Tests used**
- **Modules used** — here the modules are listed **by name**, one badge each. The table only counts them; this is where you see which ones were run.
- **Activity time**
- **Billing status**
- **Invoice reference**

A breadcrumb at the top of the page walks back up to the license activity table and to the account page.

If a record no longer exists the page says **Activity not found** — *"This activity record no longer exists. It may have been removed."* — with a way back to your account.

---

## How a test is counted

A test is counted per **bundle**, not per module:

> **Tests used = number of items in the library × number of distinct bundles among the modules you selected.**

Modules that belong to the same bundle count once between them. Modules that belong to no bundle are grouped together and also count once.

| What you run | Tests charged |
|---|---|
| 10 compounds, 3 modules — all in the same bundle | 10 × 1 = **10** |
| 10 compounds, 3 modules — from two different bundles | 10 × 2 = **20** |
| 50 compounds, 1 module | 50 × 1 = **50** |

{% hint style="warning" %}
Selecting more modules does not necessarily cost more. Adding a second module from a bundle you have already selected is free; adding one from a different bundle multiplies the cost of the whole run. Choose modules bundle by bundle if cost matters.
{% endhint %}

A few consequences worth knowing:

- **One row per evaluation run.** The record is written when the run completes, with the whole library counted once.
- **Opening a report costs nothing.** Report generation checks your license but writes no activity record and consumes no tests.
- **Canceling is not a refund.** Canceling stops QSAR Flex listening for the result; it does not stop the backend. The app says so at the time — *"Evaluation canceled. Your library is unchanged; tests already started may still be billed."*
- **Desktop runs appear here too.** The Windows and macOS desktop app reports each evaluation to the same license. The record also stores the app version and which build ran it; those are kept for support and are not shown in the table.

---

## Billed and Pending

What the **Billed** column means depends on the type of license the run was charged to.

| License type | Billed column | Effect on the license |
|---|---|---|
| **Pay-per-test** | **Billed** straight away | The tests are deducted from **Remaining tests** on the License tab |
| **Subscription** (standard, with an end date) | **Billed** straight away | Nothing is deducted — the run is inside the period you already pay for, and the row is a usage record rather than a new charge |
| **On-Demand subscription** (no end date) | **Pending** | Nothing is deducted. The usage is invoiced by MultiCASE later. Once it has been invoiced, the row shows **Billed** with its **Invoice reference** |

So a table full of **Pending** rows is normal on an On-Demand license and means only that those runs have not been invoiced yet. On a pay-per-test or a dated subscription license, every row should read **Billed**.

Pending usage is surfaced in two other places, both counting the same thing — the total tests on rows that are still **Pending**:

- **Account → License** shows a **Pending billing** figure in amber whenever it is above zero. If the count cannot be fetched the field says *"Couldn't be loaded"* rather than showing zero.
- The **license chip** in the navbar shows the pending count beside your remaining tests (pay-per-test) or in place of **Unlimited** (On-Demand). It refreshes after every evaluation, including one you canceled.

{% hint style="info" %}
Activity belongs to the **license**, not to the person. Records point at the license they were run under, so moving a user between seats — or off the license entirely — leaves the earlier runs where they are. Usage from before a move stays billed to the license that ran it.
{% endhint %}

---

## Questions about a charge

Raise it at [support.multicase.com](https://support.multicase.com), quoting the **Activity ID** and the **Activity time** from the record. Both are on the activity detail page, and the ID is the first column of the table.

Related pages: [Access & Licensing](../fundamentals/access-and-licensing.md) for license types and coverage, and [Enterprise User Management](enterprise-user-management.md) for seats and company admins.
