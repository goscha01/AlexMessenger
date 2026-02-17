import { PageSchema, PageSchemaOutput, QAPatchItem } from '@/lib/catalog/schemas';

/**
 * Applies QA patches to a page schema.
 * Deep clones, applies each patch, re-validates.
 * Returns the patched schema or original if patching breaks validation.
 */
export function applyPatches(
  schema: PageSchema,
  patches: QAPatchItem[]
): { schema: PageSchema; appliedCount: number } {
  if (patches.length === 0) {
    return { schema, appliedCount: 0 };
  }

  // Deep clone
  const cloned = JSON.parse(JSON.stringify(schema)) as PageSchema;
  let appliedCount = 0;

  for (const patch of patches) {
    if (patch.blockIndex < 0 || patch.blockIndex >= cloned.blocks.length) {
      continue; // skip invalid index
    }

    const block = cloned.blocks[patch.blockIndex] as Record<string, unknown>;
    if (!(patch.field in block)) {
      continue; // skip if field doesn't exist on block
    }

    block[patch.field] = patch.newValue;
    appliedCount++;
  }

  // Re-validate the patched schema
  const result = PageSchemaOutput.safeParse(cloned);
  if (result.success) {
    return { schema: result.data, appliedCount };
  }

  // If patching broke validation, return original
  console.warn('QA patches broke schema validation, reverting:', result.error.issues);
  return { schema, appliedCount: 0 };
}
