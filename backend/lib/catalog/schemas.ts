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

// ===== Gemini Output: Observations (replaces DesignDirectionBrief) =====
export const GeminiObservationsSchema = z.object({
  industryCandidates: z.array(z.object({
    label: z.string(),
    confidence: z.number().min(0).max(1),
  })).min(1).max(3),
  visualProblems: z.array(z.string()),
  visualGoals: z.array(z.string()),
  brandSignals: z.object({
    perceivedTone: z.string(),
    complexity: z.enum(['simple', 'moderate', 'complex']),
    trustLevel: z.enum(['low', 'medium', 'high']),
  }),
  paletteObserved: z.object({
    primary: z.string().optional(),
    accents: z.array(z.string()).optional(),
    background: z.string().optional(),
  }),
  avoidPatterns: z.array(z.string()),
});

// ===== Style Spec (Style Director output) =====
export const SignatureEnum = z.enum([
  'bento', 'editorial', 'colorBlocks', 'monoMinimal',
  'darkNeon', 'softCards', 'technicalGrid',
]);

export const StyleSpecSchema = z.object({
  signature: SignatureEnum,
  presetId: z.string(),
  fontPairingId: z.string(),
  density: z.enum(['loose', 'normal', 'tight']),
  visualMotifs: z.array(z.string()),
  sectionSeparators: z.enum(['none', 'lines', 'color-shift', 'wave', 'dots']),
  antiTemplateRules: z.array(z.string()),
});

// ===== Block Types (expanded) =====
export const BlockTypeEnum = z.enum([
  'HeroSplit',
  'ValueProps3',
  'ServicesGrid',
  'SocialProofRow',
  'TestimonialsCards',
  'FAQAccordion',
  'CTASection',
  'FooterSimple',
  // Diversity blocks
  'BentoGrid',
  'FeatureZigzag',
  'StatsBand',
  'ProcessTimeline',
  // Signature artifact blocks
  'HeroTerminal',
  'HeroChart',
  'DataVizBand',
  'DataTable',
  'ComparisonTable',
  'SectionKicker',
]);

// ===== Variant Enums (expanded) =====
export const HeroVariant = z.enum([
  'split-left', 'split-right', 'centered',
  'asymmetric', 'boxed', 'editorial', 'color-block',
]).default('split-left');

export const ValuePropsVariant = z.enum(['cards', 'icons-inline', 'numbered']).default('cards');
export const ServicesVariant = z.enum(['cards', 'minimal-list', 'icon-left']).default('cards');

export const SocialProofVariant = z.enum([
  'logo-bar', 'ticker', 'grid', 'stats-only',
]).default('logo-bar');

export const TestimonialsVariant = z.enum(['cards', 'single-spotlight', 'minimal-quote']).default('cards');
export const FAQVariant = z.enum(['classic', 'side-by-side', 'bordered']).default('classic');

export const CTAVariant = z.enum([
  'gradient-bg', 'card-centered', 'split-cta',
  'card-inset', 'minimal',
]).default('gradient-bg');

export const FooterVariant = z.enum(['minimal', 'columns', 'centered']).default('minimal');

// New block variants
export const BentoGridVariant = z.enum(['2x2', '3-col', 'mixed']).default('mixed');
export const FeatureZigzagVariant = z.enum(['standard', 'with-image', 'numbered']).default('standard');
export const StatsBandVariant = z.enum(['dark', 'accent', 'minimal']).default('accent');
export const ProcessTimelineVariant = z.enum(['vertical', 'horizontal', 'cards']).default('vertical');

// Signature artifact block variants
export const HeroTerminalVariant = z.enum(['dark', 'matrix', 'retro']).default('dark');
export const HeroChartVariant = z.enum(['line-chart', 'bar-chart', 'area-chart']).default('line-chart');
export const DataVizBandVariant = z.enum(['sparklines', 'progress-bars', 'gauge']).default('sparklines');
export const DataTableVariant = z.enum(['striped', 'bordered', 'minimal']).default('striped');
export const ComparisonTableVariant = z.enum(['vs', 'tiers', 'checklist']).default('vs');
export const SectionKickerVariant = z.enum(['label-line', 'counter', 'icon-rule']).default('label-line');

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
    value: z.string().optional(), // for stats-only variant
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

// ===== New Block Schemas =====
export const BentoGridSchema = z.object({
  type: z.literal('BentoGrid'),
  variant: BentoGridVariant,
  sectionTitle: z.string(),
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    span: z.enum(['normal', 'wide', 'tall']).default('normal'),
  })).min(3).max(6),
});

export const FeatureZigzagSchema = z.object({
  type: z.literal('FeatureZigzag'),
  variant: FeatureZigzagVariant,
  sectionTitle: z.string(),
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })).min(2).max(4),
});

