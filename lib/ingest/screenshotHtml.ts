/**
 * Takes a screenshot of rendered HTML via the Railway backend service.
 * Returns base64 PNG string.
 */
export async function screenshotHtml(html: string): Promise<string> {
  const baseUrl = process.env.SCREENSHOT_API_URL;
  if (!baseUrl) throw new Error('SCREENSHOT_API_URL not set');

  const url = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  const secret = process.env.SCREENSHOT_API_SECRET;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`;
  }

  const response = await fetch(`${url}/screenshot-html`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ html }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Screenshot-html failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.screenshot;
}
