# ============================================================================
# capture-win-install.ps1 — fully automated Windows install-guide capture for
# QSARFlex (Local edition), browser-based sign-in flow. Runs INSIDE the Windows
# guest, in the interactive user session, NON-ELEVATED (see capture-win.sh —
# RunLevel Limited matters: an elevated app cannot receive the browser's
# qsarflex:// callback because of Windows integrity-level no-write-up).
#
# Clean slate (uninstall + wipe data/session + Edge cookies, Edge killed first
# so the cookie DB cannot be rewritten on exit) -> download -> Velopack wizard
# (01 welcome, 02 installing, 04 complete — the install finishes in under a
# second, so the last wizard frame is the Complete screen) -> 05 sign-in wait
# window -> maximized normal-profile Edge (06 email form, 06-password) -> login
# via UIA ValuePattern (no keyboard-focus dependency) -> real mouse click on
# Edge's "Open" prompt -> 07 data modal (rounded) -> 08 app ready.
#
# Inputs (staged by capture-win.sh into \\Mac\Home\Downloads):
#   _wincreds.txt   line1=email  line2=password
#   _winurl.txt     installer URL (beta or stable)
# Outputs: install-win-*.png in the share, _winlog.txt, _windone.txt
# ============================================================================
$ErrorActionPreference = 'Continue'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win {
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int ht, bool repaint);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint x, uint y, uint d, int e);
  [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr h, int attr, out RECT r, int size);
  public struct RECT { public int Left, Top, Right, Bottom; }
}
"@
[Win]::SetProcessDPIAware() | Out-Null

$SHARE = '\\Mac\Home\Downloads'
$URL   = 'https://downloads.multicase.com/qsarflex/local/QSARFlex-Local-Installer.exe'
if (Test-Path "$SHARE\_winurl.txt") { $URL = (Get-Content "$SHARE\_winurl.txt" | Select-Object -First 1).Trim() }
$DL    = "$env:USERPROFILE\Downloads\QSARFlex-Local-Installer.exe"
$LOG   = "$SHARE\_winlog.txt"
$DONE  = "$SHARE\_windone.txt"
Remove-Item $LOG, $DONE -ErrorAction SilentlyContinue
$creds = Get-Content "$SHARE\_wincreds.txt"
$EMAIL = $creds[0].Trim(); $PASS = $creds[1].Trim()

function Log($m) { ("[{0}] {1}" -f (Get-Date -Format HH:mm:ss), $m) | Out-File $LOG -Append -Encoding ascii }
function Fail($m) { Log $m; "fail" | Out-File $DONE -Encoding ascii; exit }
function InstProc { Get-Process -Name 'QSARFlex-Local-Installer' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1 }
function AppWin($titlePattern) { Get-Process QSARFlex -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle -match $titlePattern } | Select-Object -First 1 }
function Click($x, $y) { [Win]::SetCursorPos($x, $y) | Out-Null; Start-Sleep -Milliseconds 250; [Win]::mouse_event(2,0,0,0,0); [Win]::mouse_event(4,0,0,0,0) }
function Rect($h) { $r = New-Object Win+RECT; for ($i=0; $i -lt 6; $i++) { [Win]::GetWindowRect($h, [ref]$r) | Out-Null; if (($r.Right-$r.Left) -gt 0) { break }; Start-Sleep -Milliseconds 400 }; $r }
function Frame($h) { $r = New-Object Win+RECT; $ok = [Win]::DwmGetWindowAttribute($h, 9, [ref]$r, 16); if ($ok -ne 0 -or ($r.Right - $r.Left) -le 0) { $r = Rect $h }; $r }
function Grab($h, $name, [int]$radius = 0) {
  $r = Frame $h; $w = $r.Right - $r.Left; $ht = $r.Bottom - $r.Top
  if ($w -le 0) { return $false }
  $src = New-Object System.Drawing.Bitmap($w, $ht)
  ([System.Drawing.Graphics]::FromImage($src)).CopyFromScreen($r.Left, $r.Top, 0, 0, (New-Object System.Drawing.Size($w, $ht)))
  $path = "$SHARE\install-win-$name.png"
  if ($radius -gt 0) {
    $out = New-Object System.Drawing.Bitmap($w, $ht)
    $g = [System.Drawing.Graphics]::FromImage($out); $g.SmoothingMode = 'AntiAlias'
    $d = 2 * $radius; $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gp.AddArc(0,0,$d,$d,180,90); $gp.AddArc($w-$d,0,$d,$d,270,90)
    $gp.AddArc($w-$d,$ht-$d,$d,$d,0,90); $gp.AddArc(0,$ht-$d,$d,$d,90,90); $gp.CloseFigure()
    $g.SetClip($gp); $g.DrawImage($src, 0, 0, $w, $ht)
    $out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  } else { $src.Save($path, [System.Drawing.Imaging.ImageFormat]::Png) }
  return $true
}
function Place($h, [int]$fw = 0, [int]$fh = 0) {
  [Win]::ShowWindow($h, 9) | Out-Null; Start-Sleep -Milliseconds 300
  if ($fw -gt 0) { [Win]::MoveWindow($h, 20, 20, $fw, $fh, $true) | Out-Null }
  else { $r = Rect $h; $w = $r.Right - $r.Left; if ($w -gt 1360) { $w = 1360 }; [Win]::MoveWindow($h, 20, 20, $w, ($r.Bottom - $r.Top), $true) | Out-Null }
  Start-Sleep -Milliseconds 800; [Win]::SetForegroundWindow($h) | Out-Null; Start-Sleep -Milliseconds 400
}

