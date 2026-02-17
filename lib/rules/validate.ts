import {
  PageSchemaOutput, PageSchema, PageSchemaV2Output, PageSchemaV2,
  BlockTypeEnum,
} from '@/lib/catalog/schemas';
import { BLOCK_CATALOG } from '@/lib/catalog/blocks';
import { DESIGN_PRESETS } from '@/lib/design/presets';
import { FONT_PAIRINGS } from '@/lib/design/fonts';
import { contrastRatio } from '@/lib/design/colorUtils';

export interface ValidationResult {
  valid: boolean;
  data?: PageSchema;
  errors: string[];
  warnings: string[];
}

export interface ValidationResultV2 {
  valid: boolean;
  data?: PageSchemaV2;
  errors: string[];
  warnings: string[];
}

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

// Validate a PageSchemaV2 (preset-based, from Claude)
export function validatePageSchemaV2(raw: unknown): ValidationResultV2 {
  const result = PageSchemaV2Output.safeParse(raw);

  if (result.success) {
    const warnings = runGuardrailsV2(result.data);
    return { valid: true, data: result.data, errors: [], warnings };
  }

  return {
    valid: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
    warnings: [],
  };
}

// Legacy validate for PageSchema (with tokens — used by repair)
export function validatePageSchema(raw: unknown): ValidationResult {
  const result = PageSchemaOutput.safeParse(raw);

  if (result.success) {
    const warnings = runGuardrails(result.data);
    return { valid: true, data: result.data, errors: [], warnings };
  }

  return {
    valid: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
    warnings: [],
  };
}

// Valid variant IDs per block type
const VALID_VARIANTS: Record<string, string[]> = {};
for (const b of BLOCK_CATALOG) {
  VALID_VARIANTS[b.type] = b.variants.map((v) => v.id);
}

const VALID_PRESET_IDS = new Set(DESIGN_PRESETS.map((p) => p.id));
const VALID_FONT_IDS = new Set(FONT_PAIRINGS.map((f) => f.id));

function runGuardrailsV2(schema: PageSchemaV2): string[] {
  const warnings: string[] = [];

  // Validate preset exists
  if (!VALID_PRESET_IDS.has(schema.presetId)) {
    warnings.push(`Unknown presetId "${schema.presetId}" — will fall back to corporate-blue.`);
  }

  // Validate font pairing exists
  if (schema.fontPairingId && !VALID_FONT_IDS.has(schema.fontPairingId)) {
    warnings.push(`Unknown fontPairingId "${schema.fontPairingId}" — will use preset default.`);
  }

  // Validate token tweaks are valid hex
  if (schema.tokenTweaks) {
    for (const [key, value] of Object.entries(schema.tokenTweaks)) {
      if (value && !HEX_REGEX.test(value)) {
        warnings.push(`Invalid hex in tokenTweaks.${key}: "${value}".`);
      }
    }
  }

  // Validate variants per block
  for (let i = 0; i < schema.blocks.length; i++) {
    const block = schema.blocks[i];
    const validVariants = VALID_VARIANTS[block.type];
    if (validVariants && 'variant' in block) {
      const variant = (block as Record<string, unknown>).variant as string;
      if (!validVariants.includes(variant)) {
        warnings.push(`Block[${i}] ${block.type}: unknown variant "${variant}" — will use default.`);
      }
    }
  }

  // Must have a hero block
  if (!schema.blocks.some((b) => b.type === 'HeroSplit')) {
    warnings.push('No HeroSplit block found — consider adding one as the first section.');
  }

  // Hero should be first
  if (schema.blocks[0]?.type !== 'HeroSplit') {
    warnings.push('HeroSplit is not the first block.');
  }

  // Should end with footer
  const lastBlock = schema.blocks[schema.blocks.length - 1];
  if (lastBlock?.type !== 'FooterSimple') {
    warnings.push('Page does not end with FooterSimple block.');
  }

  // Check for duplicate hero blocks
  const heroCount = schema.blocks.filter((b) => b.type === 'HeroSplit').length;
  if (heroCount > 1) {
    warnings.push(`Found ${heroCount} HeroSplit blocks — typically only 1 is needed.`);
  }

  // Check for excessive CTA sections
  const ctaCount = schema.blocks.filter((b) => b.type === 'CTASection').length;
  if (ctaCount > 2) {
    warnings.push(`Found ${ctaCount} CTASection blocks — consider reducing to 1-2.`);
  }

  return warnings;
}

function runGuardrails(schema: PageSchema): string[] {
  const warnings: string[] = [];

  // Must have a hero block
  if (!schema.blocks.some((b) => b.type === 'HeroSplit')) {
    warnings.push('No HeroSplit block found — consider adding one as the first section.');
  }

  // Should end with footer
  const lastBlock = schema.blocks[schema.blocks.length - 1];
  if (lastBlock?.type !== 'FooterSimple') {
    warnings.push('Page does not end with FooterSimple block.');
  }

  // Validate hex colors
  const { primaryColor, secondaryColor, accentColor } = schema.tokens;
  if (!HEX_REGEX.test(primaryColor)) {
    warnings.push(`Invalid primaryColor hex: "${primaryColor}". Expected format: #RRGGBB.`);
  }
  if (!HEX_REGEX.test(secondaryColor)) {
    warnings.push(`Invalid secondaryColor hex: "${secondaryColor}".`);
  }
  if (!HEX_REGEX.test(accentColor)) {
    warnings.push(`Invalid accentColor hex: "${accentColor}".`);
  }

  // Check contrast
  if (HEX_REGEX.test(primaryColor)) {
    const ratio = contrastRatio(primaryColor, '#FFFFFF');
    if (ratio < 4.5) {
      warnings.push(`Primary color ${primaryColor} has low contrast on white (${ratio.toFixed(1)}:1).`);
    }
  }

  // Check for reasonable block count
  if (schema.blocks.length < 3) {
    warnings.push('Page has fewer than 3 blocks — may look sparse.');
  }

  // Check for duplicate hero blocks
  const heroCount = schema.blocks.filter((b) => b.type === 'HeroSplit').length;
  if (heroCount > 1) {
    warnings.push(`Found ${heroCount} HeroSplit blocks — typically only 1 is needed.`);
  }

  // Check for excessive CTA sections
  const ctaCount = schema.blocks.filter((b) => b.type === 'CTASection').length;
  if (ctaCount > 2) {
    warnings.push(`Found ${ctaCount} CTASection blocks — consider reducing to 1-2.`);
  }

  return warnings;
}
