// ===== Layout DNA Templates =====
// Each style has 3 radically different structural skeletons (DNAs)
// that lock the hero type, required blocks, and layout patterns
// to ensure maximum visual diversity across generated pages.

export interface LayoutDNA {
  id: string;
  label: string;
  description: string;
  heroType: string;
  heroVariant: string;
  requiredBlocks: string[];
  requiredPatterns: string[];
  forbiddenBlocks: string[];
  blockCount: { min: number; max: number };
  structureHint: string;
}

export interface StyleDNASet {
  styleId: string;
  dnas: [LayoutDNA, LayoutDNA, LayoutDNA];
}

// ---------------------------------------------------------------------------
// modern-saas
// ---------------------------------------------------------------------------
const modernSaas: StyleDNASet = {
  styleId: 'modern-saas',
  dnas: [
    {
      id: 'modern-saas-a',
      label: 'Classic SaaS',
      description:
        'Traditional B2B SaaS landing page with split hero, value props, social proof, testimonials, and FAQ.',
      heroType: 'HeroSplit',
      heroVariant: 'split-left',
      requiredBlocks: ['ValueProps3', 'SocialProofRow', 'TestimonialsCards', 'FAQAccordion'],
      requiredPatterns: ['zigzag', 'editorial'],
      forbiddenBlocks: ['BentoGrid', 'DataVizBand', 'HeroTerminal', 'HeroChart', 'DataTable'],
      blockCount: { min: 7, max: 9 },
      structureHint:
        'Open with the split hero, then ValueProps3 for a quick feature scan, follow with SocialProofRow as a trust band, TestimonialsCards for deeper proof, FAQAccordion near the bottom, and close with CTA + Footer.',
    },
    {
      id: 'modern-saas-b',
      label: 'Product Showcase',
      description:
        'Bento-grid-centric layout that spotlights features visually with a boxed hero and stats.',
      heroType: 'HeroSplit',
      heroVariant: 'boxed',
      requiredBlocks: ['BentoGrid', 'FeatureZigzag', 'StatsBand'],
      requiredPatterns: ['bento', 'zigzag'],
      forbiddenBlocks: ['TestimonialsCards', 'FAQAccordion', 'DataTable', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Start with the boxed hero to frame the product, drop into a BentoGrid for feature discovery, alternate with FeatureZigzag for detail, punctuate with StatsBand as a credibility break, then CTA + Footer.',
    },
    {
      id: 'modern-saas-c',
      label: 'Social Proof Heavy',
      description:
        'Proof-driven layout with asymmetric hero, stats, testimonials, and comparison table.',
      heroType: 'HeroSplit',
      heroVariant: 'asymmetric',
      requiredBlocks: ['StatsBand', 'TestimonialsCards', 'ComparisonTable'],
      requiredPatterns: ['comparison', 'data-viz'],
      forbiddenBlocks: ['BentoGrid', 'ValueProps3', 'FAQAccordion', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Lead with the asymmetric hero for visual intrigue, immediately hit StatsBand to anchor credibility, follow with TestimonialsCards, use ComparisonTable to differentiate from competitors, then CTA + Footer.',
    },
  ],
};

// ---------------------------------------------------------------------------
// dark-tech
// ---------------------------------------------------------------------------
const darkTech: StyleDNASet = {
  styleId: 'dark-tech',
  dnas: [
    {
      id: 'dark-tech-a',
      label: 'Classic Dark',
      description:
        'Dark developer-tool landing with editorial hero, bento features, stats, and testimonials.',
      heroType: 'HeroSplit',
      heroVariant: 'editorial',
      requiredBlocks: ['BentoGrid', 'StatsBand', 'TestimonialsCards'],
      requiredPatterns: ['bento', 'editorial'],
      forbiddenBlocks: ['DataVizBand', 'ComparisonTable', 'HeroTerminal', 'HeroChart', 'DataTable'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Open with the editorial hero for an authoritative tone, present features in a BentoGrid, insert StatsBand as a metric credibility break, show TestimonialsCards, then CTA + Footer.',
    },
    {
      id: 'dark-tech-b',
      label: 'Command Center',
      description:
        'Terminal-driven hacker aesthetic with data viz, comparison, and stats for a data-rich feel.',
      heroType: 'HeroTerminal',
      heroVariant: 'matrix',
      requiredBlocks: ['DataVizBand', 'ComparisonTable', 'StatsBand'],
      requiredPatterns: ['data-viz', 'comparison'],
      forbiddenBlocks: ['BentoGrid', 'TestimonialsCards', 'ValueProps3', 'HeroSplit', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Start with the matrix terminal hero for maximum dev impact, flow into DataVizBand for live-data feel, use ComparisonTable to show technical superiority, anchor with StatsBand, then CTA + Footer.',
    },
    {
      id: 'dark-tech-c',
      label: 'Data Driven',
      description:
        'Chart-led layout with zigzag features, data table, and social proof for analytical users.',
      heroType: 'HeroChart',
      heroVariant: 'area-chart',
      requiredBlocks: ['FeatureZigzag', 'DataTable', 'SocialProofRow'],
      requiredPatterns: ['zigzag', 'data-viz'],
      forbiddenBlocks: ['BentoGrid', 'ComparisonTable', 'StatsBand', 'HeroSplit', 'HeroTerminal'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Lead with the area-chart hero to signal data prowess, alternate features using FeatureZigzag, present raw data in DataTable, add SocialProofRow for community trust, then CTA + Footer.',
    },
  ],
};

// ---------------------------------------------------------------------------
// editorial-premium
// ---------------------------------------------------------------------------
const editorialPremium: StyleDNASet = {
  styleId: 'editorial-premium',
  dnas: [
    {
      id: 'editorial-premium-a',
      label: 'Classic Editorial',
      description:
        'Magazine-style editorial page with elegant hero, zigzag features, testimonials, and FAQ.',
      heroType: 'HeroSplit',
      heroVariant: 'editorial',
      requiredBlocks: ['FeatureZigzag', 'TestimonialsCards', 'FAQAccordion'],
      requiredPatterns: ['zigzag', 'editorial'],
      forbiddenBlocks: ['BentoGrid', 'DataVizBand', 'HeroTerminal', 'HeroChart', 'DataTable'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Open with the editorial hero for a refined first impression, tell the product story through FeatureZigzag, add TestimonialsCards as endorsements, close knowledge gaps with FAQAccordion, then CTA + Footer.',
    },
    {
      id: 'editorial-premium-b',
      label: 'Magazine Layout',
      description:
        'Bento-driven magazine spread with section kickers and data visualisation for depth.',
      heroType: 'HeroSplit',
      heroVariant: 'asymmetric',
      requiredBlocks: ['BentoGrid', 'SectionKicker', 'DataVizBand'],
      requiredPatterns: ['bento', 'data-viz'],
      forbiddenBlocks: ['FeatureZigzag', 'TestimonialsCards', 'FAQAccordion', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Start with the asymmetric hero to break convention, use SectionKicker to introduce the BentoGrid spread, layer in DataVizBand for visual storytelling, then CTA + Footer.',
    },
    {
      id: 'editorial-premium-c',
      label: 'Story Flow',
      description:
        'Narrative-driven layout with color-block hero, process timeline, testimonials, and stats.',
      heroType: 'HeroSplit',
      heroVariant: 'color-block',
      requiredBlocks: ['ProcessTimeline', 'TestimonialsCards', 'StatsBand'],
      requiredPatterns: ['timeline', 'editorial'],
      forbiddenBlocks: ['BentoGrid', 'SectionKicker', 'DataVizBand', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Open with the bold color-block hero, guide the reader through a ProcessTimeline narrative, validate with TestimonialsCards, punctuate with StatsBand, then CTA + Footer.',
    },
  ],
};

// ---------------------------------------------------------------------------
// bold-startup
// ---------------------------------------------------------------------------
const boldStartup: StyleDNASet = {
  styleId: 'bold-startup',
  dnas: [
    {
      id: 'bold-startup-a',
      label: 'Classic Bold',
      description:
        'High-energy startup page with color-block hero, value props, and social proof.',
      heroType: 'HeroSplit',
      heroVariant: 'color-block',
      requiredBlocks: ['ValueProps3', 'SocialProofRow'],
      requiredPatterns: ['zigzag', 'editorial'],
      forbiddenBlocks: ['DataVizBand', 'ComparisonTable', 'HeroTerminal', 'HeroChart', 'DataTable'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Blast open with the color-block hero for instant energy, present ValueProps3 for quick wins, add SocialProofRow as a trust strip, optionally expand with a feature block, then CTA + Footer.',
    },
    {
      id: 'bold-startup-b',
      label: 'Impact Data',
      description:
        'Data-forward startup pitch with chart hero, stats, bento grid, and comparison table.',
      heroType: 'HeroChart',
      heroVariant: 'bar-chart',
      requiredBlocks: ['StatsBand', 'BentoGrid', 'ComparisonTable'],
      requiredPatterns: ['data-viz', 'comparison'],
      forbiddenBlocks: ['ValueProps3', 'SocialProofRow', 'ProcessTimeline', 'HeroSplit', 'HeroTerminal'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Lead with the bar-chart hero for immediate data impact, drop into StatsBand for headline metrics, showcase features in BentoGrid, use ComparisonTable to crush competitors, then CTA + Footer.',
    },
    {
      id: 'bold-startup-c',
      label: 'Dynamic Flow',
      description:
        'Journey-style startup page with centered hero, zigzag features, timeline, and testimonials.',
      heroType: 'HeroSplit',
      heroVariant: 'centered',
      requiredBlocks: ['FeatureZigzag', 'ProcessTimeline', 'TestimonialsCards'],
      requiredPatterns: ['zigzag', 'timeline'],
      forbiddenBlocks: ['StatsBand', 'BentoGrid', 'ComparisonTable', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Open with the centered hero for bold simplicity, alternate features through FeatureZigzag, map the user journey with ProcessTimeline, seal it with TestimonialsCards, then CTA + Footer.',
    },
  ],
};

// ---------------------------------------------------------------------------
// minimal-mono
// ---------------------------------------------------------------------------
const minimalMono: StyleDNASet = {
  styleId: 'minimal-mono',
  dnas: [
    {
      id: 'minimal-mono-a',
      label: 'Classic Minimal',
      description:
        'Restrained, clean page with centered hero, value props, and FAQ. Nothing extra.',
      heroType: 'HeroSplit',
      heroVariant: 'centered',
      requiredBlocks: ['ValueProps3', 'FAQAccordion'],
      requiredPatterns: ['editorial', 'zigzag'],
      forbiddenBlocks: ['BentoGrid', 'DataVizBand', 'HeroTerminal', 'HeroChart', 'ComparisonTable'],
      blockCount: { min: 6, max: 7 },
      structureHint:
        'Open with the centered hero for maximum whitespace, present ValueProps3 cleanly, allow ample breathing room between sections, close with FAQAccordion, then CTA + Footer. Favour restraint over density.',
    },
    {
      id: 'minimal-mono-b',
      label: 'Data Minimal',
      description:
        'Data-informed minimal page with editorial hero, data table, stats, and section kicker.',
      heroType: 'HeroSplit',
      heroVariant: 'editorial',
      requiredBlocks: ['DataTable', 'StatsBand', 'SectionKicker'],
      requiredPatterns: ['data-viz', 'editorial'],
      forbiddenBlocks: ['ValueProps3', 'FAQAccordion', 'BentoGrid', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Start with the editorial hero for quiet authority, use SectionKicker to introduce DataTable content, punctuate with StatsBand, keep visual noise to a minimum, then CTA + Footer.',
    },
    {
      id: 'minimal-mono-c',
      label: 'Process Minimal',
      description:
        'Process-driven minimal page with boxed hero, timeline, and zigzag features.',
      heroType: 'HeroSplit',
      heroVariant: 'boxed',
      requiredBlocks: ['ProcessTimeline', 'FeatureZigzag'],
      requiredPatterns: ['timeline', 'zigzag'],
      forbiddenBlocks: ['DataTable', 'StatsBand', 'SectionKicker', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 7 },
      structureHint:
        'Open with the boxed hero for contained elegance, guide the user through ProcessTimeline, elaborate with FeatureZigzag, keep spacing generous and tone muted, then CTA + Footer.',
    },
  ],
};

// ---------------------------------------------------------------------------
// soft-cards
// ---------------------------------------------------------------------------
const softCards: StyleDNASet = {
  styleId: 'soft-cards',
  dnas: [
    {
      id: 'soft-cards-a',
      label: 'Classic Soft',
      description:
        'Card-heavy pastel page with split hero, value props, services grid, and testimonials.',
      heroType: 'HeroSplit',
      heroVariant: 'split-left',
      requiredBlocks: ['ValueProps3', 'ServicesGrid', 'TestimonialsCards'],
      requiredPatterns: ['bento', 'editorial'],
      forbiddenBlocks: ['ComparisonTable', 'DataVizBand', 'HeroTerminal', 'HeroChart', 'DataTable'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Open with the split-left hero in soft tones, present ValueProps3 as rounded cards, expand with ServicesGrid in a card layout, add TestimonialsCards for warmth, then CTA + Footer. Emphasise rounded corners and pastel fills.',
    },
    {
      id: 'soft-cards-b',
      label: 'Bento Soft',
      description:
        'Bento-centric soft layout with boxed hero, social proof, and FAQ accordion.',
      heroType: 'HeroSplit',
      heroVariant: 'boxed',
      requiredBlocks: ['BentoGrid', 'SocialProofRow', 'FAQAccordion'],
      requiredPatterns: ['bento', 'zigzag'],
      forbiddenBlocks: ['ValueProps3', 'ServicesGrid', 'DataTable', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Start with the boxed hero (card feel), flow into BentoGrid with rounded soft cards, add SocialProofRow as a pastel trust band, close with FAQAccordion, then CTA + Footer.',
    },
    {
      id: 'soft-cards-c',
      label: 'Showcase Soft',
      description:
        'Feature-forward soft layout with centered hero, zigzag, comparison table, and stats.',
      heroType: 'HeroSplit',
      heroVariant: 'centered',
      requiredBlocks: ['FeatureZigzag', 'ComparisonTable', 'StatsBand'],
      requiredPatterns: ['zigzag', 'comparison'],
      forbiddenBlocks: ['BentoGrid', 'SocialProofRow', 'FAQAccordion', 'HeroTerminal', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Open with the centered hero for a calm introduction, alternate features through FeatureZigzag using card containers, present ComparisonTable in a soft card style, punctuate with StatsBand, then CTA + Footer.',
    },
  ],
};

// ---------------------------------------------------------------------------
// technical-dashboard
// ---------------------------------------------------------------------------
const technicalDashboard: StyleDNASet = {
  styleId: 'technical-dashboard',
  dnas: [
    {
      id: 'technical-dashboard-a',
      label: 'Classic Dashboard',
      description:
        'Structured admin-panel landing with centered hero, stats band, bento grid, and data table.',
      heroType: 'HeroSplit',
      heroVariant: 'centered',
      requiredBlocks: ['StatsBand', 'BentoGrid', 'DataTable'],
      requiredPatterns: ['bento', 'data-viz'],
      forbiddenBlocks: ['DataVizBand', 'ComparisonTable', 'HeroTerminal', 'HeroChart', 'ProcessTimeline'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Open with the centered hero showing a dashboard preview, immediately follow with StatsBand for KPI metrics, present features in BentoGrid (widget-like cards), display DataTable for detailed data, then CTA + Footer.',
    },
    {
      id: 'technical-dashboard-b',
      label: 'Data Observatory',
      description:
        'Chart-led data observatory layout with live-data hero, data viz, comparison, and process timeline.',
      heroType: 'HeroChart',
      heroVariant: 'line-chart',
      requiredBlocks: ['DataVizBand', 'ComparisonTable', 'ProcessTimeline'],
      requiredPatterns: ['data-viz', 'comparison'],
      forbiddenBlocks: ['BentoGrid', 'StatsBand', 'DataTable', 'HeroSplit', 'HeroTerminal'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Lead with the line-chart hero for an analytics-first impression, expand with DataVizBand for deeper visualisation, use ComparisonTable for plan/feature breakdowns, map the workflow in ProcessTimeline, then CTA + Footer.',
    },
    {
      id: 'technical-dashboard-c',
      label: 'Terminal Ops',
      description:
        'Terminal-driven ops layout with dark terminal hero, dark stats, data table, and zigzag features.',
      heroType: 'HeroTerminal',
      heroVariant: 'dark',
      requiredBlocks: ['StatsBand', 'DataTable', 'FeatureZigzag'],
      requiredPatterns: ['data-viz', 'zigzag'],
      forbiddenBlocks: ['BentoGrid', 'DataVizBand', 'ComparisonTable', 'HeroSplit', 'HeroChart'],
      blockCount: { min: 6, max: 8 },
      structureHint:
        'Open with the dark terminal hero for a DevOps feel, follow with StatsBand in a dark theme for uptime/performance metrics, present DataTable for detailed operations data, use FeatureZigzag for product capabilities, then CTA + Footer.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Master map
// ---------------------------------------------------------------------------
export const STYLE_DNA_MAP: Record<string, StyleDNASet> = {
  'modern-saas': modernSaas,
  'dark-tech': darkTech,
  'editorial-premium': editorialPremium,
  'bold-startup': boldStartup,
  'minimal-mono': minimalMono,
  'soft-cards': softCards,
  'technical-dashboard': technicalDashboard,
};

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/**
 * Return all three Layout DNAs for a given style.
 * Returns an empty array if the style is not found.
 */
export function getDNAsForStyle(styleId: string): LayoutDNA[] {
  const set = STYLE_DNA_MAP[styleId];
  return set ? [...set.dnas] : [];
}

/**
 * Return a single Layout DNA by style + DNA id.
 * Returns undefined if either the style or DNA id is not found.
 */
export function getDNA(styleId: string, dnaId: string): LayoutDNA | undefined {
  const set = STYLE_DNA_MAP[styleId];
  if (!set) return undefined;
  return set.dnas.find((d) => d.id === dnaId);
}
