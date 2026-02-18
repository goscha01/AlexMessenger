import { z } from 'zod';
import { DataTableSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type DataTableBlock = z.infer<typeof DataTableSchema>;

export function renderDataTable(block: DataTableBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  switch (block.variant) {
    case 'bordered':
      return renderBordered(block, palette, typography, borderRadius);
    case 'minimal':
      return renderMinimal(block, palette, typography, borderRadius);
    case 'striped':
    default:
      return renderStriped(block, palette, typography, borderRadius);
  }
}

/* ------------------------------------------------------------------ */
/*  Variant: striped (default)                                         */
/*  Alternating row backgrounds, primary header, rounded container     */
/* ------------------------------------------------------------------ */
function renderStriped(
  block: DataTableBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const headerCells = block.columns.map((col) => `
        <th class="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider"
            style="color: #ffffff; font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(col)}
        </th>`).join('');

  const bodyRows = block.rows.map((row, ri) => {
    const bg = ri % 2 === 0 ? palette.surface : `${palette.surface}CC`;
    const cells = row.map((cell) => `
          <td class="px-5 py-3 text-sm"
              style="color: ${palette.textPrimary}; font-family: '${typography.bodyFont}', sans-serif;">
            ${escapeHtml(cell)}
          </td>`).join('');
    return `
        <tr style="background: ${bg};">
          ${cells}
        </tr>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="overflow-x-auto" style="border-radius: ${borderRadius}; border: 1px solid ${palette.secondary}20;">
      <table class="w-full" style="border-collapse: collapse; min-width: 500px;">
        <thead>
          <tr style="background: ${palette.primary};">
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
/*  Variant: bordered                                                  */
/*  Full borders on every cell, surface header, structured feel        */
/* ------------------------------------------------------------------ */
function renderBordered(
  block: DataTableBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const borderColor = `${palette.secondary}30`;

  const headerCells = block.columns.map((col) => `
        <th class="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider"
            style="color: ${palette.textPrimary}; font-family: '${typography.bodyFont}', sans-serif; border: 1px solid ${borderColor};">
          ${escapeHtml(col)}
        </th>`).join('');

  const bodyRows = block.rows.map((row) => {
    const cells = row.map((cell) => `
          <td class="px-5 py-3 text-sm"
              style="color: ${palette.textPrimary}; font-family: '${typography.bodyFont}', sans-serif; border: 1px solid ${borderColor};">
            ${escapeHtml(cell)}
          </td>`).join('');
    return `
        <tr>
          ${cells}
        </tr>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="overflow-x-auto" style="border-radius: ${borderRadius};">
      <table class="w-full" style="border-collapse: collapse; min-width: 500px;">
        <thead>
          <tr style="background: ${palette.surface};">
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
/*  Variant: minimal                                                   */
/*  No borders, no striping, thin row dividers, accent header border   */
/* ------------------------------------------------------------------ */
function renderMinimal(
  block: DataTableBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
): string {
  const headerCells = block.columns.map((col) => `
        <th class="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider"
            style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(col)}
        </th>`).join('');

  const bodyRows = block.rows.map((row) => {
    const cells = row.map((cell) => `
          <td class="px-5 py-3 text-sm"
              style="color: ${palette.textPrimary}; font-family: '${typography.bodyFont}', sans-serif;">
            ${escapeHtml(cell)}
          </td>`).join('');
    return `
        <tr style="border-bottom: 1px solid ${palette.secondary}15;">
          ${cells}
        </tr>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full" style="border-collapse: collapse; min-width: 500px;">
        <thead>
          <tr style="border-bottom: 2px solid ${palette.accent};">
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
