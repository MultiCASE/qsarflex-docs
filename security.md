# Security

This page describes how QSAR Flex handles your data — where each operation runs, what leaves your machine, which hosts the products contact, and what is kept afterwards.

Nothing here changes the chemistry. What changed in 4.0 is DataKurator, and with it where curation runs and when PubChem is contacted.

---

## Where your library lives

In the web app and in the desktop app, your library, your evaluation results and DataKurator's working set are held **in the browser**, in local storage:

| What | Storage key | Cleared when |
|---|---|---|
| Compounds and reactions | `library-storage` | You clear the library, or sign out |
| Evaluation results | `evaluation-result-storage` | You clear the library, or sign out |
| DataKurator working set | `qsarflex_dk_state` | You clear DataKurator, or DataKurator is next opened by a different user |

There is no MultiCASE-side copy of your library. Signing out clears your library and your evaluation results locally, and also asks the license service to end the session.

The DataKurator working set is cleared at the same time only if DataKurator is the page you signed out from. Sign out from anywhere else — the Library, Account, or any other screen — and it stays in the browser profile until DataKurator is opened again — where it is discarded if a different user has signed in, and restored if the same user has. Use **Clear** in DataKurator if you want it gone immediately.

{% hint style="info" %}
Because the library lives in your browser profile, it does not follow you between browsers, machines or private windows. The desktop app keeps it in its own embedded browser profile.
{% endhint %}

---

## Where the chemistry runs

Structures reach a chemistry engine whenever you parse a file, render a structure, curate, evaluate or generate a report. Which engine depends on where you run QSAR Flex.

**Web app**

Every one of those operations is an HTTPS call to the QSAR Flex API — `/compound/batch`, `/compound/render`, `/curate/analyze`, `/curate/correct`, `/curate/smiles-transform`, `/curate/export`, `/evaluate`, `/generate-report`. Your structures are transmitted for the duration of the request and the result is returned to your session. The API accepts browser requests only from `multicase.com` origins.

**Desktop**

The desktop shell serves those same endpoint paths **inside the application process**. Nothing is posted to the QSAR Flex API: parsing, rendering, curation, evaluation and report generation all run on your machine, against the filter models and the reference database installed under your user profile. The network is used for sign-in, license checks, updates — and PubChem, only when you ask for it.

{% hint style="info" %}
If your requirement is that your structures never reach MultiCASE, install the **desktop application**. It carries the full reference database on the machine, so no structure is transmitted in the course of an evaluation. Even there, a PubChem lookup you explicitly confirm still sends the compounds you selected, and every evaluation still reports counts and module ids to the license service.
{% endhint %}

---

## DataKurator

DataKurator is not a purely local tool, and the difference matters:

- **In the web app**, DataKurator sends your structures to the QSAR Flex backend over HTTPS. Loading a file or pressing **Re-analyze** POSTs them to `/curate/analyze`; a PubChem lookup goes to `/curate/correct`; the neutralize and chirality steps go to `/curate/smiles-transform`; **Download** goes to `/curate/export`.
- **On the desktop app**, the same four calls are intercepted by the shell and executed in-process. Curation happens on the machine.

Automatic analysis never contacts PubChem. Every analysis the app runs for you — on load, on Re-analyze, after a One Step Cure — is sent with PubChem explicitly disabled.

---

## Third-party APIs

PubChem is the only third-party service QSAR Flex contacts with your data. There are three ways to reach it, and each one needs a deliberate action:

| Where | What is sent | What triggers it |
|---|---|---|
| **Auto Fill** — Add compound, single-compound form | The name, CAS number or SMILES you typed | Clicking **Auto Fill**. The click is the confirmation; there is no separate dialog |
| **One Step Cure → Verify structures against PubChem** | Names, CAS numbers and SMILES for every compound in the set | Ticking the box (it is off by default), pressing **Proceed**, then confirming the consent dialog |
| **PubChem lookup** — a row's ⋮ menu in Curate | That compound's name, CAS number and SMILES | Choosing **PubChem lookup**, then confirming the consent dialog |

{% hint style="info" %}
There is no **PubChem Batch Correct** *button* anywhere in 4.0. The bulk lookup is the **Verify structures against PubChem** checkbox inside the One Step Cure dialog, under **More curation steps**. The confirmation dialog it opens still refers to the run by the old name, which is worth knowing if you are matching this page against what is on screen.
{% endhint %}

### The consent dialog

Both DataKurator routes stop at a dialog titled **Send data to PubChem?** before anything is transmitted. It names exactly what will leave — "compound names, CAS numbers, and SMILES for all compounds" for the bulk run, "the compound's name, CAS number, and SMILES" for a single row — states that "This data will leave your system.", prints the endpoint `https://pubchem.ncbi.nlm.nih.gov/rest/pug/`, and asks "Do you want to continue?" with **Cancel** and **Continue**.

