import { PageSchema, PageSchemaOutput, QAPatchV2Item, NoveltyLocks } from '@/lib/catalog/schemas';
import { BLOCK_CATALOG } from '@/lib/catalog/blocks';

const DEFAULT_VARIANTS: Record<string, string> = {};
for (const b of BLOCK_CATALOG) {
  DEFAULT_VARIANTS[b.type] = b.variants[0]?.id ?? '';
}

export function applyPatches(
  schema: PageSchema,
  patches: QAPatchV2Item[],
  noveltyLocks?: NoveltyLocks,
): { schema: PageSchema; appliedCount: number; diff: string[] } {
  if (patches.length === 0) {
    return { schema, appliedCount: 0, diff: [] };
  }

  // Deep clone
  const cloned = JSON.parse(JSON.stringify(schema)) as PageSchema;
  let appliedCount = 0;
  const diff: string[] = [];

  // Sort patches by blockIndex descending for insert/remove to avoid index shifts
  const sorted = [...patches].sort((a, b) => {
    if (a.action === 'insert' || a.action === 'remove') return b.blockIndex - a.blockIndex;
    return 0;
  });

  for (const patch of sorted) {
    try {
      // --- Novelty lock enforcement ---
      if (noveltyLocks) {
        // Block swap-variant on hero (index 0) if hero is locked
        if (patch.action === 'swap-variant' && patch.blockIndex === 0) {
          diff.push(`[locked] swap-variant blocked on hero (locked: ${noveltyLocks.heroTypeLocked}/${noveltyLocks.heroVariantLocked})`);
          continue;
        }
        // Block swap-variant on any locked variant index
        if (patch.action === 'swap-variant') {
          const isLocked = noveltyLocks.lockedVariants.some(lv => lv.blockIndex === patch.blockIndex);
          if (isLocked) {
            diff.push(`[locked] swap-variant blocked on block[${patch.blockIndex}] (variant locked)`);
            continue;
          }
        }
        // Block remove on required block types
        if (patch.action === 'remove' && patch.blockIndex >= 0 && patch.blockIndex < cloned.blocks.length) {
          const targetType = cloned.blocks[patch.blockIndex].type;
          if (noveltyLocks.requiredBlockTypes.includes(targetType)) {
            diff.push(`[locked] remove blocked on block[${patch.blockIndex}] (${targetType} is required)`);
            continue;
          }
        }
      }

      switch (patch.action) {
        case 'modify': {
          if (patch.blockIndex < 0 || patch.blockIndex >= cloned.blocks.length) break;
          if (!patch.field || !patch.newValue) break;

          const block = cloned.blocks[patch.blockIndex] as Record<string, unknown>;
          if (!(patch.field in block)) break;

          const oldVal = String(block[patch.field]);
          block[patch.field] = patch.newValue;
          diff.push(`modify block[${patch.blockIndex}].${patch.field}: "${oldVal.slice(0, 30)}..." → "${patch.newValue.slice(0, 30)}..."`);
          appliedCount++;
          break;
        }

        case 'swap-variant': {
          if (patch.blockIndex < 0 || patch.blockIndex >= cloned.blocks.length) break;
          if (!patch.newVariant) break;

          const block = cloned.blocks[patch.blockIndex] as Record<string, unknown>;
          const oldVariant = block.variant;
          block.variant = patch.newVariant;
          diff.push(`swap-variant block[${patch.blockIndex}] (${block.type}): "${oldVariant}" → "${patch.newVariant}"`);
          appliedCount++;
          break;
        }

        case 'remove': {
          if (patch.blockIndex < 0 || patch.blockIndex >= cloned.blocks.length) break;
          const removed = cloned.blocks[patch.blockIndex];
          // Don't remove hero or footer
          if (removed.type === 'HeroSplit' || removed.type === 'HeroTerminal' || removed.type === 'HeroChart' || removed.type === 'FooterSimple') break;

          cloned.blocks.splice(patch.blockIndex, 1);
          diff.push(`remove block[${patch.blockIndex}] (${removed.type})`);
          appliedCount++;
          break;
        }

        case 'insert': {
          if (!patch.newBlockType) break;
          if (patch.blockIndex < 0 || patch.blockIndex > cloned.blocks.length) break;

          // Create a minimal placeholder block — the content will be from newValue or defaults
          const newBlock = createPlaceholderBlock(
            patch.newBlockType,
            patch.newVariant || DEFAULT_VARIANTS[patch.newBlockType] || '',
          );
          if (!newBlock) break;

          cloned.blocks.splice(patch.blockIndex, 0, newBlock as PageSchema['blocks'][number]);
          diff.push(`insert ${patch.newBlockType}(${patch.newVariant || 'default'}) at [${patch.blockIndex}]`);
          appliedCount++;
          break;
        }
      }
    } catch {
      // Skip individual patch failures
    }
  }

  // Re-validate the patched schema
  const result = PageSchemaOutput.safeParse(cloned);
  if (result.success) {
    return { schema: result.data, appliedCount, diff };
  }

  // If patching broke validation, return original
  console.warn('[patch] QA patches broke schema validation, reverting:', result.error.issues.slice(0, 3));
  return { schema, appliedCount: 0, diff: ['Patches reverted — broke validation'] };
}

function createPlaceholderBlock(type: string, variant: string): Record<string, unknown> | null {
  switch (type) {
    case 'StatsBand':
      return {
        type: 'StatsBand',
        variant: variant || 'accent',
        items: [
          { value: '500+', label: 'Clients' },
          { value: '99%', label: 'Satisfaction' },
          { value: '24/7', label: 'Support' },
        ],
      };
    case 'BentoGrid':
      return {
        type: 'BentoGrid',
        variant: variant || 'mixed',
        sectionTitle: 'Key Features',
        items: [
          { title: 'Feature 1', description: 'Description of feature 1', span: 'wide' },
          { title: 'Feature 2', description: 'Description of feature 2', span: 'normal' },
          { title: 'Feature 3', description: 'Description of feature 3', span: 'normal' },
        ],
      };
    case 'FeatureZigzag':
      return {
        type: 'FeatureZigzag',
        variant: variant || 'standard',
        sectionTitle: 'How It Works',
        items: [
          { title: 'Step 1', description: 'First step description' },
          { title: 'Step 2', description: 'Second step description' },
        ],
      };
    case 'ProcessTimeline':
      return {
        type: 'ProcessTimeline',
        variant: variant || 'horizontal',
        sectionTitle: 'Our Process',
        steps: [
          { title: 'Start', description: 'Begin the process' },
          { title: 'Execute', description: 'Carry out the plan' },
          { title: 'Deliver', description: 'See the results' },
        ],
      };
    default:
      return null;
  }
}
