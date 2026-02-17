import type { ResolvedDesignTokens } from './types';
import type { PageSchema } from '@/lib/catalog/schemas';
import { contrastRatio, colorDistance } from './colorUtils';
import { FONT_PAIRINGS } from './fonts';

interface ScoreCategory {
  score: number;
  max: number;
  notes: string;
}

export interface DesignScoreResult {
  total: number;
  breakdown: Record<string, ScoreCategory>;
}

export function computeDesignScore(
  schema: PageSchema,
  tokens: ResolvedDesignTokens
): DesignScoreResult {
  const breakdown: Record<string, ScoreCategory> = {};

  // Contrast (25 pts)
  breakdown.contrast = scoreContrast(tokens);

  // Hierarchy (20 pts)
  breakdown.hierarchy = scoreHierarchy(schema);

  // Content density (15 pts)
  breakdown.contentDensity = scoreContentDensity(schema);

  // CTA quality (15 pts)
  breakdown.ctaQuality = scoreCTAQuality(schema);

  // Typography (10 pts)
  breakdown.typography = scoreTypography(tokens);

  // Color harmony (10 pts)
  breakdown.colorHarmony = scoreColorHarmony(tokens);

  // Visual variety (5 pts)
  breakdown.visualVariety = scoreVisualVariety(schema);

  const total = Object.values(breakdown).reduce((sum, cat) => sum + cat.score, 0);

  return { total, breakdown };
}

function scoreContrast(tokens: ResolvedDesignTokens): ScoreCategory {
  const { palette } = tokens;
  let score = 0;
  const notes: string[] = [];

  // Primary text on background
  const primaryOnBg = contrastRatio(palette.textPrimary, palette.background);
  if (primaryOnBg >= 7) {
    score += 10;
  } else if (primaryOnBg >= 4.5) {
    score += 7;
    notes.push(`Primary text contrast ${primaryOnBg.toFixed(1)}:1 (AA but not AAA)`);
  } else {
    notes.push(`Primary text contrast FAILS AA: ${primaryOnBg.toFixed(1)}:1`);
  }

  // Accent on background (for buttons)
  const accentOnBg = contrastRatio(palette.accent, palette.background);
  if (accentOnBg >= 4.5) {
    score += 8;
  } else if (accentOnBg >= 3) {
    score += 5;
    notes.push(`Accent contrast ${accentOnBg.toFixed(1)}:1 — borderline`);
  } else {
    notes.push(`Accent fails contrast: ${accentOnBg.toFixed(1)}:1`);
  }

  // White text on accent (button text readability)
  const whiteOnAccent = contrastRatio('#FFFFFF', palette.accent);
  const blackOnAccent = contrastRatio('#000000', palette.accent);
  const bestBtnContrast = Math.max(whiteOnAccent, blackOnAccent);
  if (bestBtnContrast >= 4.5) {
    score += 7;
  } else if (bestBtnContrast >= 3) {
    score += 4;
    notes.push('Button text contrast is borderline');
  } else {
    notes.push('Button text contrast fails');
  }

  return { score, max: 25, notes: notes.join('; ') || 'All contrast checks pass' };
}

function scoreHierarchy(schema: PageSchema): ScoreCategory {
  let score = 0;
  const notes: string[] = [];

  // Hero first
  if (schema.blocks[0]?.type === 'HeroSplit') {
    score += 8;
  } else {
    notes.push('Hero is not the first block');
  }

  // Footer last
  if (schema.blocks[schema.blocks.length - 1]?.type === 'FooterSimple') {
    score += 6;
  } else {
    notes.push('Footer is not the last block');
  }

  // Logical ordering: no CTA before main content
  const firstContentIdx = schema.blocks.findIndex(
    (b) => b.type === 'ValueProps3' || b.type === 'ServicesGrid'
  );
  const firstCtaIdx = schema.blocks.findIndex((b) => b.type === 'CTASection');
  if (firstCtaIdx === -1 || firstContentIdx === -1 || firstCtaIdx > firstContentIdx) {
    score += 6;
  } else {
    score += 2;
    notes.push('CTA appears before main content sections');
  }

  return { score, max: 20, notes: notes.join('; ') || 'Good visual hierarchy' };
}

