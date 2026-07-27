#!/usr/bin/env bash
# ============================================================================
# capture-mac-install.sh — fully automated macOS install-guide capture for the
# QSARFlex (Local edition) desktop app.
#
# Downloads the installer, mounts it, installs, launches, clicks through
# Gatekeeper, logs in via the default browser flow, and screenshots every step
# ON THE FLY as clean, rounded-corner window captures. No human interaction.
#
# HOW IT STAYS CLEAN
#   Each shot is a native macOS window capture (`screencapture -l <windowID>`),
#   so it comes out with the window's real rounded corners + transparency and
#   NO background bleed. Window IDs come from the bundled Swift helper winid.swift.
#   The one floating modal (Data Files Setup) is rounded via ImageMagick.
#
# REQUIREMENTS (all present on this Mac)
#   • Terminal with Screen Recording + Accessibility permission (Warp has both)
#   • cliclick, ImageMagick (magick), swiftc  — brew installable
#   • Credentials in scripts/.env.local  (QSARFLEX_EMAIL / QSARFLEX_PASS)
#
# USAGE:  ./scripts/capture-mac-install.sh
#         CHANNEL=beta ./scripts/capture-mac-install.sh   (beta feed — the only
#                                                           live channel today)
# Output: ../.gitbook/assets/install-mac-0N-*.png
# ============================================================================
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
OUT="$ROOT/.gitbook/assets"
PREFIX="install-mac"
# CHANNEL=beta ./scripts/capture-mac-install.sh  → captures from the beta feed.
# QSARFlex Local ships beta-only for now; stable path is wired for when it exists.
CHANNEL="${CHANNEL:-stable}"
if [ "$CHANNEL" = "beta" ]; then
  DMG_URL="https://downloads.multicase.com/qsarflex/mac/local/beta/QSARFlex-Local-Beta-Installer.dmg"
else
  DMG_URL="https://downloads.multicase.com/qsarflex/mac/local/QSARFlex-Local-Installer.dmg"
fi
DMG="$HOME/Downloads/QSARFlex-Local-Installer.dmg"
VOLUME="/Volumes/QSARFlex"
APP="/Applications/QSARFlex.app"
WINID="$SCRIPT_DIR/winid"

[ -f "$SCRIPT_DIR/.env.local" ] && source "$SCRIPT_DIR/.env.local"
EMAIL="${QSARFLEX_EMAIL:-}"; PASS="${QSARFLEX_PASS:-}"
mkdir -p "$OUT"

say()  { printf '\n\033[1;36m%s\033[0m\n' "$*"; }
step() { printf '\n\033[1;33m▶ %s\033[0m\n' "$*"; }
ok()   { printf '   \033[32m✓ %s\033[0m\n' "$*"; }
die()  { printf '\033[31m!! %s\033[0m\n' "$*"; exit 1; }

# ── capture helpers ─────────────────────────────────────────────────────────
# snap <name> <owner> [titleSubstring] — native rounded window capture
snap() {
  local name="$1" owner="$2" title="${3:-}" info wid
  info=$("$WINID" "$owner" "$title" 2>/dev/null)
  if [ -z "$info" ]; then
    echo "   ! no window [$owner/$title] — full-screen fallback"
    screencapture -x "$OUT/${PREFIX}-${name}.png"; return 1
  fi
  wid=$(echo "$info" | cut -d' ' -f1)
  screencapture -l "$wid" -o "$OUT/${PREFIX}-${name}.png"
  ok "${PREFIX}-${name}.png"
}

# snap_rounded_region <name> <x> <y> <w> <h> <radius> — region grab + rounded mask
snap_rounded_region() {
  local name="$1" x="$2" y="$3" w="$4" h="$5" r="$6" f="$OUT/${PREFIX}-${name}.png"
  screencapture -x -R "${x},${y},${w},${h}" "$f"
  magick "$f" \( +clone -alpha extract \
      -draw "fill black polygon 0,0 0,$r $r,0 fill white circle $r,$r $r,0" \
      \( +clone -flip \) -compose Multiply -composite \
      \( +clone -flop \) -compose Multiply -composite \) \
    -alpha off -compose CopyOpacity -composite "$f"
  ok "${PREFIX}-${name}.png"
}

