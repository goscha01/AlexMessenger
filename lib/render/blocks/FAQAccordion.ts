import { z } from 'zod';
import { FAQAccordionSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type FAQAccordionBlock = z.infer<typeof FAQAccordionSchema>;

export function renderFAQAccordion(block: FAQAccordionBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius, spacing } = tokens;

  switch (block.variant) {
    case 'side-by-side':
      return renderSideBySide(block, palette, typography, borderRadius, spacing);
    case 'bordered':
      return renderBordered(block, palette, typography, borderRadius, spacing);
    case 'classic':
    default:
      return renderClassic(block, palette, typography, borderRadius, spacing);
  }
}

/** Shared chevron SVG for accordion indicators */
const chevronSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>`;

/* ------------------------------------------------------------------ */
/*  Variant: classic (default)                                        */
/*  Standard details/summary accordion, first item open, chevron      */
/* ------------------------------------------------------------------ */
function renderClassic(
  block: FAQAccordionBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
  _spacing: string,
): string {
  const itemsHtml = block.items
    .map(
      (item, i) => `
    <details class="group border-b" style="border-color: ${palette.textSecondary}20;" ${i === 0 ? 'open' : ''}>
      <summary class="flex justify-between items-center cursor-pointer py-5 text-left">
        <span class="font-semibold pr-4"
              style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
          ${escapeHtml(item.question)}
        </span>
        <span class="shrink-0 group-open:rotate-180 transition-transform duration-200"
              style="color: ${palette.textSecondary};">
          ${chevronSvg}
        </span>
      </summary>
      <div class="pb-5 leading-relaxed"
           style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
        ${escapeHtml(item.answer)}
      </div>
    </details>`,
    )
    .join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.primary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="border-t" style="border-color: ${palette.textSecondary}20;">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: side-by-side                                             */
/*  Two-column: questions left, answers revealed right (pure CSS)     */
/* ------------------------------------------------------------------ */
function renderSideBySide(
  block: FAQAccordionBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
  _spacing: string,
): string {
  const itemsHtml = block.items
    .map(
      (item, i) => `
    <details class="group" ${i === 0 ? 'open' : ''}>
      <summary class="cursor-pointer py-4 px-5 flex justify-between items-center transition-colors duration-200 hover:opacity-80"
               style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight}; border-radius: ${borderRadius}; background: ${palette.surface};">
        <span class="pr-4">${escapeHtml(item.question)}</span>
        <span class="shrink-0 group-open:rotate-180 transition-transform duration-200"
              style="color: ${palette.accent};">
          ${chevronSvg}
        </span>
      </summary>
      <div class="mt-2 p-5 leading-relaxed"
           style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight}; background: ${palette.primary}08; border-radius: ${borderRadius};">
        ${escapeHtml(item.answer)}
      </div>
    </details>`,
    )
    .join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-14"
        style="color: ${palette.primary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: bordered                                                 */
/*  Each Q&A in its own bordered card with rounded corners            */
/* ------------------------------------------------------------------ */
function renderBordered(
  block: FAQAccordionBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
  _spacing: string,
): string {
  const itemsHtml = block.items
    .map(
      (item, i) => `
    <details class="group border-2 overflow-hidden transition-shadow duration-200 hover:shadow-md"
             style="border-color: ${palette.secondary}30; border-radius: ${borderRadius}; background: ${palette.surface};"
             ${i === 0 ? 'open' : ''}>
      <summary class="flex justify-between items-center cursor-pointer px-6 py-5 text-left">
        <span class="font-semibold pr-4"
              style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
          ${escapeHtml(item.question)}
        </span>
        <span class="shrink-0 group-open:rotate-180 transition-transform duration-200"
              style="color: ${palette.accent};">
          ${chevronSvg}
        </span>
      </summary>
      <div class="px-6 pb-5 leading-relaxed border-t"
           style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight}; border-color: ${palette.secondary}20; padding-top: 1rem;">
        ${escapeHtml(item.answer)}
      </div>
    </details>`,
    )
    .join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.primary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="space-y-4">
      ${itemsHtml}
    </div>
  </div>
</section>`;
}
