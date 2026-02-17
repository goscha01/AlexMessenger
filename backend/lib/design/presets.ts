import type { DesignPreset, ResolvedDesignTokens, TokenTweaks } from './types';
import { getFontPairing } from './fonts';
import { isValidHex } from './colorUtils';

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional SaaS/B2B — trustworthy and clean',
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
    id: 'warm-earth',
    name: 'Warm Earth',
    description: 'Restaurants, wellness, hospitality — inviting and grounded',
    mood: 'warm and inviting',
    layoutStyle: 'elegant',
    palette: {
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#CD853F',
      background: '#FFFAF5',
      surface: '#FFF5EB',
      textPrimary: '#3E1F05',
      textSecondary: '#8B7355',
    },
    defaultFontPairingId: 'fraunces-inter',
    borderRadius: '0.75rem',
    spacing: '1.5rem',
  },
  {
    id: 'bold-startup',
    name: 'Bold Startup',
    description: 'Startup landing pages — energetic and confident',
    mood: 'bold and energetic',
    layoutStyle: 'bold',
    palette: {
      primary: '#111827',
      secondary: '#6366F1',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F3F4F6',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
    },
    defaultFontPairingId: 'sora-dm',
    borderRadius: '0.75rem',
    spacing: '2rem',
  },
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    description: 'Luxury, fashion — sophisticated and premium',
    mood: 'sophisticated and luxurious',
    layoutStyle: 'elegant',
    palette: {
      primary: '#1A1A2E',
      secondary: '#16213E',
      accent: '#C9A96E',
      background: '#0F0F1A',
      surface: '#1A1A2E',
      textPrimary: '#F5F5F5',
      textSecondary: '#A0A0B0',
    },
    defaultFontPairingId: 'cormorant-source',
    borderRadius: '0.25rem',
    spacing: '2rem',
  },
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    description: 'Portfolio, agency — clean and focused',
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
    spacing: '1.5rem',
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    description: 'Health, eco, organic — natural and trustworthy',
    mood: 'fresh and natural',
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
  {
    id: 'creative-pop',
    name: 'Creative Pop',
    description: 'Creative agencies, events — playful and vibrant',
    mood: 'playful and creative',
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
    borderRadius: '1rem',
    spacing: '2rem',
  },
  {
    id: 'tech-gradient',
    name: 'Tech Gradient',
    description: 'AI/tech products — futuristic and innovative',
    mood: 'futuristic and innovative',
    layoutStyle: 'bold',
    palette: {
      primary: '#0F172A',
      secondary: '#3B82F6',
      accent: '#8B5CF6',
      background: '#020617',
      surface: '#0F172A',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
    },
    defaultFontPairingId: 'space-dm',
    borderRadius: '0.75rem',
    spacing: '2rem',
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    description: 'Children, education, lifestyle — gentle and approachable',
    mood: 'soft and approachable',
    layoutStyle: 'creative',
    palette: {
      primary: '#6D4C9F',
      secondary: '#F0ABFC',
      accent: '#F472B6',
      background: '#FFFBFE',
      surface: '#FDF2F8',
      textPrimary: '#3B0764',
      textSecondary: '#7C7C8A',
    },
    defaultFontPairingId: 'poppins-inter',
    borderRadius: '1.25rem',
    spacing: '1.5rem',
  },
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    description: 'Law, finance, editorial — authoritative and timeless',
    mood: 'authoritative and timeless',
    layoutStyle: 'corporate',
    palette: {
      primary: '#1C1917',
      secondary: '#78716C',
      accent: '#B45309',
      background: '#FFFFFF',
      surface: '#FAFAF9',
      textPrimary: '#1C1917',
      textSecondary: '#57534E',
    },
    defaultFontPairingId: 'libre-merriweather',
    borderRadius: '0.25rem',
    spacing: '1.5rem',
  },
];

const PRESET_MAP = new Map(DESIGN_PRESETS.map((p) => [p.id, p]));

export function resolveTokens(
  presetId: string,
  tweaks?: TokenTweaks,
  fontPairingOverride?: string
): ResolvedDesignTokens {
  const preset = PRESET_MAP.get(presetId) ?? DESIGN_PRESETS[0]; // fallback to corporate-blue
  const fontPairing = getFontPairing(fontPairingOverride ?? preset.defaultFontPairingId);

  // Apply tweaks — only valid hex overrides
  const palette = { ...preset.palette };
  if (tweaks) {
    for (const [key, value] of Object.entries(tweaks)) {
      if (value && isValidHex(value) && key in palette) {
        (palette as Record<string, string>)[key] = value;
      }
    }
  }

  return {
    brandName: '', // filled by caller
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
