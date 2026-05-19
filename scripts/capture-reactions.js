/**
 * Targeted: re-capture reaction screenshots with all 5 Lisinopril RXN files.
 * Run: node capture-reactions.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const EMAIL = 'shrihegde@multicase.com';
const PASS  = 'C7EQbTd6ju6kB2d@1';
const BASE  = 'http://localhost:3000';
const OUT   = path.resolve(__dirname, '../images');

const VIEWPORT = { width: 1440, height: 900 };

const RXN_FILES = [
  '/Users/multicase/Downloads/Lisininopril_step_1.RXN',
  '/Users/multicase/Downloads/Lisininopril_step_2.RXN',
  '/Users/multicase/Downloads/Lisininopril_step_3.RXN',
  '/Users/multicase/Downloads/Lisininopril_step_4.RXN',
  '/Users/multicase/Downloads/Lisininopril_step_5.RXN',
];

const HIDE_DEV = `
  nextjs-portal, [data-nextjs-dialog], [data-nextjs-toast],
  #__next-build-indicator, .__next-build-watcher,
  [class*="nextjs__container"] { display: none !important; }
`;

async function shot(page, name) {
  await page.addStyleTag({ content: HIDE_DEV }).catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log(`  📸 ${name}`);
}

async function login(page) {
  await page.goto(`${BASE}/auth/signin`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload({ waitUntil: 'networkidle' });
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

const SAMPLE_COMPOUNDS = [
  { id: 1, name: "Aspirin",     smiles: "CC(=O)Oc1ccccc1C(=O)O",        cas: "50-78-2",    type: "compound" },
  { id: 2, name: "Caffeine",    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C", cas: "58-08-2",    type: "compound" },
  { id: 3, name: "Ibuprofen",   smiles: "CC(C)Cc1ccc(cc1)C(C)C(=O)O",   cas: "15687-27-1", type: "compound" },
];

async function screenshotReactions(page, theme) {
  console.log(`\n  ⚗️  Reactions (${theme})`);

  // Inject sample library and navigate home
  await page.evaluate((c) => {
    localStorage.setItem('library-storage', JSON.stringify({ state: { library: c }, version: 0 }));
    localStorage.removeItem('evaluation-result-storage');
  }, SAMPLE_COMPOUNDS);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Open "+ Reaction" dialog
  const reactionBtn = page.locator('button').filter({ hasText: /reaction/i }).first();
  if (!await reactionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.warn('  ⚠ Reaction button not found'); return;
  }
  await reactionBtn.click();
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
  await page.waitForTimeout(500);
  await shot(page, `reactions-smiles-tab-${theme}.png`);

  // Enter a SMILES and visualize (not submit — click Visualise button first)
  try {
    const textarea = page.locator('[role="dialog"] textarea').first();
    if (await textarea.isVisible({ timeout: 2000 }).catch(() => false)) {
      await textarea.fill('CC(=O)Cl.OCC>>CC(=O)OCC.Cl');
      // Click the Visualise button (type="button")
      const visualiseBtn = page.locator('[role="dialog"] button[type="button"]').filter({ hasText: /visuali/i }).first();
      if (await visualiseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await visualiseBtn.click();
        await page.waitForTimeout(2500);
        await shot(page, `reactions-smiles-result-${theme}.png`);
      }
    }
  } catch {}

  // Close and re-open cleanly for Files tab
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

      // Upload all 5 Lisinopril steps at once
      const fileInput = page.locator('[role="dialog"] input[type="file"]').first();
      if (await fileInput.count() > 0) {
        await fileInput.setInputFiles(RXN_FILES);
        await page.waitForTimeout(1200);
        await shot(page, `reactions-rxn-uploaded-${theme}.png`);

        // Submit to visualize all steps
        const submitBtn = page.locator('[role="dialog"] button[type="submit"]').first();
        if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(4000); // allow all 5 steps to render
          await shot(page, `reactions-rxn-visualized-${theme}.png`);
        }
      }
    }
  } catch (e) {
    console.warn('  ⚠ Files tab issue:', e.message?.split('\n')[0]);
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page    = await context.newPage();

  await login(page);

  for (const theme of ['light', 'dark']) {
    console.log(`\n══════════ ${theme.toUpperCase()} ══════════`);
    await page.evaluate((t) => localStorage.setItem('theme', t), theme);
    await screenshotReactions(page, theme);
  }

  await browser.close();
  console.log('\n✅ Done!');
})();
