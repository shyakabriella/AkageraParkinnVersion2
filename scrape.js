import fs from 'fs';
import puppeteer from 'puppeteer';

const urls = [
  { name: 'home', url: 'https://akageraparkinn.com/' },
  { name: 'gallery', url: 'https://akageraparkinn.com/gallery' },
  { name: 'experiences', url: 'https://akageraparkinn.com/experience' },
  { name: 'offers', url: 'https://akageraparkinn.com/offers' },
  { name: 'services', url: 'https://akageraparkinn.com/services' }
];

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  for (const { name, url } of urls) {
    console.log(`Scraping ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Wait for React to render
      await new Promise(r => setTimeout(r, 3000));
      const html = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? root.outerHTML : '';
      });
      fs.writeFileSync(`${name}.html`, html);
      console.log(`Saved ${name}.html (${html.length} bytes)`);
    } catch (e) {
      console.error(`Error scraping ${url}:`, e);
    }
  }

  await browser.close();
  console.log('Scraping complete.');
}

scrape().catch(console.error);
