import { PageSchema, PageSchemaV2, Block, FinalPageSchema, BlockSchema, LayoutDNA, NoveltyLocks } from '@/lib/catalog/schemas';
import { validatePageSchemaV2, validatePageSchema } from './validate';
import { repairSchema, repairSchemaV3, flattenBlocks } from '@/lib/llm/claude';
import { getStyle } from '@/lib/design/loadStyleLibrary';
import { DESIGN_PRESETS } from '@/lib/design/presets';
import { FONT_PAIRINGS } from '@/lib/design/fonts';
import { BLOCK_CATALOG } from '@/lib/catalog/blocks';
import { isValidHex } from '@/lib/design/colorUtils';
import { ensureDiversity } from '@/lib/design/diversify';
import { createSkeletonBlock } from '@/lib/catalog/skeletons';

const VALID_PRESET_IDS = new Set(DESIGN_PRESETS.map((p) => p.id));
const VALID_FONT_IDS = new Set(FONT_PAIRINGS.map((f) => f.id));
const DEFAULT_VARIANTS: Record<string, string> = {};
for (const b of BLOCK_CATALOG) {
  DEFAULT_VARIANTS[b.type] = b.variants[0]?.id ?? '';
}

const VALID_VARIANTS: Record<string, Set<string>> = {};
for (const b of BLOCK_CATALOG) {
  VALID_VARIANTS[b.type] = new Set(b.variants.map((v) => v.id));
}

function deterministicFix(raw: Record<string, unknown>): Record<string, unknown> {
  const fixed = { ...raw };

  // Fix missing signature
  if (!fixed.signature || typeof fixed.signature !== 'string') {
    fixed.signature = 'monoMinimal';
  }

  // Fix invalid presetId
  if (typeof fixed.presetId !== 'string' || !VALID_PRESET_IDS.has(fixed.presetId)) {
    fixed.presetId = 'corporate-blue';
  }

  // Fix invalid fontPairingId
  if (fixed.fontPairingId && (typeof fixed.fontPairingId !== 'string' || !VALID_FONT_IDS.has(fixed.fontPairingId))) {
    delete fixed.fontPairingId;
  }

  // Fix invalid hex in tokenTweaks
  if (fixed.tokenTweaks && typeof fixed.tokenTweaks === 'object') {
    const tweaks = { ...(fixed.tokenTweaks as Record<string, unknown>) };
    for (const [key, value] of Object.entries(tweaks)) {
      if (typeof value === 'string' && !isValidHex(value)) {
        delete tweaks[key];
      }
    }
    fixed.tokenTweaks = tweaks;
  }

  // Fix blocks
  if (Array.isArray(fixed.blocks)) {
    const blocks = fixed.blocks.map((block: Record<string, unknown>) => {
      if (!block || typeof block !== 'object') return block;
      const b = { ...block };

      // Fix missing/invalid variant
      if (typeof b.type === 'string' && DEFAULT_VARIANTS[b.type]) {
        if (!b.variant || typeof b.variant !== 'string') {
          b.variant = DEFAULT_VARIANTS[b.type];
        } else {
          // Validate variant exists for this block type
          const validSet = VALID_VARIANTS[b.type];
          if (validSet && !validSet.has(b.variant as string)) {
            b.variant = DEFAULT_VARIANTS[b.type];
          }
        }
      }

      return b;
    });

    // Ensure hero is first
    const heroIdx = blocks.findIndex((b: Record<string, unknown>) => b?.type === 'HeroSplit');
    if (heroIdx > 0) {
      const [hero] = blocks.splice(heroIdx, 1);
      blocks.unshift(hero);
    }

    // Ensure footer is last
    const footerIdx = blocks.findIndex((b: Record<string, unknown>) => b?.type === 'FooterSimple');
    if (footerIdx >= 0 && footerIdx < blocks.length - 1) {
      const [footer] = blocks.splice(footerIdx, 1);
      blocks.push(footer);
    }

    fixed.blocks = blocks;
  }

  return fixed;
}

