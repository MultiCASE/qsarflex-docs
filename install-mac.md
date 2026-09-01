# Installing on macOS

This guide walks through installing the QSAR Flex desktop application on macOS — from choosing a variant to your first evaluation.

{% hint style="info" %}
**Before you start**

- **macOS 12 (Monterey) or later.**
- **Apple Silicon (arm64).** The macOS build ships for Apple Silicon only — there is no Intel or universal build.
- **An internet connection at every launch.** QSAR Flex signs you in and checks your licence each time it starts.
- **About 4 GB of free disk space** if you install the Local variant, for its reference database.
{% endhint %}

---

## 1 — Choose Local or Cloud

QSAR Flex for macOS comes in two variants. They share the same interface and the same models; what differs is where the reference data lives.

|                          | **Local**                                                          | **Cloud**                                                     |
| ------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Reference data           | Downloaded to your Mac and stored encrypted                        | Held in MultiCASE's hosted database, read over the network    |
| First launch downloads   | Model files plus a reference database of about 4 GB                | Model files only — about 27 MB                                |
| Network needed to evaluate | No, once sign-in is done and the data is on disk                 | Yes, for every evaluation                                     |

**Choose Local** if you want the evaluation to be self-contained on your own machine — once the one-time download finishes, predictions run without reaching out for reference data. **Choose Cloud** if a 4 GB download is impractical, or you want to be up and running in a couple of minutes.

Download the variant you want:

- 💻 [QSAR Flex **Local** for macOS (.dmg)](https://downloads.multicase.com/qsarflex/mac/local/QSARFlex-Local-Installer.dmg) — `QSARFlex-Local-Installer.dmg`
- ☁️ [QSAR Flex **Cloud** for macOS (.dmg)](https://downloads.multicase.com/qsarflex/mac/cloud/QSARFlex-Cloud-Installer.dmg) — `QSARFlex-Cloud-Installer.dmg`

{% hint style="info" %}
On both variants the prediction itself is computed by the app on your Mac. Your compounds are never uploaded to MultiCASE to be evaluated for you.

What differs is where the reference data comes from. The **Local** variant reads it from the encrypted database on your own disk, so nothing about the structure leaves your Mac during an evaluation. The **Cloud** variant queries MultiCASE's hosted reference database as it evaluates, and some of those lookups carry the structure being looked up.

PubChem is separate, and it is contacted only when you ask for it — **Auto Fill** in the compound dialog, or a **PubChem lookup** in DataKurator. Both send the compound's name, CAS number and SMILES to PubChem, on the Local variant as well as Cloud. DataKurator asks you to confirm before it sends anything. **Auto Fill** goes as soon as you click it.
{% endhint %}

---

## 2 — Drag QSAR Flex to Applications

Open the downloaded `.dmg`. It mounts a volume named **QSARFlex** and opens a window with the app on the left and an **Applications** shortcut on the right. Drag the **QSARFlex** icon onto **Applications**.

<figure><img src=".gitbook/assets/install-mac-01-dmg-window.png" alt="Drag QSAR Flex into the Applications folder"></figure>

Once it copies, eject the installer disk image.

---

## 3 — Open QSAR Flex

Launch QSAR Flex from your **Applications** folder (or Launchpad). The first time you open it, macOS confirms the app was downloaded from the internet — click **Open**.

<figure><img src=".gitbook/assets/install-mac-02-gatekeeper.png" alt="macOS confirmation that QSAR Flex was downloaded from the internet"></figure>

{% hint style="info" %}
The app is signed with a MultiCASE Developer ID certificate and has been notarized and stapled by Apple, so Gatekeeper passes it — the dialog itself says Apple checked the file for malicious software and found none. You never need to right-click **Open**, approve it in **Privacy & Security**, or clear a quarantine flag from Terminal. This prompt appears once, on the first launch.
{% endhint %}

---

## 4 — Sign in

QSAR Flex signs you in through your default web browser, so your saved passwords and password manager work as usual. The app shows a **Sign in with your browser** window and opens the sign-in page for you. If the browser does not come forward, click **Open Browser Again**.

<figure><img src=".gitbook/assets/install-mac-03-signin.png" alt="QSAR Flex waiting for you to sign in in the browser"></figure>

In the browser you land on MultiCASE Accounts. Enter your email address and click **Next**.

<figure><img src=".gitbook/assets/install-mac-04-login-form.png" alt="QSAR Flex sign-in page in the browser — email address"></figure>

Then enter your password and click **Continue**.

<figure><img src=".gitbook/assets/install-mac-04-password.png" alt="QSAR Flex sign-in page in the browser — password"></figure>

The browser confirms **You're signed in** and hands you back to QSAR Flex automatically. If the app does not come forward, click **Open QSAR Flex**. You can close the tab once you are back in the app.

<figure><img src=".gitbook/assets/install-mac-04-desktop-return.png" alt="You're signed in — the browser hands you back to QSAR Flex"></figure>

{% hint style="info" %}
Your password is typed into MultiCASE Accounts in the browser, never into QSAR Flex. The same MultiCASE account signs you in to the web app, both desktop apps and the support portal.
{% endhint %}

{% hint style="warning" %}
**Don't have an account, or no licence yet?** QSAR Flex checks for an active licence right after sign-in and will not open without one. Raise a request at [support.multicase.com](https://support.multicase.com) — new accounts, licences and added modules all go through the portal.
{% endhint %}

---

## 5 — One-time data setup

After sign-in, QSAR Flex sets up the data it needs to make predictions. A **Data Files Setup** panel reports the progress, and each file is checksum-verified as it arrives.

<figure><img src=".gitbook/assets/install-mac-05-data-download.png" alt="One-time reference-data download"></figure>

- On the **Local** variant this is the model files plus the encrypted reference database — about 4 GB in total, so allow a few minutes on a fast connection and longer on a slow one.
- On the **Cloud** variant only the model files are fetched, about 27 MB.

This is a one-time setup. The files are kept in `~/Library/Application Support/QSARFlex/data`, outside the app itself, so later launches skip this step and app updates leave the data in place.

---

## 6 — You're ready

When setup finishes, the main QSAR Flex window opens on the **Library**. The navbar carries the **Library** and **DataKurator** tabs, the search box that opens the command bar with **⌘K**, your licence status, a **Documentation** button and your account menu.

<figure><img src=".gitbook/assets/install-mac-06-app-ready.png" alt="QSAR Flex ready to use"></figure>

Next, head to [Getting Started](getting-started.md) to run your first evaluation.

---

## Keeping QSAR Flex up to date

QSAR Flex updates itself. It checks for a new version of the app and of the reference data when it starts and every 15 minutes after that, and prompts you only when there is something to install. Your reference data is not re-downloaded when the app updates.

Sign-in happens on every launch, so QSAR Flex needs a connection each time you open it, even on the Local variant.

If an update, a sign-in or the data download fails, open a ticket at [support.multicase.com](https://support.multicase.com).
