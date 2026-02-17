import { z } from 'zod';
import { ValueProps3Schema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type ValueProps3Block = z.infer<typeof ValueProps3Schema>;

export function renderValueProps3(block: ValueProps3Block, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius, spacing } = tokens;

  const sectionTitleHtml = `
    <h2 class="text-3xl lg:text-4xl text-center mb-12" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>`;

  function renderIcon(item: { icon: string; title: string }): string {
    if (item.icon.startsWith('data:')) {
      return `<img src="${item.icon}" alt="${escapeHtml(item.title)}" class="w-16 h-16 mx-auto mb-4" />`;
    }
    return `<div class="text-4xl mb-4">${item.icon}</div>`;
  }

  switch (block.variant) {
    case 'icons-inline': {
      const itemsHtml = block.items.map((item) => `
        <div class="flex items-start gap-5 py-6">
          <div class="shrink-0 w-16 h-16 flex items-center justify-center" style="background: ${palette.primary}12; border-radius: ${borderRadius};">
            ${item.icon.startsWith('data:')
              ? `<img src="${item.icon}" alt="${escapeHtml(item.title)}" class="w-10 h-10" />`
              : `<span class="text-3xl">${item.icon}</span>`}
          </div>
          <div>
            <h3 class="text-xl mb-2" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
              ${escapeHtml(item.title)}
            </h3>
            <p class="leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
              ${escapeHtml(item.description)}
            </p>
          </div>
        </div>
      `).join('');

      return `
<section class="py-16 lg:py-24" style="background-color: ${palette.background};">
  <div class="max-w-3xl mx-auto px-6">
    ${sectionTitleHtml}
    <div class="divide-y" style="border-color: ${palette.secondary}22;">
      ${itemsHtml}
    </div>
  </div>
</section>`;
    }

    case 'numbered': {
      const cols = block.items.length <= 2 ? 'md:grid-cols-2' : block.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

      const itemsHtml = block.items.map((item, i) => {
        const stepNum = String(i + 1).padStart(2, '0');
        return `
        <div class="text-center p-6" style="padding: ${spacing};">
          <div class="text-5xl font-bold mb-4" style="color: ${palette.accent}; opacity: 0.3; font-family: '${typography.headingFont}', sans-serif;">
            ${stepNum}
          </div>
          <h3 class="text-xl mb-3" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
            ${escapeHtml(item.title)}
          </h3>
          <p class="leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
            ${escapeHtml(item.description)}
          </p>
        </div>`;
      }).join('');

      return `
<section class="py-16 lg:py-24" style="background-color: ${palette.background};">
  <div class="max-w-7xl mx-auto px-6">
    ${sectionTitleHtml}
    <div class="grid grid-cols-1 ${cols} gap-8">
      ${itemsHtml}
    </div>
  </div>
</section>`;
    }

    case 'cards':
    default: {
      const cols = block.items.length <= 2 ? 'md:grid-cols-2' : block.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

      const itemsHtml = block.items.map((item) => `
        <div class="text-center p-8 transition-shadow duration-200 hover:shadow-lg" style="background-color: ${palette.surface}; border-radius: ${borderRadius}; border: 1px solid ${palette.secondary}18;">
          ${renderIcon(item)}
          <h3 class="text-xl mb-3" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
            ${escapeHtml(item.title)}
          </h3>
          <p class="leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
            ${escapeHtml(item.description)}
          </p>
        </div>
      `).join('');

      return `
<section class="py-16 lg:py-24" style="background-color: ${palette.background};">
  <div class="max-w-7xl mx-auto px-6">
    ${sectionTitleHtml}
    <div class="grid grid-cols-1 ${cols} gap-8">
      ${itemsHtml}
    </div>
  </div>
</section>`;
    }
  }
}