function scoreContentDensity(schema: PageSchema): ScoreCategory {
  let score = 0;
  const notes: string[] = [];
  const blockCount = schema.blocks.length;

  if (blockCount >= 5 && blockCount <= 8) {
    score += 10;
  } else if (blockCount >= 4 && blockCount <= 10) {
    score += 7;
    notes.push(`${blockCount} blocks — slightly outside ideal range (5-8)`);
  } else {
    score += 3;
    notes.push(`${blockCount} blocks — too ${blockCount < 4 ? 'few' : 'many'}`);
  }

  // Block type variety (not all the same)
  const uniqueTypes = new Set(schema.blocks.map((b) => b.type)).size;
  if (uniqueTypes >= Math.min(blockCount, 5)) {
    score += 5;
  } else {
    score += 2;
    notes.push('Low block type variety');
  }

  return { score, max: 15, notes: notes.join('; ') || 'Good content density' };
}

function scoreCTAQuality(schema: PageSchema): ScoreCategory {
  let score = 0;
  const notes: string[] = [];

  // Has hero CTA (above the fold)
  const hero = schema.blocks.find((b) => b.type === 'HeroSplit');
  if (hero && hero.type === 'HeroSplit' && hero.ctaText) {
    score += 8;
  } else {
    notes.push('No above-the-fold CTA in hero');
  }

  // 1-2 CTA sections
  const ctaCount = schema.blocks.filter((b) => b.type === 'CTASection').length;
  if (ctaCount >= 1 && ctaCount <= 2) {
    score += 7;
  } else if (ctaCount === 0) {
    score += 3;
    notes.push('No dedicated CTA section');
  } else {
    score += 3;
    notes.push(`${ctaCount} CTA sections — too many`);
  }

  return { score, max: 15, notes: notes.join('; ') || 'Good CTA placement' };
}

function scoreTypography(tokens: ResolvedDesignTokens): ScoreCategory {
  let score = 0;
  const notes: string[] = [];

  // Check if fonts are from curated list
  const pairingIds = FONT_PAIRINGS.map((p) => p.id);
  const matchesCurated = FONT_PAIRINGS.some(
    (p) => p.heading === tokens.typography.headingFont && p.body === tokens.typography.bodyFont
  );

  if (matchesCurated) {
    score += 10;
  } else {
    // Check if at least individual fonts are in the list
    const allFonts = new Set(FONT_PAIRINGS.flatMap((p) => [p.heading, p.body]));
    const headingKnown = allFonts.has(tokens.typography.headingFont);
    const bodyKnown = allFonts.has(tokens.typography.bodyFont);
    if (headingKnown && bodyKnown) {
      score += 7;
      notes.push('Font combination exists in known fonts but not a curated pairing');
    } else {
      score += 3;
      notes.push(`Non-curated fonts: ${tokens.typography.headingFont} / ${tokens.typography.bodyFont}`);
    }
  }

  return { score, max: 10, notes: notes.join('; ') || 'Curated font pairing' };
}

function scoreColorHarmony(tokens: ResolvedDesignTokens): ScoreCategory {
  let score = 0;
  const notes: string[] = [];
  const { palette } = tokens;

  // Colors should differ enough from each other
  const primarySecondaryDist = colorDistance(palette.primary, palette.secondary);
  if (primarySecondaryDist > 80) {
    score += 4;
  } else if (primarySecondaryDist > 40) {
    score += 2;
    notes.push('Primary and secondary are quite similar');
  } else {
    notes.push('Primary and secondary are nearly identical');
  }

  // Accent should stand out from primary
  const primaryAccentDist = colorDistance(palette.primary, palette.accent);
  if (primaryAccentDist > 60) {
    score += 3;
  } else if (primaryAccentDist > 30) {
    score += 2;
    notes.push('Accent could be more distinct from primary');
  } else {
    notes.push('Accent too similar to primary');
  }

  // Background and surface should be light (or both dark for dark themes)
  const bgDist = colorDistance(palette.background, palette.surface);
  if (bgDist > 5 && bgDist < 80) {
    score += 3;
  } else if (bgDist <= 5) {
    score += 2;
    notes.push('Background and surface are identical');
  } else {
    score += 1;
    notes.push('Background and surface differ too much');
  }

  return { score, max: 10, notes: notes.join('; ') || 'Good color harmony' };
}

function scoreVisualVariety(schema: PageSchema): ScoreCategory {
  let score = 0;
  const notes: string[] = [];

  // Check variant diversity
  const variants = schema.blocks
    .map((b) => ('variant' in b ? (b as Record<string, unknown>).variant : undefined))
    .filter(Boolean);

  if (variants.length === 0) {
    // No variants yet (backward compat)
    score += 3;
    notes.push('No variant data — using defaults');
  } else {
    const uniqueVariants = new Set(variants).size;
    if (uniqueVariants >= Math.ceil(variants.length * 0.5)) {
      score += 5;
    } else {
      score += 2;
      notes.push('Low variant diversity');
    }
  }

  return { score, max: 5, notes: notes.join('; ') || 'Good visual variety' };
}