# ── UI Automation helpers ───────────────────────────────────────────────────
function UiaRoot($h) { [System.Windows.Automation.AutomationElement]::FromHandle($h) }
function UiaFind($root, $ctype, $namePattern, $timeoutSec, $excludePattern = 'address and search|search bar') {
  for ($i=0; $i -lt $timeoutSec; $i++) {
    $all = $root.FindAll([System.Windows.Automation.TreeScope]::Descendants,
      (New-Object System.Windows.Automation.PropertyCondition(
        [System.Windows.Automation.AutomationElement]::ControlTypeProperty, $ctype)))
    foreach ($el in $all) {
      $n = $el.Current.Name
      if ($n -match $namePattern -and $n -notmatch $excludePattern) { return $el }
    }
    Start-Sleep -Seconds 1
  }
  return $null
}
# Password inputs expose an EMPTY UIA name in Chromium — find by IsPassword.
function UiaFindPassword($root, $timeoutSec) {
  $cond = New-Object System.Windows.Automation.PropertyCondition(
    [System.Windows.Automation.AutomationElement]::IsPasswordProperty, $true)
  for ($i=0; $i -lt $timeoutSec; $i++) {
    $el = $root.FindFirst([System.Windows.Automation.TreeScope]::Descendants, $cond)
    if ($el) { return $el }
    Start-Sleep -Seconds 1
  }
  return $null
}
function UiaClickEl($el) {
  $b = $el.Current.BoundingRectangle
  Click ([int]($b.X + $b.Width/2)) ([int]($b.Y + $b.Height/2))
}
# Set a web input's text. ValuePattern needs no keyboard focus (SendKeys from a
# hidden task cannot steal focus); falls back to click + clipboard paste.
function UiaSetText($el, $text) {
  try {
    $vp = $el.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern)
    $vp.SetValue($text)
    Start-Sleep -Milliseconds 400
    if ($el.Current.Name -ne '' -or $true) { return $true }
  } catch { }
  UiaClickEl $el; Start-Sleep -Milliseconds 600
  Set-Clipboard -Value $text
  [System.Windows.Forms.SendKeys]::SendWait("^a^v")
  Start-Sleep -Milliseconds 400
  return $true
}