export async function validateAndAutofixV2(
  rawSchema: unknown
): Promise<{ schema: PageSchemaV2; warnings: string[] }> {
  // Apply deterministic fixes first
  const fixed = deterministicFix(rawSchema as Record<string, unknown>);

  // First validation attempt
  let result = validatePageSchemaV2(fixed);

  if (result.valid && result.data) {
    // Apply diversity enforcement
    const { schema: diversified, changes } = ensureDiversity(result.data);
    if (changes.length > 0) {
      console.log('[autofix] Diversity changes:', changes);
      // Re-validate after diversification
      const reResult = validatePageSchemaV2(diversified);
      if (reResult.valid && reResult.data) {
        return {
          schema: reResult.data,
          warnings: [...result.warnings, ...changes.map((c) => `[diversity] ${c}`)],
        };
      }
      // If diversification broke validation, return original
      return { schema: result.data, warnings: [...result.warnings, 'Diversity changes failed validation'] };
    }
    return { schema: result.data, warnings: result.warnings };
  }

  // If invalid, try Claude repair (single attempt)
  console.log('[autofix] V2 schema validation failed, attempting repair...', result.errors);

  const repaired = await repairSchema(
    JSON.stringify(fixed, null, 2),
    result.errors
  );

  const reResult = validatePageSchemaV2({
    signature: (fixed as Record<string, unknown>).signature || 'monoMinimal',
    presetId: (fixed as Record<string, unknown>).presetId || 'corporate-blue',
    blocks: repaired.blocks,
  });

  if (reResult.valid && reResult.data) {
    const { schema: diversified, changes } = ensureDiversity(reResult.data);
    const allWarnings = [
      ...reResult.warnings,
      'Schema was auto-repaired by Claude.',
      ...changes.map((c) => `[diversity] ${c}`),
    ];
    // Re-validate after diversity
    const finalResult = validatePageSchemaV2(diversified);
    if (finalResult.valid && finalResult.data) {
      return { schema: finalResult.data, warnings: allWarnings };
    }
    return { schema: reResult.data, warnings: [...reResult.warnings, 'Schema was auto-repaired by Claude.'] };
  }

  throw new Error(
    `V2 schema validation failed after repair attempt. Errors: ${reResult.errors.join('; ')}`
  );
}

// Legacy autofix for PageSchema (backward compat)
export async function validateAndAutofix(
  rawSchema: unknown
): Promise<{ schema: PageSchema; warnings: string[] }> {
  let result = validatePageSchema(rawSchema);

  if (result.valid && result.data) {
    return { schema: result.data, warnings: result.warnings };
  }

  console.log('Schema validation failed, attempting repair...', result.errors);

  const repaired = await repairSchema(
    JSON.stringify(rawSchema, null, 2),
    result.errors
  );

  result = validatePageSchema(repaired);

  if (result.valid && result.data) {
    return {
      schema: result.data,
      warnings: [...result.warnings, 'Schema was auto-repaired by Claude.'],
    };
  }

  throw new Error(
    `Schema validation failed after repair attempt. Errors: ${result.errors.join('; ')}`
  );
}

/**
 * Validates and autofixes a FinalPageSchema from the V3 pipeline.
 * 1. Flatten {type, variant, props} → {type, variant, ...props}
 * 2. Validate styleId exists in the style library
 * 3. Validate each block type/variant against BLOCK_CATALOG
 * 4. Run block-level deterministic fixes (variant fallback, hero first, footer last)
 * 5. Validate each flattened block with Zod (BlockSchema)
 * 6. If invalid → single Claude repair pass
 * 7. Return flattened blocks + warnings
 */
