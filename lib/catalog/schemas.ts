import { z } from 'zod';

// ===== Extracted Content (from Cheerio) =====
export const ExtractedContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  headings: z.array(z.string()),
  paragraphs: z.array(z.string()),
  navItems: z.array(z.string()),
  ctaTexts: z.array(z.string()),
  testimonials: z.array(z.string()),
  faqItems: z.array(z.object({ question: z.string(), answer: z.string() })),
  brandName: z.string(),
  contactInfo: z.string().optional(),
});

// ===== Gemini Output: DesignDirectionBrief =====
export const DesignDirectionBriefSchema = z.object({
  siteType: z.string(),
  mood: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  fontSuggestion: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  layoutStyle: z.enum(['corporate', 'creative', 'minimal', 'bold', 'elegant']),
  suggestedBlocks: z.array(z.string()),
  designNotes: z.string(),
});

// ===== Block Types =====
export const BlockTypeEnum = z.enum([
  'HeroSplit',
  'ValueProps3',
  'ServicesGrid',
  'SocialProofRow',
  'TestimonialsCards',
  'FAQAccordion',
  'CTASection',
  'FooterSimple',
]);

// ===== Variant Enums =====
export const HeroVariant = z.enum(['split-left', 'split-right', 'centered']).default('split-left');
export const ValuePropsVariant = z.enum(['cards', 'icons-inline', 'numbered']).default('cards');
export const ServicesVariant = z.enum(['cards', 'minimal-list', 'icon-left']).default('cards');
export const SocialProofVariant = z.enum(['logo-bar', 'ticker', 'grid']).default('logo-bar');
export const TestimonialsVariant = z.enum(['cards', 'single-spotlight', 'minimal-quote']).default('cards');
export const FAQVariant = z.enum(['classic', 'side-by-side', 'bordered']).default('classic');
export const CTAVariant = z.enum(['gradient-bg', 'card-centered', 'split-cta']).default('gradient-bg');
export const FooterVariant = z.enum(['minimal', 'columns', 'centered']).default('minimal');

// ===== Individual Block Schemas =====
export const HeroSplitSchema = z.object({
  type: z.literal('HeroSplit'),
  variant: HeroVariant,
  headline: z.string().min(1).max(200),
  subheadline: z.string().max(300),
  ctaText: z.string().max(60),
  ctaHref: z.string(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
});

export const ValueProps3Schema = z.object({
  type: z.literal('ValueProps3'),
  variant: ValuePropsVariant,
  sectionTitle: z.string(),
  items: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
  })).min(2).max(4),
});

export const ServicesGridSchema = z.object({
  type: z.literal('ServicesGrid'),
  variant: ServicesVariant,
  sectionTitle: z.string(),
  services: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })).min(2).max(8),
});

export const SocialProofRowSchema = z.object({
  type: z.literal('SocialProofRow'),
  variant: SocialProofVariant,
  label: z.string().optional(),
  items: z.array(z.object({
    name: z.string(),
  })).min(2).max(8),
});

export const TestimonialsCardsSchema = z.object({
  type: z.literal('TestimonialsCards'),
  variant: TestimonialsVariant,
  sectionTitle: z.string(),
  testimonials: z.array(z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
  })).min(1).max(4),
});

export const FAQAccordionSchema = z.object({
  type: z.literal('FAQAccordion'),
  variant: FAQVariant,
  sectionTitle: z.string(),
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).min(1).max(10),
});

export const CTASectionSchema = z.object({
  type: z.literal('CTASection'),
  variant: CTAVariant,
  headline: z.string(),
  subtext: z.string().optional(),
  ctaText: z.string(),
  ctaHref: z.string(),
});

export const FooterSimpleSchema = z.object({
  type: z.literal('FooterSimple'),
  variant: FooterVariant,
  brandName: z.string(),
  links: z.array(z.object({
    text: z.string(),
    href: z.string(),
  })),
  copyright: z.string().optional(),
});

// ===== Discriminated Union of All Blocks =====
export const BlockSchema = z.discriminatedUnion('type', [
  HeroSplitSchema,
  ValueProps3Schema,
  ServicesGridSchema,
  SocialProofRowSchema,
  TestimonialsCardsSchema,
  FAQAccordionSchema,
  CTASectionSchema,
  FooterSimpleSchema,
]);

// ===== Design Tokens (legacy — used for rendering) =====
export const TokensSchema = z.object({
  brandName: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  headingFont: z.string(),
  bodyFont: z.string(),
});

// ===== Legacy PageSchema (used for rendering with resolved tokens) =====
export const PageSchemaOutput = z.object({
  tokens: TokensSchema,
  blocks: z.array(BlockSchema).min(3).max(12),
});

// ===== Token Tweaks (Claude can override preset colors) =====
export const TokenTweaksSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  surface: z.string().optional(),
  textPrimary: z.string().optional(),
  textSecondary: z.string().optional(),
});

// ===== PageSchemaV2 (Claude output — preset-based) =====
export const PageSchemaV2Output = z.object({
  presetId: z.string(),
  tokenTweaks: TokenTweaksSchema.optional(),
  fontPairingId: z.string().optional(),
  blocks: z.array(BlockSchema).min(3).max(12),
});

// ===== Layout Plan (Gemini output) =====
export const LayoutPlanBlockSchema = z.object({
  type: BlockTypeEnum,
  variant: z.string(),
  rationale: z.string(),
});

export const LayoutPlanSchema = z.object({
  presetId: z.string(),
  fontPairingId: z.string(),
  blockOrder: z.array(LayoutPlanBlockSchema).min(3).max(12),
  designRationale: z.string(),
});

// ===== QA Patch =====
export const QAPatchItemSchema = z.object({
  blockIndex: z.number().int().min(0),
  field: z.string(),
  oldValue: z.string(),
  newValue: z.string(),
  reason: z.string(),
});

export const QAPatchSchema = z.object({
  patches: z.array(QAPatchItemSchema),
  overallNote: z.string(),
});

// ===== TypeScript types =====
export type ExtractedContent = z.infer<typeof ExtractedContentSchema>;
export type DesignDirectionBrief = z.infer<typeof DesignDirectionBriefSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type Tokens = z.infer<typeof TokensSchema>;
export type PageSchema = z.infer<typeof PageSchemaOutput>;
export type PageSchemaV2 = z.infer<typeof PageSchemaV2Output>;
export type LayoutPlan = z.infer<typeof LayoutPlanSchema>;
export type LayoutPlanBlock = z.infer<typeof LayoutPlanBlockSchema>;
export type QAPatch = z.infer<typeof QAPatchSchema>;
export type QAPatchItem = z.infer<typeof QAPatchItemSchema>;
export type TokenTweaks = z.infer<typeof TokenTweaksSchema>;
export type BlockType = z.infer<typeof BlockTypeEnum>;
