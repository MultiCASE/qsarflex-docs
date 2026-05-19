const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/auth/signin', { waitUntil: 'networkidle' });
  await page.click('button');
  await page.waitForURL('**/login**', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  
  console.log('URL:', page.url().substring(0, 100));
  
  const inputs = await page.$$('input');
  for (const inp of inputs) {
    const type = await inp.getAttribute('type');
    const name = await inp.getAttribute('name');
    const id = await inp.getAttribute('id');
    const placeholder = await inp.getAttribute('placeholder');
    console.log('INPUT:', JSON.stringify({type, name, id, placeholder}));
  }
  
  const buttons = await page.$$('button, input[type=submit]');
  for (const btn of buttons) {
    const text = await btn.innerText().catch(() => '');
    const type = await btn.getAttribute('type');
    const val = await btn.getAttribute('value').catch(() => '');
    console.log('BUTTON:', JSON.stringify({type, text, val}));
  }
  
  await browser.close();
})();
