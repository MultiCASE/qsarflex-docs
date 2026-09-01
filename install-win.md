# Installing on Windows

This guide walks through installing the QSAR Flex desktop application on Windows — from choosing a variant to your first evaluation.

{% hint style="info" %}
**Installation needs no administrator rights.** QSAR Flex installs for your Windows user only, and it updates itself when new versions are released.
{% endhint %}

---

## Before you start

| What you need | Details |
| --- | --- |
| **64-bit Windows (x64)** | QSAR Flex is published as a 64-bit (x64) build only. There is no 32-bit or Arm build. |
| **Microsoft Edge WebView2 Runtime** | QSAR Flex draws its interface in WebView2. The runtime is included with Windows 11; on earlier versions of Windows, install Microsoft's free WebView2 Runtime if it is not already present. |
| **A MultiCASE account with an active licence** | QSAR Flex checks for an active licence every time it starts and will not open without one. See [Access & Licensing](fundamentals/access-and-licensing.md). |
| **An internet connection** | The installer downloads the application, and sign-in plus the licence check happen over the network at every launch. |

{% hint style="info" %}
**Don't have an account yet?** Request one at [support.multicase.com](https://support.multicase.com). The same MultiCASE account signs you in to QSAR Flex and to the support portal.
{% endhint %}

---

## 1 — Choose a variant

QSAR Flex for Windows comes in two variants. Both run the prediction engine on your own machine, and both look and behave identically. They differ in where the reference database lives.

| Variant | Reference data | Choose this if |
| --- | --- | --- |
| **Local** | Held on your machine as an encrypted database. QSAR Flex downloads it once, on first run (about 4 GB). | You want the reference data — and the structures you evaluate — to stay on your computer, or your evaluations should not depend on a live connection to MultiCASE. |
| **Cloud** | Read as you evaluate from a MultiCASE-hosted PostgreSQL database at `central-db.multicase.com`. Nothing large to download. | You would rather not use the disk space, and your machine is always online while you work. |

{% hint style="info" %}
**Where your structures go.** Both variants run the prediction models on your workstation. On **Local**, the structures you evaluate stay on the machine. On **Cloud**, QSAR Flex reaches the hosted reference database over the network — outbound TCP 5432 to `central-db.multicase.com` — and some of those lookups carry the structure being evaluated as a canonical SMILES. Choose **Local** if the structures you evaluate must not leave the workstation, and open that port outbound if you choose **Cloud**.

Two features reach out to PubChem on either variant. **Auto Fill** in Add Compound sends the name, CAS number or SMILES you typed. DataKurator can verify structures against PubChem — that option is off by default and asks you to confirm before anything is sent.
{% endhint %}

Download the installer for the variant you want:

[⬇️ Download QSAR Flex **Local** for Windows](https://downloads.multicase.com/qsarflex/local/QSARFlex-Local-Installer.exe)

[⬇️ Download QSAR Flex **Cloud** for Windows](https://downloads.multicase.com/qsarflex/cloud/QSARFlex-Cloud-Installer.exe)

The files arrive as `QSARFlex-Local-Installer.exe` and `QSARFlex-Cloud-Installer.exe`. Both links always point at the current release. Install one variant — pick the other later only if your needs change.

{% hint style="info" %}
**Both the installer and the application are code-signed** with Azure Trusted Signing, using a SHA-256 digest and an RFC 3161 trusted timestamp — so the signature stays verifiable after the signing certificate expires. To check it yourself, right-click the downloaded `.exe`, choose **Properties**, and open the **Digital Signatures** tab.
{% endhint %}

---

## 2 — Run the installer

Double-click the installer you downloaded. The setup window opens on **Welcome** — click **Install** to begin.

<figure><img src=".gitbook/assets/install-win-01-welcome.png" alt="QSAR Flex setup — Welcome"></figure>

Windows does not ask for administrator approval: QSAR Flex is a per-user install.

---

## 3 — Install

The installer fetches the application and sets it up under your user account. It takes a few moments on a normal connection.

<figure><img src=".gitbook/assets/install-win-02-installing.png" alt="Installing QSAR Flex"></figure>

When it finishes you see **Installation Complete** and the installer closes itself.

<figure><img src=".gitbook/assets/install-win-04-complete.png" alt="Installation complete"></figure>

The application does not start on its own. Open QSAR Flex from the Start menu or from the new desktop shortcut.

QSAR Flex now appears in **Settings → Apps → Installed apps** (Apps & Features) for the signed-in Windows user, listed as **QSARFlex** and published by **MultiCASE Inc.** — that is also where you uninstall it.

---

## 4 — Sign in

QSAR Flex signs you in through your web browser, so your saved passwords, password manager and single sign-on all work as usual. When this window appears, your default browser opens the sign-in page automatically.

<figure><img src=".gitbook/assets/install-win-05-signin.png" alt="QSAR Flex waiting for you to sign in in the browser"></figure>

If the browser does not open, or you closed the tab by accident, click **Open Browser Again**.

In the browser, enter your email address and click **Next**.

<figure><img src=".gitbook/assets/install-win-06-login-form.png" alt="QSAR Flex sign-in page in the browser — email address"></figure>

Then enter your password and click **Continue**.

<figure><img src=".gitbook/assets/install-win-06-password.png" alt="QSAR Flex sign-in page in the browser — password"></figure>

The browser lands on a confirmation page and hands your session straight back to the app. If Windows or your browser asks for permission to open QSAR Flex, allow it; if the app does not come back to the front by itself, click **Open QSAR Flex**. You can close the tab once you are back in the application.

<figure><img src=".gitbook/assets/install-win-06-desktop-return.png" alt="You're signed in — the browser hands you back to QSAR Flex"></figure>

{% hint style="info" %}
QSAR Flex keeps no sign-in tokens on disk, so it asks you to sign in through the browser each time you start it. Straight after sign-in it fetches your licence — if none is active, it reports a licence error and closes. Open a ticket at [support.multicase.com](https://support.multicase.com) if that happens.
{% endhint %}

---

## 5 — One-time data setup

On first run, QSAR Flex downloads the reference data it needs for predictions and shows a **Required Data Download** window. This step is mandatory and cannot be postponed — the application cannot run without the data — but it happens only once. Later launches skip it.

<figure><img src=".gitbook/assets/install-win-07-data-download.png" alt="One-time reference-data download"></figure>

* On the **Local** variant this includes the encrypted reference database, roughly **4 GB**, so allow time on a slower connection.
* On the **Cloud** variant only the model files are downloaded — a much smaller transfer.

Every downloaded file is verified against a SHA-256 checksum before it is used. The data is stored in `%LOCALAPPDATA%\QSARFlex\data` and is left in place when the application updates, so you never download it twice.

---

## 6 — You're ready

When setup finishes, the QSAR Flex workspace opens. You can now add compounds and reactions and run evaluations.

<figure><img src=".gitbook/assets/install-win-08-app-ready.png" alt="QSAR Flex ready to use"></figure>

Next, head to [Getting Started](getting-started.md) to run your first evaluation.

---

## Staying up to date

QSAR Flex checks for application and data updates when it starts and every 15 minutes after that, and only interrupts you when something is actually available. You can also check on demand from **Help → Check for Updates**. Updates install the same way the app did — for your user, with no administrator rights.

---

## Getting help

Something not working, or you need a licence, extra modules or an enterprise rollout? Open a ticket at [support.multicase.com](https://support.multicase.com) and the team will answer in the ticket thread. See [Getting Support](support.md) for a walkthrough of the portal.