export async function validateAndAutofixV3(
  raw: FinalPageSchema,
  styleId: string,
): Promise<{ blocks: Block[]; warnings: string[] }> {
  const warnings: string[] = [];

  // 1. Validate styleId
  const style = getStyle(styleId);
  if (!style) {
    warnings.push(`Unknown styleId "${styleId}", proceeding anyway`);
  }

  // 2. Flatten blocks: {type, variant, props} → {type, variant, ...props}
  let flatBlocks: Record<string, unknown>[] = raw.blocks.map((b) => ({
    type: b.type,
    variant: b.variant,
    ...b.props,
  }));

  // 3. Block-level deterministic fixes
  flatBlocks = flatBlocks.map((block) => {
    const b = { ...block };
    const bType = b.type as string;

    // Fix missing/invalid variant
    if (DEFAULT_VARIANTS[bType]) {
      if (!b.variant || typeof b.variant !== 'string') {
        b.variant = DEFAULT_VARIANTS[bType];
        warnings.push(`Fixed missing variant for ${bType}`);
      } else {
        const validSet = VALID_VARIANTS[bType];
        if (validSet && !validSet.has(b.variant as string)) {
          warnings.push(`Invalid variant "${b.variant}" for ${bType}, using default`);
          b.variant = DEFAULT_VARIANTS[bType];
        }
      }
    }

    return b;
  });

  // 4. Ensure hero is first, footer is last
  const HERO_TYPES = new Set(['HeroSplit', 'HeroTerminal', 'HeroChart']);
  const heroIdx = flatBlocks.findIndex((b) => HERO_TYPES.has(b.type as string));
  if (heroIdx > 0) {
    const [hero] = flatBlocks.splice(heroIdx, 1);
    flatBlocks.unshift(hero);
    warnings.push(`Moved ${hero.type} to first position`);
  }
  const footerIdx = flatBlocks.findIndex((b) => b.type === 'FooterSimple');
  if (footerIdx >= 0 && footerIdx < flatBlocks.length - 1) {
    const [footer] = flatBlocks.splice(footerIdx, 1);
    flatBlocks.push(footer);
    warnings.push('Moved FooterSimple to last position');
  }

  // 5. Try parsing each block with Zod
  const parsedBlocks: Block[] = [];
  let parseErrors: string[] = [];

  for (let i = 0; i < flatBlocks.length; i++) {
    const result = BlockSchema.safeParse(flatBlocks[i]);
    if (result.success) {
      parsedBlocks.push(result.data);
    } else {
      const errMsg = result.error.issues.map((iss) => `block[${i}].${iss.path.join('.')}: ${iss.message}`).join('; ');
      parseErrors.push(errMsg);
    }
  }

  // If all blocks parsed, we're done
  if (parseErrors.length === 0 && parsedBlocks.length === flatBlocks.length) {
    return { blocks: parsedBlocks, warnings };
  }

  // 6. If some blocks failed, attempt Claude repair (single pass)
  warnings.push(`${parseErrors.length} block(s) failed validation, attempting repair`);
  console.log('[autofixV3] Block validation errors:', parseErrors);

  try {
    const repaired = await repairSchemaV3(
      JSON.stringify(raw, null, 2),
      parseErrors,
    );

    // Flatten the repaired blocks
    const repairedFlat = repaired.blocks.map((b) => ({
      type: b.type,
      variant: b.variant,
      ...b.props,
    }));

    const repairedParsed: Block[] = [];
    for (const block of repairedFlat) {
      const result = BlockSchema.safeParse(block);
      if (result.success) {
        repairedParsed.push(result.data);
      }
    }

    if (repairedParsed.length >= 3) {
      warnings.push('Schema was auto-repaired by Claude V3');
      return { blocks: repairedParsed, warnings };
    }
  } catch (err) {
    warnings.push(`Repair failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 7. Fallback: return whatever blocks parsed successfully
  if (parsedBlocks.length >= 3) {
    warnings.push('Using partially valid blocks after repair failure');
    return { blocks: parsedBlocks, warnings };
  }

  throw new Error(
    `V3 schema validation failed: only ${parsedBlocks.length} blocks valid. Errors: ${parseErrors.join('; ')}`
  );
}

/**
 * Compute novelty locks from validated blocks and an optional DNA constraint.
 * These locks prevent QA from reverting intentional structural choices.
 */
export function computeNoveltyLocks(blocks: Block[], dna?: LayoutDNA): NoveltyLocks {
  const heroBlock = blocks[0] as Record<string, unknown> | undefined;

  return {
    heroTypeLocked: (heroBlock?.type as string) || 'HeroSplit',
    heroVariantLocked: (heroBlock?.variant as string) || 'split-left',
    requiredBlockTypes: dna?.requiredBlocks || [],
    lockedVariants: [
      // Always lock the hero variant (index 0)
      { blockIndex: 0, variant: (heroBlock?.variant as string) || 'split-left' },
      // Lock any DNA-required block variants
      ...blocks
        .map((b, i) => ({ blockIndex: i, variant: (b as Record<string, unknown>).variant as string }))
        .filter((entry) => {
          if (entry.blockIndex === 0) return false; // already locked above
          if (!dna) return false;
          const block = blocks[entry.blockIndex] as Record<string, unknown>;
          return dna.requiredBlocks.includes(block.type as string);
        }),
    ],
    lockedSectionOrder: dna?.sectionOrder,
  };
}

// ---------------------------------------------------------------------------
// Blueprint Compliance Enforcement
// ---------------------------------------------------------------------------
// Deterministically repairs Claude's output to match the DNA blueprint.
// Called AFTER validateAndAutofixV3() and BEFORE rendering.

const HERO_TYPES = new Set(['HeroSplit', 'HeroTerminal', 'HeroChart']);

export function enforceBlueprintCompliance(
  blocks: Block[],
  dna: LayoutDNA,
): { blocks: Block[]; repairs: string[] } {
  const repairs: string[] = [];
  let result = [...blocks];

  // ── Step 1: Hero check ───────────────────────────────────────────────
  const heroIdx = result.findIndex((b) =>
    HERO_TYPES.has((b as Record<string, unknown>).type as string)
  );

  if (heroIdx >= 0) {
    const hero = result[heroIdx] as Record<string, unknown>;

    if (hero.type !== dna.heroType) {
      // Types are incompatible — replace with skeleton, preserving shared props
      const skeleton = createSkeletonBlock(dna.heroType, dna.heroVariant);
      if (skeleton) {
        if (hero.headline) skeleton.headline = hero.headline;
        if (hero.subheadline) skeleton.subheadline = hero.subheadline;
        if (hero.ctaText) skeleton.ctaText = hero.ctaText;
        if (hero.ctaHref) skeleton.ctaHref = hero.ctaHref;
        result[heroIdx] = skeleton as Block;
        repairs.push(`[blueprint] Replaced hero ${hero.type} → ${dna.heroType}(${dna.heroVariant})`);
      }
    } else if (hero.variant !== dna.heroVariant) {
      hero.variant = dna.heroVariant;
      repairs.push(`[blueprint] Hero variant → ${dna.heroVariant}`);
    }

    // Move hero to position 0 if needed
    if (heroIdx > 0) {
      const [h] = result.splice(heroIdx, 1);
      result.unshift(h);
      repairs.push(`[blueprint] Moved hero from index ${heroIdx} to 0`);
    }
  } else {
    // No hero at all — insert skeleton
    const skeleton = createSkeletonBlock(dna.heroType, dna.heroVariant);
    if (skeleton) {
      result.unshift(skeleton as Block);
      repairs.push(`[blueprint] Inserted missing hero ${dna.heroType}(${dna.heroVariant})`);
    }
  }

  // ── Step 2: Remove forbidden blocks ──────────────────────────────────
  const forbiddenSet = new Set(dna.forbiddenBlocks);
  result = result.filter((b) => {
    const bType = (b as Record<string, unknown>).type as string;
    if (forbiddenSet.has(bType)) {
      repairs.push(`[blueprint] Removed forbidden block "${bType}"`);
      return false;
    }
    return true;
  });

  // ── Step 3: Insert missing required blocks ───────────────────────────
  const presentTypes = new Set(
    result.map((b) => (b as Record<string, unknown>).type as string)
  );
  for (const required of dna.requiredBlocks) {
    if (!presentTypes.has(required)) {
      const defaultVariant = DEFAULT_VARIANTS[required] || '';
      const skeleton = createSkeletonBlock(required, defaultVariant);
      if (skeleton) {
        result.push(skeleton as Block); // appended; ordering is handled in step 4
        repairs.push(`[blueprint] Inserted missing required block "${required}"`);
        presentTypes.add(required);
      }
    }
  }

  // ── Step 4: Order enforcement ────────────────────────────────────────
  // Separate blocks into spine (in sectionOrder) and optional
  const sectionOrderSet = new Set(dna.sectionOrder);
  const spineBlocks: Block[] = [];
  const optionalBlocks: Block[] = [];

  // Track original positions for optional block interleaving
  const originalPositions = new Map<Block, number>();
  result.forEach((b, i) => originalPositions.set(b, i));

  for (const block of result) {
    const bType = (block as Record<string, unknown>).type as string;
    if (sectionOrderSet.has(bType)) {
      spineBlocks.push(block);
    } else {
      optionalBlocks.push(block);
    }
  }

  // Sort spine blocks by sectionOrder index
  spineBlocks.sort((a, b) => {
    const aType = (a as Record<string, unknown>).type as string;
    const bType = (b as Record<string, unknown>).type as string;
    return dna.sectionOrder.indexOf(aType) - dna.sectionOrder.indexOf(bType);
  });

  // Sort optional blocks by original position (preserve relative order)
  optionalBlocks.sort(
    (a, b) => (originalPositions.get(a) ?? 0) - (originalPositions.get(b) ?? 0)
  );

  // Interleave: place optional blocks between spine blocks based on original position
  const reordered: Block[] = [];
  let optIdx = 0;

  for (let ri = 0; ri < spineBlocks.length; ri++) {
    reordered.push(spineBlocks[ri]);

    const currentSpineOrigPos = originalPositions.get(spineBlocks[ri]) ?? 0;
    const nextSpineOrigPos =
      ri + 1 < spineBlocks.length
        ? (originalPositions.get(spineBlocks[ri + 1]) ?? Infinity)
        : Infinity;

    while (optIdx < optionalBlocks.length) {
      const optOrigPos = originalPositions.get(optionalBlocks[optIdx]) ?? 0;
      if (optOrigPos > currentSpineOrigPos && optOrigPos < nextSpineOrigPos) {
        reordered.push(optionalBlocks[optIdx]);
        optIdx++;
      } else {
        break;
      }
    }
  }

  // Append any remaining optional blocks before CTA/Footer
  while (optIdx < optionalBlocks.length) {
    reordered.push(optionalBlocks[optIdx]);
    optIdx++;
  }

  // Safety: ensure hero first, footer last
  const finalHeroIdx = reordered.findIndex((b) =>
    HERO_TYPES.has((b as Record<string, unknown>).type as string)
  );
  if (finalHeroIdx > 0) {
    const [h] = reordered.splice(finalHeroIdx, 1);
    reordered.unshift(h);
  }
  const finalFooterIdx = reordered.findIndex(
    (b) => (b as Record<string, unknown>).type === 'FooterSimple'
  );
  if (finalFooterIdx >= 0 && finalFooterIdx < reordered.length - 1) {
    const [f] = reordered.splice(finalFooterIdx, 1);
    reordered.push(f);
  }

  // Check if order changed
  const originalOrder = result.map((b) => (b as Record<string, unknown>).type).join(',');
  const newOrder = reordered.map((b) => (b as Record<string, unknown>).type).join(',');
  if (originalOrder !== newOrder) {
    repairs.push(`[blueprint] Reordered blocks to match sectionOrder`);
  }

  result = reordered;

  // ── Step 5: Block count check ────────────────────────────────────────
  if (result.length < dna.blockCount.min) {
    repairs.push(`[blueprint] Warning: ${result.length} blocks < minimum ${dna.blockCount.min}`);
  }
  if (result.length > dna.blockCount.max) {
    const requiredTypeSet = new Set(dna.requiredBlocks);
    const keepTypes = new Set([...HERO_TYPES, 'CTASection', 'FooterSimple']);

    while (result.length > dna.blockCount.max) {
      // Find the last optional (trimmable) block
      let trimIdx = -1;
      for (let i = result.length - 1; i >= 0; i--) {
        const bType = (result[i] as Record<string, unknown>).type as string;
        if (!keepTypes.has(bType) && !requiredTypeSet.has(bType)) {
          trimIdx = i;
          break;
        }
      }
      if (trimIdx < 0) break;
      const removed = result.splice(trimIdx, 1)[0];
      repairs.push(
        `[blueprint] Trimmed optional block "${(removed as Record<string, unknown>).type}" (exceeded max ${dna.blockCount.max})`
      );
    }
  }

  return { blocks: result, repairs };
}
