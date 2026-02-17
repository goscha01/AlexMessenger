import { z } from 'zod';
import { TestimonialsCardsSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type TestimonialsCardsBlock = z.infer<typeof TestimonialsCardsSchema>;

export function renderTestimonialsCards(block: TestimonialsCardsBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius, spacing } = tokens;

  switch (block.variant) {
    case 'single-spotlight':
      return renderSingleSpotlight(block, palette, typography, borderRadius, spacing);
    case 'minimal-quote':
      return renderMinimalQuote(block, palette, typography, borderRadius, spacing);
    case 'cards':
    default:
      return renderCards(block, palette, typography, borderRadius, spacing);
  }
}

/* ------------------------------------------------------------------ */
/*  Variant: cards (default)                                          */
/*  Grid of quote cards with avatar circles                           */
/* ------------------------------------------------------------------ */
function renderCards(
  block: TestimonialsCardsBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
  _spacing: string,
): string {
  const cols =
    block.testimonials.length === 1
      ? 'max-w-2xl mx-auto'
      : block.testimonials.length === 2
        ? 'grid md:grid-cols-2 gap-8'
        : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';

  const cardsHtml = block.testimonials
    .map(
      (t) => `
    <div class="p-8 shadow-sm border hover:shadow-lg transition-shadow duration-300"
         style="background: ${palette.surface}; border-color: ${palette.secondary}20; border-radius: ${borderRadius};">
      <div class="text-4xl mb-4 leading-none" style="color: ${palette.accent};">&ldquo;</div>
      <p class="leading-relaxed mb-6" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
        ${escapeHtml(t.quote)}
      </p>
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
             style="background-color: ${palette.primary};">
          ${t.author.charAt(0).toUpperCase()}
        </div>
        <div>
          <p class="font-semibold" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
            ${escapeHtml(t.author)}
          </p>
          ${t.role ? `<p class="text-sm" style="color: ${palette.textSecondary};">${escapeHtml(t.role)}</p>` : ''}
        </div>
      </div>
    </div>`,
    )
    .join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-7xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12"
        style="color: ${palette.primary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="${cols}">
      ${cardsHtml}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: single-spotlight                                         */
/*  Large featured testimonial with prominent quote marks             */
/* ------------------------------------------------------------------ */
function renderSingleSpotlight(
  block: TestimonialsCardsBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
  _spacing: string,
): string {
  const featured = block.testimonials[0];

  return `
<section class="py-20 lg:py-32" style="background: linear-gradient(135deg, ${palette.primary}0A, ${palette.secondary}12);">
  <div class="max-w-4xl mx-auto px-6 text-center">
    <h2 class="text-3xl lg:text-4xl font-bold mb-16"
        style="color: ${palette.primary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>

    <div class="relative p-10 lg:p-14 shadow-xl"
         style="background: ${palette.surface}; border-radius: ${borderRadius};">
      <!-- Large decorative quote marks -->
      <div class="absolute top-6 left-8 text-7xl lg:text-8xl leading-none opacity-20 select-none pointer-events-none"
           style="color: ${palette.accent}; font-family: Georgia, serif;">&ldquo;</div>
      <div class="absolute bottom-4 right-8 text-7xl lg:text-8xl leading-none opacity-20 select-none pointer-events-none"
           style="color: ${palette.accent}; font-family: Georgia, serif;">&rdquo;</div>

      <blockquote class="relative z-10">
        <p class="text-xl lg:text-2xl leading-relaxed mb-8 italic"
           style="color: ${palette.textPrimary}; font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(featured.quote)}
        </p>
        <footer class="flex flex-col items-center gap-3">
          <div class="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold"
               style="background: linear-gradient(135deg, ${palette.primary}, ${palette.accent});">
            ${featured.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <cite class="not-italic font-semibold text-lg block"
                  style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
              ${escapeHtml(featured.author)}
            </cite>
            ${featured.role ? `<span class="text-sm" style="color: ${palette.textSecondary};">${escapeHtml(featured.role)}</span>` : ''}
          </div>
        </footer>
      </blockquote>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/*  Variant: minimal-quote                                            */
/*  Clean layout with thin left border accent                         */
/* ------------------------------------------------------------------ */
function renderMinimalQuote(
  block: TestimonialsCardsBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  _borderRadius: string,
  _spacing: string,
): string {
  const quotesHtml = block.testimonials
    .map(
      (t) => `
    <div class="py-8 pl-6 border-l-4" style="border-color: ${palette.accent};">
      <p class="text-lg leading-relaxed mb-4"
         style="color: ${palette.textPrimary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
        ${escapeHtml(t.quote)}
      </p>
      <div class="flex items-center gap-2">
        <span class="font-semibold" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(t.author)}
        </span>
        ${t.role ? `<span style="color: ${palette.textSecondary};">&mdash; ${escapeHtml(t.role)}</span>` : ''}
      </div>
    </div>`,
    )
    .join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.background};">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-14"
        style="color: ${palette.primary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
      ${escapeHtml(block.sectionTitle)}
    </h2>
    <div class="space-y-6">
      ${quotesHtml}
    </div>
  </div>
</section>`;
}
