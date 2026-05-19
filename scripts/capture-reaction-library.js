/**
 * Targeted script: capture library-with-reaction screenshot (light + dark).
 * Run: node capture-reaction-library.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const EMAIL = 'shrihegde@multicase.com';
const PASS  = 'C7EQbTd6ju6kB2d@1';
const BASE  = 'http://localhost:3000';
const OUT   = path.resolve(__dirname, '../images');

const VIEWPORT = { width: 1440, height: 900 };

async function shot(page, name) {
  // Hide Next.js dev tools overlay before every screenshot
  await page.addStyleTag({ content: `
    nextjs-portal, [data-nextjs-dialog], [data-nextjs-toast],
    #__next-build-indicator, .__next-build-watcher,
    [class*="nextjs"], [id*="__next-build"],
    nextjs-portal { display: none !important; }
  ` }).catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log(`  📸 ${name}`);
}

async function login(page) {
  await page.goto(`${BASE}/auth/signin`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Click "Sign in with Cognito" button on QSARFlex signin page
  await page.click('button:has-text("Sign in with Cognito")');
  await page.waitForURL('**/login**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // Cognito: fill username (email)
  await page.fill('input[name="username"]', EMAIL);
  await page.click('button[type="submit"]');
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });

  // Cognito: fill password
  await page.fill('input[type="password"]', PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/**`, { timeout: 20000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  console.log('  ✓ Logged in');
}

async function injectReaction(page) {
  const REACTION = [
    {
      id: 1,
      type: 'reaction',
      name: 'Reaction - 1 step',
      cas: 'N/A',
      smiles: 'CC(=O)Cl.OCC>>CC(=O)OCC.Cl',
    },
  ];
  await page.evaluate((r) => {
    localStorage.setItem('library-storage', JSON.stringify({ state: { library: r }, version: 0 }));
    localStorage.removeItem('evaluation-result-storage');
  }, REACTION);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
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
    await injectReaction(page);

    // Wait for the reaction card to fetch and render the structure from the API
    try {
      await page.waitForFunction(
        () => document.querySelector('[class*="StructureViewer"] svg, .reaction-viewer svg') !== null ||
              document.querySelector('iframe') !== null,
        { timeout: 10000 }
      ).catch(() => {});
    } catch {}
    await page.waitForTimeout(2000);

    await shot(page, `library-with-reaction-${theme}.png`);
  }

  await browser.close();
  console.log('\n✅ Done!');
  console.log(fs.readdirSync(OUT).filter(f => f.includes('reaction')).join('\n'));
})();
