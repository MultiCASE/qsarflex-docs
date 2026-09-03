# The QSAR Flex Window

🧭 QSAR Flex 4.0 puts everything the product does behind a single 48-pixel bar at the top of the window. The bar never scrolls away, and it is identical in the web app and the desktop app. The desktop app adds one native menu of its own — **Help → Check for Updates** — and nothing else. This page describes each control on the bar.

Nothing on this page changes what QSAR Flex predicts. The chemistry, the models and the endpoints are the same as in 3.x — only the way you reach them is new.

---

## 🗺️ The Navbar

The bar is divided into three columns, read left to right:

| Position | Control | What it is for |
|---|---|---|
| Left | **Product mark** | Click the QSAR Flex logo to return to the Library |
| Left | **Library / DataKurator** | A segmented control — the two places the software goes |
| Center | **Search** | The command bar, opened with ⌘ K / Ctrl + K |
| Right | **License status chip** | Your current license, at a glance |
| Right | **Documentation** | Opens this documentation space |
| Right | **Theme toggle** | Light, dark, or follow your system |
| Right | **Avatar** | Your account menu |

Below the bar the page content is centred and capped in width, so a line of text is the same length on every screen.

{% hint style="info" %}
Press **Tab** as soon as a page loads and a **Skip to content** link appears in the top-left corner. It jumps past every focusable control on the navbar — seven tab stops — straight to the page itself.
{% endhint %}

---

## 📚 Library and DataKurator

The two primary destinations sit in a segmented control immediately to the right of the logo.

- **Library** — the list of compounds and reactions you are working on. This is the default destination: anything that is not DataKurator and not an account page shows Library as current.
- **DataKurator** — structure curation. Hovering it shows the tooltip *"Curate and validate compound libraries"*.

The current destination is drawn as a raised tab with its own border and a green icon; the other is flat. On the account pages (**Account** and the license activity pages) **neither** tab is lit — you are not in the Library or in DataKurator, and the bar says so rather than guessing. On those pages the license chip and the avatar are outlined in green instead.

---

## ⌨️ The Command Bar

The center of the navbar is a search-shaped button labeled **Search** with a key cap on its right edge. The cap reads **⌘ K** on macOS and **Ctrl + K** on Windows. Its tooltip is *"Find any action by name"*.

There are two ways to open it:

- Click the **Search** control.
- Press **⌘ K** (macOS) or **Ctrl + K** (Windows) from anywhere in the app.

The shortcut deliberately does nothing while you are typing in a text box — ⌘ K inside a SMILES field belongs to that field. The one exception is the command bar's own search box, where the shortcut is not suppressed — but the bar is already open there, so pressing it changes nothing.

On a narrow window the control shrinks to the magnifying-glass icon alone rather than disappearing, so it stays reachable on a phone or a half-width window where there is no keyboard to press ⌘ K on.

{% hint style="warning" %}
**If you used the QSAR Flex web app before 4.0**, ⌘ K / Ctrl + K opened the evaluate dialog there; it now opens the command bar. To evaluate, open the command bar and choose **Evaluate**, or use the green **Evaluate** button in the Library toolbar. The 3.x Windows desktop had no keyboard shortcut for evaluation, so this changes nothing for anyone coming from it.
{% endhint %}

### Searching

The search box is prompted with *"Search for anything — try 'evaluate' or 'curate'"*.

Typing filters the list on both the visible command name and a set of hidden synonyms, so you do not have to know our word for the job. `import`, `upload`, `sdf` and `paste` all find **Add compounds**; `clean`, `duplicates` and `mixtures` all find **DataKurator**; `logout` finds **Sign out**.

Every word you type has to appear somewhere, but the order does not matter — `add reaction` and `reaction add` return the same row.

If nothing matches, the list reads *Nothing matches "…"* with the text you typed.

Press **Enter** to run the highlighted command, or **Esc** to close the bar without running anything.

### The commands

Thirteen commands are listed, in four groups. Every one of them is offered on every page.

**Library**

| Command | What it does |
|---|---|
| **Add compounds** | Opens the Compound Input dialog |
| **Add a reaction** | Opens the Reaction Input dialog |
| **Evaluate** | Opens the module selection dialog |
| **Clear the library** | Empties the Library |

**DataKurator**

| Command | What it does |
|---|---|
| **Clear DataKurator** | Discards the structures DataKurator is holding |
| **Export curated structures** | Opens DataKurator's **Download** menu |

**Go to**

| Command | Destination |
|---|---|
| **Library** | The Library page |
| **DataKurator** | The DataKurator page |
| **Account and license** | Your Account page |

**QSAR Flex**

| Command | What it does |
|---|---|
| **Switch to dark mode** / **Switch to light mode** | Flips the theme. The label always names the theme you are not in |
| **Match my system appearance** | Hands the theme back to your operating system |
| **User guide** | Opens this documentation space in a separate tab or window |
| **Sign out** | Signs you out |

