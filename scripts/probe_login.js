const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for all navigations
  page.on('response', resp => {
    console.log('RESPONSE:', resp.status(), resp.url().substring(0, 120));
  });
  
  await page.goto('http://localhost:3000/auth/signin', { waitUntil: 'networkidle' });
  console.log('--- Page title:', await page.title());
  console.log('--- URL:', page.url());
  
  // Find the sign-in button
  const btn = await page.$('button');
  if (btn) {
    console.log('--- Button text:', await btn.innerText());
    console.log('--- Clicking...');
    await btn.click();
    await page.waitForTimeout(3000);
    console.log('--- After click URL:', page.url());
    console.log('--- After click title:', await page.title());
    
    // Check what input fields exist
    const inputs = await page.$$('input');
    for (const inp of inputs) {
      const type = await inp.getAttribute('type');
      const name = await inp.getAttribute('name');
      const id = await inp.getAttribute('id');
      console.log('INPUT:', type, name, id);
    }
  }
  
  await browser.close();
})();
