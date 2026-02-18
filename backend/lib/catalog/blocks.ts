import { BlockType } from './schemas';

export interface VariantMeta {
  id: string;
  name: string;
  description: string;
}

export interface BlockMeta {
  type: BlockType;
  displayName: string;
  description: string;
  requiredFields: string[];
  variants: VariantMeta[];
}

export const BLOCK_CATALOG: BlockMeta[] = [
  {
    type: 'HeroSplit',
    displayName: 'Hero (Split Layout)',
    description: 'Full-width hero with headline, subheadline, CTA button, and image/gradient',
    requiredFields: ['headline', 'subheadline', 'ctaText', 'ctaHref'],
    variants: [
      { id: 'split-left', name: 'Split Left', description: 'Text left, image/gradient right — classic SaaS layout' },
      { id: 'split-right', name: 'Split Right', description: 'Image/gradient left, text right — reversed layout' },
      { id: 'centered', name: 'Centered', description: 'Full-width centered text over background gradient' },
      { id: 'asymmetric', name: 'Asymmetric', description: 'Off-center text with large accent shape — editorial feel' },
      { id: 'boxed', name: 'Boxed', description: 'Content in a contained card over full-bleed background' },
      { id: 'editorial', name: 'Editorial', description: 'Large serif headline with minimal layout — magazine style' },
      { id: 'color-block', name: 'Color Block', description: 'Bold color split — text on one color, accent on other' },
    ],
  },
  {
    type: 'ValueProps3',
    displayName: 'Value Propositions',
    description: '2-4 column grid of value propositions, each with an icon/emoji, title, and short description',
    requiredFields: ['sectionTitle', 'items[].icon', 'items[].title', 'items[].description'],
    variants: [
      { id: 'cards', name: 'Cards', description: 'Icon-top cards in a grid with centered text' },
      { id: 'icons-inline', name: 'Icons Inline', description: 'Icon left with text flowing right — horizontal layout' },
      { id: 'numbered', name: 'Numbered', description: 'Large step numbers replacing icons — sequential flow' },
    ],
  },
  {
    type: 'ServicesGrid',
    displayName: 'Services Grid',
    description: 'Grid of service/feature cards with title, description, and optional icon',
    requiredFields: ['sectionTitle', 'services[].title', 'services[].description'],
    variants: [
      { id: 'cards', name: 'Cards', description: 'Elevated card grid with hover effects' },
      { id: 'minimal-list', name: 'Minimal List', description: 'Simple stacked list with subtle dividers' },
      { id: 'icon-left', name: 'Icon Left', description: 'Icon on left, title and description flowing right' },
    ],
  },
  {
    type: 'SocialProofRow',
    displayName: 'Social Proof Row',
    description: 'Horizontal row of client/partner names with an optional label like "Trusted by"',
    requiredFields: ['items[].name'],
    variants: [
      { id: 'logo-bar', name: 'Logo Bar', description: 'Simple horizontal row of names/logos' },
      { id: 'ticker', name: 'Ticker', description: 'Auto-scrolling marquee of names — dynamic feel' },
      { id: 'grid', name: 'Grid', description: 'Grid layout of name badges' },
      { id: 'stats-only', name: 'Stats Only', description: 'Numeric stats row — "500+ clients, 99% uptime"' },
    ],
  },
  {
    type: 'TestimonialsCards',
    displayName: 'Testimonials Cards',
    description: '1-4 testimonial cards with quote text, author name, and optional role',
    requiredFields: ['sectionTitle', 'testimonials[].quote', 'testimonials[].author'],
    variants: [
      { id: 'cards', name: 'Cards', description: 'Grid of quote cards with avatars' },
      { id: 'single-spotlight', name: 'Single Spotlight', description: 'Large featured testimonial with big quote marks' },
      { id: 'minimal-quote', name: 'Minimal Quote', description: 'Clean minimal quotes with thin borders' },
    ],
  },
  {
    type: 'FAQAccordion',
    displayName: 'FAQ Accordion',
    description: 'Expandable FAQ section with question-answer pairs',
    requiredFields: ['sectionTitle', 'items[].question', 'items[].answer'],
    variants: [
      { id: 'classic', name: 'Classic', description: 'Standard expandable accordion with +/- indicators' },
      { id: 'side-by-side', name: 'Side by Side', description: 'Questions left column, answers right column' },
      { id: 'bordered', name: 'Bordered', description: 'Cards with borders around each Q&A pair' },
    ],
  },
  {
    type: 'CTASection',
    displayName: 'Call to Action',
    description: 'Centered CTA section with headline, optional subtext, and action button',
    requiredFields: ['headline', 'ctaText', 'ctaHref'],
    variants: [
      { id: 'gradient-bg', name: 'Gradient Background', description: 'Bold gradient background with white text' },
      { id: 'card-centered', name: 'Card Centered', description: 'Floating card on subtle background' },
      { id: 'split-cta', name: 'Split CTA', description: 'Text left, button right — inline layout' },
      { id: 'card-inset', name: 'Card Inset', description: 'Inset card with border — contained and clean' },
      { id: 'minimal', name: 'Minimal', description: 'Simple text + button — no background treatment' },
    ],
  },
  {
    type: 'FooterSimple',
    displayName: 'Simple Footer',
    description: 'Minimal footer with brand name, navigation links, and copyright text',
    requiredFields: ['brandName', 'links[].text', 'links[].href'],
    variants: [
      { id: 'minimal', name: 'Minimal', description: 'Single line — brand left, links right' },
      { id: 'columns', name: 'Columns', description: 'Multi-column footer with grouped links' },
      { id: 'centered', name: 'Centered', description: 'All elements centered in a single column' },
    ],
  },
  // ===== New Blocks =====
  {
    type: 'BentoGrid',
    displayName: 'Bento Grid',
    description: 'Asymmetric grid of feature cards with varying sizes — modern dashboard feel',
    requiredFields: ['sectionTitle', 'items[].title', 'items[].description'],
    variants: [
      { id: '2x2', name: '2x2 Grid', description: 'Even 2-column grid — balanced and clean' },
      { id: '3-col', name: '3 Column', description: '3-column grid — fits more items' },
      { id: 'mixed', name: 'Mixed Sizes', description: 'Asymmetric grid with wide/tall items — dynamic layout' },
    ],
  },
  {
    type: 'FeatureZigzag',
    displayName: 'Feature Zigzag',
    description: 'Alternating left-right feature sections — breaks visual monotony',
    requiredFields: ['sectionTitle', 'items[].title', 'items[].description'],
    variants: [
      { id: 'standard', name: 'Standard', description: 'Alternating text blocks left-right' },
      { id: 'with-image', name: 'With Image', description: 'Each row has an image placeholder opposite the text' },
      { id: 'numbered', name: 'Numbered', description: 'Large step numbers — process-oriented zigzag' },
    ],
  },
  {
    type: 'StatsBand',
    displayName: 'Stats Band',
    description: 'Horizontal band of key metrics/numbers — builds credibility',
    requiredFields: ['items[].value', 'items[].label'],
    variants: [
      { id: 'dark', name: 'Dark Background', description: 'White text on dark band — high contrast impact' },
      { id: 'accent', name: 'Accent Background', description: 'Numbers on brand accent color' },
      { id: 'minimal', name: 'Minimal', description: 'Numbers on white/transparent — subtle' },
    ],
  },
  {
    type: 'ProcessTimeline',
    displayName: 'Process Timeline',
    description: 'Step-by-step process visualization — shows workflow or methodology',
    requiredFields: ['sectionTitle', 'steps[].title', 'steps[].description'],
    variants: [
      { id: 'vertical', name: 'Vertical', description: 'Vertical timeline with connecting line' },
      { id: 'horizontal', name: 'Horizontal', description: 'Horizontal step flow — left to right' },
      { id: 'cards', name: 'Cards', description: 'Numbered cards in a grid — clean step display' },
    ],
  },
  // ===== Signature Artifact Blocks =====
  {
    type: 'HeroTerminal',
    displayName: 'Hero (Terminal)',
    description: 'Dark terminal-style hero with typed command lines, blinking cursor, and CTA',
    requiredFields: ['headline', 'subheadline', 'ctaText', 'ctaHref', 'commandLines[]'],
    variants: [
      { id: 'dark', name: 'Dark', description: 'Dark terminal with green/cyan text on black background' },
      { id: 'matrix', name: 'Matrix', description: 'Green-on-black matrix-style with falling characters backdrop' },
      { id: 'retro', name: 'Retro', description: 'Amber-on-dark retro CRT terminal aesthetic' },
    ],
  },
  {
    type: 'HeroChart',
    displayName: 'Hero (Chart)',
    description: 'Hero section with embedded CSS-only chart (line/bar/area) showing key metrics',
    requiredFields: ['headline', 'subheadline', 'ctaText', 'ctaHref', 'chartData[].label', 'chartData[].value'],
    variants: [
      { id: 'line-chart', name: 'Line Chart', description: 'SVG line chart with accent-colored data points' },
      { id: 'bar-chart', name: 'Bar Chart', description: 'Vertical bar chart with gradient fills' },
      { id: 'area-chart', name: 'Area Chart', description: 'Filled area chart with semi-transparent gradient' },
    ],
  },
  {
    type: 'DataVizBand',
    displayName: 'Data Viz Band',
    description: 'Full-width band of data visualizations — sparklines, progress bars, or gauges',
    requiredFields: ['items[].label', 'items[].value'],
    variants: [
      { id: 'sparklines', name: 'Sparklines', description: 'Mini SVG sparkline charts next to each metric' },
      { id: 'progress-bars', name: 'Progress Bars', description: 'Horizontal progress bars with percentage labels' },
      { id: 'gauge', name: 'Gauge', description: 'Semi-circular gauge indicators for each metric' },
    ],
  },
  {
    type: 'DataTable',
    displayName: 'Data Table',
    description: 'Structured data table with headers, rows, and optional column highlighting',
    requiredFields: ['sectionTitle', 'columns[]', 'rows[][]'],
    variants: [
      { id: 'striped', name: 'Striped', description: 'Alternating row backgrounds for easy scanning' },
      { id: 'bordered', name: 'Bordered', description: 'Full borders around every cell — structured feel' },
      { id: 'minimal', name: 'Minimal', description: 'Clean with subtle row dividers only' },
    ],
  },
  {
    type: 'ComparisonTable',
    displayName: 'Comparison Table',
    description: 'Feature comparison grid — plan tiers, us-vs-them, or feature checklist',
    requiredFields: ['sectionTitle', 'columns[].name', 'rows[].feature', 'rows[].values[]'],
    variants: [
      { id: 'vs', name: 'Vs', description: 'Two-column "Us vs Them" comparison with highlighted winner' },
      { id: 'tiers', name: 'Tiers', description: 'Multi-column pricing/plan tier comparison' },
      { id: 'checklist', name: 'Checklist', description: 'Feature checklist with check/x marks per column' },
    ],
  },
  {
    type: 'SectionKicker',
    displayName: 'Section Kicker',
    description: 'Thin section transition element with label, counter, or decorative rule',
    requiredFields: ['label'],
    variants: [
      { id: 'label-line', name: 'Label Line', description: 'Centered label with thin horizontal rules on each side' },
      { id: 'counter', name: 'Counter', description: 'Large section number with small label — editorial feel' },
      { id: 'icon-rule', name: 'Icon Rule', description: 'Small icon or symbol centered on a thin rule' },
    ],
  },
];
