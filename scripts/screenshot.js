/**
 * QSARFlex documentation screenshot automation — comprehensive
 * Run: node screenshot.js
 * Prerequisites: app at localhost:3000, backend at localhost:8080
 */

const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const EMAIL = 'shrihegde@multicase.com';
const PASS  = 'C7EQbTd6ju6kB2d@1';
const BASE  = 'http://localhost:3000';
const OUT   = path.resolve(__dirname, '../images');

// Files for realistic demos
const DK_FILE  = path.resolve(__dirname, 'samples/dk_demo.smi');
const RXN_FILE = '/Users/multicase/Downloads/Lisininopril_step_1.RXN';

const VIEWPORT = { width: 1440, height: 900 };

// Library compounds for standard library screenshots
const SAMPLE_COMPOUNDS = [
  { id: 1, name: "Aspirin",          smiles: "CC(=O)Oc1ccccc1C(=O)O",               cas: "50-78-2",    type: "compound" },
  { id: 2, name: "Caffeine",         smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",        cas: "58-08-2",    type: "compound" },
  { id: 3, name: "Testosterone",     smiles: "CC12CCC3C(C1CCC2O)CCC4=CC(=O)CCC34C", cas: "58-22-0",    type: "compound" },
  { id: 4, name: "Ibuprofen",        smiles: "CC(C)Cc1ccc(cc1)C(C)C(=O)O",          cas: "15687-27-1", type: "compound" },
  { id: 5, name: "Chloroquine",      smiles: "CCN(CC)CCCC(C)Nc1ccnc2cc(Cl)ccc12",   cas: "54-05-7",    type: "compound" },
  { id: 6, name: "Benzo[a]pyrene",   smiles: "c1ccc2c(c1)cc1ccc3cccc4ccc2c1c34",    cas: "50-32-8",    type: "compound" },
];

// NDSRI compounds for CPCA evaluation (if licensed)
const NDSRI_COMPOUNDS = [
  { id: 1, name: "N-nitroso Reboxetine",     smiles: "CCOc1ccccc1OC(C2CN(CCO2)N=O)c3ccccc3", cas: "", type: "compound" },
  { id: 2, name: "N-nitroso Doxylamine",     smiles: "CN(CCOC(C)(c1ccccc1)c2ccccn2)N=O",     cas: "", type: "compound" },
  { id: 3, name: "NDMA",                     smiles: "CN(C)N=O",                              cas: "62-75-9", type: "compound" },
  { id: 4, name: "NDEA",                     smiles: "CCN(CC)N=O",                            cas: "55-18-5", type: "compound" },
];

// Pre-computed evaluation results for library "with results" screenshots
// (avoids needing a licensed module for cosmetic screenshots)
const PRECOMPUTED_RESULTS = [
  { id: 1, modules: { "Ames Mutagenicity": "Inactive", "Water Solubility": "3.4 mg/mL" } },
  { id: 2, modules: { "Ames Mutagenicity": "Inactive", "Water Solubility": "21.6 mg/mL" } },
  { id: 3, modules: { "Ames Mutagenicity": "Inactive", "Water Solubility": "0.06 mg/mL" } },
  { id: 4, modules: { "Ames Mutagenicity": "Inactive", "Water Solubility": "0.09 mg/mL" } },
  { id: 5, modules: { "Ames Mutagenicity": "Inactive" } },
  { id: 6, modules: { "Ames Mutagenicity": "Active" } },
];

fs.mkdirSync(OUT, { recursive: true });

// ── helpers ──────────────────────────────────────────────────────────────────

async function shot(page, name) {
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
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
    if (r) localStorage.setItem('evaluation-result-storage', JSON.stringify({ state: { results: r }, version: 0 }));
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

// ── Phase 0: Login + capture sign-in & Cognito pages ─────────────────────────

async function loginAndCaptureCognito(page) {
  console.log('\n── SIGN-IN PAGES ──');

  // QSARFlex sign-in page — light
  await page.goto(`${BASE}/auth/signin`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, 'signin-light.png');

  // QSARFlex sign-in page — dark (inject before redirect)
  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot(page, 'signin-dark.png');

  // Reset to light for the rest of the flow
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload({ waitUntil: 'networkidle' });

  // Cognito email step
  await page.click('button:has-text("Sign in with Cognito")');
  await page.waitForURL('**/login**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await shot(page, 'cognito-signin-email.png');

  // Fill email → Cognito password step
  await page.fill('input[name="username"]', EMAIL);
  await page.click('button[type="submit"]');
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.waitForTimeout(700);
  await shot(page, 'cognito-signin-password.png');

  // Complete login
  await page.fill('input[type="password"]', PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/**`, { timeout: 20000 });
  await page.waitForLoadState('networkidle');
  console.log('  ✓ Logged in');
}

// ── Library & Compound screenshots ───────────────────────────────────────────

async function screenshotLibrary(page, theme) {
  console.log(`\n  📂 Library (${theme})`);

  // Empty library
  await clearLibrary(page);
  await navigateTo(page, '/');
  await setTheme(page, theme);
  await clearLibrary(page);
  await navigateTo(page, '/');
  await shot(page, `library-empty-${theme}.png`);

  // ── Add Compound dialog — single tab (empty) ──
  const addBtn = page.locator('button').filter({ hasText: 'Compounds' }).first();
  if (await addBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await addBtn.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
    await page.waitForTimeout(700);
    await shot(page, `add-compound-${theme}.png`);

    // Autofill with Caffeine — fill the name field, then click Auto Fill
    try {
      const nameInput = page.locator('[role="dialog"] input[placeholder*="compound name"]').first();
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill('Caffeine');
        const autofillBtn = page.locator('[role="dialog"] button').filter({ hasText: 'Auto Fill' }).first();
        if (await autofillBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await autofillBtn.click();
          await page.waitForTimeout(3500);
          await shot(page, `add-compound-autofill-${theme}.png`);
        }
      }
    } catch {}

    // Batch tab — empty state
    try {
      const batchTab = page.locator('[role="dialog"] [role="tab"]').filter({ hasText: 'Batch' }).first();
      if (await batchTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await batchTab.click();
        await page.waitForTimeout(400);
        await shot(page, `batch-upload-${theme}.png`);

        // Batch tab — with file loaded
        const fileInput = page.locator('[role="dialog"] input[type="file"]').first();
        if (await fileInput.count() > 0) {
          await fileInput.setInputFiles(DK_FILE);
          await page.waitForTimeout(900);
          await shot(page, `batch-upload-with-file-${theme}.png`);
        }
      }
    } catch {}

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // Library with compounds (pre-injected, no results)
  await injectLibrary(page, SAMPLE_COMPOUNDS, null);
  await navigateTo(page, '/');
  await shot(page, `library-compounds-${theme}.png`);

  // Library with evaluation results pre-injected
  await injectLibrary(page, SAMPLE_COMPOUNDS, PRECOMPUTED_RESULTS);
  await navigateTo(page, '/');
  await shot(page, `library-with-results-${theme}.png`);
}

// ── Reaction screenshots ──────────────────────────────────────────────────────

async function screenshotReactions(page, theme) {
  console.log(`\n  ⚗️  Reactions (${theme})`);

  await injectLibrary(page, SAMPLE_COMPOUNDS, null);
  await navigateTo(page, '/');

  // Open "+ Reaction" dialog
  const reactionBtn = page.locator('button').filter({ hasText: /reaction/i }).first();
  if (!await reactionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.warn('  ⚠ Reaction button not found');
    return;
  }
  await reactionBtn.click();
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
  await page.waitForTimeout(500);

  // SMILES tab (default)
  await shot(page, `reactions-smiles-tab-${theme}.png`);

  // Enter a reaction SMILES and visualize
  try {
    const smilesTextarea = page.locator('[role="dialog"] textarea').first();
    if (await smilesTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
      await smilesTextarea.fill('CC(=O)Cl.OCC>>CC(=O)OCC.Cl');
      const submitBtn = page.locator('[role="dialog"] button[type="submit"]').first();
      if (await submitBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(2500);
        await shot(page, `reactions-smiles-result-${theme}.png`);
      }
    }
  } catch {}

  // Close and re-open to get to Files tab cleanly
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await reactionBtn.click();
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
  await page.waitForTimeout(400);

  // Reaction Files tab
  try {
    const filesTab = page.locator('[role="dialog"] [role="tab"]').filter({ hasText: /file/i }).first();
    if (await filesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filesTab.click();
      await page.waitForTimeout(400);
      await shot(page, `reactions-files-tab-${theme}.png`);

      // Upload RXN file
      const fileInput = page.locator('[role="dialog"] input[type="file"]').first();
      if (await fileInput.count() > 0) {
        await fileInput.setInputFiles(RXN_FILE);
        await page.waitForTimeout(1000);
        await shot(page, `reactions-rxn-uploaded-${theme}.png`);

        // Submit to visualize
        const submitBtn = page.locator('[role="dialog"] button[type="submit"]').first();
        if (await submitBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2500);
          await shot(page, `reactions-rxn-visualized-${theme}.png`);
        }
      }
    }
  } catch (e) {
    console.warn('  ⚠ Reaction files tab issue:', e.message?.split('\n')[0]);
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
}

// ── Evaluation screenshots ────────────────────────────────────────────────────

async function screenshotEvaluation(page, theme) {
  console.log(`\n  🔬 Evaluation (${theme})`);

  await injectLibrary(page, SAMPLE_COMPOUNDS, null);
  await navigateTo(page, '/');

  const evalBtn = page.locator('button').filter({ hasText: /^evaluate$/i }).first();
  if (!await evalBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
    console.warn('  ⚠ Evaluate button not enabled — screenshot library-with-results instead');
    // Fall back to pre-injected results screenshot
    await injectLibrary(page, SAMPLE_COMPOUNDS, PRECOMPUTED_RESULTS);
    await navigateTo(page, '/');
    await shot(page, `eval-results-${theme}.png`);
    return;
  }

  await evalBtn.click();
  await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
  // Wait for module list to load
  await page.waitForFunction(
    () => !document.querySelector('[role="dialog"]')?.textContent?.includes('Loading'),
    { timeout: 15000 }
  ).catch(() => {});
  await page.waitForTimeout(900);
  await shot(page, `evaluate-dialog-${theme}.png`);

  // Select first available module
  try {
    const firstCheck = page.locator('[role="dialog"] [role="checkbox"]:not([data-disabled])').first();
    if (await firstCheck.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstCheck.click({ force: true });
      await page.waitForTimeout(300);

      const confirmBtn = page.locator('[role="dialog"] button').filter({ hasText: /^evaluate$/i }).first();
      if (await confirmBtn.isEnabled({ timeout: 3000 }).catch(() => false)) {
        await confirmBtn.click();
        // Wait for evaluation overlay to disappear
        await page.waitForFunction(
          () => !document.querySelector('[data-evaluating], [data-overlay]') &&
                !document.body.textContent?.includes('Evaluating'),
          { timeout: 60000 }
        ).catch(() => {});
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        await shot(page, `eval-results-${theme}.png`);

        // Click a GenerateReportButton to open the report sheet
        try {
          const reportBtn = page.locator('button.cursor-pointer').filter({ has: page.locator('svg') }).first();
          if (await reportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await reportBtn.click();
            // Wait for report sheet to slide in
            await page.waitForSelector('[data-state="open"]', { timeout: 20000 }).catch(() => {});
            await page.waitForTimeout(2000);
            await shot(page, `eval-report-${theme}.png`);
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);
          }
        } catch {}
      }
    } else {
      console.warn('  ⚠ No enabled checkboxes in eval dialog');
      await page.keyboard.press('Escape');
    }
  } catch (e) {
    console.warn('  ⚠ Evaluation error:', e.message?.split('\n')[0]);
    await page.keyboard.press('Escape').catch(() => {});
    await page.screenshot({ path: path.join(OUT, `debug-eval-${theme}.png`) }).catch(() => {});
  }
}

// ── Profile / License / Users screenshots ────────────────────────────────────

async function screenshotProfile(page, theme) {
  console.log(`\n  👤 Profile/License/Users (${theme})`);

  // Profile tab
  await navigateTo(page, '/profile');
  await page.waitForTimeout(700);
  await shot(page, `profile-${theme}.png`);

  // License tab
  await navigateTo(page, '/profile?tab=license');
  await page.waitForTimeout(900);
  await shot(page, `profile-license-${theme}.png`);

  // Click "Update users" button to open assign users dialog
  try {
    const updateBtn = page.locator('button').filter({ hasText: /update users/i }).first();
    if (await updateBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await updateBtn.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 6000 });
      await page.waitForTimeout(700);
      await shot(page, `profile-license-assign-users-${theme}.png`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch {}

  // Click "Invite user" button on license tab
  try {
    const inviteBtnLicense = page.locator('button').filter({ hasText: /invite user/i }).first();
    if (await inviteBtnLicense.isVisible({ timeout: 3000 }).catch(() => false)) {
      await inviteBtnLicense.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 6000 });
      await page.waitForTimeout(700);
      await shot(page, `profile-invite-user-${theme}.png`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch {}

  // Users tab
  await navigateTo(page, '/profile?tab=users');
  await page.waitForTimeout(900);
  await shot(page, `profile-users-${theme}.png`);

  // Invite user from Users tab (if button is visible there too)
  try {
    const inviteBtnUsers = page.locator('button').filter({ hasText: /invite/i }).first();
    if (await inviteBtnUsers.isVisible({ timeout: 3000 }).catch(() => false)) {
      await inviteBtnUsers.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 6000 }).catch(() => {});
      await page.waitForTimeout(700);
      await shot(page, `profile-users-invite-dialog-${theme}.png`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch {}
}

// ── DataKurator screenshots ───────────────────────────────────────────────────

async function screenshotDataKurator(page, theme) {
  console.log(`\n  🧪 DataKurator (${theme})`);

  // ── Upload step ──
  await clearDkState(page);
  await navigateTo(page, '/datakurator');
  await page.waitForTimeout(500);
  await shot(page, `datakurator-upload-${theme}.png`);

  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(DK_FILE);
  await page.waitForTimeout(900);
  await shot(page, `datakurator-file-selected-${theme}.png`);

  const runBtn = page.locator('button').filter({ hasText: /run analysis/i }).first();
  if (!await runBtn.isEnabled({ timeout: 4000 }).catch(() => false)) {
    console.warn('  ⚠ Run Analysis not enabled');
    await page.screenshot({ path: path.join(OUT, `debug-dk-${theme}.png`) }).catch(() => {});
    return;
  }

  await runBtn.click();
  // Wait for analysis to complete — the "One Step Cure" or "Re-analyze" button appears
  await page.waitForSelector(
    'button:has-text("One Step Cure"), button:has-text("Re-analyze")',
    { timeout: 20000 }
  ).catch(() => {});
  await page.waitForTimeout(1500);
  await shot(page, `datakurator-results-${theme}.png`);

  // ── Structure viewer (hover row → click eye icon) ──
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
        await shot(page, `datakurator-structure-hover-${theme}.png`);
        await viewBtn.click();
        await page.waitForTimeout(900);
        await shot(page, `datakurator-structure-viewer-${theme}.png`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        viewerCaptured = true;
      }
    }
  } catch {}

  // ── Row dropdown menu (scoped to row, not global) ──
  try {
    let menuCaptured = false;
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < Math.min(rowCount, 8) && !menuCaptured; i++) {
      const row = rows.nth(i);
      const menuBtn = row.locator('button[title="Actions"]');  // scoped to this row
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

  // ── Mixture fragment picker — iterate rows until we find one with "Pick components" ──
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

      // Select all fragments
      const selectAll = page.locator('button').filter({ hasText: 'Select all' }).first();
      if (await selectAll.isVisible({ timeout: 2000 }).catch(() => false)) {
        await selectAll.click();
        await page.waitForTimeout(400);
        await shot(page, `datakurator-fragments-selected-${theme}.png`);
      }

      // Split into compounds
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

  // ── Inline SMILES edit (scoped Actions button) ──
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
        // The edit input has class h-7 and font-mono
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

  // Close any open menus before OSC
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // ── One Step Cure dialog ──
  try {
    // Wait for the OSC button to be enabled (not busy)
    await page.waitForSelector('button:not([disabled]):has-text("One Step Cure")', { timeout: 8000 });
    const oscBtn = page.locator('button:not([disabled])').filter({ hasText: 'One Step Cure' }).first();
    await oscBtn.click({ timeout: 5000 });
    await page.waitForSelector('[role="dialog"]', { timeout: 6000 });
    await page.waitForTimeout(700);
    await shot(page, `datakurator-osc-dialog-${theme}.png`);

    // Confirm/run OSC — click the "Proceed" button in the dialog
    const runOscBtn = page.locator('[role="dialog"] button').filter({ hasText: /proceed|cure|apply|confirm/i }).last();
    if (await runOscBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await runOscBtn.click({ timeout: 5000 });
      // Wait for OSC dialog to close and summary to appear
      await page.waitForSelector('[role="dialog"]:has-text("Summary")', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1500);
      // Screenshot whether or not the summary dialog appeared
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

  // ── PubChem Batch Correct ──
  try {
    await page.waitForSelector('button:not([disabled]):has-text("PubChem Batch Correct")', { timeout: 8000 });
    const pubchemBtn = page.locator('button:not([disabled])').filter({ hasText: 'PubChem Batch Correct' }).first();
    await pubchemBtn.click({ timeout: 5000 });
    await page.waitForSelector('[role="alertdialog"]', { timeout: 6000 });
    await page.waitForTimeout(700);
    await shot(page, `datakurator-pubchem-warning-${theme}.png`);

    // Confirm
    const continueBtn = page.locator('[role="alertdialog"] button').filter({ hasText: /continue|proceed|yes|confirm/i }).first();
    if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await continueBtn.click({ timeout: 5000 });
      await page.waitForFunction(
        () => !document.body.textContent?.includes('Correcting') && !document.body.textContent?.includes('Re-curing'),
        { timeout: 40000 }
      ).catch(() => {});
      await page.waitForTimeout(1500);
      const summaryDialog = page.locator('[role="dialog"]');
      if (await summaryDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        await shot(page, `datakurator-pubchem-results-${theme}.png`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      } else {
        await shot(page, `datakurator-pubchem-results-${theme}.png`);
      }
    } else {
      await page.keyboard.press('Escape').catch(() => {});
    }
  } catch (e) {
    console.warn('  ⚠ PubChem batch:', e.message?.split('\n')[0]);
    await page.screenshot({ path: path.join(OUT, `debug-pubchem-${theme}.png`) }).catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
  }

  // ── Export step ──
  try {
    const proceedBtn = page.locator('button').filter({ hasText: /proceed|next|export/i }).first();
    if (await proceedBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await proceedBtn.click();
      await page.waitForTimeout(1200);
      await shot(page, `datakurator-export-${theme}.png`);
    }
  } catch {}
}

// ── main ─────────────────────────────────────────────────────────────────────

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx     = await browser.newContext({ viewport: VIEWPORT });
  const page    = await ctx.newPage();

  try {
    await loginAndCaptureCognito(page);

    for (const theme of ['light', 'dark']) {
      console.log(`\n══════════ ${theme.toUpperCase()} MODE ══════════`);
      await navigateTo(page, '/');
      await setTheme(page, theme);

      await screenshotLibrary(page, theme);
      await screenshotReactions(page, theme);
      await screenshotEvaluation(page, theme);
      await screenshotProfile(page, theme);
      await screenshotDataKurator(page, theme);
    }

    const files = fs.readdirSync(OUT).sort();
    console.log(`\n✅ Done! ${files.length} screenshots → ${OUT}`);
    console.log(files.join('\n'));

  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
    await page.screenshot({ path: path.join(OUT, 'debug-fatal.png') }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