export const StatsBandSchema = z.object({
  type: z.literal('StatsBand'),
  variant: StatsBandVariant,
  items: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).min(3).max(5),
});

export const ProcessTimelineSchema = z.object({
  type: z.literal('ProcessTimeline'),
  variant: ProcessTimelineVariant,
  sectionTitle: z.string(),
  steps: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).min(3).max(6),
});

// ===== Signature Artifact Block Schemas =====
export const HeroTerminalSchema = z.object({
  type: z.literal('HeroTerminal'),
  variant: HeroTerminalVariant,
  headline: z.string().min(1).max(200),
  subheadline: z.string().max(300),
  ctaText: z.string().max(60),
  ctaHref: z.string(),
  commandLines: z.array(z.string()).min(1).max(6),
});

export const HeroChartSchema = z.object({
  type: z.literal('HeroChart'),
  variant: HeroChartVariant,
  headline: z.string().min(1).max(200),
  subheadline: z.string().max(300),
  ctaText: z.string().max(60),
  ctaHref: z.string(),
  chartData: z.array(z.object({
    label: z.string(),
    value: z.number(),
  })).min(3).max(8),
});

export const DataVizBandSchema = z.object({
  type: z.literal('DataVizBand'),
  variant: DataVizBandVariant,
  sectionTitle: z.string().optional(),
  items: z.array(z.object({
    label: z.string(),
    value: z.string(),
    trend: z.enum(['up', 'down', 'flat']).optional(),
  })).min(3).max(6),
});

export const DataTableSchema = z.object({
  type: z.literal('DataTable'),
  variant: DataTableVariant,
  sectionTitle: z.string(),
  columns: z.array(z.string()).min(2).max(6),
  rows: z.array(z.array(z.string())).min(2).max(8),
});

export const ComparisonTableSchema = z.object({
  type: z.literal('ComparisonTable'),
  variant: ComparisonTableVariant,
  sectionTitle: z.string(),
  columns: z.array(z.object({
    name: z.string(),
    highlighted: z.boolean().optional(),
  })).min(2).max(4),
  rows: z.array(z.object({
    feature: z.string(),
    values: z.array(z.string()),
  })).min(3).max(10),
});

export const SectionKickerSchema = z.object({
  type: z.literal('SectionKicker'),
  variant: SectionKickerVariant,
  label: z.string(),
  sublabel: z.string().optional(),
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
  // Diversity blocks
  BentoGridSchema,
  FeatureZigzagSchema,
  StatsBandSchema,
  ProcessTimelineSchema,
  // Signature artifact blocks
  HeroTerminalSchema,
  HeroChartSchema,
  DataVizBandSchema,
  DataTableSchema,
  ComparisonTableSchema,
  SectionKickerSchema,
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

// ===== Layout Plan V2 (Gemini output — replaces LayoutPlan) =====
export const LayoutPlanBlockSchema = z.object({
  type: BlockTypeEnum,
  variant: z.string(),
  rationale: z.string(),
});

export const LayoutPlanV2Schema = z.object({
  signature: z.string(),
  presetId: z.string(),
  fontPairingId: z.string(),
  density: z.enum(['loose', 'normal', 'tight']),
  blockOrder: z.array(LayoutPlanBlockSchema).min(3).max(12),
  diversityPatterns: z.array(z.string()).min(3),
  designRationale: z.string(),
});

// Keep old LayoutPlanSchema for backward compat during migration
export const LayoutPlanSchema = LayoutPlanV2Schema;

// ===== PageSchemaV2 (Claude output — preset-based) =====
export const PageSchemaV2Output = z.object({
  signature: z.string(),
  presetId: z.string(),
  tokenTweaks: TokenTweaksSchema.optional(),
  fontPairingId: z.string().optional(),
  blocks: z.array(BlockSchema).min(3).max(12),
});

// ===== QA Patch V2 =====
export const QAPatchV2ItemSchema = z.object({
  action: z.enum(['modify', 'swap-variant', 'insert', 'remove']),
  blockIndex: z.number().int().min(0),
  field: z.string().optional(),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
  newBlockType: z.string().optional(),
  newVariant: z.string().optional(),
  reason: z.string(),
});

export const QAPatchV2Schema = z.object({
  patches: z.array(QAPatchV2ItemSchema).min(1),
  tokenPatches: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  overallNote: z.string(),
});

// Keep old QAPatch schemas for backward compat
export const QAPatchItemSchema = QAPatchV2ItemSchema;
export const QAPatchSchema = QAPatchV2Schema;

// ===== Layout DNA Schema =====

export const LayoutDNASchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  heroType: z.string(),
  heroVariant: z.string(),
  requiredBlocks: z.array(z.string()),
  requiredPatterns: z.array(z.string()),
  forbiddenBlocks: z.array(z.string()),
  blockCount: z.object({ min: z.number(), max: z.number() }),
  structureHint: z.string(),
  sectionOrder: z.array(z.string()),
});

