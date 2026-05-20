/**
 * Targeted: re-capture reaction screenshots with all 5 Lisinopril RXN files.
 *
 * reactions-rxn-visualized = Visualise clicked inside dialog (renders all 5 steps inline)
 * library-with-reaction    = library showing 1 compound card + 1 reaction card (mixed)
 *
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

async function maskEmails(page) {
  await page.evaluate(() => {
    const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const UUID_RE  = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const sanitize = (s) => s
      .replace(EMAIL_RE, 'user@example.com')
      .replace(UUID_RE,  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const cleaned = sanitize(node.textContent);
        if (cleaned !== node.textContent) node.textContent = cleaned;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'INPUT') {
          const cleaned = sanitize(node.value || '');
          if (cleaned !== node.value) node.value = cleaned;
        }
        for (const child of node.childNodes) walk(child);
      }
    };
    walk(document.body);
  });
}

async function shot(page, name) {
  await page.addStyleTag({ content: HIDE_DEV }).catch(() => {});
  await maskEmails(page);
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

async function openReactionDialog(page) {
  const btn = page.locator('button').filter({ hasText: /reaction/i }).first();
  await btn.waitFor({ state: 'visible', timeout: 6000 });
  await btn.click();
  await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
  await page.waitForTimeout(400);
  return btn;
}

async function goToFilesTab(page) {
  const tab = page.locator('[role="dialog"] [role="tab"]').filter({ hasText: /file/i }).first();
  await tab.waitFor({ state: 'visible', timeout: 4000 });
  await tab.click();
  await page.waitForTimeout(400);
}

async function uploadRxnFiles(page) {
  const fileInput = page.locator('[role="dialog"] input[type="file"]').first();
  await fileInput.waitFor({ timeout: 4000 });
  await fileInput.setInputFiles(RXN_FILES);
  await page.waitForTimeout(1200);
}

async function screenshotReactions(page, theme) {
  console.log(`\n  ⚗️  Reactions (${theme})`);

  // ── SMILES tab screenshots ─────────────────────────────────────────────────
  await page.evaluate(() => {
    localStorage.setItem('library-storage', JSON.stringify({ state: { library: [] }, version: 0 }));
    localStorage.removeItem('evaluation-result-storage');
  });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  let reactionBtn = await openReactionDialog(page);
  await shot(page, `reactions-smiles-tab-${theme}.png`);

  // Fill SMILES + click Visualise to show inline preview
  const textarea = page.locator('[role="dialog"] textarea').first();
  await textarea.fill('CC(=O)Cl.OCC>>CC(=O)OCC.Cl');
  const visualiseBtn = page.locator('[role="dialog"] button').filter({ hasText: /visuali/i }).first();
  if (await visualiseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await visualiseBtn.click();
    await page.waitForTimeout(3000);
    await shot(page, `reactions-smiles-result-${theme}.png`);
  }

  // ── Files tab screenshots ──────────────────────────────────────────────────
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  reactionBtn = await openReactionDialog(page);
  await goToFilesTab(page);
  await shot(page, `reactions-files-tab-${theme}.png`);

  // Upload all 5 RXN files
  await uploadRxnFiles(page);
  await shot(page, `reactions-rxn-uploaded-${theme}.png`);

  // Click Visualise — renders full 5-step Lisinopril synthesis inside the dialog
  const filesVisualiseBtn = page.locator('[role="dialog"] button').filter({ hasText: /visuali/i }).first();
  if (await filesVisualiseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await filesVisualiseBtn.click();
    // Wait for backend render (5 steps may take a moment)
    await page.waitForTimeout(5000);
    await shot(page, `reactions-rxn-visualized-${theme}.png`);
  }

  // Submit → reaction added to library (dialog closes automatically)
  const submitBtn = page.locator('[role="dialog"] button[type="submit"]').first();
  if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await submitBtn.click();
    await page.waitForTimeout(3000);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // ── Library with reaction card ─────────────────────────────────────────────
  // Library now has 1 reaction card (from the submit above). Add 1 compound alongside it.
  const currentLib = await page.evaluate(() => {
    const raw = localStorage.getItem('library-storage');
    if (!raw) return [];
    try { return JSON.parse(raw).state.library || []; } catch { return []; }
  });

  // Prepend Aspirin so the library shows compound + reaction together
  const withCompound = [
    { id: 0, name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O', cas: '50-78-2', type: 'compound' },
    ...currentLib.map(item => ({ ...item, id: item.id + 1 })),
  ];
  await page.evaluate((lib) => {
    localStorage.setItem('library-storage', JSON.stringify({ state: { library: lib }, version: 0 }));
  }, withCompound);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // wait for reaction to render from API

  await shot(page, `library-with-reaction-${theme}.png`);
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
