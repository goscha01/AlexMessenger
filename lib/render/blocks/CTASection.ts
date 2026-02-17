import { z } from 'zod';
import { CTASectionSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type CTASectionBlock = z.infer<typeof CTASectionSchema>;

export function renderCTASection(block: CTASectionBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius, spacing } = tokens;

  switch (block.variant) {
    case 'card-centered':
      return renderCardCentered(block, palette, typography, borderRadius, spacing);
    case 'split-cta':
      return renderSplitCta(block, palette, typography, borderRadius, spacing);
    case 'gradient-bg':
    default:
      return renderGradientBg(block, palette, typography, borderRadius, spacing);
  }
}

/* ------------------------------------------------------------------ */
/*  Variant: gradient-bg (default)                                    */
/*  Full-width gradient background, white text, centered              */
/* ------------------------------------------------------------------ */
function renderGradientBg(
  block: CTASectionBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
  _spacing: string,
): string {
  return `
<section class="py-16 lg:py-24" style="background: linear-gradient(135deg, ${palette.primary}, ${palette.secondary});">
  <div class="max-w-4xl mx-auto px-6 text-center">
    <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4"
        style="font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.headline)}
    </h2>
    ${
      block.subtext
        ? `<p class="text-lg text-white/80 mb-8 max-w-2xl mx-auto" style="font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">${escapeHtml(block.subtext)}</p>`
        : '<div class="mb-8"></div>'
    }
    <a href="${escapeHtml(block.ctaHref)}"
       class="inline-block px-8 py-4 bg-white font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
       style="color: ${palette.primary}; border-radius: ${borderRadius};">
      ${escapeHtml(block.ctaText)}
    </a>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: card-centered                                            */
/*  Surface card floating on light background, colored button         */
/* ------------------------------------------------------------------ */
function renderCardCentered(
  block: CTASectionBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
  _spacing: string,
): string {
  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-3xl mx-auto px-6">
    <div class="text-center px-8 py-12 lg:px-14 lg:py-16 shadow-xl"
         style="background: ${palette.surface}; border-radius: ${borderRadius};">
      <h2 class="text-3xl lg:text-4xl font-bold mb-4"
          style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
        ${escapeHtml(block.headline)}
      </h2>
      ${
        block.subtext
          ? `<p class="text-lg mb-8 max-w-xl mx-auto" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">${escapeHtml(block.subtext)}</p>`
          : '<div class="mb-8"></div>'
      }
      <a href="${escapeHtml(block.ctaHref)}"
         class="inline-block px-8 py-4 text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
         style="background-color: ${palette.accent}; border-radius: ${borderRadius};">
        ${escapeHtml(block.ctaText)}
      </a>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: split-cta                                                */
/*  Text left, button right — horizontal layout with subtle bg        */
/* ------------------------------------------------------------------ */
function renderSplitCta(
  block: CTASectionBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
  _spacing: string,
): string {
  return `
<section class="py-12 lg:py-16" style="background: ${palette.primary}0A;">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row items-center justify-between gap-8 py-8 px-8 lg:px-12"
         style="background: ${palette.surface}; border-radius: ${borderRadius}; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
      <div class="flex-1 text-center md:text-left">
        <h2 class="text-2xl lg:text-3xl font-bold mb-2"
            style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
          ${escapeHtml(block.headline)}
        </h2>
        ${
          block.subtext
            ? `<p class="text-base lg:text-lg" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">${escapeHtml(block.subtext)}</p>`
            : ''
        }
      </div>
      <div class="shrink-0">
        <a href="${escapeHtml(block.ctaHref)}"
           class="inline-block px-8 py-4 text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
           style="background: linear-gradient(135deg, ${palette.primary}, ${palette.accent}); border-radius: ${borderRadius};">
          ${escapeHtml(block.ctaText)}
        </a>
      </div>
    </div>
  </div>
</section>`;
}
