export interface RecraftAsset {
  url: string;
  type: 'hero' | 'icon';
}

interface GenerateOptions {
  prompt: string;
  model: 'recraftv3' | 'recraftv2';
  style: string;
  size?: string;
}

async function generate(options: GenerateOptions): Promise<string> {
  const apiKey = process.env.RECRAFT_API_KEY;
  if (!apiKey) throw new Error('RECRAFT_API_KEY not set');

  const response = await fetch(
    'https://external.api.recraft.ai/v1/images/generations',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: options.prompt,
        model: options.model,
        style: options.style,
        size: options.size || '1024x1024',
        response_format: 'b64_json',
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Recraft API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error('Recraft returned no image data');

  return `data:image/svg+xml;base64,${b64}`;
}

// Style-specific hero illustration prompts
const STYLE_HERO_PROMPTS: Record<string, string> = {
  'dark-tech': 'Dark, futuristic, abstract technology visualization with neon circuit patterns, glowing data streams, and deep black background. Cyberpunk-inspired geometric shapes.',
  'editorial-premium': 'Elegant, high-contrast editorial illustration with sophisticated typography elements, luxury aesthetic, muted gold and cream tones. Magazine-quality composition.',
  'technical-dashboard': 'Data dashboard visualization with chart elements, grid patterns, metric displays, dark background with cyan and green data points. Technical and precise.',
  'bold-startup': 'Bold, vibrant, energetic illustration with geometric shapes, bright gradients, dynamic angles. Startup energy with confident, forward-looking composition.',
  'modern-saas': 'Clean, modern SaaS product illustration with floating UI elements, soft shadows, and professional blue tones. Polished and trustworthy.',
  'warm-organic': 'Warm, organic illustration with natural textures, earth tones, hand-drawn feel. Approachable and human with soft, rounded shapes.',
  'playful-creative': 'Playful, colorful, creative illustration with whimsical shapes, bold patterns, and fun composition. Energetic and imaginative with saturated colors.',
};

const STYLE_ICON_MOODS: Record<string, string> = {
  'dark-tech': 'futuristic, neon-accented, dark-themed',
  'editorial-premium': 'elegant, refined, thin-lined',
  'technical-dashboard': 'technical, precise, data-oriented',
  'bold-startup': 'bold, vibrant, geometric',
  'modern-saas': 'clean, professional, modern',
  'warm-organic': 'warm, organic, hand-drawn',
  'playful-creative': 'playful, colorful, whimsical',
};

function getHeroPromptForStyle(styleId: string, brandName: string, siteType: string): string {
  const stylePrompt = STYLE_HERO_PROMPTS[styleId] || STYLE_HERO_PROMPTS['modern-saas'];
  return `${stylePrompt} Hero illustration for a ${siteType} website called "${brandName}". No text.`;
}

function getIconMoodForStyle(styleId: string, fallbackMood: string): string {
  return STYLE_ICON_MOODS[styleId] || fallbackMood;
}

export async function generateHeroIllustration(
  brandName: string,
  mood: string,
  siteType: string,
  styleId?: string,
): Promise<string> {
  const prompt = styleId
    ? getHeroPromptForStyle(styleId, brandName, siteType)
    : `Modern ${mood} hero illustration for a ${siteType} website called "${brandName}". Abstract, professional, clean design with subtle gradients. No text.`;

  return generate({
    prompt,
    model: 'recraftv3',
    style: 'vector_illustration',
    size: '1536x1024',
  });
}

export async function generateFeatureIcon(
  subject: string,
  mood: string,
  styleId?: string,
): Promise<string> {
  const iconMood = styleId ? getIconMoodForStyle(styleId, mood) : mood;
  const prompt = `Simple, clean ${iconMood} icon representing "${subject}". Minimal, flat design. No text, no background.`;

  return generate({
    prompt,
    model: 'recraftv2',
    style: 'icon',
    size: '1024x1024',
  });
}

export async function generateAssets(
  brandName: string,
  mood: string,
  siteType: string,
  iconSubjects: string[] = [],
  styleId?: string,
): Promise<{ heroImage?: string; icons: string[] }> {
  const apiKey = process.env.RECRAFT_API_KEY;
  if (!apiKey) return { icons: [] };

  try {
    // Hero: Recraft V3 Vector (style-aware)
    const heroImage = await generateHeroIllustration(brandName, mood, siteType, styleId);

    // Feature icons: Recraft V2 Vector (parallel, up to 6, style-aware)
    const subjects = iconSubjects.slice(0, 6);
    const icons = await Promise.all(
      subjects.map((subject) => generateFeatureIcon(subject, mood, styleId))
    ).catch(() => [] as string[]);

    return { heroImage, icons };
  } catch (error) {
    console.error('Recraft generation failed:', error);
    return { icons: [] };
  }
}
