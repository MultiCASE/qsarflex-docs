#!/usr/bin/env bash
# ============================================================================
# capture-win.sh  —  drive the QSARFlex (Local) Windows install-guide capture
# from the Mac host.
#
# Runs capture-win-install.ps1 inside a Parallels Windows VM, in the interactive
# user session (via a LogonType=Interactive scheduled task, because `prlctl exec`
# runs as SYSTEM/session-0 where screen capture is black). Screenshots are written
# by the guest straight into ../.gitbook/assets over the Parallels home share.
#
# Requires: Parallels with a running Windows VM that has Parallels Tools, and
# credentials in scripts/.env.local (QSARFLEX_EMAIL / QSARFLEX_PASS).
#
# Usage:  ./scripts/capture-win.sh   [VM-name]      (default VM name: "Windows 11")
#         CHANNEL=beta ./scripts/capture-win.sh     (beta feed — the only live
#                                                     channel today)
# ============================================================================
set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
VM="${1:-${QSARFLEX_WIN_VM:-Windows 11}}"
SHARE="$HOME/Downloads"          # == \\Mac\Home\Downloads inside the guest

[ -f "$SCRIPT_DIR/.env.local" ] && source "$SCRIPT_DIR/.env.local"
: "${QSARFLEX_EMAIL:?set QSARFLEX_EMAIL in scripts/.env.local}"
: "${QSARFLEX_PASS:?set QSARFLEX_PASS in scripts/.env.local}"
command -v prlctl >/dev/null || { echo "!! prlctl not found (install Parallels)"; exit 1; }
prlctl list "$VM" >/dev/null 2>&1 || { echo "!! VM '$VM' not found (prlctl list --all)"; exit 1; }

# CHANNEL=beta ./scripts/capture-win.sh  → captures from the beta feed.
# QSARFlex Local ships beta-only for now; stable path is wired for when it exists.
CHANNEL="${CHANNEL:-stable}"
if [ "$CHANNEL" = "beta" ]; then
  INSTALLER_URL="https://downloads.multicase.com/qsarflex/local/beta/QSARFlex-Local-Beta-Installer.exe"
else
  INSTALLER_URL="https://downloads.multicase.com/qsarflex/local/QSARFlex-Local-Installer.exe"
fi

# credentials + driver staged where the guest can read them
printf '%s\n%s\n' "$QSARFLEX_EMAIL" "$QSARFLEX_PASS" > "$SHARE/_wincreds.txt"
printf '%s\n' "$INSTALLER_URL" > "$SHARE/_winurl.txt"
cp "$SCRIPT_DIR/capture-win-install.ps1" "$SHARE/capture-win-install.ps1"

# wrapper that launches the driver in the interactive session (session 1).
# RunLevel Limited is REQUIRED: an elevated task launches the app elevated,
# and Windows integrity-level no-write-up then silently blocks the browser's
# qsarflex:// callback from ever reaching it. The .vbs hop hides the console
# window that would otherwise flash on every task start.
cat > "$SHARE/_winrun.vbs" <<'VBS'
CreateObject("Wscript.Shell").Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File ""\\Mac\Home\Downloads\capture-win-install.ps1""", 0, False
VBS
cat > "$SHARE/_winrun.ps1" <<'PS1'
$u = ((Get-CimInstance Win32_ComputerSystem).UserName -split '\\')[-1]
$action = New-ScheduledTaskAction -Execute 'wscript.exe' -Argument '"\\Mac\Home\Downloads\_winrun.vbs"'
$principal = New-ScheduledTaskPrincipal -UserId $u -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName 'QSFWinCap' -Action $action -Principal $principal -Force | Out-Null
Start-ScheduledTask -TaskName 'QSFWinCap'
PS1

rm -f "$SHARE/_windone.txt" "$SHARE/_winlog.txt"
echo "Launching capture inside '$VM' (clean install + data download, several minutes)…"
prlctl exec "$VM" powershell -ExecutionPolicy Bypass -File '\\Mac\Home\Downloads\_winrun.ps1' >/dev/null 2>&1

# wait for the guest to signal completion
for i in $(seq 1 1200); do [ -f "$SHARE/_windone.txt" ] && break; sleep 2; done
echo "== progress log =="; cat "$SHARE/_winlog.txt" 2>/dev/null
STATUS="$(tr -d "\r" < "$SHARE/_windone.txt" 2>/dev/null)"
rm -f "$SHARE/_wincreds.txt"
# the guest writes shots to the shared Downloads; move them into the repo assets
mv -f "$SHARE"/install-win-*.png "$ROOT/.gitbook/assets/" 2>/dev/null
echo "== captured =="; ls -1 "$ROOT/.gitbook/assets"/install-win-*.png 2>/dev/null | sed 's#.*/#   #'
[ "$STATUS" = "ok" ] && echo "DONE ✓" || echo "!! did not complete cleanly (status: ${STATUS:-timeout})"
