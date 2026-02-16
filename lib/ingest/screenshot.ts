export interface Screenshots {
  desktop: string; // base64 PNG
  mobile: string;  // base64 PNG
}

export async function captureScreenshots(url: string): Promise<Screenshots> {
  const apiUrl = process.env.SCREENSHOT_API_URL;

  if (!apiUrl) {
    throw new Error(
      'SCREENSHOT_API_URL is not set. Set it to your Railway screenshot service URL (or http://localhost:3001 for local dev).'
    );
  }

  const secret = process.env.SCREENSHOT_API_SECRET;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`;
  }

  const response = await fetch(`${apiUrl}/screenshot`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(90000),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`Screenshot service error: ${err.error || response.status}`);
  }

  const data = await response.json();
  return { desktop: data.desktop, mobile: data.mobile };
}
