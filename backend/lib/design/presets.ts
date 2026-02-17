import type { DesignPreset, ResolvedDesignTokens, TokenTweaks } from './types';
import { getFontPairing } from './fonts';
import { isValidHex } from './colorUtils';

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional B2B — trustworthy but understated',
    mood: 'professional and modern',
    layoutStyle: 'corporate',
    palette: {
      primary: '#1E3A5F',
      secondary: '#4A90D9',
      accent: '#2563EB',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
    },
    defaultFontPairingId: 'inter-inter',
    borderRadius: '0.5rem',
    spacing: '1.5rem',
  },
  {
    id: 'editorial-warm',
    name: 'Editorial Warm',
    description: 'Magazine-style layouts — warm tones, serif headings, generous whitespace',
    mood: 'warm and editorial',
    layoutStyle: 'elegant',
    palette: {
      primary: '#8B4513',
      secondary: '#C4956A',
      accent: '#B8621B',
      background: '#FFFAF5',
      surface: '#FFF5EB',
      textPrimary: '#2C1810',
      textSecondary: '#8B7355',
    },
    defaultFontPairingId: 'playfair-source',
    borderRadius: '0.25rem',
    spacing: '2.5rem',
  },
  {
    id: 'mono-minimal',
    name: 'Mono Minimal',
    description: 'Monochrome with a single accent — portfolio, agency feel',
    mood: 'minimal and refined',
    layoutStyle: 'minimal',
    palette: {
      primary: '#18181B',
      secondary: '#52525B',
      accent: '#18181B',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      textPrimary: '#18181B',
      textSecondary: '#71717A',
    },
    defaultFontPairingId: 'manrope-inter',
    borderRadius: '0.375rem',
    spacing: '2rem',
  },
  {
    id: 'dark-neon',
    name: 'Dark Neon',
    description: 'Near-black backgrounds with neon accent — tech/gaming/crypto',
    mood: 'futuristic and bold',
    layoutStyle: 'bold',
    palette: {
      primary: '#0A0A0A',
      secondary: '#1A1A2E',
      accent: '#00FF88',
      background: '#0A0A0A',
      surface: '#111118',
      textPrimary: '#E8E8E8',
      textSecondary: '#888899',
    },
    defaultFontPairingId: 'space-dm',
    borderRadius: '0.5rem',
    spacing: '1.5rem',
  },
  {
    id: 'technical-grid',
    name: 'Technical Grid',
    description: 'Cool grays, mono-spaced accents, tight grid — developer/data tools',
    mood: 'precise and technical',
    layoutStyle: 'corporate',
    palette: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#3B82F6',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
    },
    defaultFontPairingId: 'space-dm',
    borderRadius: '0.25rem',
    spacing: '1.25rem',
  },
  {
    id: 'color-blocks',
    name: 'Color Blocks',
    description: 'Bold alternating section colors — creative agency, events',
    mood: 'bold and creative',
    layoutStyle: 'creative',
    palette: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#FAF5FF',
      textPrimary: '#1E1B4B',
      textSecondary: '#6B7280',
    },
    defaultFontPairingId: 'plus-jakarta-inter',
    borderRadius: '0',
    spacing: '2rem',
  },
  {
    id: 'soft-cards',
    name: 'Soft Cards',
    description: 'Pastel palette, rounded everything — lifestyle, wellness, education',
    mood: 'soft and approachable',
    layoutStyle: 'creative',
    palette: {
      primary: '#6D4C9F',
      secondary: '#F0ABFC',
      accent: '#A78BFA',
      background: '#FFFBFE',
      surface: '#FDF2F8',
      textPrimary: '#3B0764',
      textSecondary: '#7C7C8A',
    },
    defaultFontPairingId: 'poppins-inter',
    borderRadius: '1.25rem',
    spacing: '1.75rem',
  },
  {
    id: 'trusty-green',
    name: 'Trusty Green',
    description: 'Green-anchored, professional — health, finance, eco',
    mood: 'trustworthy and grounded',
    layoutStyle: 'corporate',
    palette: {
      primary: '#166534',
      secondary: '#22C55E',
      accent: '#16A34A',
      background: '#FFFFFF',
      surface: '#F0FDF4',
      textPrimary: '#14532D',
      textSecondary: '#4B5563',
    },
    defaultFontPairingId: 'outfit-source',
    borderRadius: '0.75rem',
    spacing: '1.5rem',
  },
];

const PRESET_MAP = new Map(DESIGN_PRESETS.map((p) => [p.id, p]));

export function resolveTokens(
  presetId: string,
  tweaks?: TokenTweaks,
  fontPairingOverride?: string
): ResolvedDesignTokens {
  const preset = PRESET_MAP.get(presetId) ?? DESIGN_PRESETS[0];
  const fontPairing = getFontPairing(fontPairingOverride ?? preset.defaultFontPairingId);

  const palette = { ...preset.palette };
  if (tweaks) {
    for (const [key, value] of Object.entries(tweaks)) {
      if (value && isValidHex(value) && key in palette) {
        (palette as Record<string, string>)[key] = value;
      }
    }
  }

  return {
    brandName: '',
    palette,
    typography: {
      headingFont: fontPairing.heading,
      bodyFont: fontPairing.body,
      baseSize: 16,
      scale: 1.25,
      headingWeight: 700,
      bodyWeight: 400,
    },
    borderRadius: preset.borderRadius,
    spacing: preset.spacing,
  };
}

export const PRESET_IDS = DESIGN_PRESETS.map((p) => p.id);
