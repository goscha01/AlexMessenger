import { z } from 'zod';
import { HeroSplitSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type HeroSplitBlock = z.infer<typeof HeroSplitSchema>;

export function renderHeroSplit(block: HeroSplitBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  const imageHtml = block.imageUrl
    ? `<img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.imageAlt || tokens.brandName)}" class="w-full max-h-[500px] object-cover" style="border-radius: ${borderRadius}; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);" />`
    : `<div class="w-full h-80 lg:h-[400px]" style="border-radius: ${borderRadius}; background: linear-gradient(135deg, ${palette.primary}22, ${palette.accent}33);"></div>`;

  const textBlock = `
    <div class="flex-1 text-center lg:text-left">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
        ${escapeHtml(block.headline)}
      </h1>
      <p class="text-lg lg:text-xl mb-8 max-w-xl mx-auto lg:mx-0" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
        ${escapeHtml(block.subheadline)}
      </p>
      <a href="${escapeHtml(block.ctaHref)}"
         class="inline-block px-8 py-4 text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
         style="background-color: ${palette.accent}; border-radius: ${borderRadius};">
        ${escapeHtml(block.ctaText)}
      </a>
    </div>`;

  const imageBlock = `
    <div class="flex-1 w-full">
      ${imageHtml}
    </div>`;

  switch (block.variant) {
    case 'split-right':
      return `
<section class="relative overflow-hidden" style="background: linear-gradient(135deg, ${palette.primary}08, ${palette.secondary}0A);">
  <div class="max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row-reverse items-center gap-12">
    ${textBlock}
    ${imageBlock}
  </div>
</section>`;

    case 'centered':
      return `
<section class="relative overflow-hidden" style="background: linear-gradient(135deg, ${palette.primary}18, ${palette.accent}22, ${palette.secondary}18);">
  <div class="max-w-4xl mx-auto px-6 py-24 lg:py-36 text-center">
    <h1 class="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.headline)}
    </h1>
    <p class="text-lg lg:text-xl mb-10 max-w-2xl mx-auto" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
      ${escapeHtml(block.subheadline)}
    </p>
    <a href="${escapeHtml(block.ctaHref)}"
       class="inline-block px-10 py-4 text-white font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
       style="background-color: ${palette.accent}; border-radius: ${borderRadius};">
      ${escapeHtml(block.ctaText)}
    </a>
  </div>
</section>`;

    case 'split-left':
    default:
      return `
<section class="relative overflow-hidden" style="background: linear-gradient(135deg, ${palette.primary}08, ${palette.secondary}0A);">
  <div class="max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
    ${textBlock}
    ${imageBlock}
  </div>
</section>`;
  }
}