# click_frac <owner> <fracX> <fracY> — click a point inside a window by fraction
click_frac() {
  local info x y w h cx cy
  info=$("$WINID" "$1"); [ -z "$info" ] && { echo "   ! window $1 not found"; return 1; }
  read -r _ x y w h <<<"$info"
  cx=$(printf '%.0f' "$(echo "$x + $w * $2" | bc -l)")
  cy=$(printf '%.0f' "$(echo "$y + $h * $3" | bc -l)")
  cliclick c:${cx},${cy}
}

wait_window() { # <owner> [title] <timeout_s>
  local owner="$1" title="$2" max="$3" i=0
  while ! "$WINID" "$owner" "$title" >/dev/null 2>&1; do
    i=$((i+1)); [ $i -ge "$max" ] && return 1; sleep 1
  done
}

reset_clean_slate() {
  say "Clean slate (uninstall + wipe data/session)…"
  pkill -i qsarflex 2>/dev/null || true; sleep 1
  local p=(
    "$APP" "$HOME/Library/Application Support/QSARFlex"
    "$HOME/Library/Caches/velopack/QSARFlex"
    "$HOME/Library/Caches/com.MultiCASE_Inc..QSARFlex" "$HOME/Library/Caches/com.multicase.qsarflex"
    "$HOME/Library/HTTPStorages/com.MultiCASE_Inc..QSARFlex" "$HOME/Library/HTTPStorages/com.MultiCASE_Inc..QSARFlex.binarycookies"
    "$HOME/Library/HTTPStorages/com.multicase.qsarflex" "$HOME/Library/HTTPStorages/com.multicase.qsarflex.binarycookies"
    "$HOME/Library/WebKit/com.MultiCASE_Inc..QSARFlex" "$HOME/Library/WebKit/com.multicase.qsarflex"
    "$HOME/Library/Preferences/com.MultiCASE_Inc..QSARFlex.plist" "$HOME/Library/Preferences/com.multicase.qsarflex.plist"
    "$HOME/Library/Logs/velopack_QSARFlex.log"
  )
  for x in "${p[@]}"; do [ -e "$x" ] && rm -rf "$x"; done
  ok "clean"
}

# ── preflight ───────────────────────────────────────────────────────────────
[ -n "$EMAIL" ] && [ -n "$PASS" ] || die "Set QSARFLEX_EMAIL / QSARFLEX_PASS in $SCRIPT_DIR/.env.local"
command -v cliclick >/dev/null || die "cliclick not found (brew install cliclick)"
command -v magick   >/dev/null || die "ImageMagick not found (brew install imagemagick)"
command -v swiftc   >/dev/null || die "swiftc not found (Xcode command line tools)"
[ -x "$WINID" ] || { swiftc "$SCRIPT_DIR/winid.swift" -o "$WINID" || die "winid build failed"; }

say "Automated macOS install capture → $OUT"
reset_clean_slate

# ── download ────────────────────────────────────────────────────────────────
step "Downloading installer"
rm -f "$DMG"
curl -fSL --progress-bar -o "$DMG" "$DMG_URL" || die "download failed"
ok "downloaded $(du -h "$DMG" | cut -f1)"

# ── mount + capture DMG window + install ────────────────────────────────────
step "Mounting + installing"
hdiutil detach "$VOLUME" >/dev/null 2>&1 || true
open "$DMG"; sleep 4
snap "01-dmg-window" "Finder" "QSARFlex"
rm -rf "$APP"; cp -R "$VOLUME/QSARFlex.app" /Applications/ || die "copy failed"
# make Gatekeeper prompt on first launch (as if freshly downloaded)
xattr -w com.apple.quarantine "0081;$(printf '%08x' "$(date +%s)");Chrome;$(uuidgen)" "$APP"
hdiutil detach "$VOLUME" >/dev/null 2>&1 || true
# window OWNER (CGWindowList) is the app display name (CFBundleName), not the
# executable name — read it from the bundle so a future executable rename does
# not break window matching. CFBundleName is "QSARFlex".
APP_PROC=$(defaults read "$APP/Contents/Info" CFBundleName 2>/dev/null || echo QSARFlex)
ok "installed (window owner: $APP_PROC)"

