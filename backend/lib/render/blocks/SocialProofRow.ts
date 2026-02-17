import { z } from 'zod';
import { SocialProofRowSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type SocialProofRowBlock = z.infer<typeof SocialProofRowSchema>;

export function renderSocialProofRow(block: SocialProofRowBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  const labelHtml = block.label
    ? `<p class="text-center text-sm uppercase tracking-widest mb-6" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">${escapeHtml(block.label)}</p>`
    : '';

  switch (block.variant) {
    case 'ticker': {
      // Duplicate items for seamless infinite scroll loop
      const allItems = [...block.items, ...block.items];

      const itemsHtml = allItems.map((item) => `
        <span class="shrink-0 px-8 text-lg font-semibold tracking-wide whitespace-nowrap" style="color: ${palette.textSecondary}; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(item.name)}
        </span>
      `).join('');

      return `
<section class="py-12" style="background-color: ${palette.surface}; border-top: 1px solid ${palette.secondary}18; border-bottom: 1px solid ${palette.secondary}18;">
  <div class="max-w-7xl mx-auto px-6">
    ${labelHtml}
  </div>
  <div class="overflow-hidden relative">
    <style>
      @keyframes social-proof-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    </style>
    <div class="flex items-center" style="animation: social-proof-scroll 20s linear infinite; width: max-content;">
      ${itemsHtml}
    </div>
  </div>
</section>`;
    }

    case 'grid': {
      const itemsHtml = block.items.map((item) => `
        <div class="flex items-center justify-center px-6 py-4 transition-shadow duration-200 hover:shadow-md" style="background-color: ${palette.surface}; border-radius: ${borderRadius}; border: 1px solid ${palette.secondary}15;">
          <span class="font-semibold text-base tracking-wide" style="color: ${palette.textSecondary}; font-family: '${typography.headingFont}', sans-serif;">
            ${escapeHtml(item.name)}
          </span>
        </div>
      `).join('');

      const cols = block.items.length <= 3
        ? 'grid-cols-2 md:grid-cols-3'
        : block.items.length <= 6
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-2 md:grid-cols-4';

      return `
<section class="py-12" style="background-color: ${palette.background}; border-top: 1px solid ${palette.secondary}18; border-bottom: 1px solid ${palette.secondary}18;">
  <div class="max-w-5xl mx-auto px-6">
    ${labelHtml}
    <div class="grid ${cols} gap-4">
      ${itemsHtml}
    </div>
  </div>
</section>`;
    }

    case 'stats-only': {
      const itemsHtml = block.items.map((item, i) => `
        <div class="text-center px-6 ${i > 0 ? 'border-l' : ''}" style="border-color: ${palette.secondary}20;">
          <div class="text-2xl lg:text-3xl font-bold" style="color: ${palette.accent}; font-family: '${typography.headingFont}', sans-serif;">
            ${escapeHtml(item.value || item.name)}
          </div>
          <div class="text-sm mt-1" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
            ${escapeHtml(item.value ? item.name : '')}
          </div>
        </div>
      `).join('');

      return `
<section class="py-10" style="background-color: ${palette.surface}; border-top: 1px solid ${palette.secondary}18; border-bottom: 1px solid ${palette.secondary}18;">
  <div class="max-w-5xl mx-auto px-6">
    ${labelHtml}
    <div class="flex flex-wrap justify-center gap-8 lg:gap-12">
      ${itemsHtml}
    </div>
  </div>
</section>`;
    }

    case 'logo-bar':
    default: {
      const itemsHtml = block.items.map((item) => `
        <div class="px-6 py-3">
          <span class="font-semibold text-lg tracking-wide" style="color: ${palette.textSecondary}; font-family: '${typography.headingFont}', sans-serif;">
            ${escapeHtml(item.name)}
          </span>
        </div>
      `).join('');

      return `
<section class="py-12" style="background-color: ${palette.surface}; border-top: 1px solid ${palette.secondary}18; border-bottom: 1px solid ${palette.secondary}18;">
  <div class="max-w-7xl mx-auto px-6">
    ${labelHtml}
    <div class="flex flex-wrap justify-center items-center gap-8">
      ${itemsHtml}
    </div>
  </div>
</section>`;
    }
  }
}
