import { chromium, Browser } from 'playwright';

let _browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!_browser || !_browser.isConnected()) {
    _browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  }
  return _browser;
}

/**
 * Takes a screenshot of rendered HTML using local Playwright.
 * Returns base64 PNG string.
 */
export async function screenshotHtml(html: string): Promise<string> {
  const browser = await getBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.setContent(html, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const buffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1440, height: Math.min(bodyHeight, 4000) },
    });

    return buffer.toString('base64');
  } finally {
    await context.close();
  }
}
