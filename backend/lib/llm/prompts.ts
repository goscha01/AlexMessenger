import { BlockMeta } from '@/lib/catalog/blocks';
import { ExtractedContent, StyleSpec, LayoutPlanV2 } from '@/lib/catalog/schemas';
import { DesignPreset, FontPairing } from '@/lib/design/types';
import { SignatureCSS } from '@/lib/design/signatures';

// ===== Gemini Observations Prompt (vision — observations only) =====

export function geminiObservationsPrompt(context: {
  title: string;
  description: string;
  brandName: string;
}): string {
  return `You are a senior web designer observing a website to identify its visual characteristics and areas for improvement.

WEBSITE: "${context.brandName}" — ${context.title}
DESCRIPTION: ${context.description || 'No description available.'}

Analyze the provided desktop and mobile screenshots. ONLY describe what you see and what should improve. Do NOT suggest specific block types, presets, or layout structures.

Return a JSON object:
{
  "industryCandidates": [
    { "label": "industry description (e.g. 'restaurant', 'law firm', 'SaaS platform')", "confidence": 0.0-1.0 }
  ],
  "visualProblems": ["list of specific visual issues you can see (e.g. 'low contrast header text', 'cluttered hero section', 'no clear visual hierarchy')"],
  "visualGoals": ["what the redesign should achieve (e.g. 'establish clear information hierarchy', 'modernize typography', 'add breathing room between sections')"],
  "brandSignals": {
    "perceivedTone": "describe the brand's personality (e.g. 'corporate and trustworthy', 'playful and casual')",
    "complexity": "simple | moderate | complex",
    "trustLevel": "low | medium | high"
  },
  "paletteObserved": {
    "primary": "#hex or null if unclear",
    "accents": ["#hex colors used as accents"],
    "background": "#hex main background"
  },
  "avoidPatterns": ["list of design patterns to avoid (e.g. 'generic SaaS gradient hero', 'stock photo grid', 'cookie-cutter card layout')"]
}

RULES:
- Return 1-3 industry candidates, ordered by confidence
- Be specific about visual problems — not vague
- avoidPatterns should list cliché patterns this site currently uses or would likely default to
- All hex colors must be valid 6-digit codes starting with #
- Do NOT suggest colors, fonts, blocks, or layouts — only observe`;
}

// ===== Style Director Prompt (text-only — selects signature + preset) =====

export function styleDirectorPrompt(
  observations: string,
  signatures: { id: string; name: string; description: string }[],
  presets: DesignPreset[],
  fontPairings: FontPairing[]
): string {
  const sigList = signatures
    .map((s) => `- "${s.id}": ${s.name} — ${s.description}`)
    .join('\n');

  const presetList = presets
    .map((p) => `- "${p.id}": ${p.name} — ${p.description} (mood: ${p.mood})`)
    .join('\n');

  const fontList = fontPairings
    .map((f) => `- "${f.id}": ${f.heading} / ${f.body} — ${f.description} (${f.category})`)
    .join('\n');

  return `You are a design director choosing a visual style for a website redesign. Based on observations about the current site, select a cohesive design system.

OBSERVATIONS FROM VISUAL ANALYSIS:
${observations}

AVAILABLE STYLE SIGNATURES:
${sigList}

AVAILABLE DESIGN PRESETS:
${presetList}

AVAILABLE FONT PAIRINGS:
${fontList}

Return a JSON object:
{
  "signature": "signature ID from the list above",
  "presetId": "preset ID from the list above",
  "fontPairingId": "font pairing ID from the list above",
  "density": "loose | normal | tight",
  "visualMotifs": ["2-4 motifs to apply (e.g. 'thin-rules', 'dots', 'rounded-corners', 'neon-glow', 'serif-accents')"],
  "sectionSeparators": "none | lines | color-shift | wave | dots",
  "antiTemplateRules": ["3-5 rules this design MUST follow to avoid being generic (e.g. 'no gradient hero backgrounds', 'must use at least 2 non-card layouts', 'avoid centered-everything pattern')"]
}

RULES:
1. The signature should match the brand's personality and industry.
2. The preset should complement the signature (don't pick dark-neon with editorial-warm).
3. Font pairing category should match the mood (serif for editorial, sans for tech, mixed for creative).
4. antiTemplateRules MUST be specific and actionable — not vague.
5. density: use "loose" for editorial/luxury, "tight" for technical/data, "normal" for most.
6. DO NOT default to corporate-blue or inter-inter unless the site genuinely needs them.`;
}

// ===== Layout Plan V2 Prompt (block selection + diversity) =====