# ── first launch + (best-effort) Gatekeeper ─────────────────────────────────
# NOTE: macOS shows the "downloaded from the Internet — Open?" alert only on the
# FIRST-EVER approval of an app on a given Mac. On a machine that has already run
# QSARFlex it will NOT reappear (re-quarantining just silently blocks the app),
# so this frame is best-effort — run on a fresh Mac/VM to capture it.
step "First launch"
open "$APP" 2>/dev/null &
for i in $(seq 1 25); do
  # sign-in window means it launched cleanly (already approved) → skip Gatekeeper
  "$WINID" "$APP_PROC" "Sign in" >/dev/null 2>&1 && break
  # the alert grabs focus, so check the frontmost process for an "Open" button
  # the dialog belongs to CoreServicesUIAgent — snap it natively and click Open
  gkinfo=$("$WINID" "CoreServicesUIAgent" 2>/dev/null | head -1)
  if [ -n "$gkinfo" ]; then
    gkwid=$(echo "$gkinfo" | cut -d' ' -f1)
    screencapture -l "$gkwid" -o "$OUT/${PREFIX}-02-gatekeeper.png" && ok "${PREFIX}-02-gatekeeper.png"
    osascript -e 'tell application "System Events" to tell process "CoreServicesUIAgent" to click button "Open" of window 1' 2>/dev/null \
      || osascript -e 'tell application "System Events" to click button "Open" of window 1 of (first process whose frontmost is true)' 2>/dev/null
    ok "Gatekeeper Open clicked"
    break
  fi
  # Already-approved Mac: a re-quarantined app is silently blocked (no dialog AND
  # no window). Detect that after ~8s, drop the quarantine, and relaunch normally.
  if [ "$i" = 8 ]; then
    echo "   (no Gatekeeper prompt — app already approved on this Mac; relaunching without quarantine)"
    xattr -dr com.apple.quarantine "$APP" 2>/dev/null
    pkill -i qsarflex 2>/dev/null; sleep 1
    open "$APP" 2>/dev/null &
  fi
  sleep 1
done

# ── sign in (via Google Chrome + JavaScript — no coordinate guessing) ───────
# ONE-TIME SETUP: in Chrome enable View ▸ Developer ▸ Allow JavaScript from
# Apple Events, and approve the macOS Automation prompt on first run.
# The app still opens the DEFAULT browser; that stray tab is ignored — the
# login is driven in a fresh Chrome window via the DOM, so page states are
# detected (form vs "You're still signed in") instead of guessed.
step "Sign in (Chrome)"
wait_window "$APP_PROC" "Sign in" 40 || die "sign-in wait window never appeared"
sleep 2
snap "03-signin" "$APP_PROC" "Sign in"

AUTH_URL="https://auth.multicase.com/login?client_id=420859nmanbm80vrf4ba81gbo4&response_type=code&scope=email+openid+phone+profile&redirect_uri=https%3A%2F%2Fwww.qsarflex.multicase.com%2Fauth%2Fdesktop-return%2Fmac"

case "$PASS$EMAIL" in *"'"*|*'"'*|*'\\'*) die "credentials containing quotes/backslashes are not supported by the JS injector";; esac

chrome_js() { # run JavaScript in Chrome's active tab, print the result
  osascript - "$1" <<'AS'
on run argv
  tell application "Google Chrome" to execute front window's active tab javascript (item 1 of argv)
end run
AS
}

open -na "Google Chrome" --args --new-window "$AUTH_URL"
sleep 5
osascript -e 'tell application "Google Chrome" to set bounds of front window to {1080, 500, 3000, 1560}' 2>/dev/null
osascript -e 'tell application "System Events" to set frontmost of process "Google Chrome" to true' 2>/dev/null

[ "$(chrome_js '"ok"')" = "ok" ] \
  || die "Chrome JS control unavailable — enable View ▸ Developer ▸ Allow JavaScript from Apple Events and grant Automation permission to this terminal"

# reach the login form, leaving the "still signed in" page if it shows
state=""
for i in $(seq 1 30); do
  state=$(chrome_js '(function(){
    if (document.querySelector("input[type=email], input[name=username]")) return "form";
    var el = Array.from(document.querySelectorAll("a,button,span")).find(function(e){return /different user/i.test(e.innerText||"")});
    if (el) return "continue";
    return "loading";
  })()')
  [ "$state" = "form" ] && break
  if [ "$state" = "continue" ]; then
    ok "active session detected — choosing Sign in as a different user"
    chrome_js 'Array.from(document.querySelectorAll("a,button,span")).find(function(e){return /different user/i.test(e.innerText||"")}).click(); "ok"' >/dev/null
    sleep 3
  else
    sleep 1
  fi
