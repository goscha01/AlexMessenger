import { BlockMeta } from '@/lib/catalog/blocks';
import { DesignDirectionBrief, ExtractedContent, LayoutPlan } from '@/lib/catalog/schemas';
import { DesignPreset, FontPairing } from '@/lib/design/types';

export function geminiDesignPrompt(context: {
  title: string;
  description: string;
  brandName: string;
}): string {
  return `You are a senior web designer analyzing a website to create a redesign brief.

WEBSITE: "${context.brandName}" — ${context.title}
DESCRIPTION: ${context.description || 'No description available.'}

Analyze the provided desktop and mobile screenshots and return a JSON object with this exact structure:

{
  "siteType": "string describing the type of website, e.g. 'SaaS landing page', 'restaurant', 'portfolio', 'e-commerce'",
  "mood": "string describing the target mood, e.g. 'professional and modern', 'warm and inviting', 'bold and energetic'",
  "primaryColor": "#hex 6-digit color - main brand color detected or recommended",
  "secondaryColor": "#hex 6-digit color - complementary secondary color",
  "accentColor": "#hex 6-digit color - accent/CTA color that contrasts well",
  "fontSuggestion": {
    "heading": "A real Google Font name for headings (e.g. 'Inter', 'Poppins', 'Playfair Display')",
    "body": "A real Google Font name for body text (e.g. 'Inter', 'Open Sans', 'Source Sans 3')"
  },
  "layoutStyle": "one of: corporate, creative, minimal, bold, elegant",
  "suggestedBlocks": ["ordered list of block type names"],
  "designNotes": "2-3 sentences about your design reasoning and key improvements"
}

AVAILABLE BLOCK TYPES (use these exact names in suggestedBlocks):
- HeroSplit: Hero with headline, subheadline, CTA, and image/gradient
- ValueProps3: 2-4 column value proposition cards with icons
- ServicesGrid: Grid of service/feature cards
- SocialProofRow: Row of client/partner names
- TestimonialsCards: Testimonial quote cards
- FAQAccordion: FAQ question-answer section
- CTASection: Call-to-action section with button
- FooterSimple: Simple footer with links

RULES:
- Suggest 4-8 blocks total
- Always start with HeroSplit
- Always end with FooterSimple
- All colors MUST be valid 6-digit hex codes starting with #
- Font names MUST be real Google Fonts
- Focus on DESIGN quality, not content changes
- Analyze the current design's strengths and weaknesses in designNotes`;
}

export function layoutPlanPrompt(
  direction: DesignDirectionBrief,
  content: ExtractedContent,
  presets: DesignPreset[],
  fontPairings: FontPairing[],
  catalog: BlockMeta[]
): string {
  const presetList = presets
    .map((p) => `- "${p.id}": ${p.name} — ${p.description} (mood: ${p.mood}, style: ${p.layoutStyle})`)
    .join('\n');

  const fontList = fontPairings
    .map((f) => `- "${f.id}": ${f.heading} / ${f.body} — ${f.description} (${f.category})`)
    .join('\n');

  const blockList = catalog
    .map((b) => {
      const variantStr = b.variants.map((v) => `"${v.id}" (${v.description})`).join(', ');
      return `- ${b.type}: ${b.description}\n  Variants: ${variantStr}`;
    })
    .join('\n');

  return `You are a design system architect creating a layout plan for a website redesign.

DESIGN DIRECTION (from visual analysis):
- Site type: ${direction.siteType}
- Mood: ${direction.mood}
- Layout style: ${direction.layoutStyle}
- Suggested blocks: ${direction.suggestedBlocks.join(', ')}
- Design notes: ${direction.designNotes}

WEBSITE CONTENT AVAILABLE:
- Brand: ${content.brandName}
- Has headings: ${content.headings.length > 0 ? 'yes' : 'no'} (${content.headings.length})
- Has testimonials: ${content.testimonials.length > 0 ? 'yes' : 'no'} (${content.testimonials.length})
- Has FAQ items: ${content.faqItems.length > 0 ? 'yes' : 'no'} (${content.faqItems.length})
- Has CTA texts: ${content.ctaTexts.length > 0 ? 'yes' : 'no'}
- Has navigation: ${content.navItems.length > 0 ? 'yes' : 'no'}

AVAILABLE DESIGN PRESETS:
${presetList}

AVAILABLE FONT PAIRINGS:
${fontList}

AVAILABLE BLOCKS & VARIANTS:
${blockList}

Return a JSON object:
{
  "presetId": "id of the best matching design preset",
  "fontPairingId": "id of the best matching font pairing",
  "blockOrder": [
    { "type": "BlockType", "variant": "variant-id", "rationale": "why this block and variant" }
  ],
  "designRationale": "2-3 sentences explaining overall design choices"
}

RULES:
1. Pick the preset that best matches the site type, mood, and layout style.
2. Pick a font pairing that complements the preset mood.
3. Start with HeroSplit, end with FooterSimple.
4. Use 5-8 blocks total.
5. Only include TestimonialsCards if testimonials exist in the content.
6. Only include FAQAccordion if FAQ items exist in the content.
7. Choose variants that create visual variety — don't use the same variant pattern repeatedly.
8. Use ONLY block types and variant IDs from the lists above.`;
}

export function claudeSchemaPrompt(
  layoutPlan: LayoutPlan,
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
- ValueProps3: { type, variant, sectionTitle, items: [{ icon: "emoji", title, description }] (2-4 items) }
- ServicesGrid: { type, variant, sectionTitle, services: [{ title, description, icon: "emoji" }] (2-8) }
- SocialProofRow: { type, variant, label: "Trusted by" or similar, items: [{ name }] (2-8) }
- TestimonialsCards: { type, variant, sectionTitle, testimonials: [{ quote, author, role }] (1-4) }
- FAQAccordion: { type, variant, sectionTitle, items: [{ question, answer }] (1-10) }
- CTASection: { type, variant, headline, subtext, ctaText, ctaHref }
- FooterSimple: { type, variant, brandName, links: [{ text, href }], copyright }

OUTPUT this JSON:
{
  "presetId": "${layoutPlan.presetId}",
  "fontPairingId": "${layoutPlan.fontPairingId}",
  "blocks": [
    // Follow the EXACT block order and variants from the layout plan above
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
7. The "variant" field in each block MUST match the layout plan's variant for that block.`;
}

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

export function geminiCritiquePrompt(): string {
  return `You are a senior UI/UX designer reviewing a rendered website design. Analyze the screenshot and provide specific, actionable fixes.

Rate the design quality from 1-10 and identify concrete issues to fix.

Return a JSON object:
{
  "patches": [
    {
      "blockIndex": 0,
      "field": "headline",
      "oldValue": "current text if known",
      "newValue": "suggested replacement",
      "reason": "why this change improves the design"
    }
  ],
  "overallNote": "2-3 sentences summarizing the design quality and key improvements"
}

RULES:
- Only suggest patches for text content, not colors or layout (those are preset-controlled).
- Focus on: headline clarity, CTA text strength, section title improvements, description conciseness.
- Maximum 5 patches per review.
- If the design looks good, return an empty patches array.
- blockIndex is 0-based matching the block order in the page.`;
}