export function layoutPlanV2Prompt(
  styleSpec: StyleSpec,
  content: ExtractedContent,
  catalog: BlockMeta[]
): string {
  const blockList = catalog
    .map((b) => {
      const variantStr = b.variants.map((v) => `"${v.id}" (${v.description})`).join(', ');
      return `- ${b.type}: ${b.description}\n  Variants: ${variantStr}`;
    })
    .join('\n');

  return `You are a design system architect creating a layout plan for a website redesign.

STYLE SPEC (follow this):
- Signature: ${styleSpec.signature}
- Preset: ${styleSpec.presetId}
- Font pairing: ${styleSpec.fontPairingId}
- Density: ${styleSpec.density}
- Anti-template rules: ${styleSpec.antiTemplateRules.join('; ')}

WEBSITE CONTENT:
- Brand: ${content.brandName}
- Title: ${content.title}
- Headings: ${content.headings.slice(0, 10).join(' | ')}
- Has testimonials: ${content.testimonials.length > 0 ? `yes (${content.testimonials.length})` : 'no'}
- Has FAQ: ${content.faqItems.length > 0 ? `yes (${content.faqItems.length})` : 'no'}
- Has CTAs: ${content.ctaTexts.length > 0 ? 'yes' : 'no'}
- Paragraphs: ${content.paragraphs.length}

AVAILABLE BLOCKS:
${blockList}

Return a JSON object:
{
  "signature": "${styleSpec.signature}",
  "presetId": "${styleSpec.presetId}",
  "fontPairingId": "${styleSpec.fontPairingId}",
  "density": "${styleSpec.density}",
  "blockOrder": [
    { "type": "BlockType", "variant": "variant-id", "rationale": "why this block" }
  ],
  "diversityPatterns": ["list at least 3 distinct layout patterns used (e.g. 'zigzag', 'bento-grid', 'stats-band', 'timeline', 'cards', 'accordion')"],
  "designRationale": "2-3 sentences explaining the layout choices"
}

CRITICAL RULES:
1. MUST include at least 3 blocks from: BentoGrid, FeatureZigzag, StatsBand, ProcessTimeline
2. MUST NOT use this default sequence: HeroSplit → ValueProps3 → SocialProofRow → CTASection → FooterSimple
3. MUST list at least 3 distinct layout patterns in diversityPatterns
4. Start with HeroSplit (but use a NON-DEFAULT variant like asymmetric, boxed, editorial, or color-block)
5. End with FooterSimple
6. Use 6-9 blocks total
7. Only include TestimonialsCards if testimonials exist
8. Only include FAQAccordion if FAQ items exist
9. Follow the anti-template rules from the style spec
10. Choose variants that match the signature style (e.g. editorial → "editorial" hero, bento → "mixed" grid)`;
}

// ===== Claude Content Prompt (fills content into blocks) =====

export function claudeContentPrompt(
  layoutPlan: LayoutPlanV2,
  content: ExtractedContent,
  catalog: BlockMeta[]
): string {
  const blockSpecs = catalog.map((b) =>
    `- ${b.type}: Required fields: ${b.requiredFields.join(', ')}`
  ).join('\n');

  const blockOrder = layoutPlan.blockOrder
    .map((b, i) => `${i + 1}. ${b.type} (variant: "${b.variant}")`)
    .join('\n');

  return `You are a web design system that fills real content into a page layout. Output ONLY valid JSON — no markdown, no explanation, no code fences.

LAYOUT PLAN (follow this exactly):
Signature: ${layoutPlan.signature}
Preset: ${layoutPlan.presetId}
Font pairing: ${layoutPlan.fontPairingId}
Blocks in order:
${blockOrder}

EXTRACTED WEBSITE CONTENT:
- Brand: ${content.brandName}
- Title: ${content.title}
- Description: ${content.description}
- Headings: ${content.headings.slice(0, 15).join(' | ')}
- Navigation: ${content.navItems.join(', ')}
- Key paragraphs: ${content.paragraphs.slice(0, 8).join('\n')}
- CTA texts: ${content.ctaTexts.join(', ') || 'Learn More, Get Started'}
- Testimonials: ${content.testimonials.slice(0, 4).join(' | ') || 'None found'}
- FAQ items: ${content.faqItems.length > 0 ? content.faqItems.slice(0, 5).map(f => f.question).join(' | ') : 'None found'}

BLOCK FIELD SPECIFICATIONS:
${blockSpecs}

DETAILED FIELD SPECS:
- HeroSplit: { type, variant, headline, subheadline, ctaText, ctaHref }
- ValueProps3: { type, variant, sectionTitle, items: [{ icon: "emoji", title, description }] (2-4) }
- ServicesGrid: { type, variant, sectionTitle, services: [{ title, description, icon: "emoji" }] (2-8) }
- SocialProofRow: { type, variant, label, items: [{ name, value? }] (2-8) }
- TestimonialsCards: { type, variant, sectionTitle, testimonials: [{ quote, author, role }] (1-4) }
- FAQAccordion: { type, variant, sectionTitle, items: [{ question, answer }] (1-10) }
- CTASection: { type, variant, headline, subtext, ctaText, ctaHref }
- FooterSimple: { type, variant, brandName, links: [{ text, href }], copyright }
- BentoGrid: { type, variant, sectionTitle, items: [{ title, description, icon?: "emoji", span?: "normal"|"wide"|"tall" }] (3-6) }
- FeatureZigzag: { type, variant, sectionTitle, items: [{ title, description, icon?: "emoji" }] (2-4) }
- StatsBand: { type, variant, items: [{ value: "number+unit", label }] (3-5) }
- ProcessTimeline: { type, variant, sectionTitle, steps: [{ title, description }] (3-6) }

OUTPUT this JSON:
{
  "signature": "${layoutPlan.signature}",
  "presetId": "${layoutPlan.presetId}",
  "fontPairingId": "${layoutPlan.fontPairingId}",
  "blocks": [
    // Follow the EXACT block order and variants from the layout plan
    // Fill each block with REAL content from the extracted website content
  ]
}

CRITICAL RULES:
1. Output ONLY the JSON object. No markdown, no explanation, no code fences.
2. Follow the exact block order and variant values from the layout plan.
3. Populate blocks with content from the website. Do NOT invent fake content.
4. If content is missing for a block, derive reasonable defaults from available content.
5. Icons should be emojis (e.g. "🚀", "💡", "⚡").
6. ctaHref values should be "#" or "/" for internal links.
7. The "variant" field in each block MUST match the layout plan's variant for that block.
8. For StatsBand, create realistic metrics from the website content (e.g. "500+", "99.9%", "24/7").
9. For ProcessTimeline, extract or derive logical steps from the website's content.
10. For BentoGrid, vary the "span" field — use at least one "wide" item.`;
}

