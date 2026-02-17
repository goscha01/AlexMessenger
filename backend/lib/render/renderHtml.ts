import type { PageSchema, Block } from '@/lib/catalog/schemas';
import type { ResolvedDesignTokens } from '@/lib/design/types';
import { renderHeroSplit } from './blocks/HeroSplit';
import { renderValueProps3 } from './blocks/ValueProps3';
import { renderServicesGrid } from './blocks/ServicesGrid';
import { renderSocialProofRow } from './blocks/SocialProofRow';
import { renderTestimonialsCards } from './blocks/TestimonialsCards';
import { renderFAQAccordion } from './blocks/FAQAccordion';
import { renderCTASection } from './blocks/CTASection';
import { renderFooterSimple } from './blocks/FooterSimple';

// HTML entity escaping for XSS prevention
const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch] || ch);
}

type BlockRenderer = (block: never, tokens: ResolvedDesignTokens) => string;

const BLOCK_RENDERERS: Record<string, BlockRenderer> = {
  HeroSplit: renderHeroSplit as BlockRenderer,
  ValueProps3: renderValueProps3 as BlockRenderer,
  ServicesGrid: renderServicesGrid as BlockRenderer,
  SocialProofRow: renderSocialProofRow as BlockRenderer,
  TestimonialsCards: renderTestimonialsCards as BlockRenderer,
  FAQAccordion: renderFAQAccordion as BlockRenderer,
  CTASection: renderCTASection as BlockRenderer,
  FooterSimple: renderFooterSimple as BlockRenderer,
};

export function renderPageHtml(schema: PageSchema, resolvedTokens: ResolvedDesignTokens): string {
  const { blocks } = schema;
  const t = resolvedTokens;

  const blockHtml = blocks
    .map((block: Block) => {
      const renderer = BLOCK_RENDERERS[block.type];
      if (!renderer) return `<!-- Unknown block type: ${block.type} -->`;
      return renderer(block as never, t);
    })
    .join('\n');

  const headingFont = encodeURIComponent(t.typography.headingFont);
  const bodyFont = encodeURIComponent(t.typography.bodyFont);
  const fontsParam = headingFont === bodyFont
    ? `family=${headingFont}:wght@400;500;600;700`
    : `family=${headingFont}:wght@400;500;600;700&family=${bodyFont}:wght@400;500;600;700`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(t.brandName)} — Redesigned</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?${fontsParam}&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-primary: ${t.palette.primary};
      --color-secondary: ${t.palette.secondary};
      --color-accent: ${t.palette.accent};
      --color-background: ${t.palette.background};
      --color-surface: ${t.palette.surface};
      --color-text-primary: ${t.palette.textPrimary};
      --color-text-secondary: ${t.palette.textSecondary};
      --font-heading: '${t.typography.headingFont}', system-ui, sans-serif;
      --font-body: '${t.typography.bodyFont}', system-ui, sans-serif;
      --radius: ${t.borderRadius};
    }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--font-body);
      color: var(--color-text-primary);
      background-color: var(--color-background);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
    }
    details summary { list-style: none; }
    details summary::-webkit-details-marker { display: none; }
  </style>
</head>
<body>
${blockHtml}
</body>
</html>`;
}
