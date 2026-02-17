import type { PageSchemaV2, Block } from '@/lib/catalog/schemas';

const DIVERSITY_BLOCKS = new Set(['BentoGrid', 'FeatureZigzag', 'StatsBand', 'ProcessTimeline']);

const DEFAULT_SEQUENCE = ['HeroSplit', 'ValueProps3', 'SocialProofRow', 'CTASection', 'FooterSimple'];

export function ensureDiversity(schema: PageSchemaV2): { schema: PageSchemaV2; changes: string[] } {
  const changes: string[] = [];
  let blocks = [...schema.blocks] as Record<string, unknown>[];

  const blockTypes = blocks.map((b) => b.type as string);
  const diversityCount = blockTypes.filter((t) => DIVERSITY_BLOCKS.has(t)).length;

  // If we already have 3+ diversity blocks, no changes needed
  if (diversityCount >= 3) {
    return { schema, changes: [] };
  }

  // Strategy: replace generic blocks with diverse alternatives
  let needed = 3 - diversityCount;

  // 1. Replace ServicesGrid(cards) → BentoGrid(mixed)
  if (needed > 0) {
    const sgIdx = blocks.findIndex(
      (b) => b.type === 'ServicesGrid' && (b.variant === 'cards' || !b.variant)
    );
    if (sgIdx >= 0) {
      const sg = blocks[sgIdx] as Record<string, unknown>;
      const services = (sg.services || []) as { title: string; description: string; icon?: string }[];
      blocks[sgIdx] = {
        type: 'BentoGrid',
        variant: 'mixed',
        sectionTitle: sg.sectionTitle || 'What We Offer',
        items: services.slice(0, 6).map((s, i) => ({
          title: s.title,
          description: s.description,
          icon: s.icon,
          span: i === 0 ? 'wide' : 'normal',
        })),
      };
      changes.push(`Replaced ServicesGrid[${sgIdx}] → BentoGrid(mixed)`);
      needed--;
    }
  }

  // 2. Replace ValueProps3(cards) → FeatureZigzag(standard)
  if (needed > 0) {
    const vpIdx = blocks.findIndex(
      (b) => b.type === 'ValueProps3' && (b.variant === 'cards' || !b.variant)
    );
    if (vpIdx >= 0) {
      const vp = blocks[vpIdx] as Record<string, unknown>;
      const items = (vp.items || []) as { icon: string; title: string; description: string }[];
      blocks[vpIdx] = {
        type: 'FeatureZigzag',
        variant: 'standard',
        sectionTitle: vp.sectionTitle || 'Why Choose Us',
        items: items.slice(0, 4).map((item) => ({
          title: item.title,
          description: item.description,
          icon: item.icon,
        })),
      };
      changes.push(`Replaced ValueProps3[${vpIdx}] → FeatureZigzag(standard)`);
      needed--;
    }
  }

  // 3. Insert StatsBand before CTA if none exists
  if (needed > 0) {
    const ctaIdx = blocks.findIndex((b) => b.type === 'CTASection');
    if (ctaIdx > 0) {
      const statsBand: Record<string, unknown> = {
        type: 'StatsBand',
        variant: 'accent',
        items: [
          { value: '500+', label: 'Clients Served' },
          { value: '99.9%', label: 'Uptime' },
          { value: '24/7', label: 'Support' },
          { value: '50+', label: 'Countries' },
        ],
      };
      blocks.splice(ctaIdx, 0, statsBand);
      changes.push(`Inserted StatsBand before CTASection[${ctaIdx}]`);
      needed--;
    }
  }

  // 4. Insert ProcessTimeline if still needed
  if (needed > 0) {
    const footerIdx = blocks.findIndex((b) => b.type === 'FooterSimple');
    const insertIdx = footerIdx > 0 ? footerIdx : blocks.length;
    const timeline: Record<string, unknown> = {
      type: 'ProcessTimeline',
      variant: 'horizontal',
      sectionTitle: 'How It Works',
      steps: [
        { title: 'Step 1', description: 'Get started by signing up' },
        { title: 'Step 2', description: 'Configure your preferences' },
        { title: 'Step 3', description: 'Launch and see results' },
      ],
    };
    blocks.splice(insertIdx, 0, timeline);
    changes.push(`Inserted ProcessTimeline before footer at [${insertIdx}]`);
    needed--;
  }

  // 5. Swap CTASection(gradient-bg) → CTASection(card-inset)
  const ctaGradient = blocks.findIndex(
    (b) => b.type === 'CTASection' && b.variant === 'gradient-bg'
  );
  if (ctaGradient >= 0) {
    blocks[ctaGradient] = { ...blocks[ctaGradient], variant: 'card-inset' };
    changes.push(`Swapped CTASection[${ctaGradient}] variant: gradient-bg → card-inset`);
  }

  // Enforce max block count
  if (blocks.length > 12) {
    blocks = blocks.slice(0, 12);
    changes.push('Trimmed blocks to max 12');
  }

  return {
    schema: { ...schema, blocks: blocks as PageSchemaV2['blocks'] },
    changes,
  };
}
