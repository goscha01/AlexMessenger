import { z } from 'zod';
import { FeatureZigzagSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type FeatureZigzagBlock = z.infer<typeof FeatureZigzagSchema>;

export function renderFeatureZigzag(block: FeatureZigzagBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  switch (block.variant) {
    case 'with-image':
      return renderWithImage(block, palette, typography, borderRadius);
    case 'numbered':
      return renderNumbered(block, palette, typography, borderRadius);
    case 'standard':
    default:
      return renderStandard(block, palette, typography, borderRadius);
  }
}

function renderStandard(
  block: FeatureZigzagBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
): string {
  const itemsHtml = block.items.map((item, i) => {
    const isReversed = i % 2 === 1;
    return `
    <div class="flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 lg:gap-16">
      <div class="flex-1">
        ${item.icon ? `<div class="text-3xl mb-3">${escapeHtml(item.icon)}</div>` : ''}
        <h3 class="text-2xl lg:text-3xl font-bold mb-3" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(item.title)}
        </h3>
        <p class="text-base lg:text-lg leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(item.description)}
        </p>
      </div>
      <div class="flex-1 w-full h-48 lg:h-64" style="background: linear-gradient(135deg, ${palette.primary}10, ${palette.accent}15); border-radius: 0.75rem;"></div>
    </div>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-16" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="space-y-16 lg:space-y-24">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}

function renderWithImage(
  block: FeatureZigzagBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const itemsHtml = block.items.map((item, i) => {
    const isReversed = i % 2 === 1;
    return `
    <div class="flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 lg:gap-12">
      <div class="flex-1">
        ${item.icon ? `<div class="text-3xl mb-3">${escapeHtml(item.icon)}</div>` : ''}
        <h3 class="text-xl lg:text-2xl font-bold mb-3" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(item.title)}
        </h3>
        <p class="text-base leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(item.description)}
        </p>
      </div>
      <div class="flex-1 w-full aspect-video" style="background: ${palette.surface}; border: 1px solid ${palette.secondary}15; border-radius: ${borderRadius};"></div>
    </div>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-16" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="space-y-12 lg:space-y-20">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}

function renderNumbered(
  block: FeatureZigzagBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
): string {
  const itemsHtml = block.items.map((item, i) => {
    const isReversed = i % 2 === 1;
    return `
    <div class="flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-6 lg:gap-12">
      <div class="shrink-0 w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center text-2xl lg:text-3xl font-bold"
           style="color: ${palette.accent}; border: 2px solid ${palette.accent}; border-radius: 50%; font-family: '${typography.headingFont}', sans-serif;">
        ${String(i + 1).padStart(2, '0')}
      </div>
      <div class="flex-1">
        <h3 class="text-xl lg:text-2xl font-bold mb-2" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(item.title)}
        </h3>
        <p class="text-base leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(item.description)}
        </p>
      </div>
    </div>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-4xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-16" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="space-y-12">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}
