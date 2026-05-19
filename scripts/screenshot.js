/**
 * QSARFlex documentation screenshot automation
 * Run: node screenshot.js
 * Prerequisites: app running at localhost:3000, backend at localhost:8080
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const EMAIL  = 'shrihegde@multicase.com';
const PASS   = 'C7EQbTd6ju6kB2d@1';
const BASE   = 'http://localhost:3000';
const OUT    = path.resolve(__dirname, '../images');
const SMI    = path.resolve(__dirname, 'samples/test_compounds.smi');

const VIEWPORT = { width: 1440, height: 900 };

// Sample compounds to inject directly into localStorage
const SAMPLE_COMPOUNDS = [
  { id: 1, name: "Aspirin",      smiles: "CC(=O)Oc1ccccc1C(=O)O",                                 cas: "50-78-2",   type: "compound" },
  { id: 2, name: "Caffeine",     smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",                           cas: "58-08-2",   type: "compound" },
  { id: 3, name: "Testosterone", smiles: "CC12CCC3C(C1CCC2O)CCC4=CC(=O)CCC34C",                   cas: "58-22-0",   type: "compound" },
  { id: 4, name: "Ibuprofen",    smiles: "CC(C)Cc1ccc(cc1)C(C)C(=O)O",                             cas: "15687-27-1", type: "compound" },
  { id: 5, name: "Chloroquine",  smiles: "CCN(CC)CCCC(C)Nc1ccnc2cc(Cl)ccc12",                     cas: "54-05-7",   type: "compound" },
  { id: 6, name: "Benzo[a]pyrene", smiles: "c1ccc2c(c1)cc1ccc3cccc4ccc2c1c34",                    cas: "50-32-8",   type: "compound" },
];

fs.mkdirSync(OUT, { recursive: true });

// ── helpers ──────────────────────────────────────────────────────────────────

async function shot(page, name) {
  await page.waitForTimeout(700);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log('  📸', name);
}

async function login(page) {
  console.log('→ Logging in…');
  await page.goto(`${BASE}/auth/signin`, { waitUntil: 'networkidle' });
  await page.click('button:has-text("Sign in with Cognito")');
  await page.waitForURL('**/login**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  await page.fill('input[name="username"]', EMAIL);
  await page.click('button[type="submit"]');

  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', PASS);
  await page.click('button[type="submit"]');

  await page.waitForURL(`${BASE}/**`, { timeout: 20000 });
  await page.waitForLoadState('networkidle');
  console.log('  ✓ Logged in');
}

async function setTheme(page, theme) {
  // Inject theme into localStorage and reload so next-themes picks it up
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate((t) => {
    localStorage.setItem('theme', t);
  }, theme);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
}

async function injectLibrary(page) {
  await page.evaluate((compounds) => {
    const state = { state: { library: compounds }, version: 0 };
    localStorage.setItem('library-storage', JSON.stringify(state));
  }, SAMPLE_COMPOUNDS);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
}

