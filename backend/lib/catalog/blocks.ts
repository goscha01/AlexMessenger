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
];