// ===== Claude Repair Prompt =====

export function claudeRepairPrompt(
  rawJson: string,
  errors: string[]
): string {
  return `The following JSON page schema has validation errors. Fix ONLY the errors and return the corrected JSON. Output ONLY valid JSON — no markdown, no explanation, no code fences.

VALIDATION ERRORS:
${errors.join('\n')}

INVALID JSON:
${rawJson}

Return the corrected JSON object only.`;
}

// ===== Gemini QA Critique Prompt (anti-regression aware) =====

export function geminiQACritiquePrompt(noveltyLocks?: {
  heroTypeLocked: string;
  heroVariantLocked: string;
  requiredBlockTypes: string[];
  lockedVariants: { blockIndex: number; variant: string }[];
}): string {
  const lockRules = noveltyLocks ? `

NOVELTY LOCKS (DO NOT violate these):
- The hero block (block[0]) type "${noveltyLocks.heroTypeLocked}" and variant "${noveltyLocks.heroVariantLocked}" are INTENTIONALLY chosen. Do NOT swap-variant on block[0].
- These block types MUST remain in the layout — do NOT remove them: ${noveltyLocks.requiredBlockTypes.join(', ') || 'none'}
${noveltyLocks.lockedVariants.map(lv => `- Block[${lv.blockIndex}] variant "${lv.variant}" is locked — do NOT swap-variant on it.`).join('\n')}` : '';

  return `You are a senior UI/UX designer reviewing a rendered website design. Analyze the screenshot and provide specific fixes focused on CONTENT QUALITY and VISUAL POLISH — NOT structural layout changes.

Return a JSON object:
{
  "patches": [
    {
      "action": "modify | swap-variant | insert | remove",
      "blockIndex": 0,
      "field": "headline (only for modify action)",
      "oldValue": "current value if known (only for modify)",
      "newValue": "replacement value (for modify and insert)",
      "newBlockType": "BlockType (only for insert action)",
      "newVariant": "variant-id (for swap-variant or insert)",
      "reason": "why this change improves the design"
    }
  ],
  "tokenPatches": [
    { "key": "density or spacing key", "value": "new value" }
  ],
  "overallNote": "2-3 sentences summarizing design quality and key improvements"
}

PATCH ACTIONS:
- "modify": Change a text field value (headline, description, ctaText, etc.)
- "swap-variant": Change a block's variant (ONLY for non-locked blocks)
- "insert": Add a new block at the given index
- "remove": Remove a block at the given index (ONLY for non-required blocks)

AVAILABLE BLOCK TYPES & VARIANTS:
- HeroSplit: split-left, split-right, centered, asymmetric, boxed, editorial, color-block
- HeroTerminal: dark, matrix, retro
- HeroChart: line-chart, bar-chart, area-chart
- ValueProps3: cards, icons-inline, numbered
- ServicesGrid: cards, minimal-list, icon-left
- SocialProofRow: logo-bar, ticker, grid, stats-only
- TestimonialsCards: cards, single-spotlight, minimal-quote
- FAQAccordion: classic, side-by-side, bordered
- CTASection: gradient-bg, card-centered, split-cta, card-inset, minimal
- FooterSimple: minimal, columns, centered
- BentoGrid: 2x2, 3-col, mixed
- FeatureZigzag: standard, with-image, numbered
- StatsBand: dark, accent, minimal
- ProcessTimeline: vertical, horizontal, cards
- DataVizBand: sparklines, progress-bars, gauge
- DataTable: striped, bordered, minimal
- ComparisonTable: vs, tiers, checklist
- SectionKicker: label-line, counter, icon-rule
${lockRules}

RULES:
1. Return 1-5 patches (only patches that clearly improve the design)
2. Focus on: content clarity, readability, spacing, color contrast, CTA visibility
3. Prefer "modify" patches to improve text content over "swap-variant" patches
4. Do NOT swap the hero variant unless the design is fundamentally broken
5. Do NOT remove blocks that contribute to the page's unique structure
6. blockIndex is 0-based
7. Maximum 5 patches per review`;
}