export const NoveltyLocksSchema = z.object({
  heroTypeLocked: z.string(),
  heroVariantLocked: z.string(),
  requiredBlockTypes: z.array(z.string()),
  lockedVariants: z.array(z.object({ blockIndex: z.number(), variant: z.string() })),
  lockedSectionOrder: z.array(z.string()).optional(),
});

// ===== Style Library V3 Schemas =====

// Template A output — 3 style selections
export const StyleSelectionItemSchema = z.object({
  styleId: z.string(),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
  bestFor: z.string(),
});
export const StyleSelectionSchema = z.array(StyleSelectionItemSchema).length(3);

// Template B output — preview schema (4 blocks)
export const PreviewBlockSchema = z.object({
  type: z.string(),
  variant: z.string(),
  props: z.record(z.unknown()),
});
export const PreviewSchemaOutput = z.object({
  styleId: z.string(),
  presetTokens: z.record(z.unknown()),
  typography: z.object({ pairingId: z.string(), scaleId: z.string() }),
  blocks: z.array(PreviewBlockSchema).min(3).max(5),
});

// Template C output — layout plan
export const LayoutPlanV3Schema = z.object({
  styleId: z.string(),
  sectionWrappers: z.array(z.object({ index: z.number(), wrapper: z.string() })),
  layoutPatterns: z.array(z.string()).min(3),
  blocks: z.array(z.object({ type: z.string(), variant: z.string(), rationale: z.string() })),
  ctaStrategy: z.object({ primaryPlacement: z.string(), secondaryAllowed: z.boolean() }),
});

// Template D output — final page schema
export const FinalPageSchemaOutput = z.object({
  styleId: z.string(),
  tokens: z.record(z.unknown()),
  sectionWrappers: z.array(z.object({ index: z.number(), wrapper: z.string() })),
  blocks: z.array(z.object({ type: z.string(), variant: z.string(), props: z.record(z.unknown()) })),
  signatureFlags: z.object({
    backgroundMotif: z.array(z.string()),
    separators: z.array(z.string()),
    microElements: z.array(z.string()),
  }),
  noveltyLocks: NoveltyLocksSchema.optional(),
});

// Direction response for API
export const DirectionSchema = z.object({
  id: z.enum(['A', 'B', 'C']),
  styleId: z.string(),
  styleLabel: z.string(),
  confidence: z.number(),
  reason: z.string(),
  bestFor: z.string(),
  previewHtml: z.string(),
  previewScreenshot: z.string(),
});

// ===== TypeScript types =====
export type ExtractedContent = z.infer<typeof ExtractedContentSchema>;
export type GeminiObservations = z.infer<typeof GeminiObservationsSchema>;
export type StyleSpec = z.infer<typeof StyleSpecSchema>;
export type Signature = z.infer<typeof SignatureEnum>;
export type Block = z.infer<typeof BlockSchema>;
export type Tokens = z.infer<typeof TokensSchema>;
export type PageSchema = z.infer<typeof PageSchemaOutput>;
export type PageSchemaV2 = z.infer<typeof PageSchemaV2Output>;
export type LayoutPlanV2 = z.infer<typeof LayoutPlanV2Schema>;
export type LayoutPlan = LayoutPlanV2;
export type LayoutPlanBlock = z.infer<typeof LayoutPlanBlockSchema>;
export type QAPatchV2 = z.infer<typeof QAPatchV2Schema>;
export type QAPatchV2Item = z.infer<typeof QAPatchV2ItemSchema>;
export type QAPatch = QAPatchV2;
export type QAPatchItem = QAPatchV2Item;
export type TokenTweaks = z.infer<typeof TokenTweaksSchema>;
export type BlockType = z.infer<typeof BlockTypeEnum>;
export type StyleSelectionItem = z.infer<typeof StyleSelectionItemSchema>;
export type StyleSelection = z.infer<typeof StyleSelectionSchema>;
export type PreviewBlock = z.infer<typeof PreviewBlockSchema>;
export type PreviewSchema = z.infer<typeof PreviewSchemaOutput>;
export type LayoutPlanV3 = z.infer<typeof LayoutPlanV3Schema>;
export type FinalPageSchema = z.infer<typeof FinalPageSchemaOutput>;
export type Direction = z.infer<typeof DirectionSchema>;

export type LayoutDNA = z.infer<typeof LayoutDNASchema>;
export type NoveltyLocks = z.infer<typeof NoveltyLocksSchema>;

// Legacy alias
export type DesignDirectionBrief = GeminiObservations;