done
[ "$state" = "form" ] || die "login form never appeared (state: $state)"
sleep 1
snap "04-login-form" "Google Chrome" ""

js_set_value() { # React-safe input setter: selector, value
  chrome_js "(function(){
    var el = document.querySelector('$1');
    var set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    set.call(el, '$2');
    el.dispatchEvent(new Event('input', {bubbles: true}));
    el.dispatchEvent(new Event('change', {bubbles: true}));
    return 'ok';
  })()" >/dev/null
}
js_click_text() { # click the first button/link whose text matches the regex
  chrome_js "Array.from(document.querySelectorAll('button,a,input[type=submit]')).find(function(e){return /$1/i.test(e.innerText || e.value || '')}).click(); 'ok'" >/dev/null
}

js_set_value 'input[type=email], input[name=username]' "$EMAIL"
js_click_text '^Next$'
ok "submitted email"

pw_ready() { [ "$(chrome_js 'document.querySelector("input[type=password]") ? "yes" : "no"')" = "yes" ]; }
for i in $(seq 1 15); do pw_ready && break; sleep 1; done
pw_ready || die "password page never appeared"
sleep 1
snap "04-password" "Google Chrome" ""

js_set_value 'input[type=password]' "$PASS"
js_click_text '^Continue$'
ok "submitted password"
sleep 4

# Chrome's open-app dialog sits over the desktop-return page: click it, then
# capture the page. The dialog's buttons are not in the accessibility tree
# (Chromium Views limitation), so no AppleScript click can reach them — but
# CGWindowList reports the dialog's exact frame, so click the Open button at its
# fixed position within that measured frame with a real mouse event. The
# "Always allow" checkbox is never touched.
clicked=0
for i in $(seq 1 20); do
  DINFO=$("$WINID" "Google Chrome" "Open QSAR" 2>/dev/null | head -1)
  if [ -n "$DINFO" ]; then
    read -r _ dx dy dw dh <<<"$DINFO"
    cx=$(printf '%.0f' "$(echo "$dx + $dw * 0.87" | bc -l)")
    cy=$(printf '%.0f' "$(echo "$dy + $dh * 0.83" | bc -l)")
    osascript -e 'tell application "System Events" to set frontmost of process "Google Chrome" to true' 2>/dev/null
    sleep 0.4
    cliclick c:${cx},${cy}
    sleep 1
    # dialog gone == click landed
    if ! "$WINID" "Google Chrome" "Open QSAR" >/dev/null 2>&1; then
      clicked=1; ok "clicked Open QSARFlex"; break
    fi
  fi
  sleep 1
done
[ "$clicked" = 1 ] || die "could not dismiss the Open QSARFlex dialog"

sleep 2
snap "04-desktop-return" "Google Chrome" ""

step "Waiting for sign-in to complete…"
signed=0
for i in $(seq 1 120); do
  "$WINID" "$APP_PROC" "Data"       >/dev/null 2>&1 && { signed=1; break; }
  "$WINID" "$APP_PROC" "QSARFlex v" >/dev/null 2>&1 && { signed=1; break; }
  sleep 1
done
[ "$signed" = 1 ] || die "sign-in did not complete within 2 minutes"
ok "signed in"

# ── data download (first login only) ────────────────────────────────────────
step "Data download"
if wait_window "$APP_PROC" "Data" 25; then
  sleep 1; snap "05-data-download" "$APP_PROC" "Data"
else
  echo "   (Data Files Setup modal not seen — reference data may already be present)"
fi

# ── ready ───────────────────────────────────────────────────────────────────
step "Waiting for setup to finish (data download can take several minutes)…"
wait_window "$APP_PROC" "QSARFlex v" 1200 || echo "   (main window not detected in time)"
sleep 3
snap "06-app-ready" "$APP_PROC" "QSARFlex v"

say "Done. Captured:"
ls -1 "$OUT/${PREFIX}-"*.png 2>/dev/null | sed 's#.*/#   #'
