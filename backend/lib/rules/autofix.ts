import { PageSchema, PageSchemaV2, Block } from '@/lib/catalog/schemas';
import { validatePageSchemaV2, validatePageSchema } from './validate';
import { repairSchema } from '@/lib/llm/claude';
import { DESIGN_PRESETS } from '@/lib/design/presets';
import { FONT_PAIRINGS } from '@/lib/design/fonts';
import { BLOCK_CATALOG } from '@/lib/catalog/blocks';
import { isValidHex } from '@/lib/design/colorUtils';
import { ensureDiversity } from '@/lib/design/diversify';

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
