# Installing on Windows

This guide walks through installing the QSAR Flex desktop application on Windows — from download to your first evaluation.

{% hint style="info" %}
**Installation needs no administrator rights.** QSAR Flex installs for your Windows user only, and it updates itself when new versions are released.
{% endhint %}

---

## Before you start

| What you need | Details |
| --- | --- |
| **64-bit Windows (x64)** | QSAR Flex is published as a 64-bit (x64) build only. There is no 32-bit or Arm build. |
| **Microsoft Edge WebView2 Runtime** | QSAR Flex draws its interface in WebView2. The runtime is included with Windows 11; on earlier versions of Windows, install Microsoft's free WebView2 Runtime if it is not already present. |
| **A MultiCASE account with an active license** | QSAR Flex checks for an active license every time it starts and will not open without one. See [Access & Licensing](fundamentals/access-and-licensing.md). |
| **An internet connection** | The installer downloads the application, and the license check happens over the network at every launch. You sign in once; the app keeps the session and asks for the browser again only when it has ended. |

{% hint style="info" %}
**Don't have an account yet?** Request one at [support.multicase.com](https://support.multicase.com). The same MultiCASE account signs you in to QSAR Flex and to the support portal.
{% endhint %}

---

## 1 — Download QSAR Flex

QSAR Flex for Windows runs the prediction engine on your own machine. Its reference data is held on
that machine as an encrypted database, which QSAR Flex downloads once, on first run — about 4 GB.

{% hint style="info" %}
**Where your structures go.** The prediction models run on your workstation and the structures you
evaluate stay on it. Nothing is uploaded to MultiCASE to be evaluated for you.

Two features reach out to PubChem. **Auto Fill** in Add Compound sends the name, CAS number or SMILES
you typed, as soon as you press it. One Step Cure can verify structures against PubChem — that option
is off by default and asks you to confirm before anything is sent.
{% endhint %}

Download the installer:

[⬇️ Download QSAR Flex for Windows](https://downloads.multicase.com/qsarflex/local/QSARFlex-Local-Installer.exe)

The file arrives as `QSARFlex-Local-Installer.exe`. The link always points at the current release.

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
You sign in once. QSAR Flex keeps the session on this machine, in a DPAPI-protected file only your Windows account can read, and the next launch opens straight into the workspace; the browser sign-in comes back only when you signed out, signed in elsewhere with the same account, or the session ended. Straight after sign-in it fetches your license — if none is active, it reports a license error and closes. Open a ticket at [support.multicase.com](https://support.multicase.com) if that happens.
{% endhint %}

---

## 5 — One-time data setup

On first run, QSAR Flex downloads the reference data it needs for predictions and shows a **Required Data Download** window. This step is mandatory and cannot be postponed — the application cannot run without the data — but it happens only once. Later launches skip it.

<figure><img src=".gitbook/assets/install-win-07-data-download.png" alt="One-time reference-data download"></figure>

* This includes the encrypted reference database, roughly **4 GB**, so allow time on a slower connection.

Every downloaded file is verified against a SHA-256 checksum before it is used. The data is stored in `%LOCALAPPDATA%\QSARFlex\data` and is left in place when the application updates, so you never download it twice.

---

## 6 — You're ready

When setup finishes, the QSAR Flex workspace opens. You can now add compounds and reactions and run evaluations.

<figure><picture>
  <source media="(prefers-color-scheme: dark)" srcset=".gitbook/assets/workspace-empty-dark.png">
  <img src=".gitbook/assets/workspace-empty-light.png" alt="QSAR Flex ready to use">
</picture></figure>

Next, head to [Getting Started](getting-started.md) to run your first evaluation.

---

## Staying up to date

QSAR Flex checks for application and data updates when it starts and every 15 minutes after that, and only interrupts you when something is actually available. You can also check on demand from **Help → Check for Updates**. Updates install the same way the app did — for your user, with no administrator rights.

### The Check for Updates window

The window shows two status rows — **Application** and **Data Files** — each reading **Up to date ✓** or naming what is available. If your license includes modules that belong to your company alone, one more row appears for each of them, labelled with the company and module name; other users never see those rows. The card below the rows carries the release notes for whatever is available, and **Update Now** installs everything at once: data files first, then company module data, then the application, which restarts when its update is applied.

<!-- screenshot: install-win-09-check-updates.png — Check for Updates window with Application "Up to date ✓" and Data Files "Update available ↑" -->

### Choosing a different version

Under the release notes, **Choose a different version…** opens a dropdown for the application, one for the data files, and one for each company module package. Every list is sorted newest first, the top entry carries the label **· latest** and the entry you are running carries **· installed**. Pick anything other than the latest and the window shows the warning *Older versions may not open files saved by newer ones.* and the button reads **Install selected**.

Use this when a result changes between versions and you need to reproduce the earlier one, or when MultiCASE support asks you to test a specific build. For everyday use, leave everything on latest.

<!-- screenshot: install-win-10-choose-version.png — the expanded section with the Application dropdown open, "v3.9.2 · latest" at the top and "v3.9.0 · installed" selected -->
<!-- screenshot: install-win-11-install-selected.png — an older version chosen: amber warning line visible, button reading "Install selected" -->

### Staying on an older version

After you install an older version, QSAR Flex stays on it. The background checks stop offering the newer version, and the window reports **Pinned to vX · newer vY available** in place of the usual status. **Return to latest** clears the pin and installs the newest version. The same applies to the data files and to each company module package, each pinned on its own.

<!-- screenshot: install-win-12-pinned.png — window showing "Pinned to v3.9.0 · newer v3.9.2 available" with the Return to latest button -->

### How data versions are numbered

Data files carry the version of the application they were published with, so data **3.9.0** was published alongside application 3.9.0. When the data is republished between application releases, a fourth number counts the republish — **3.9.0.2** is the second data release for application 3.9.0. Application and data versions do not have to match: the status row is what tells you whether your data is current.

Company module data follows the same numbering and is offered only while your license includes the module. If the module leaves your license, its data is removed from the machine at the next sign-in.

---

## Getting help

Something not working, or you need a license, extra modules or an enterprise rollout? Open a ticket at [support.multicase.com](https://support.multicase.com) and the team will answer in the ticket thread. See [Getting Support](support.md) for a walkthrough of the portal.
