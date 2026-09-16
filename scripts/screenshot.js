/**
 * QSARFlex documentation screenshot automation
 * Run via: ./scripts/start.sh
 * Expects: FE at localhost:3000, backends at 8080/8081, postgres at 5433
 */

const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const INDIVIDUAL_EMAIL  = 'demo@qsarflex.test';
const ENTERPRISE_EMAIL  = 'demo-enterprise@qsarflex.test';
const PASS              = 'QSARFlexDemo2026!';
const BASE              = 'http://localhost:3000';
const OUT               = path.resolve(__dirname, '../.gitbook/assets');

const INDIVIDUAL_USER = '619bc5c0-6081-70ff-5a62-fcec8d5c1bba';
const ENTERPRISE_USER = '41dbb5b0-70f1-7046-5c01-7bc9cc86cb83';

const L_INDIVIDUAL_SUBSCRIPTION = '11111111-1111-1111-1111-111111111111';
const L_INDIVIDUAL_PAYPERTEST   = '22222222-2222-2222-2222-222222222222';
const L_INDIVIDUAL_ONDEMAND     = '33333333-3333-3333-3333-333333333333';
const L_ENTERPRISE_SUBSCRIPTION = '44444444-4444-4444-4444-444444444444';
const L_ENTERPRISE_PAYPERTEST   = '55555555-5555-5555-5555-555555555555';
const L_ENTERPRISE_ONDEMAND     = '66666666-6666-6666-6666-666666666666';

const VIEWPORT = { width: 1440, height: 900 };

// Files for realistic demos
const DK_FILE   = path.resolve(__dirname, 'samples/dk_demo.smi');
const RXN_FILES = [
  '/Users/multicase/Downloads/Lisininopril_step_1.RXN',
  '/Users/multicase/Downloads/Lisininopril_step_2.RXN',
  '/Users/multicase/Downloads/Lisininopril_step_3.RXN',
  '/Users/multicase/Downloads/Lisininopril_step_4.RXN',
  '/Users/multicase/Downloads/Lisininopril_step_5.RXN',
];

