const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*').split(',');

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Simple auth via shared secret
function authenticate(req, res, next) {
  const secret = process.env.API_SECRET;
  if (!secret) return next(); // no secret configured = open
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'screenshot-service' });
});

app.post('/screenshot', authenticate, async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "url" field' });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  console.log(`[screenshot] Capturing: ${url}`);
  const startTime = Date.now();

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Desktop screenshot
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const desktopBuffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1440, height: Math.min(bodyHeight, 4000) },
    });

    // Mobile screenshot
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const mobileHeight = await page.evaluate(() => document.body.scrollHeight);
    const mobileBuffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 390, height: Math.min(mobileHeight, 4000) },
    });

    await context.close();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[screenshot] Done in ${elapsed}s — desktop: ${desktopBuffer.length}B, mobile: ${mobileBuffer.length}B`);

    res.json({
      desktop: desktopBuffer.toString('base64'),
      mobile: mobileBuffer.toString('base64'),
    });
  } catch (error) {
    console.error('[screenshot] Error:', error.message);
    res.status(500).json({ error: `Screenshot failed: ${error.message}` });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Screenshot service running on port ${PORT}`);
});
