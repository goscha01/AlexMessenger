import { z } from 'zod';
import { ComparisonTableSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type ComparisonTableBlock = z.infer<typeof ComparisonTableSchema>;

export function renderComparisonTable(block: ComparisonTableBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  switch (block.variant) {
    case 'tiers':
      return renderTiers(block, palette, typography, borderRadius);
    case 'checklist':
      return renderChecklist(block, palette, typography, borderRadius);
    case 'vs':
    default:
      return renderVs(block, palette, typography, borderRadius);
  }
}

/** Test if a value string represents a positive / "yes" value */
function isPositive(val: string): boolean {
  return /^(yes|true|check|✓|✔)$/i.test(val.trim());
}

/** Test if a value string represents a negative / "no" value */
function isNegative(val: string): boolean {
  return /^(no|false|x|✗|✘)$/i.test(val.trim());
}

/** Render a green checkmark SVG */
function checkSvg(color: string): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display:inline-block;vertical-align:middle;"><path d="M6 10l3 3 5-6" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/** Render a red X SVG */
function xSvg(color: string): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display:inline-block;vertical-align:middle;"><path d="M6 6l8 8M14 6l-8 8" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: vs (default)                                              */
/*  Two-column "Us vs Them", checkmarks/X for boolean values           */
/* ------------------------------------------------------------------ */
function renderVs(
  block: ComparisonTableBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const headerCells = block.columns.map((col) => {
    const isHl = col.highlighted;
    const bg = isHl ? palette.accent : palette.surface;
    const textColor = isHl ? '#ffffff' : palette.textSecondary;
    return `
        <th class="px-5 py-4 text-center text-sm font-bold uppercase tracking-wider"
            style="background: ${bg}; color: ${textColor}; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(col.name)}
        </th>`;
  }).join('');

  const bodyRows = block.rows.map((row) => {
    const valueCells = row.values.map((val, ci) => {
      const col = block.columns[ci];
      const isHl = col?.highlighted;
      let cellContent: string;

      if (isPositive(val)) {
        cellContent = checkSvg('#22c55e');
      } else if (isNegative(val)) {
        cellContent = xSvg('#ef4444');
      } else {
        const fontWeight = isHl ? 'font-weight: 700;' : '';
        const color = isHl ? palette.textPrimary : palette.textSecondary;
        cellContent = `<span style="color: ${color}; ${fontWeight}">${escapeHtml(val)}</span>`;
      }

      const bgTint = isHl ? `${palette.accent}08` : 'transparent';
      return `
          <td class="px-5 py-3 text-center text-sm"
              style="background: ${bgTint}; font-family: '${typography.bodyFont}', sans-serif;">
            ${cellContent}
          </td>`;
    }).join('');

    return `
        <tr style="border-bottom: 1px solid ${palette.secondary}15;">
          <td class="px-5 py-3 text-sm font-medium"
              style="color: ${palette.textPrimary}; font-family: '${typography.bodyFont}', sans-serif;">
            ${escapeHtml(row.feature)}
          </td>
          ${valueCells}
        </tr>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-5xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="overflow-x-auto" style="border-radius: ${borderRadius}; border: 1px solid ${palette.secondary}20;">
      <table class="w-full" style="border-collapse: collapse; min-width: 480px;">
        <thead>
          <tr>
            <th class="px-5 py-4 text-left text-sm font-semibold"
                style="background: ${palette.surface}; color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
              Feature
            </th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: tiers                                                     */
/*  Multi-column pricing/plan comparison with recommended badge        */
/* ------------------------------------------------------------------ */
function renderTiers(
  block: ComparisonTableBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const headerCells = block.columns.map((col) => {
    const isHl = col.highlighted;
    const borderTop = isHl ? `border-top: 4px solid ${palette.accent};` : '';
    const badge = isHl
      ? `<span class="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 mb-1"
              style="background: ${palette.accent}; color: #ffffff; border-radius: 9999px;">
           Recommended
         </span><br>`
      : '';
    return `
        <th class="px-5 py-4 text-center text-sm font-bold"
            style="background: ${palette.surface}; color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; ${borderTop}">
          ${badge}${escapeHtml(col.name)}
        </th>`;
  }).join('');

  const bodyRows = block.rows.map((row) => {
    const valueCells = row.values.map((val, ci) => {
      const col = block.columns[ci];
      const isHl = col?.highlighted;
      let cellContent: string;

      if (isPositive(val)) {
        cellContent = checkSvg('#22c55e');
      } else if (isNegative(val)) {
        cellContent = xSvg(`${palette.textSecondary}60`);
      } else {
        const fontWeight = isHl ? 'font-weight: 600;' : '';
        cellContent = `<span style="color: ${palette.textPrimary}; ${fontWeight}">${escapeHtml(val)}</span>`;
      }

      const bgTint = isHl ? `${palette.accent}06` : 'transparent';
      return `
          <td class="px-5 py-3 text-center text-sm"
              style="background: ${bgTint}; font-family: '${typography.bodyFont}', sans-serif;">
            ${cellContent}
          </td>`;
    }).join('');

    return `
        <tr style="border-bottom: 1px solid ${palette.secondary}12;">
          <td class="px-5 py-3 text-sm font-medium"
              style="color: ${palette.textPrimary}; font-family: '${typography.bodyFont}', sans-serif;">
            ${escapeHtml(row.feature)}
          </td>
          ${valueCells}
        </tr>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="overflow-x-auto" style="border-radius: ${borderRadius}; border: 1px solid ${palette.secondary}15;">
      <table class="w-full" style="border-collapse: collapse; min-width: 560px;">
        <thead>
          <tr>
            <th class="px-5 py-4 text-left text-sm font-semibold"
                style="background: ${palette.surface}; color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
              Feature
            </th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: checklist                                                 */
/*  Feature checklist with filled/empty circles, grid layout           */
/* ------------------------------------------------------------------ */
function renderChecklist(
  block: ComparisonTableBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const colCount = block.columns.length;
  const gridCols = colCount <= 2
    ? 'grid-cols-1 md:grid-cols-2'
    : colCount <= 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  const columnsHtml = block.columns.map((col, ci) => {
    const isHl = col.highlighted;
    const headerBg = isHl ? palette.accent : palette.surface;
    const headerColor = isHl ? '#ffffff' : palette.textPrimary;

    const featureRows = block.rows.map((row) => {
      const val = row.values[ci] || '';
      const isYes = isPositive(val);

      const indicator = isYes
        ? `<span class="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0" style="background: ${palette.accent};">
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </span>`
        : `<span class="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0" style="border-color: ${palette.textSecondary}30;"></span>`;

      const textColor = isYes ? palette.textPrimary : palette.textSecondary;

      return `
          <div class="flex items-center gap-3 py-2">
            ${indicator}
            <span class="text-sm" style="color: ${textColor}; font-family: '${typography.bodyFont}', sans-serif;">
              ${escapeHtml(row.feature)}
            </span>
          </div>`;
    }).join('');

    return `
      <div class="border overflow-hidden" style="border-color: ${palette.secondary}20; border-radius: ${borderRadius};">
        <div class="px-5 py-4 text-center font-bold"
             style="background: ${headerBg}; color: ${headerColor}; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(col.name)}
        </div>
        <div class="px-5 py-4" style="background: ${palette.background};">
          ${featureRows}
        </div>
      </div>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="grid ${gridCols} gap-6">
      ${columnsHtml}
    </div>
  </div>
</section>`;
}
