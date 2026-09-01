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
  { id: 1, modules: { "Water Solubility": "3.4 mg/mL", "LogP": "1.19", "Ames Mutagencity": "Inactive" } },
  { id: 2, modules: { "Water Solubility": "21.6 mg/mL", "LogP": "-0.07", "Ames Mutagencity": "Inactive" } },
  { id: 3, modules: { "Water Solubility": "0.06 mg/mL", "LogP": "3.32", "Ames Mutagencity": "Inactive" } },
  { id: 4, modules: { "Water Solubility": "0.09 mg/mL", "LogP": "3.97", "Ames Mutagencity": "Inactive" } },
  { id: 5, modules: { "Water Solubility": "0.28 mg/mL", "LogP": "4.63", "Ames Mutagencity": "Inactive" } },
  { id: 6, modules: { "Water Solubility": "0.001 mg/mL", "LogP": "6.04", "Ames Mutagencity": "Active" } },
];

// Clear output dir so stale screenshots from previous runs don't accumulate
if (fs.existsSync(OUT)) {
  fs.readdirSync(OUT).filter(f => f.endsWith('.png')).forEach(f => fs.unlinkSync(path.join(OUT, f)));
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

async function shot(page, name, { markers = [] } = {}) {
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
  await page.evaluate(() => {
    localStorage.removeItem('library-storage');
    localStorage.removeItem('evaluation-result-storage');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
}

async function clearDkState(page) {
  await page.evaluate(() => localStorage.removeItem('qsarflex_dk_state'));
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

async function screenshotLibrary(page, theme) {
  console.log(`\n  📂 Library (${theme})`);

  await clearLibrary(page);
  await navigateTo(page, '/');
  await setTheme(page, theme);
  await clearLibrary(page);
  await navigateTo(page, '/');
  await shot(page, `library-empty-${theme}.png`, {
    markers: [
      { selector: 'button:has-text("Compounds")', label: 'Add compounds', side: 'bottom' },
      { selector: 'button:has-text("Reaction")',  label: 'Add reaction',  side: 'bottom' },
    ],
  });

  await navigateTo(page, '/');
  await page.waitForTimeout(600);

  // Add Compound dialog
  const addBtn = page.locator('button').filter({ hasText: 'Compounds' }).first();
  if (await addBtn.isVisible({ timeout: 6000 }).catch(() => false)) {
    await addBtn.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
    await page.waitForTimeout(700);
    await shot(page, `add-compound-${theme}.png`, {
      markers: [
        { selector: 'button:has-text("Auto Fill")', label: 'Fetch from PubChem', side: 'right' },
      ],
    });

    try {
      const nameInput = page.locator('[role="dialog"] input[placeholder*="compound name"]').first();
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill('Caffeine');
        const autofillBtn = page.locator('[role="dialog"] button').filter({ hasText: 'Auto Fill' }).first();
        if (await autofillBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await autofillBtn.click();
          await page.waitForTimeout(3500);
          await shot(page, `add-compound-autofill-${theme}.png`, {
            markers: [
              { selector: 'button:has-text("Add to Library")', label: 'Add to Library', side: 'left' },
            ],
          });
        }
      }
    } catch {}

    try {
      const batchTab = page.locator('[role="dialog"] [role="tab"]').filter({ hasText: 'Batch' }).first();
      if (await batchTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await batchTab.click();
        await page.waitForTimeout(400);
        await shot(page, `batch-upload-${theme}.png`);

        const fileInput = page.locator('[role="dialog"] input[type="file"]').first();
        if (await fileInput.count() > 0) {
          await fileInput.setInputFiles(DK_FILE);
          await page.waitForTimeout(900);
          await shot(page, `batch-upload-with-file-${theme}.png`, {
            markers: [
              { selector: 'button:has-text("Add to Library")', label: 'Import all', side: 'left' },
            ],
          });
        }
      }
    } catch {}

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  await injectLibrary(page, SAMPLE_COMPOUNDS, null);
  await navigateTo(page, '/');
  await shot(page, `library-compounds-${theme}.png`, {
    markers: [
      // Not "Run evaluation  ⌘K". ⌘K/Ctrl+K opens the command bar
      // (usePaletteShortcut in components/CommandBar.tsx); the Evaluate
      // button's own tooltip is just "Run evaluation".
      { selector: 'button:has-text("Evaluate")', label: 'Run evaluation', side: 'bottom' },
    ],
  });

  await injectLibrary(page, SAMPLE_COMPOUNDS, PRECOMPUTED_RESULTS);
  await navigateTo(page, '/');
  await shot(page, `library-with-results-${theme}.png`);
}

// ── Reaction screenshots ──────────────────────────────────────────────────────

async function screenshotReactions(page, theme) {
  console.log(`\n  ⚗️  Reactions (${theme})`);

  // ── SMILES tab: start with an empty library so the result shows only the reaction ──
  await clearLibrary(page);
  await navigateTo(page, '/');

  const reactionBtn = page.locator('button').filter({ hasText: /reaction/i }).first();
  if (!await reactionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.warn('  ⚠ Reaction button not found');
    return;
  }
  await reactionBtn.click();
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
  await page.waitForTimeout(500);
  await shot(page, `reactions-smiles-tab-${theme}.png`);

  try {
    const smilesTextarea = page.locator('[role="dialog"] textarea').first();
    if (await smilesTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
      await smilesTextarea.fill('CC(=O)Cl.OCC>>CC(=O)OCC.Cl');

      // Click Visualise first — renders the diagram inline in the dialog
      const visualiseBtn = page.locator('[role="dialog"] button').filter({ hasText: /visualis/i }).first();
      if (await visualiseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await visualiseBtn.click();
        await page.waitForTimeout(3000); // wait for backend to render
        await shot(page, `reactions-smiles-result-${theme}.png`);
      }

      // Submit adds the visualised reaction to the library
      const submitBtn = page.locator('[role="dialog"] button').filter({ hasText: /^submit$/i }).first();
      if (await submitBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 8000 }).catch(() => {});
        await page.evaluate(() => {
          document.querySelectorAll('[data-sonner-toast], [data-radix-toast-viewport], [role="alert"]').forEach(el => el.remove());
        });
        await page.waitForTimeout(2000);
      }
    }
  } catch (e) {
    console.warn('  ⚠ Reaction SMILES:', e.message?.split('\n')[0]);
    await page.keyboard.press('Escape').catch(() => {});
  }

  // ── Files tab: one compound in library so final shot shows compound + reaction coexisting ──
  await injectLibrary(page, [SAMPLE_COMPOUNDS[0]], null);
  await navigateTo(page, '/');
  const reactionBtn2 = page.locator('button').filter({ hasText: /reaction/i }).first();
  await reactionBtn2.click();
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
  await page.waitForTimeout(400);

  try {
    const filesTab = page.locator('[role="dialog"] [role="tab"]').filter({ hasText: /file/i }).first();
    if (await filesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filesTab.click();
      await page.waitForTimeout(400);
      await shot(page, `reactions-files-tab-${theme}.png`);

      const fileInput = page.locator('[role="dialog"] input[type="file"]').first();
      if (await fileInput.count() > 0) {
        await fileInput.setInputFiles(RXN_FILES);
        await page.waitForTimeout(1000);
        await shot(page, `reactions-rxn-uploaded-${theme}.png`);

        // Click Visualise — backend processes the 5 RXN files and renders the reaction in the dialog
        const visualiseBtn = page.locator('[role="dialog"] button').filter({ hasText: /visualis/i }).first();
        if (await visualiseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await visualiseBtn.click();
          await page.waitForTimeout(5000); // 5 step RXN needs more time
          await shot(page, `reactions-rxn-visualized-${theme}.png`);
        }

        // Submit adds the visualised reaction to the library
        const submitBtn = page.locator('[role="dialog"] button').filter({ hasText: /^submit$/i }).first();
        if (await submitBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 }).catch(() => {});
          await page.evaluate(() => {
            document.querySelectorAll('[data-sonner-toast], [data-radix-toast-viewport], [role="alert"]').forEach(el => el.remove());
          });
          await page.waitForTimeout(3000);
          // Library shows 1 compound + multi-step reaction with rendered structure
          await shot(page, `library-with-reaction-${theme}.png`);
        }
      }
    }
  } catch (e) {
    console.warn('  ⚠ Reaction files tab issue:', e.message?.split('\n')[0]);
  }

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(400);
}