async function clearLibrary(page) {
  await page.evaluate(() => {
    localStorage.removeItem('library-storage');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
}

// Wait up to `ms` for a condition, checking every 500ms
async function waitFor(fn, ms = 5000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await fn()) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

// ── main ─────────────────────────────────────────────────────────────────────

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();

  try {
    await login(page);

    for (const theme of ['light', 'dark']) {
      console.log(`\n── ${theme.toUpperCase()} MODE ──`);

      // ── 1. Sign-in page ─────────────────────────────────────────────────
      await page.goto(`${BASE}/auth/signin`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await shot(page, `signin-${theme}.png`);

      // Set theme (navigates to / and reloads)
      await setTheme(page, theme);

      // ── 2. Empty library ─────────────────────────────────────────────────
      await clearLibrary(page);
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      await shot(page, `library-empty-${theme}.png`);

      // ── 3. Add compound dialog (single tab) ──────────────────────────────
      const addBtn = page.locator('button').filter({ hasText: /\+.*compound|add compound/i }).first();
      await addBtn.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
      await page.waitForTimeout(600);
      await shot(page, `add-compound-${theme}.png`);

      // Try autofill
      try {
        // The first input in the dialog is probably the name/smiles field
        const inputs = page.locator('[role="dialog"] input[type="text"], [role="dialog"] input:not([type])');
        const count = await inputs.count();
        if (count > 0) {
          await inputs.first().fill('Caffeine');
          await page.waitForTimeout(200);
          const autofillBtn = page.locator('[role="dialog"] button').filter({ hasText: /autofill|look up|search/i }).first();
          if (await autofillBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
            await autofillBtn.click();
            await page.waitForTimeout(2500);
            await shot(page, `add-compound-autofill-${theme}.png`);
          }
        }
      } catch { /* skip */ }

      // Switch to batch tab for screenshot
      try {
        const batchTab = page.locator('[role="dialog"] [role="tab"]').filter({ hasText: /batch/i }).first();
        if (await batchTab.isVisible({ timeout: 1500 }).catch(() => false)) {
          await batchTab.click();
          await page.waitForTimeout(400);
          await shot(page, `batch-upload-${theme}.png`);
        }
      } catch { /* skip */ }

      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);

      // ── 4. Library with compounds (injected) ─────────────────────────────
      await injectLibrary(page);
      await shot(page, `library-compounds-${theme}.png`);

      // ── 5. DataKurator — upload step ──────────────────────────────────────
      // Clear DK state so we always start at the upload step
      await page.evaluate(() => localStorage.removeItem('qsarflex_dk_state'));
      await page.goto(`${BASE}/datakurator`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      await shot(page, `datakurator-upload-${theme}.png`);

      // Upload SMI file via react-dropzone input
      try {
        const dzInput = page.locator('input[type="file"]').first();
        await dzInput.setInputFiles(SMI);
        await page.waitForTimeout(800);
        await shot(page, `datakurator-file-selected-${theme}.png`);

        const runBtn = page.locator('button').filter({ hasText: /run analysis/i }).first();
        const enabled = await runBtn.isEnabled({ timeout: 2000 }).catch(() => false);
        if (enabled) {
          await runBtn.click();
          // Wait for transition to analyze step
          await page.waitForSelector('text=Curate', { timeout: 10000 }).catch(() => {});
          await page.waitForTimeout(4000);
          await shot(page, `datakurator-results-${theme}.png`);

          // Try to proceed to export
          const proceedBtn = page.locator('button').filter({ hasText: /proceed|export|next step/i }).first();
          if (await proceedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await proceedBtn.click();
            await page.waitForTimeout(1000);
            await shot(page, `datakurator-export-${theme}.png`);
          }
        }
      } catch (e) {
        console.warn('  ⚠ DataKurator upload issue:', e.message.split('\n')[0]);
      }

      // ── 6. Evaluate dialog ────────────────────────────────────────────────
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      await injectLibrary(page);  // ensure library is populated

      const evalBtn = page.locator('button').filter({ hasText: /^evaluate$/i }).first();
      const evalVisible = await evalBtn.isEnabled({ timeout: 5000 }).catch(() => false);

      if (evalVisible) {
        await evalBtn.click();
        await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
        // Wait for modules to load (disappear of loading text)
        await page.waitForFunction(
          () => !document.querySelector('[role="dialog"]')?.textContent?.includes('Loading modules'),
          { timeout: 10000 }
        ).catch(() => {});
        await page.waitForTimeout(800);
        await shot(page, `evaluate-dialog-${theme}.png`);

        // Select first enabled Radix UI checkbox
        try {
          const firstCheck = page.locator('[role="dialog"] [role="checkbox"]:not([data-disabled])').first();
          if (await firstCheck.isVisible({ timeout: 3000 }).catch(() => false)) {
            await firstCheck.click({ force: true });
            await page.waitForTimeout(400);

            const confirmBtn = page.locator('[role="dialog"] button').filter({ hasText: /^evaluate$/i }).first();
            if (await confirmBtn.isEnabled({ timeout: 2000 }).catch(() => false)) {
              await confirmBtn.click();
              await page.waitForLoadState('networkidle');
              await page.waitForTimeout(5000);
              await shot(page, `eval-results-${theme}.png`);
            }
          }
        } catch (e) {
          console.warn('  ⚠ Could not select module:', e.message.split('\n')[0]);
          await page.keyboard.press('Escape');
        }
      } else {
        console.warn('  ⚠ Evaluate button not enabled');
      }
    }

    console.log('\n✅ Done. Screenshots at', OUT);
    console.log('Files:', fs.readdirSync(OUT).sort().join(', '));
  } catch (err) {
    console.error('❌ Error:', err.message);
    await page.screenshot({ path: path.join(OUT, 'debug-error.png') }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
