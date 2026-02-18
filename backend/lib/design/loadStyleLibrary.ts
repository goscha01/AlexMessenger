/**
 * loadStyleLibrary.ts
 *
 * Loads the style library from styleLibrary.json and bridges its tokens
 * to the existing ResolvedDesignTokens interface used by the renderer pipeline.
 */

import type { ResolvedDesignTokens } from '@/lib/design/types';
import styleLibraryData from './styleLibrary.json';

// ---------------------------------------------------------------------------
// Interfaces matching the JSON structure
// ---------------------------------------------------------------------------

export interface LibFontPairing {
  id: string;
  heading: string;
  body: string;
  fallback: string;
}

export interface LibTypeScaleBreakpoint {
  mobile: string;
  desktop: string;
}

export interface LibTypeScale {
  id: string;
  h1: LibTypeScaleBreakpoint;
  h2: LibTypeScaleBreakpoint;
  h3: LibTypeScaleBreakpoint;
  body: LibTypeScaleBreakpoint;
  lead: LibTypeScaleBreakpoint;
  line: { body: string; heading: string };
}

export interface StyleTokensPalette {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  mutedText: string;
  border: string;
  primary: string;
  primaryHover: string;
  accent: string;
  accent2: string;
}

export interface StyleTokensSpacing {
  density: 'loose' | 'normal' | 'tight';
  sectionY: number;
  sectionYMobile: number;
  gutterX: number;
  gutterXMobile: number;
}

export interface StyleTokensTypography {
  pairingId: string;
  scaleId: string;
}

export interface StyleTokens {
  mode: 'light' | 'dark';
  containerMaxWidth: number;
  radius: { card: number; button: number; input: number };
  shadow: { card: string; hover: string };
  border: { width: number; style: string };
  palette: StyleTokensPalette;
  spacing: StyleTokensSpacing;
  typography: StyleTokensTypography;
}

export interface SignatureArtifact {
  id: string;
  required: boolean;
}

export interface StyleDef {
  id: string;
  label: string;
  positioning: string;
  description: string;
  recommendedFor: string[];
  tokens: StyleTokens;
  motifs: {
    background: string[];
    separators: string[];
    microElements: string[];
  };
  wrappers: {
    allowed: string[];
    minDistinctWrappers: number;
  };
  signatureArtifacts: SignatureArtifact[];
  blockBias: {
    preferred: string[];
    avoid: string[];
  };
  constraints: {
    forbiddenPatterns: string[];
    requiredPatterns: string[];
    ctaRules: { maxPrimaryAboveFold: number; allowSecondary: boolean };
  };
}

export interface StyleLibrary {
  version: string;
  notes: string;
  styles: StyleDef[];
  fontPairings: LibFontPairing[];
  typeScales: LibTypeScale[];
}

// ---------------------------------------------------------------------------
// Loader & accessors
// ---------------------------------------------------------------------------

let _cached: StyleLibrary | null = null;

/** Loads and returns the parsed style library JSON. Result is cached. */
export function loadStyleLibrary(): StyleLibrary {
  if (!_cached) {
    _cached = styleLibraryData as unknown as StyleLibrary;
  }
  return _cached;
}

/** Returns a single style definition by its id, or undefined if not found. */
export function getStyle(id: string): StyleDef | undefined {
  const lib = loadStyleLibrary();
  return lib.styles.find((s) => s.id === id);
}

/** Returns all style ids in the library. */
export function getStyleIds(): string[] {
  const lib = loadStyleLibrary();
  return lib.styles.map((s) => s.id);
}

/** Returns all style definitions. */
export function getAllStyles(): StyleDef[] {
  const lib = loadStyleLibrary();
  return lib.styles;
}

/** Returns a font pairing by id, or undefined if not found. */
export function getLibFontPairing(id: string): LibFontPairing | undefined {
  const lib = loadStyleLibrary();
  return lib.fontPairings.find((fp) => fp.id === id);
}

// ---------------------------------------------------------------------------
// Token bridge: StyleDef -> ResolvedDesignTokens
// ---------------------------------------------------------------------------

/**
 * Bridges a StyleDef from the style library into a ResolvedDesignTokens object
 * compatible with the existing renderer pipeline.
 */
export function resolveStyleTokens(
  style: StyleDef,
  brandName: string,
): ResolvedDesignTokens {
  const { palette, radius, spacing, typography } = style.tokens;

  // Look up the font pairing from the library
  const pairing = getLibFontPairing(typography.pairingId);
  const headingFont = pairing?.heading ?? 'system-ui';
  const bodyFont = pairing?.body ?? 'system-ui';

  return {
    brandName,
    palette: {
      primary: palette.primary,
      secondary: palette.primaryHover,
      accent: palette.accent,
      background: palette.bg,
      surface: palette.surface,
      textPrimary: palette.text,
      textSecondary: palette.mutedText,
    },
    typography: {
      headingFont,
      bodyFont,
      baseSize: 16,
      scale: 1.25,
      headingWeight: 700,
      bodyWeight: 400,
    },
    borderRadius: `${radius.card / 16}rem`,
    spacing: `${spacing.gutterX / 16}rem`,
  };
}

// ---------------------------------------------------------------------------
// Signature mapper: style library ID -> existing signature CSS ID
// ---------------------------------------------------------------------------

const SIGNATURE_MAP: Record<string, string> = {
  'modern-saas': 'softCards',
  'dark-tech': 'darkNeon',
  'editorial-premium': 'editorial',
  'bold-startup': 'colorBlocks',
  'minimal-mono': 'monoMinimal',
  'soft-cards': 'softCards',
  'technical-dashboard': 'technicalGrid',
};

/**
 * Maps a style library ID to the corresponding signature CSS ID used by the
 * existing renderer. Falls back to 'softCards' for unknown IDs.
 */
export function getSignatureForStyle(styleId: string): string {
  return SIGNATURE_MAP[styleId] ?? 'softCards';
}

// ---------------------------------------------------------------------------
// Density mapper
// ---------------------------------------------------------------------------

/** Returns the spacing density for a given style definition. */
export function getDensityForStyle(
  style: StyleDef,
): 'loose' | 'normal' | 'tight' {
  return style.tokens.spacing.density;
}