# ── clean slate ─────────────────────────────────────────────────────────────
Log "clean slate"
Get-Process QSARFlex, Update, QSARFlex-Local-Installer, msedge -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 4   # Edge must be fully dead BEFORE cookie deletion or it rewrites the DB on exit
$L = $env:LOCALAPPDATA; $A = $env:APPDATA
@(
  "$L\QSARFlex", "$L\MultiCASE\QSARFlex", "$A\MultiCASE\QSARFlex",
  "$A\Microsoft\Windows\Start Menu\Programs\QSARFlex",
  "$A\Microsoft\Windows\Start Menu\Programs\QSAR Flex",
  "$env:USERPROFILE\Desktop\QSARFlex.lnk",
  "$env:USERPROFILE\Desktop\QSAR Flex.lnk",
  "$L\Microsoft\Edge\User Data\Default\Cookies",
  "$L\Microsoft\Edge\User Data\Default\Network\Cookies",
  "$L\Microsoft\Edge\User Data\Default\Network\Cookies-journal"
) | ForEach-Object { if (Test-Path $_) { Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue } }
Log "wiped app data + edge cookies"

# ── download ────────────────────────────────────────────────────────────────
Log "downloading installer: $URL"
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri $URL -OutFile $DL -UseBasicParsing
Log ("downloaded {0:N0} MB" -f ((Get-Item $DL).Length / 1MB))

# ── installer wizard ────────────────────────────────────────────────────────
Log "launch installer"
Start-Process $DL
$p = $null; for ($i=0; $i -lt 30; $i++) { $p = InstProc; if ($p) { break }; Start-Sleep -Seconds 1 }
if (-not $p) { Fail "installer window never appeared" }
$h = $p.MainWindowHandle; Place $h
if (Grab $h '01-welcome') { Log "saved 01-welcome" }

# Welcome -> Install (primary button = bottom-right). There is no license
# page: the installer goes Welcome -> Installing -> Complete.
$r = Rect $h; Click ($r.Right - 87) ($r.Bottom - 63); Start-Sleep -Milliseconds 800
$p = InstProc; if ($p) { $h = $p.MainWindowHandle; Place $h; if (Grab $h '02-installing') { Log "saved 02-installing" } }

# Installing -> Complete: keep grabbing; the last good frame is the Complete
# screen (04). The docs show Welcome, Installing, Complete.
# Race-safe: grab to a temp file and promote it ONLY if the installer still
# exists after the grab — the final frame after the window closes is the bare
# desktop (the dead window's frame still reports its old rectangle).
$got04 = $false
for ($i=0; $i -lt 600; $i++) {
  if (-not (InstProc)) { break }
  if ((Grab $h '04-tmp') -and (InstProc)) {
    Copy-Item "$SHARE\install-win-04-tmp.png" "$SHARE\install-win-04-complete.png" -Force
    $got04 = $true
  }
  Start-Sleep -Milliseconds 100
}
Remove-Item "$SHARE\install-win-04-tmp.png" -ErrorAction SilentlyContinue
if ($got04) { Log "saved 04-complete" } else { Log "04-complete NOT captured (wizard closed too fast)" }

# ── 05: sign-in wait window ─────────────────────────────────────────────────
$p = $null
for ($i=0; $i -lt 120; $i++) { $p = AppWin 'Sign in'; if ($p) { break }; Start-Sleep -Seconds 1 }
if (-not $p) { Fail "sign-in wait window never appeared" }
Start-Sleep -Seconds 2
$waitH = $p.MainWindowHandle
[Win]::SetForegroundWindow($waitH) | Out-Null; Start-Sleep -Milliseconds 600
if (Grab $waitH '05-signin') { Log "saved 05-signin" }

# ── 06: the app opened the normal-profile Edge at the hosted login ──────────
$edge = $null
for ($i=0; $i -lt 60; $i++) {
  $edge = Get-Process msedge -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
  if ($edge) { break }; Start-Sleep -Seconds 1
}
if (-not $edge) { Fail "edge never opened" }
$eh = $edge.MainWindowHandle
[Win]::ShowWindow($eh, 3) | Out-Null   # maximize
Start-Sleep -Seconds 8                 # page load
[Win]::SetForegroundWindow($eh) | Out-Null; Start-Sleep -Milliseconds 600
$root = UiaRoot $eh

