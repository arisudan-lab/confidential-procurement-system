import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  console.log("PAGE CONTENT LENGTH:", content.length);
  if (content.includes('Confidential Tenders')) {
    console.log("SUCCESS: Page loaded perfectly!");
  } else {
    console.log("FAILED to load content.");
  }

  await browser.close();
})();