The question is asked before any work starts. Canceling a One Step Cure at the dialog abandons the whole run — "One Step Cure canceled — nothing was changed." — rather than leaving your compounds half-corrected. While the lookup runs, the progress overlay says what is in flight: "Names, CAS numbers and SMILES are being sent to pubchem.ncbi.nlm.nih.gov."

In the web app the lookup is made by the QSAR Flex backend on your behalf; on the desktop app the application calls PubChem directly. Either way the data reaches `pubchem.ncbi.nlm.nih.gov`. Review [PubChem's terms of use](https://www.ncbi.nlm.nih.gov/home/about/policies/) before using these features.

---

## Authentication

Sign-in is handled by MultiCASE Accounts — an [Amazon Cognito](https://aws.amazon.com/cognito/) hosted identity service at `auth.multicase.com`. At sign-in you type your password into that page, never into QSAR Flex, and the application never sees or stores it.

The one place QSAR Flex handles a password itself is **Account → Security**. Changing your password there sends the current and the new password over HTTPS to `user-manager-be.multicase.com`, which performs the change against Cognito. Neither is stored by the app, and you are signed out afterwards so you sign in again with the new one.

**Web app.** The session is a NextAuth session in your browser. Cognito tokens expire after about six minutes and are refreshed every four. Only one session is live per user per product: signing in somewhere else ends the earlier one.

**Desktop apps.** Sign-in opens the hosted page in your **default browser** — so password managers and SSO work as they normally do — and a one-time authorization code comes back to the app through its `qsarflex://` (Windows) or `qsarflexmac://` (macOS) URL scheme. No token travels over that scheme. The app posts the code to `user-manager-be.multicase.com` over HTTPS, which performs the Cognito exchange server-side and returns the ID token only — so no client secret ships in the application, and the desktop app never holds a refresh token.

{% hint style="info" %}
**Desktop tokens are never written to disk.** The ID token is held in memory for the lifetime of the process — there is no Keychain entry, no DPAPI blob, no token file. That is why the desktop app asks you to sign in at every launch, and why closing the app ends the session on that machine. A background timer refreshes the token every five minutes while the app is open.
{% endhint %}

There is also no offline license cache, and neither deployment works offline — the desktop app included. It fetches an active license at launch and will not open without one, and every evaluation, on either deployment, needs a live entitlement check: opening the module picker fetches the module catalog and your licensed modules from `user-manager-be.multicase.com`, and if that call fails no module can be selected. Holding the reference data locally removes the download, not the dependency.

---

## What is stored on your machine (desktop)

| Item | Location |
|---|---|
| Filter models, reference database, data manifest | `%LOCALAPPDATA%\QSARFlex\data` (Windows) · `~/Library/Application Support/QSARFlex/data` (macOS) |
| Embedded browser profile (where the library lives) | `%APPDATA%\QSARFlex\WebView2Main` on Windows |

The published model files are AES-256 encrypted and the local reference database is SQLCipher-encrypted; both the archive and every extracted file are SHA-256 verified after download. The Windows application and installers are signed with Azure Trusted Signing; the macOS app is Developer ID signed, notarized and stapled.

---

## Outbound connections

These are the hosts the products contact:

| Host | Purpose | Used by |
|---|---|---|
| `auth.multicase.com` | Cognito hosted sign-in | Both |
| `qsarflex.multicase.com` and `www.qsarflex.multicase.com` | The web app; the `www` host is also the sign-in return page the desktop app opens in your browser | Both |
| QSAR Flex API (a `multicase.com` host) | Parsing, rendering, curation, evaluation, reports | Web app |
| `user-manager-be.multicase.com` | Licenses, module entitlements, token refresh, usage counts | Both |
| `downloads.multicase.com` | Installers, update feeds, encrypted model and database downloads | Desktop |
| `pubchem.ncbi.nlm.nih.gov` | Auto Fill and DataKurator PubChem lookups | Desktop, on request only. In the web app the lookup is made server-side, so a workstation firewall rule does not affect it |
| `resources.multicase.com` | This documentation, opened when you click **Documentation** | Both |
| `d35fy2f4trk71w.cloudfront.net` | Static product assets — logos and profile images. Carries no chemical data | Both |

The desktop app runs no listeners: there is no local web server, no Windows service and no driver. Sign-in callbacks are handed to the running instance locally — through a named pipe on Windows, through the registered URL scheme on macOS.

---

## Data retention

The QSAR Flex API has no user database. It holds nothing about you or your compounds between requests:

- Curation writes your structures to a temporary file for the length of the request and deletes it in the same operation.
- Reports and evaluation results are generated per request and returned to your session.
- The API's request log records the method, path, status code and elapsed time of each call — not the request body.

MultiCASE does record **license usage**. Each evaluation reports the user and software id, the number of items in the library, the module ids used, the application version and the platform. No structures are included. You can see the resulting record yourself under **Account → License → View activity**.

---

## Questions and vulnerability reports

Open a ticket at [support.multicase.com](https://support.multicase.com) — it is the single channel for security questions, data-handling and retention queries, and vulnerability reports. Sign in with the same MultiCASE account you use for QSAR Flex. See [Getting Support](support.md).