# If a session survived the cookie wipe, Cognito shows "You're still signed
# in" instead of the form — click "Sign in as a different user?" to get the
# full email/password flow (and a clean empty-form screenshot).
$diff = UiaFind $root ([System.Windows.Automation.ControlType]::Hyperlink) 'different user' 6
if ($diff) {
  UiaClickEl $diff
  Log "clicked 'Sign in as a different user'"
  Start-Sleep -Seconds 5
}

if (Grab $eh '06-login-form') { Log "saved 06-login-form" }

# email -> Next
$emailEl = UiaFind $root ([System.Windows.Automation.ControlType]::Edit) 'name@host|mail' 20
if (-not $emailEl) { Fail "email field not found" }
UiaSetText $emailEl $EMAIL | Out-Null
[System.Windows.Forms.SendKeys]::SendWait("{ESC}")   # dismiss any autofill dropdown
$btn = UiaFind $root ([System.Windows.Automation.ControlType]::Button) '^Next$' 8
if ($btn) { UiaClickEl $btn } else { [System.Windows.Forms.SendKeys]::SendWait("{ENTER}") }
Log "submitted email"
Start-Sleep -Seconds 5

# password page: grab it BEFORE typing (clean, empty field for the docs)
if (Grab $eh '06-password') { Log "saved 06-password" }
$passEl = UiaFindPassword $root 25
if (-not $passEl) { $passEl = UiaFind $root ([System.Windows.Automation.ControlType]::Edit) 'assword' 5 }
if (-not $passEl) { Fail "password field not found" }
UiaSetText $passEl $PASS | Out-Null
[System.Windows.Forms.SendKeys]::SendWait("{ESC}")
$btn = UiaFind $root ([System.Windows.Automation.ControlType]::Button) '^Continue$' 8
if ($btn) { UiaClickEl $btn } else { [System.Windows.Forms.SendKeys]::SendWait("{ENTER}") }
Log "submitted password"
Start-Sleep -Seconds 6

# desktop-return page ("You're signed in") + Edge's external-protocol prompt.
# A REAL mouse click on Open (Invoke() is not a user gesture; and this only
# works because the app is NON-elevated).
$open = UiaFind $root ([System.Windows.Automation.ControlType]::Button) '^Open$' 30
if ($open) { UiaClickEl $open; Log "clicked Open on Edge prompt" }
else { Log "Open prompt not seen (may have auto-opened)" }
Start-Sleep -Seconds 2   # prompt gone; the You're-signed-in page is unobstructed
if (Grab $eh '06-desktop-return') { Log "saved 06-desktop-return" }

# ── 07: data download modal ─────────────────────────────────────────────────
$p = $null
for ($i=0; $i -lt 180; $i++) { $p = AppWin 'Download|Required|Data'; if ($p) { break }; Start-Sleep -Seconds 1 }
if ($p) {
  [Win]::SetForegroundWindow($p.MainWindowHandle) | Out-Null
  Start-Sleep -Seconds 10   # let the progress bar fill a bit
  if (Grab $p.MainWindowHandle '07-data-download' 14) { Log "saved 07-data-download" }
} else { Log "data modal not seen (data may already be present)" }

# ── 08: ready ───────────────────────────────────────────────────────────────
$p = $null
for ($i=0; $i -lt 1200; $i++) { $p = AppWin 'QSAR Flex v'; if ($p) { break }; Start-Sleep -Seconds 1 }
if (-not $p) { Fail "app never became ready" }
Start-Sleep -Seconds 8   # let the workspace render and transient windows settle
# nothing may overlap the app during the grab: CopyFromScreen captures the
# screen, not the window buffer — minimize every Edge window first
Get-Process msedge -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } |
  ForEach-Object { [Win]::ShowWindow($_.MainWindowHandle, 6) | Out-Null }
Start-Sleep -Seconds 1
$h = $p.MainWindowHandle; Place $h 1600 1000
Start-Sleep -Seconds 2
[Win]::SetForegroundWindow($h) | Out-Null; Start-Sleep -Milliseconds 800
if (Grab $h '08-app-ready') { Log "saved 08-app-ready" }
Log "done"
"ok" | Out-File $DONE -Encoding ascii