const SAMPLE_COMPOUNDS = [
  { id: 1, name: "Aspirin",          smiles: "CC(=O)Oc1ccccc1C(=O)O",               cas: "50-78-2",    type: "compound" },
  { id: 2, name: "Caffeine",         smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",        cas: "58-08-2",    type: "compound" },
  { id: 3, name: "Testosterone",     smiles: "CC12CCC3C(C1CCC2O)CCC4=CC(=O)CCC34C", cas: "58-22-0",    type: "compound" },
  { id: 4, name: "Ibuprofen",        smiles: "CC(C)Cc1ccc(cc1)C(C)C(=O)O",          cas: "15687-27-1", type: "compound" },
  { id: 5, name: "Chloroquine",      smiles: "CCN(CC)CCCC(C)Nc1ccnc2cc(Cl)ccc12",   cas: "54-05-7",    type: "compound" },
  { id: 6, name: "Benzo[a]pyrene",   smiles: "c1ccc2c(c1)cc1ccc3cccc4ccc2c1c34",    cas: "50-32-8",    type: "compound" },
];

const PRECOMPUTED_RESULTS = [
  { id: 1, modules: { "Water Solubility": "3.4 mg/mL", "LogP": "1.19", "Boiling Point": "321 °C" } },
  { id: 2, modules: { "Water Solubility": "21.6 mg/mL", "LogP": "-0.07", "Boiling Point": "416 °C" } },
  { id: 3, modules: { "Water Solubility": "0.06 mg/mL", "LogP": "3.32", "Boiling Point": "439 °C" } },
  { id: 4, modules: { "Water Solubility": "0.09 mg/mL", "LogP": "3.97", "Boiling Point": "319 °C" } },
  { id: 5, modules: { "Water Solubility": "0.28 mg/mL", "LogP": "4.63", "Boiling Point": "460 °C" } },
  { id: 6, modules: { "Water Solubility": "0.001 mg/mL", "LogP": "6.04", "Boiling Point": "495 °C" } },
];

// Clear output dir so stale screenshots from previous runs don't accumulate.
// NEVER touch install-win-* / install-mac-*: those are captured by a different
// harness (capture-win.sh, capture-mac-install.sh) against real installers on a
// VM, they live in this same flat directory, and this line used to delete all 17
// of them on every web run — leaving both published install guides pointing at
// missing images.
// ONLY=workspace (or licenses, profile) re-shoots one
// section and leaves every other frame in place, for a fix that touched one screen.
const ONLY = process.env.ONLY || '';
const want = (section) => !ONLY || ONLY === section;
const KEEP = /^install-(win|mac)-/
if (fs.existsSync(OUT) && !ONLY) {
  fs.readdirSync(OUT)
    .filter(f => f.endsWith('.png') && !KEEP.test(f))
    .forEach(f => fs.unlinkSync(path.join(OUT, f)));
}
fs.mkdirSync(OUT, { recursive: true });

// ── psql helpers ──────────────────────────────────────────────────────────────

function psql(sql) {
  const result = spawnSync(
    'psql', ['-h', 'localhost', '-p', '5433', '-U', 'screenshots', '-d', 'qsarflex_screenshots'],
    { input: sql, env: { ...process.env, PGPASSWORD: 'screenshots' }, stdio: 'pipe' }
  );
  if (result.status !== 0) throw new Error(`psql failed: ${result.stderr.toString()}`);
}

function redisFlush() {
  spawnSync('redis-cli', ['-h', 'localhost', '-p', '6379', 'FLUSHALL'], { stdio: 'pipe' });
}

function activateLicense(licenseId, userId) {
  psql(`UPDATE "Licenses" SET "Status" = 'Inactive', "ActivatedById" = NULL, "ActivatedTime" = NULL WHERE "Status" = 'Active'`);
  psql(`UPDATE "Licenses" SET "Status" = 'Active', "ActivatedById" = '${userId}', "ActivatedTime" = NOW() WHERE "Id" = '${licenseId}'`);
  redisFlush();
}

function deactivateAll() {
  psql(`UPDATE "Licenses" SET "Status" = 'Inactive', "ActivatedById" = NULL, "ActivatedTime" = NULL`);
  redisFlush();
}

// ── helpers ───────────────────────────────────────────────────────────────────

const HIDE_DEV_OVERLAY = `
  nextjs-portal, [data-nextjs-dialog], [data-nextjs-toast],
  #__next-build-indicator, .__next-build-watcher,
  [class*="nextjs__container"], [id*="__next-build"],
  nextjs-portal { display: none !important; }
`;

async function addMarker(page, selector, label = '', side = 'right') {
  let box;
  try {
    box = await page.locator(selector).first().boundingBox({ timeout: 2000 });
  } catch { return false; }
  if (!box || box.width === 0 || box.height === 0) return false;

  await page.evaluate(({ b, label, side }) => {
    const wrapper = document.createElement('div');
    wrapper.className = '__qf_marker';
    wrapper.style.cssText = `
      position: fixed; z-index: 2147483647; pointer-events: none;
      display: flex; align-items: center; gap: 6px;
      font-family: -apple-system, sans-serif; font-weight: 700;
    `;

    const arrowRotation = { right: 180, left: 0, top: 90, bottom: 270 }[side] ?? 180;
    const arrow = document.createElement('div');
    arrow.innerHTML = `<svg width="30" height="16" viewBox="0 0 30 16" fill="none">
      <path d="M0 8 L20 8 M16 2 L26 8 L16 14" stroke="#E8380D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    arrow.style.cssText = `transform:rotate(${arrowRotation}deg); display:flex; flex-shrink:0;`;

    const badge = document.createElement('span');
    badge.textContent = label;
    badge.style.cssText = `
      background:#E8380D; color:#fff; border-radius:4px;
      padding:2px 7px; white-space:nowrap; font-size:11px; line-height:18px;
    `;

    const GAP = 8;
    let top, left;
    if (side === 'right') {
      top  = b.y + b.height / 2 - 8;
      left = b.x + b.width + GAP;
      wrapper.append(arrow, badge);
    } else if (side === 'left') {
      top  = b.y + b.height / 2 - 8;
      left = Math.max(GAP, b.x - GAP - 160);
      wrapper.append(badge, arrow);
    } else if (side === 'top') {
      top  = b.y - GAP - 28;
      left = b.x + b.width / 2 - 15;
      wrapper.style.flexDirection = 'column';
      wrapper.append(badge, arrow);
    } else {
      top  = b.y + b.height + GAP;
      left = b.x + b.width / 2 - 15;
      wrapper.style.flexDirection = 'column';
      wrapper.append(arrow, badge);
    }

    wrapper.style.top  = `${Math.max(4, top)}px`;
    wrapper.style.left = `${Math.max(4, left)}px`;
    document.body.appendChild(wrapper);
  }, { b: box, label, side });
  return true;
}

async function removeMarkers(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.__qf_marker').forEach(el => el.remove());
  });
}

// Callout badges were tuned for the 3.x layout. The 4.0 UI is denser — on the
// Curate action bar, the Evaluate dialog and the empty-library card they land on
// top of the very controls and copy they point at. Ship clean screenshots; the
// prose names every control it refers to.
const DRAW_MARKERS = false;

async function shot(page, name, { markers = [] } = {}) {
  if (!DRAW_MARKERS) markers = [];
  await page.addStyleTag({ content: HIDE_DEV_OVERLAY }).catch(() => {});
  for (const m of markers) {
    await addMarker(page, m.selector, m.label || '', m.side || 'right');
  }
  await page.waitForTimeout(markers.length > 0 ? 300 : 800);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  await removeMarkers(page);
  console.log('  📸', name);
}

async function setTheme(page, theme) {
  await page.evaluate((t) => localStorage.setItem('theme', t), theme);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
}

async function injectLibrary(page, compounds, results) {
  await page.evaluate(([c, r]) => {
    localStorage.setItem('library-storage', JSON.stringify({ state: { library: c }, version: 0 }));
    if (r) {
      localStorage.setItem('evaluation-result-storage', JSON.stringify({ state: { results: r }, version: 0 }));
    } else {
      localStorage.removeItem('evaluation-result-storage');
    }
  }, [compounds || SAMPLE_COMPOUNDS, results || null]);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
}

async function clearLibrary(page) {
  // The workspace and its results persist in IndexedDB (lib/idb.ts), not
  // localStorage; drop every database the origin holds, then reload.
  await page.evaluate(async () => {
    localStorage.removeItem('library-storage');
    localStorage.removeItem('evaluation-result-storage');
    const dbs = (indexedDB.databases ? await indexedDB.databases() : []) || [];
    await Promise.all(dbs.map(d => new Promise(res => { const r = indexedDB.deleteDatabase(d.name); r.onsuccess = r.onerror = r.onblocked = () => res(); })));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
}

async function navigateTo(page, url) {
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
}

async function signIn(page, email) {
  await page.goto(`${BASE}/auth/signin`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.click('button:has-text("Sign in with Cognito")');
  await page.waitForURL('**/login**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.locator('input[name="username"]:visible').fill(email);
  await page.locator('input[name="username"]:visible').press('Tab');
  await page.locator('input[name="password"]:visible, input[type="password"]:visible').fill(PASS);
  await page.locator('button[type="submit"]:visible, input[type="submit"]:visible').first().click();
  await page.waitForURL(`${BASE}/**`, { timeout: 20000 });
  await page.waitForLoadState('networkidle');
  console.log(`  ✓ Signed in as ${email}`);
}

// ── Sign-in page screenshots (before login) ───────────────────────────────────

async function screenshotSignIn(page) {
  console.log('\n── Sign-in pages ──');
  await page.goto(`${BASE}/auth/signin`, { waitUntil: 'networkidle' });

  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, 'signin-light.png');

  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, 'signin-dark.png');

  // Cognito hosted UI — both username and password show on the same page
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.click('button:has-text("Sign in with Cognito")');
  await page.waitForURL('**/login**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);

  await page.locator('input[name="username"]:visible').fill(INDIVIDUAL_EMAIL);
  await page.locator('input[name="username"]:visible').press('Tab');
  await page.locator('input[name="password"]:visible, input[type="password"]:visible').fill(PASS);
  await page.waitForTimeout(400);
  await page.locator('button[type="submit"]:visible, input[type="submit"]:visible').first().click();
  await page.waitForURL(`${BASE}/**`, { timeout: 20000 });
  await page.waitForLoadState('networkidle');
  console.log('  ✓ Signed in');
}

// ── Library & Compound screenshots ───────────────────────────────────────────

// ── License-type screenshots ──────────────────────────────────────────────────

async function screenshotLicenseTypes(page, theme, isEnterprise) {
  const prefix = isEnterprise ? 'enterprise' : 'individual';
  const userId = isEnterprise ? ENTERPRISE_USER : INDIVIDUAL_USER;

  const variants = isEnterprise
    ? [
        { id: L_ENTERPRISE_SUBSCRIPTION, slug: 'subscription' },
        { id: L_ENTERPRISE_PAYPERTEST,   slug: 'paypertest'   },
        { id: L_ENTERPRISE_ONDEMAND,     slug: 'ondemand'     },
      ]
    : [
        { id: L_INDIVIDUAL_SUBSCRIPTION, slug: 'subscription' },
        { id: L_INDIVIDUAL_PAYPERTEST,   slug: 'paypertest'   },
        { id: L_INDIVIDUAL_ONDEMAND,     slug: 'ondemand'     },
      ];

  for (const { id, slug } of variants) {
    activateLicense(id, userId);
    await navigateTo(page, '/profile?tab=license');
    await page.waitForTimeout(900);
    await shot(page, `profile-license-${prefix}-${slug}-${theme}.png`);
  }

  // restore the default active license
  activateLicense(isEnterprise ? L_ENTERPRISE_SUBSCRIPTION : L_INDIVIDUAL_SUBSCRIPTION, userId);
}

async function screenshotLicenseActivation(page, theme) {
  // Deactivate everything so L1 (subscription) shows as Inactive with an Activate button
  deactivateAll();
  await navigateTo(page, '/profile?tab=license');
  await page.waitForTimeout(900);

  try {
    const activateBtn = page.locator('button').filter({ hasText: /^activate$/i }).first();
    if (await activateBtn.isVisible({ timeout: 6000 }).catch(() => false)) {
      await activateBtn.click();
      await page.waitForSelector('[role="alertdialog"], [role="dialog"]', { timeout: 6000 });
      await page.waitForTimeout(700);
      await shot(page, `license-activate-${theme}.png`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    } else {
      console.warn('  ⚠ Activate button not found for activation screenshot');
      await page.screenshot({ path: `${OUT}/debug-activate-${theme}.png` }).catch(() => {});
    }
  } catch (e) {
    console.warn('  ⚠ License activation screenshot:', e.message?.split('\n')[0]);
    await page.screenshot({ path: `${OUT}/debug-activate-${theme}.png` }).catch(() => {});
  }

  // Restore individual subscription as active
  activateLicense(L_INDIVIDUAL_SUBSCRIPTION, INDIVIDUAL_USER);
}

// ── Profile screenshots ───────────────────────────────────────────────────────

async function screenshotProfile(page, theme) {
  console.log(`\n  👤 Profile/License (${theme})`);

  await navigateTo(page, '/profile');
  await page.waitForTimeout(700);
  await shot(page, `profile-${theme}.png`);

  await navigateTo(page, '/profile?tab=license');
  await page.waitForTimeout(900);
  await shot(page, `profile-license-${theme}.png`, {
    markers: [
      { selector: 'button:has-text("Update users")', label: 'Assign / remove seat', side: 'top' },
      { selector: 'button:has-text("Invite user")',  label: 'Invite new user',       side: 'bottom' },
    ],
  });

  try {
    const updateBtn = page.locator('button').filter({ hasText: /update users/i }).first();
    await updateBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await updateBtn.scrollIntoViewIfNeeded().catch(() => {});
    if (await updateBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await updateBtn.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 6000 });
      await page.waitForTimeout(700);
      await shot(page, `profile-license-assign-users-${theme}.png`, {
        markers: [
          { selector: '[role="dialog"] [role="checkbox"]:first-of-type', label: 'Toggle seat assignment', side: 'right' },
        ],
      });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch {}

  try {
    const inviteBtn = page.locator('button').filter({ hasText: /invite user/i }).first();
    await inviteBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await inviteBtn.scrollIntoViewIfNeeded().catch(() => {});
    if (await inviteBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await shot(page, `profile-invite-user-${theme}.png`, {
        markers: [
          { selector: 'button:has-text("Invite user")', label: 'Invite new user', side: 'bottom' },
        ],
      });
      await inviteBtn.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 6000 });
      await page.waitForTimeout(700);
      const emailInput = page.locator('[role="dialog"] input[type="email"], [role="dialog"] input[type="text"]').first();
      if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await emailInput.fill('newuser@democorp.com');
        await page.waitForTimeout(300);
      }
      await shot(page, `profile-users-invite-dialog-${theme}.png`, {
        markers: [
          { selector: '[role="dialog"] input[type="email"], [role="dialog"] input[type="text"]', label: 'Enter email address', side: 'right' },
        ],
      });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch {}

  await navigateTo(page, '/profile?tab=users');
  await page.waitForTimeout(900);
  await shot(page, `profile-users-${theme}.png`, {
    markers: [
      { selector: 'button:has-text("Invite user")', label: 'Invite new user', side: 'top' },
    ],
  });
}

// ── Workspace screenshots ─────────────────────────────────────────────────────
// One workspace: the table, the row panel on the left, the Add and Curate
// menus, Evaluate. Files go in through the hidden file inputs the page keeps
// for its menu items (compounds first, reactions second), so the same import
// path runs as for a user's file.

const REACTION_SMILES = 'CC(=O)Cl.OCC>>CC(=O)OCC';

async function waitIdle(page, ms = 800) {
  // The check and the loads show an overlay while they run; wait for it to go.
  await page.waitForFunction(() => !document.body.innerText.match(/Reading the files|Checking the structures|Curating \d+ compounds|Running modules/), null, { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

async function rowByName(page, name) {
  return page.locator('tbody tr[data-row-id]').filter({ hasText: name }).first();
}

async function openRow(page, name) {
  const row = await rowByName(page, name);
  await row.scrollIntoViewIfNeeded();
  await row.click();
  await page.waitForTimeout(900);
  return row;
}

async function closePanel(page) {
  const close = page.locator('button[aria-label="Close (Esc)"]').first();
  if (await close.isVisible({ timeout: 800 }).catch(() => false)) await close.click();
  await page.waitForTimeout(400);
}

async function openMenu(page, label) {
  await page.locator('button').filter({ hasText: new RegExp(`^${label}`) }).first().click();
  await page.waitForSelector('[role="menu"], [role="menuitem"]', { timeout: 5000 });
  await page.waitForTimeout(400);
}

async function menuItem(page, text) {
  const item = page.locator('[role="menuitem"]').filter({ hasText: text }).first();
  await item.click();
  await page.waitForTimeout(500);
}

async function pressEscape(page, times = 1) {
  for (let i = 0; i < times; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
}

async function screenshotWorkspace(page, theme) {
  console.log(`\n  🧭 Workspace (${theme})`);
  await clearLibrary(page);
  await navigateTo(page, '/');
  await page.waitForTimeout(600);

  // ── empty workspace ────────────────────────────────────────────────────────
  await shot(page, `workspace-empty-${theme}.png`);

  // ── Add ▾ → Type a compound… ───────────────────────────────────────────────
  try {
    await openMenu(page, 'Add');
    await menuItem(page, 'Type a compound');
    await page.waitForSelector('[role="dialog"]:has-text("Type a compound")', { timeout: 6000 });
    const smilesInput = page.locator('[role="dialog"] input').first();
    await smilesInput.fill('CC(=O)Oc1ccccc1C(=O)O');
    await page.waitForTimeout(600);
    await shot(page, `add-compound-${theme}.png`);
    const autofill = page.locator('[role="dialog"] button').filter({ hasText: /auto ?fill/i }).first();
    if (await autofill.isVisible({ timeout: 1500 }).catch(() => false)) {
      await autofill.click();
      await page.waitForFunction(() => {
        const inputs = Array.from(document.querySelectorAll('[role="dialog"] input'));
        return inputs.some(i => /aspirin/i.test(i.value)) || document.body.innerText.includes('50-78-2');
      }, null, { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(600);
      await shot(page, `add-compound-autofill-${theme}.png`);
    }
    await pressEscape(page);
  } catch (e) { console.warn('  ⚠ Type a compound:', e.message?.split('\n')[0]); await pressEscape(page, 2); }

  // ── Add ▾ → Draw in ChemiGraphy… ──────────────────────────────────────────
  try {
    await openMenu(page, 'Add');
    await menuItem(page, 'Draw in ChemiGraphy');
    await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
    await page.waitForFunction(() => !document.body.innerText.includes('Starting the editor'), null, { timeout: 60000 }).catch(() => {});
    await page.mouse.move(820, 460); await page.waitForTimeout(2500);
    await shot(page, `editor-new-${theme}.png`);
    await page.locator('[role="dialog"] button').filter({ hasText: /^Cancel$/ }).first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(500);
  } catch (e) { console.warn('  ⚠ Editor (new):', e.message?.split('\n')[0]); await pressEscape(page, 2); }

  // ── load the demo file: the table, and the count ──────────────────────────
  await page.locator('input[type="file"]').first().setInputFiles(DK_FILE);
  await waitIdle(page, 1500);
  await page.waitForSelector('tbody tr[data-row-id]', { timeout: 60000 });
  await page.waitForTimeout(1200);
  await shot(page, `workspace-table-${theme}.png`);

  // ── the three menus ───────────────────────────────────────────────────────
  try { await openMenu(page, 'Add'); await shot(page, `workspace-add-menu-${theme}.png`); await pressEscape(page); } catch {}
  try { await openMenu(page, 'Curate'); await shot(page, `workspace-curate-menu-${theme}.png`); await pressEscape(page); } catch {}
  try {
    await openMenu(page, 'Curate');
    const sub = page.locator('[role="menuitem"]').filter({ hasText: /Download curated/ }).first();
    await sub.hover(); await page.waitForTimeout(700);
    await shot(page, `workspace-download-menu-${theme}.png`);
    await pressEscape(page, 2);
  } catch { await pressEscape(page, 2); }
  try {
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+k' : 'Control+k');
    await page.waitForSelector('[role="dialog"], [cmdk-root]', { timeout: 5000 });
    await page.waitForTimeout(600);
    await shot(page, `workspace-command-bar-${theme}.png`);
    await pressEscape(page);
  } catch { await pressEscape(page); }

  // ── the row panel, the structure viewer, Edit SMILES ──────────────────────
  try {
    await openRow(page, 'Aspirin');
    await shot(page, `workspace-panel-${theme}.png`);
    // The panel's structure is the viewer's trigger: click the drawing.
    const view = page.locator('.cursor-zoom-in').first();
    if (await view.isVisible({ timeout: 2000 }).catch(() => false)) {
      await view.click(); await page.waitForTimeout(1500);
      await shot(page, `workspace-structure-viewer-${theme}.png`);
      await pressEscape(page);
    }
    // Edit SMILES: the row's own key, with the row focused
    const row = await rowByName(page, 'Aspirin'); await row.click(); await page.waitForTimeout(300);
    await page.keyboard.press('s');
    await page.waitForSelector('[role="dialog"]:has-text("SMILES")', { timeout: 5000 });
    const field = page.locator('[role="dialog"] input, [role="dialog"] textarea').first();
    await field.fill('CC(=O)Oc1ccccc1C(=O)OC');
    await page.waitForTimeout(400);
    await shot(page, `workspace-edit-smiles-${theme}.png`);
    await page.locator('[role="dialog"] button').filter({ hasText: /^Save$/ }).first().click();
    await page.waitForTimeout(1200);
    await shot(page, `workspace-not-checked-${theme}.png`);
    // and back, so the rest of the set is as the file loaded it
    await openMenu(page, 'Curate'); await menuItem(page, /^Undo/); await waitIdle(page, 1200);
    await closePanel(page);
  } catch (e) { console.warn('  ⚠ Panel/edit:', e.message?.split('\n')[0]); await pressEscape(page, 2); }

  // ── tautomers ─────────────────────────────────────────────────────────────
  try {
    await openRow(page, 'Acetylacetone');
    await page.keyboard.press('t');
    await page.waitForSelector('[role="dialog"]:has-text("Tautomers")', { timeout: 60000 });
    await page.waitForTimeout(1500);
    await shot(page, `workspace-tautomers-dialog-${theme}.png`);
    const first = page.locator('[role="dialog"]').getByText(/^Tautomer #1$/).first();
    if (await first.isVisible({ timeout: 2000 }).catch(() => false)) { await first.click(); await page.waitForTimeout(1500); await shot(page, `workspace-tautomer-selected-${theme}.png`); }
    await pressEscape(page);
    await closePanel(page);
  } catch (e) { console.warn('  ⚠ Tautomers:', e.message?.split('\n')[0]); await pressEscape(page, 2); }

  // ── a mixture: pick components, split ─────────────────────────────────────
  try {
    await openRow(page, 'Ethanol-Benzene-Mixture');
    const pick = page.locator('button').filter({ hasText: /^Pick components$/ }).first();
    await pick.click(); await page.waitForTimeout(1200);
    await shot(page, `workspace-panel-picker-${theme}.png`);
    const boxes = page.locator('aside [role="checkbox"], [data-slot="sheet-content"] [role="checkbox"], [role="dialog"] [role="checkbox"]');
    const n = await boxes.count();
    for (let i = 0; i < n; i++) { const b = boxes.nth(i); if ((await b.getAttribute('aria-checked')) !== 'true') await b.click(); }
    await page.waitForTimeout(400);
    const split = page.locator('button').filter({ hasText: /^(Keep \d+ of \d+|Split into)/ }).first();
    if (await split.isVisible({ timeout: 2000 }).catch(() => false)) {
      await split.click(); await waitIdle(page, 1500);
      await shot(page, `workspace-after-split-${theme}.png`);
    }
    await closePanel(page);
  } catch (e) { console.warn('  ⚠ Mixture:', e.message?.split('\n')[0]); await pressEscape(page, 2); }

  // ── PubChem: the consent, then the result ─────────────────────────────────
  try {
    await openRow(page, 'Propanol-WrongCAS');
    await page.keyboard.press('p');
    await page.waitForSelector('[role="alertdialog"]:has-text("Send data to PubChem?")', { timeout: 6000 });
    await page.waitForTimeout(500);
    await shot(page, `workspace-pubchem-warning-${theme}.png`);
    await page.locator('[role="alertdialog"] button').filter({ hasText: /^Continue$/ }).first().click();
    await waitIdle(page, 2500);
    await shot(page, `workspace-pubchem-results-${theme}.png`);
    await page.locator('[role="dialog"] button').filter({ hasText: /^Done$/ }).first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(400);
    await closePanel(page);
  } catch (e) { console.warn('  ⚠ PubChem:', e.message?.split('\n')[0]); await pressEscape(page, 2); }

  // ── One Step Cure: the dialog, its PubChem option, the summary ────────────
  try {
    await openMenu(page, 'Curate'); await menuItem(page, 'One Step Cure');
    await page.waitForSelector('[role="dialog"]:has-text("One Step Cure")', { timeout: 6000 });
    await page.waitForTimeout(700);
    await shot(page, `workspace-osc-dialog-${theme}.png`);
    const more = page.locator('[role="dialog"]').getByText(/PubChem/).first();
    if (await more.isVisible({ timeout: 1500 }).catch(() => false)) {
      await more.scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
      await shot(page, `workspace-pubchem-option-${theme}.png`);
    }
    await page.locator('[role="dialog"] button').filter({ hasText: /^Proceed$/ }).first().click();
    await page.waitForSelector('[role="dialog"]:has-text("attention"), [role="dialog"]:has-text("Changed")', { timeout: 120000 }).catch(() => {});
    await page.waitForTimeout(1200);
    await shot(page, `workspace-osc-summary-${theme}.png`);
    await pressEscape(page);
  } catch (e) { console.warn('  ⚠ One Step Cure:', e.message?.split('\n')[0]); await pressEscape(page, 2); }

  // ── reactions: typed, and from .rxn files ─────────────────────────────────
  try {
    await openMenu(page, 'Add'); await menuItem(page, 'Type a reaction');
    await page.waitForSelector('[role="dialog"]:has-text("Type a reaction")', { timeout: 6000 });
    const box = page.locator('[role="dialog"] textarea, [role="dialog"] input[placeholder*="Reaction SMILES"]').first();
    await box.fill(REACTION_SMILES); await page.waitForTimeout(500);
    await shot(page, `reactions-dialog-${theme}.png`);
    await page.locator('[role="dialog"] button[type="submit"], [role="dialog"] button:has-text("Add")').last().click();
    await waitIdle(page, 1500);
    await shot(page, `reactions-smiles-result-${theme}.png`);
    const existing = RXN_FILES.filter(f => fs.existsSync(f));
    if (existing.length) {
      await page.locator('input[type="file"]').nth(1).setInputFiles(existing);
      await waitIdle(page, 2000);
      await shot(page, `reactions-rxn-uploaded-${theme}.png`);
      const rrow = page.locator('tbody tr[data-row-id]').filter({ hasText: /Reaction/ }).last();
      await rrow.click(); await page.waitForTimeout(1800);
      await shot(page, `reactions-rxn-visualized-${theme}.png`);
      await closePanel(page);
    }
  } catch (e) { console.warn('  ⚠ Reactions:', e.message?.split('\n')[0]); await pressEscape(page, 2); }

  // ── evaluate: the dialog, the run, the results, a report ──────────────────
  try {
    await page.locator('button').filter({ hasText: /^Evaluate$/ }).first().click();
    await page.waitForSelector('[role="dialog"]:has-text("Select Modules to Evaluate")', { timeout: 8000 });
    await page.waitForTimeout(1200);
    await shot(page, `evaluate-dialog-${theme}.png`);
    for (const m of ['Water Solubility', 'LogP', 'Boiling Point']) {
      const lab = page.locator('[role="dialog"] label').filter({ hasText: new RegExp(`^${m}$`) }).first();
      if (await lab.isVisible({ timeout: 1500 }).catch(() => false)) await lab.click();
    }
    await page.waitForTimeout(300);
    // The button reads "Evaluate 13"; hasText is a substring match, and Cancel is the only other button.
    await page.locator('[role="dialog"] button').filter({ hasText: /Evaluate/ }).last().click();
    await page.waitForFunction(() => !document.body.innerText.includes('Evaluating the workspace'), null, { timeout: 600000 });
    await page.waitForTimeout(1500);
    await shot(page, `workspace-results-${theme}.png`);
    await openRow(page, 'Caffeine');
    await shot(page, `workspace-panel-results-${theme}.png`);
    // The report opens from a module row in the panel's Evaluation section.
    const outcome = page.locator('button').filter({ hasText: /^LogP/ }).first();
    await outcome.click();
    await page.waitForSelector('[data-slot="sheet-content"]:has-text("Report"), [role="dialog"]:has-text("Report"), [data-state="open"]:has-text("LogP — Report")', { timeout: 180000 });
    await page.waitForTimeout(4000);
    await shot(page, `eval-report-${theme}.png`);
    await pressEscape(page);
    await closePanel(page);
  } catch (e) { console.warn('  ⚠ Evaluate:', e.message?.split('\n').slice(0,3).join(' | ')); await pressEscape(page, 2); }

  // ── the editor on an existing compound ────────────────────────────────────
  try {
    await openRow(page, 'Caffeine');
    await page.locator('button').filter({ hasText: /^Edit structure$/ }).first().click();
    await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
    await page.waitForFunction(() => !document.body.innerText.includes('Starting the editor'), null, { timeout: 60000 }).catch(() => {});
    await page.mouse.move(820, 460); await page.waitForTimeout(2500);
    await shot(page, `editor-edit-${theme}.png`);
    await page.locator('[role="dialog"] button').filter({ hasText: /^Cancel$/ }).first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(400);
    await closePanel(page);
  } catch (e) { console.warn('  ⚠ Editor (edit):', e.message?.split('\n')[0]); await pressEscape(page, 2); }
}


// ── main ──────────────────────────────────────────────────────────────────────

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ══════════════════════════════════════════════════════════════════════════════
  // SESSION 1 — Individual user
  // Sign-in pages + all product screenshots
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n══ Session 1: individual user ══');
  activateLicense('11111111-1111-1111-1111-111111111111', INDIVIDUAL_USER);

  const ctx1  = await browser.newContext({ viewport: VIEWPORT });
  const page1 = await ctx1.newPage();

  await screenshotSignIn(page1);

  for (const theme of ['light', 'dark']) {
    console.log(`\n══ ${theme.toUpperCase()} MODE ══`);
    await navigateTo(page1, '/');
    await setTheme(page1, theme);

    if (want('workspace')) await screenshotWorkspace(page1, theme);
    if (want('licenses')) await screenshotLicenseTypes(page1, theme, false);
    if (want('licenses')) await screenshotLicenseActivation(page1, theme);
  }

  await ctx1.close();
  console.log('\n  ✓ Individual session complete');

  // ══════════════════════════════════════════════════════════════════════════════
  // SESSION 2 — Enterprise user
  // Profile/license/users screenshots (enterprise features: Update users, Invite)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n══ Session 2: enterprise user ══');
  activateLicense('44444444-4444-4444-4444-444444444444', ENTERPRISE_USER);

  const ctx2  = await browser.newContext({ viewport: VIEWPORT });
  const page2 = await ctx2.newPage();
  await signIn(page2, ENTERPRISE_EMAIL);

  for (const theme of ['light', 'dark']) {
    await setTheme(page2, theme);
    if (want('licenses')) await screenshotLicenseTypes(page2, theme, true);
    if (want('profile')) await screenshotProfile(page2, theme);
  }

  await ctx2.close();
  console.log('\n  ✓ Enterprise session complete');

  // ── Done ──────────────────────────────────────────────────────────────────────
  await browser.close();
  redisFlush();
  const files = fs.readdirSync(OUT).filter(f => f.endsWith('.png'));
  console.log(`\n✅ ${files.length} screenshots saved to images/`);
  files.forEach(f => console.log(`   ${f}`));
})();