// ── Evaluation screenshots ────────────────────────────────────────────────────

async function screenshotEvaluation(page, theme) {
  console.log(`\n  🔬 Evaluation (${theme})`);

  await injectLibrary(page, SAMPLE_COMPOUNDS, null);
  await navigateTo(page, '/');

  // Open dialog and screenshot it, then close without running evaluation
  const evalBtn = page.locator('button').filter({ hasText: /^evaluate$/i }).first();
  if (await evalBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
    await evalBtn.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
    await page.waitForFunction(
      () => !document.querySelector('[role="dialog"]')?.textContent?.includes('Loading'),
      { timeout: 15000 }
    ).catch(() => {});
    await page.waitForTimeout(900);
    await shot(page, `evaluate-dialog-${theme}.png`, {
      markers: [
        { selector: '[role="dialog"] [role="checkbox"]', label: 'Select modules', side: 'right' },
      ],
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // Use precomputed results for reliable eval-results and eval-report screenshots
  await injectLibrary(page, SAMPLE_COMPOUNDS, PRECOMPUTED_RESULTS);
  await navigateTo(page, '/');

  await shot(page, `eval-results-${theme}.png`, {
    markers: [
      { selector: 'button.cursor-pointer', label: 'Click to view report', side: 'right' },
    ],
  });

  try {
    const reportBtn = page.locator('button.cursor-pointer').filter({ has: page.locator('svg') }).first();
    if (await reportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const consoleErrors = [];
      const onConsole = msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); };
      const responseErrors = [];
      const onResponse = async res => {
        if (res.url().includes('generate-report') && !res.ok()) {
          try { responseErrors.push(await res.text()); } catch {}
        }
      };
      page.on('console', onConsole);
      page.on('response', onResponse);

      await reportBtn.click();
      // Wait for the Sheet iframe which only appears when the report HTML is loaded
      await page.waitForSelector('[data-state="open"] iframe, [role="dialog"] iframe', { timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(1500);

      page.off('console', onConsole);
      page.off('response', onResponse);

      const sheetOpen = await page.locator('[data-state="open"]').count() > 0;
      if (sheetOpen) {
        await shot(page, `eval-report-${theme}.png`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } else {
        const detail = responseErrors[0] || consoleErrors.slice(0, 3).join(' | ') || 'no errors captured';
        console.warn(`  ⚠ Report sheet did not open (${theme}): ${detail}`);
      }
    }
  } catch (e) {
    console.warn('  ⚠ Report error:', e.message?.split('\n')[0]);
  }
}

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
    if (await updateBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
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
    if (await inviteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
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

// ── DataKurator screenshots ───────────────────────────────────────────────────

async function screenshotDataKurator(page, theme) {
  console.log(`\n  🧪 DataKurator (${theme})`);

  await clearDkState(page);
  await navigateTo(page, '/');
  await page.waitForTimeout(400);
  await navigateTo(page, '/datakurator');
  await page.waitForTimeout(800);
  const isOnUpload = await page.locator('input[type="file"]').first().isVisible({ timeout: 3000 }).catch(() => false);
  if (!isOnUpload) {
    await clearDkState(page);
    await navigateTo(page, '/');
    await page.waitForTimeout(400);
    await navigateTo(page, '/datakurator');
    await page.waitForTimeout(1000);
  }
  await shot(page, `datakurator-upload-${theme}.png`);

  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(DK_FILE, { timeout: 10000 });
  await page.waitForTimeout(900);
  await shot(page, `datakurator-file-selected-${theme}.png`);

  const runBtn = page.locator('button').filter({ hasText: /run analysis/i }).first();
  if (!await runBtn.isEnabled({ timeout: 4000 }).catch(() => false)) {
    console.warn('  ⚠ Run Analysis not enabled');
    return;
  }

  await runBtn.click();
  await page.waitForSelector(
    'button:has-text("One Step Cure"), button:has-text("Re-analyze")',
    { timeout: 20000 }
  ).catch(() => {});
  await page.waitForTimeout(1500);
  await shot(page, `datakurator-results-${theme}.png`, {
    markers: [
      { selector: 'button:has-text("One Step Cure")',         label: 'Auto-fix all issues', side: 'right' },
      { selector: 'button:has-text("PubChem Batch Correct")', label: 'Correct via PubChem', side: 'right' },
    ],
  });

  try {
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    let viewerCaptured = false;
    for (let i = 0; i < Math.min(rowCount, 6) && !viewerCaptured; i++) {
      const row = rows.nth(i);
      await row.hover();
      await page.waitForTimeout(400);
      const viewBtn = page.locator('button[title="View structure"]').first();
      if (await viewBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await shot(page, `datakurator-structure-hover-${theme}.png`, {
          markers: [
            { selector: 'button[title="View structure"]', label: 'View 2D structure', side: 'left' },
            { selector: 'button[title="Actions"]',        label: 'Row actions',       side: 'right' },
          ],
        });
        await viewBtn.click();
        await page.waitForTimeout(900);
        await shot(page, `datakurator-structure-viewer-${theme}.png`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        viewerCaptured = true;
      }
    }
  } catch {}

  try {
    let menuCaptured = false;
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < Math.min(rowCount, 8) && !menuCaptured; i++) {
      const row = rows.nth(i);
      const menuBtn = row.locator('button[title="Actions"]');
      if (await menuBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await menuBtn.click({ timeout: 3000 });
        await page.waitForTimeout(400);
        if (await page.locator('[role="menuitem"]').count() > 0) {
          await shot(page, `datakurator-row-menu-${theme}.png`);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);
          menuCaptured = true;
        }
      }
    }
  } catch {}

  try {
    let pickerCaptured = false;
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount && !pickerCaptured; i++) {
      const row = rows.nth(i);
      const menuBtn = row.locator('button[title="Actions"]');
      if (!await menuBtn.isVisible({ timeout: 400 }).catch(() => false)) continue;
      await menuBtn.click({ timeout: 3000 });
      await page.waitForTimeout(400);
      const pickItem = page.locator('[role="menuitem"]').filter({ hasText: /pick component/i }).first();
      if (!await pickItem.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        continue;
      }
      await pickItem.click();
      await page.waitForTimeout(700);
      await shot(page, `datakurator-fragment-picker-${theme}.png`);

      const selectAll = page.locator('button').filter({ hasText: 'Select all' }).first();
      if (await selectAll.isVisible({ timeout: 2000 }).catch(() => false)) {
        await selectAll.click();
        await page.waitForTimeout(400);
        await shot(page, `datakurator-fragments-selected-${theme}.png`);
      }

      const splitBtn = page.locator('button').filter({ hasText: /split into/i }).first();
      if (await splitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await splitBtn.click();
        await page.waitForTimeout(900);
        await shot(page, `datakurator-after-split-${theme}.png`);
      }
      pickerCaptured = true;
    }
    if (!pickerCaptured) console.warn('  ⚠ No Mixture row found for fragment picker');
  } catch (e) {
    console.warn('  ⚠ Mixture picker:', e.message?.split('\n')[0]);
  }

  try {
    let editCaptured = false;
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < Math.min(rowCount, 12) && !editCaptured; i++) {
      const row = rows.nth(i);
      const menuBtn = row.locator('button[title="Actions"]');
      if (!await menuBtn.isVisible({ timeout: 400 }).catch(() => false)) continue;
      await menuBtn.click({ timeout: 3000 });
      await page.waitForTimeout(300);
      const editItem = page.locator('[role="menuitem"]').filter({ hasText: /edit smiles/i }).first();
      if (await editItem.isVisible({ timeout: 1000 }).catch(() => false)) {
        await editItem.click();
        await page.waitForTimeout(600);
        const smilesInput = page.locator('input.h-7').first();
        if (await smilesInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await shot(page, `datakurator-edit-smiles-${theme}.png`);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);
          editCaptured = true;
        }
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }
    }
  } catch {}

  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  try {
    await page.waitForSelector('button:not([disabled]):has-text("One Step Cure")', { timeout: 8000 });
    const oscBtn = page.locator('button:not([disabled])').filter({ hasText: 'One Step Cure' }).first();
    await oscBtn.click({ timeout: 5000 });
    await page.waitForSelector('[role="dialog"]', { timeout: 6000 });
    await page.waitForTimeout(700);
    await shot(page, `datakurator-osc-dialog-${theme}.png`);

    const runOscBtn = page.locator('[role="dialog"] button').filter({ hasText: /proceed|cure|apply|confirm/i }).last();
    if (await runOscBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await runOscBtn.click({ timeout: 5000 });
      await page.waitForSelector('[role="dialog"]:has-text("Summary")', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await shot(page, `datakurator-osc-summary-${theme}.png`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    } else {
      await page.keyboard.press('Escape');
    }
  } catch (e) {
    console.warn('  ⚠ OSC:', e.message?.split('\n')[0]);
    await page.screenshot({ path: path.join(OUT, `debug-osc-${theme}.png`) }).catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(500);
  }

  try {
    await page.waitForSelector('button:not([disabled]):has-text("PubChem Batch Correct")', { timeout: 8000 });
    const pubchemBtn = page.locator('button:not([disabled])').filter({ hasText: 'PubChem Batch Correct' }).first();
    await pubchemBtn.click({ timeout: 5000 });
    await page.waitForSelector('[role="alertdialog"]', { timeout: 6000 });
    await page.waitForTimeout(700);
    await shot(page, `datakurator-pubchem-warning-${theme}.png`);

    const continueBtn = page.locator('[role="alertdialog"] button').filter({ hasText: /continue|proceed|yes|confirm/i }).first();
    if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await continueBtn.click({ timeout: 5000 });
      await page.waitForFunction(
        () => !document.body.textContent?.includes('Correcting') && !document.body.textContent?.includes('Re-analyzing'),
        { timeout: 40000 }
      ).catch(() => {});
      await page.waitForTimeout(1500);
      await shot(page, `datakurator-pubchem-results-${theme}.png`);
      if (await page.locator('[role="dialog"]').isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
    } else {
      await page.keyboard.press('Escape').catch(() => {});
    }
  } catch (e) {
    console.warn('  ⚠ PubChem batch:', e.message?.split('\n')[0]);
    await page.screenshot({ path: path.join(OUT, `debug-pubchem-${theme}.png`) }).catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
  }

  try {
    const proceedBtn = page.locator('button').filter({ hasText: /proceed|next|export/i }).first();
    if (await proceedBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await proceedBtn.click();
      await page.waitForTimeout(1200);
      await shot(page, `datakurator-export-${theme}.png`, {
        markers: [
          { selector: 'button:has-text("Load")', label: 'Load directly into library', side: 'left' },
        ],
      });
    }
  } catch {}
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

    await screenshotLibrary(page1, theme);
    await screenshotReactions(page1, theme);
    await screenshotEvaluation(page1, theme);
    await screenshotDataKurator(page1, theme);
    await screenshotLicenseTypes(page1, theme, false);
    await screenshotLicenseActivation(page1, theme);
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
    await screenshotLicenseTypes(page2, theme, true);
    await screenshotProfile(page2, theme);
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
