import { z } from 'zod';
import { FooterSimpleSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type FooterSimpleBlock = z.infer<typeof FooterSimpleSchema>;

export function renderFooterSimple(block: FooterSimpleBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius, spacing } = tokens;

  switch (block.variant) {
    case 'columns':
      return renderColumns(block, palette, typography, borderRadius, spacing);
    case 'centered':
      return renderCentered(block, palette, typography, borderRadius, spacing);
    case 'minimal':
    default:
      return renderMinimal(block, palette, typography, borderRadius, spacing);
  }
}

/** Generate copyright string, using provided value or a sensible default. */
function getCopyright(block: FooterSimpleBlock): string {
  if (block.copyright) return escapeHtml(block.copyright);
  const year = new Date().getFullYear();
  return escapeHtml(`\u00A9 ${year} ${block.brandName}. All rights reserved.`);
}

/* ------------------------------------------------------------------ */
/*  Variant: minimal (default)                                        */
/*  Brand left, links right, copyright centered below. Dark bg.       */
/* ------------------------------------------------------------------ */
function renderMinimal(
  block: FooterSimpleBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
  _spacing: string,
): string {
  const linksHtml = block.links
    .map(
      (link) => `
    <a href="${escapeHtml(link.href)}"
       class="text-sm opacity-70 hover:opacity-100 transition-opacity duration-200"
       style="color: ${palette.background}; font-family: '${typography.bodyFont}', sans-serif;">
      ${escapeHtml(link.text)}
    </a>`,
    )
    .join('');

  return `
<footer class="py-12" style="background-color: ${palette.primary};">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="text-xl font-bold"
           style="color: ${palette.background}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
        ${escapeHtml(block.brandName)}
      </div>
      <nav class="flex flex-wrap justify-center gap-6" aria-label="Footer navigation">
        ${linksHtml}
      </nav>
    </div>
    <div class="mt-8 pt-8 text-center" style="border-top: 1px solid ${palette.background}15;">
      <p class="text-sm opacity-50"
         style="color: ${palette.background}; font-family: '${typography.bodyFont}', sans-serif;">
        ${getCopyright(block)}
      </p>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: columns                                                  */
/*  Brand + description left, links in columns right                  */
/* ------------------------------------------------------------------ */
function renderColumns(
  block: FooterSimpleBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
  _spacing: string,
): string {
  const linksHtml = block.links
    .map(
      (link) => `
      <li>
        <a href="${escapeHtml(link.href)}"
           class="text-sm opacity-70 hover:opacity-100 transition-opacity duration-200"
           style="color: ${palette.background}; font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(link.text)}
        </a>
      </li>`,
    )
    .join('');

  return `
<footer class="py-14" style="background-color: ${palette.primary};">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <!-- Brand column -->
      <div class="md:col-span-1">
        <div class="text-2xl font-bold mb-3"
             style="color: ${palette.background}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
          ${escapeHtml(block.brandName)}
        </div>
        <p class="text-sm leading-relaxed opacity-60"
           style="color: ${palette.background}; font-family: '${typography.bodyFont}', sans-serif;">
          Quality service you can trust. We are committed to delivering the best experience.
        </p>
      </div>

      <!-- Links columns -->
      <div class="md:col-span-2">
        <h3 class="text-xs uppercase tracking-widest mb-4 opacity-50 font-semibold"
            style="color: ${palette.background}; font-family: '${typography.headingFont}', sans-serif;">
          Quick Links
        </h3>
        <ul class="grid grid-cols-2 gap-3 list-none p-0 m-0">
          ${linksHtml}
        </ul>
      </div>
    </div>

    <div class="mt-10 pt-8 text-center" style="border-top: 1px solid ${palette.background}15;">
      <p class="text-sm opacity-50"
         style="color: ${palette.background}; font-family: '${typography.bodyFont}', sans-serif;">
        ${getCopyright(block)}
      </p>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: centered                                                 */
/*  Everything centered — brand, pill-button links, copyright         */
/* ------------------------------------------------------------------ */
function renderCentered(
  block: FooterSimpleBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
  _spacing: string,
): string {
  const linksHtml = block.links
    .map(
      (link) => `
    <a href="${escapeHtml(link.href)}"
       class="inline-block px-5 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
       style="color: ${palette.background}; background: ${palette.background}15; border-radius: 9999px; font-family: '${typography.bodyFont}', sans-serif;">
      ${escapeHtml(link.text)}
    </a>`,
    )
    .join('');

  return `
<footer class="py-14" style="background-color: ${palette.primary};">
  <div class="max-w-4xl mx-auto px-6 text-center">
    <div class="text-2xl font-bold mb-6"
         style="color: ${palette.background}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.brandName)}
    </div>

    <nav class="flex flex-wrap justify-center gap-3 mb-8" aria-label="Footer navigation">
      ${linksHtml}
    </nav>

    <div class="pt-6" style="border-top: 1px solid ${palette.background}15;">
      <p class="text-sm opacity-50"
         style="color: ${palette.background}; font-family: '${typography.bodyFont}', sans-serif;">
        ${getCopyright(block)}
      </p>
    </div>
  </div>
</footer>`;
}
