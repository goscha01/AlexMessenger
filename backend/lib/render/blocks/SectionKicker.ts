import { z } from 'zod';
import { SectionKickerSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type SectionKickerBlock = z.infer<typeof SectionKickerSchema>;

export function renderSectionKicker(block: SectionKickerBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography } = tokens;

  switch (block.variant) {
    case 'counter':
      return renderCounter(block, palette, typography);
    case 'icon-rule':
      return renderIconRule(block, palette, typography);
    case 'label-line':
    default:
      return renderLabelLine(block, palette, typography);
  }
}

/* ------------------------------------------------------------------ */
/*  Variant: label-line (default)                                      */
/*  Centered label with thin horizontal lines extending to both sides  */
/* ------------------------------------------------------------------ */
function renderLabelLine(
  block: SectionKickerBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
): string {
  const sublabelHtml = block.sublabel
    ? `<p class="text-sm mt-1" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
         ${escapeHtml(block.sublabel)}
       </p>`
    : '';

  return `
<section class="py-6 lg:py-10" style="background: ${palette.background};">
  <div class="max-w-5xl mx-auto px-6">
    <div class="flex items-center gap-4">
      <div class="flex-1 h-px" style="background: ${palette.secondary}30;"></div>
      <div class="text-center shrink-0">
        <span class="text-xs font-semibold uppercase tracking-widest"
              style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; letter-spacing: 0.1em;">
          ${escapeHtml(block.label)}
        </span>
        ${sublabelHtml}
      </div>
      <div class="flex-1 h-px" style="background: ${palette.secondary}30;"></div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: counter                                                   */
/*  Large section number with label text, editorial/magazine feel      */
/* ------------------------------------------------------------------ */
function renderCounter(
  block: SectionKickerBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
): string {
  // Extract digits from label, fall back to "01"
  const digits = block.label.match(/\d+/);
  const number = digits ? digits[0].padStart(2, '0') : '01';

  const sublabelHtml = block.sublabel
    ? `<p class="text-sm mt-1" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
         ${escapeHtml(block.sublabel)}
       </p>`
    : '';

  return `
<section class="py-6 lg:py-10" style="background: ${palette.background};">
  <div class="max-w-5xl mx-auto px-6">
    <div class="flex items-baseline gap-4 pb-3" style="border-bottom: 1px solid ${palette.secondary}25;">
      <span class="text-4xl lg:text-5xl font-bold"
            style="color: ${palette.accent}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight}; line-height: 1;">
        ${number}
      </span>
      <div>
        <span class="text-xs font-semibold uppercase tracking-widest"
              style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; letter-spacing: 0.1em;">
          ${escapeHtml(block.label)}
        </span>
        ${sublabelHtml}
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: icon-rule                                                 */
/*  Decorative symbol centered on a thin horizontal rule, label below  */
/* ------------------------------------------------------------------ */
function renderIconRule(
  block: SectionKickerBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
): string {
  const sublabelHtml = block.sublabel
    ? `<p class="text-sm mt-1" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
         ${escapeHtml(block.sublabel)}
       </p>`
    : '';

  return `
<section class="py-6 lg:py-10" style="background: ${palette.background};">
  <div class="max-w-5xl mx-auto px-6">
    <div class="flex items-center gap-4 mb-3">
      <div class="flex-1 h-px" style="background: ${palette.secondary}25;"></div>
      <span class="text-base" style="color: ${palette.accent}; line-height: 1;">&#9670;</span>
      <div class="flex-1 h-px" style="background: ${palette.secondary}25;"></div>
    </div>
    <div class="text-center">
      <span class="text-xs font-semibold uppercase tracking-widest"
            style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; letter-spacing: 0.1em;">
        ${escapeHtml(block.label)}
      </span>
      ${sublabelHtml}
    </div>
  </div>
</section>`;
}