### Running a command from another page

A command does not require you to be standing on the page that owns it. If you run **Evaluate** while DataKurator is on screen, QSAR Flex navigates to the Library and opens the module dialog on arrival.

The queued command is armed for that one navigation only. It expires after about three seconds, and it is dropped the moment you navigate somewhere other than where it was headed — so a command you abandoned will never fire by itself when you come back later. If the destination was not ready in time you get a message saying so, and the suggestion to run it again from that screen.

### Commands that cannot run

A command that is unavailable right now is still listed. It is grayed out, and the reason is printed on the row in place of the location:

| Reason shown | When |
|---|---|
| **Nothing in the library** | On **Evaluate** and **Clear the library**, while the Library is empty |
| **Nothing loaded** | On **Clear DataKurator** and **Export curated structures**, while DataKurator holds no structures |
| **Already following your system** | On **Match my system appearance**, when your theme is already set to System |

This is on purpose. *"Where did Evaluate go?"* is a question worth answering even when there is nothing to evaluate.

### Where it lives

Every row that can run carries the place in the interface where the same command is normally found: **Library**, **DataKurator**, **Top left**, **Top right** or **Account menu**.

The hint is there so the command bar teaches you the interface rather than replacing it. Reach **Evaluate** through the bar four times and you have also read "Library" four times; the fifth time you can go straight to the button.

---

## 🔑 The License Status Chip

The first control in the right-hand cluster is a chip showing your active license. It is present on every page. While the license is being fetched a gray placeholder holds the space, so nothing beside it jumps sideways when the answer arrives.

What the chip says depends on the license:

| Chip reads | Meaning |
|---|---|
| **`142/500` tests** | A pay-per-test license: tests remaining out of tests bought |
| **Unlimited** | An on-demand subscription, which never expires |
| **`3` pending billing** | An on-demand subscription with test runs not yet invoiced |
| **`8 mo left`** | A dated subscription with more than 60 days to run, shown in whole months |
| **`23d left`** | A dated subscription with 60 days or fewer to run |
| **Active** | A subscription with no end date |
| **Expired** | A dated subscription whose end date has passed |
| **No active license** | The account has no active license. Evaluation will not run |
| **License unavailable** | The license service could not be reached |

A pay-per-test chip turns amber once fewer than **10** tests remain, and its tooltip adds *"⚠ Low tests remaining. Consider purchasing more."* If some of your runs are awaiting billing, the count appears after the tests as *(N pending)*.

Hovering the chip gives you the detail behind it — license type (Subscription, On demand or Pay-per-test), status, tests remaining where they apply, the subscription end date where there is one, and the line *"Click to view details"*.

**Clicking the chip opens the License tab of your Account page**, in every state including the two failure states. From there you can see the full license, its validity and usage, its assigned users, and its activity history.

{% hint style="info" %}
**No active license** and **License unavailable** are different problems. The first means the account does not have a license yet — raise it at [support.multicase.com](https://support.multicase.com). The second means the license service did not respond; evaluation will not run until it does, and it is usually worth reloading before reporting it.
{% endhint %}

---

## 📖 The Documentation Button

The book icon opens **https://resources.multicase.com/qf-web** — this documentation space. It always opens away from the page you are on: a new browser tab in the web app, your default browser on the macOS desktop build, and a separate window on the Windows desktop build. The same target is available from the command bar as **User guide**.

---

## 🌗 The Theme Toggle

The sun/moon button opens a small menu with three choices:

- **Light**
- **Dark**
- **System** — follow your operating system's appearance

The one currently in force is marked with a green dot and set in a heavier weight, so you can tell whether the dark screen you are looking at is your own choice or your machine's.

The button's tooltip names the setting rather than the result: *"Appearance: dark"* when you have chosen a side, or *"Appearance: following your system (dark)"* when you have not.

{% hint style="info" %}
System is a state you can get back to. The command bar's theme command only flips between light and dark; use **System** in this menu, or the command **Match my system appearance**, to hand the choice back to your operating system.
{% endhint %}

---

## 👤 The Avatar Menu

The last control is your avatar — your profile picture, or your initials if you have not set one. It carries a green border, and gains a second green ring while you are on an account page.

Opening it shows your name and the email address you signed in with, then two items:

- **Profile** — opens your Account page
- **Sign out**

Your Account page is where the Profile, Security, License and Team tabs live. The **Team** tab appears only if you are a company administrator.

---

## Related pages

- [Evaluation](evaluation.md) — running modules against your Library
- [DataKurator](datakurator.md) — structure curation
- [Access & Licensing](fundamentals/access-and-licensing.md) — what your license covers
- [Getting Support](support.md) — reaching MultiCASE through the support portal
