import { z } from 'zod';
import { ProcessTimelineSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type ProcessTimelineBlock = z.infer<typeof ProcessTimelineSchema>;

export function renderProcessTimeline(block: ProcessTimelineBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  switch (block.variant) {
    case 'horizontal':
      return renderHorizontal(block, palette, typography, borderRadius);
    case 'cards':
      return renderCards(block, palette, typography, borderRadius);
    case 'vertical':
    default:
      return renderVertical(block, palette, typography, borderRadius);
  }
}

function renderVertical(
  block: ProcessTimelineBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
): string {
  const stepsHtml = block.steps.map((step, i) => `
    <div class="relative flex gap-6">
      <div class="flex flex-col items-center">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
             style="background: ${palette.accent}; color: #fff; font-family: '${typography.headingFont}', sans-serif;">
          ${i + 1}
        </div>
        ${i < block.steps.length - 1 ? `<div class="w-0.5 flex-1 mt-2" style="background: ${palette.accent}30;"></div>` : ''}
      </div>
      <div class="pb-10">
        <h3 class="text-lg font-bold mb-1" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(step.title)}
        </h3>
        <p class="text-base leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(step.description)}
        </p>
      </div>
    </div>
  `).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-14" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="space-y-0">
      ${stepsHtml}
    </div>
  </div>
</section>`;
}

function renderHorizontal(
  block: ProcessTimelineBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
): string {
  const stepsHtml = block.steps.map((step, i) => `
    <div class="flex-1 text-center relative">
      <div class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4"
           style="background: ${palette.accent}; color: #fff; font-family: '${typography.headingFont}', sans-serif;">
        ${i + 1}
      </div>
      <h3 class="text-base font-bold mb-1" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
        ${escapeHtml(step.title)}
      </h3>
      <p class="text-sm leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
        ${escapeHtml(step.description)}
      </p>
    </div>
  `).join('');

  // Connecting line between steps
  const lineWidth = `calc(100% - ${block.steps.length * 3}rem)`;

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-14" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="relative">
      <div class="hidden md:block absolute top-6 left-1/2 -translate-x-1/2 h-0.5" style="width: ${lineWidth}; background: ${palette.accent}30;"></div>
      <div class="flex flex-col md:flex-row gap-8 relative">
        ${stepsHtml}
      </div>
    </div>
  </div>
</section>`;
}

function renderCards(
  block: ProcessTimelineBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const cols = block.steps.length <= 3
    ? 'grid-cols-1 md:grid-cols-3'
    : block.steps.length <= 4
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  const stepsHtml = block.steps.map((step, i) => `
    <div class="block-card p-6 relative" style="background: ${palette.surface}; border-radius: ${borderRadius}; border: 1px solid ${palette.secondary}15;">
      <div class="text-3xl font-bold mb-3" style="color: ${palette.accent}30; font-family: '${typography.headingFont}', sans-serif;">
        ${String(i + 1).padStart(2, '0')}
      </div>
      <h3 class="text-lg font-bold mb-2" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
        ${escapeHtml(step.title)}
      </h3>
      <p class="text-sm leading-relaxed" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
        ${escapeHtml(step.description)}
      </p>
    </div>
  `).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="grid ${cols} gap-4">
      ${stepsHtml}
    </div>
  </div>
</section>`;
}
