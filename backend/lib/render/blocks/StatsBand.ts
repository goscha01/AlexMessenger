import { z } from 'zod';
import { StatsBandSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type StatsBandBlock = z.infer<typeof StatsBandSchema>;

export function renderStatsBand(block: StatsBandBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography } = tokens;

  switch (block.variant) {
    case 'dark':
      return renderDark(block, palette, typography);
    case 'minimal':
      return renderMinimal(block, palette, typography);
    case 'accent':
    default:
      return renderAccent(block, palette, typography);
  }
}

function renderDark(
  block: StatsBandBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
): string {
  const itemsHtml = block.items.map((item) => `
    <div class="text-center px-4">
      <div class="text-3xl lg:text-4xl font-bold mb-1" style="color: #ffffff; font-family: '${typography.headingFont}', sans-serif;">
        ${escapeHtml(item.value)}
      </div>
      <div class="text-sm uppercase tracking-wider" style="color: rgba(255,255,255,0.7); font-family: '${typography.bodyFont}', sans-serif;">
        ${escapeHtml(item.label)}
      </div>
    </div>
  `).join('');

  return `
<section class="py-12 lg:py-16" style="background: ${palette.primary};">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-wrap justify-center gap-12 lg:gap-20">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}

function renderAccent(
  block: StatsBandBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
): string {
  const itemsHtml = block.items.map((item) => `
    <div class="text-center px-4">
      <div class="text-3xl lg:text-4xl font-bold mb-1" style="color: ${palette.accent}; font-family: '${typography.headingFont}', sans-serif;">
        ${escapeHtml(item.value)}
      </div>
      <div class="text-sm uppercase tracking-wider" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
        ${escapeHtml(item.label)}
      </div>
    </div>
  `).join('');

  return `
<section class="py-12 lg:py-16" style="background: ${palette.surface}; border-top: 1px solid ${palette.secondary}15; border-bottom: 1px solid ${palette.secondary}15;">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-wrap justify-center gap-12 lg:gap-20">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}

function renderMinimal(
  block: StatsBandBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
): string {
  const itemsHtml = block.items.map((item, i) => `
    <div class="text-center px-6 ${i > 0 ? 'border-l' : ''}" style="border-color: ${palette.secondary}20;">
      <div class="text-2xl lg:text-3xl font-bold mb-1" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
        ${escapeHtml(item.value)}
      </div>
      <div class="text-sm" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
        ${escapeHtml(item.label)}
      </div>
    </div>
  `).join('');

  return `
<section class="py-10 lg:py-14" style="background: ${palette.background};">
  <div class="max-w-5xl mx-auto px-6">
    <div class="flex flex-wrap justify-center">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}
