import { GoogleGenerativeAI } from '@google/generative-ai';
import { PageSchema, QAPatch, QAPatchSchema, QAPatchItem } from '@/lib/catalog/schemas';
import type { ResolvedDesignTokens } from '@/lib/design/types';
import { screenshotHtml } from '@/lib/ingest/screenshotHtml';
import { renderPageHtml } from '@/lib/render/renderHtml';
import { applyPatches } from './patch';
import { geminiCritiquePrompt } from '@/lib/llm/prompts';

export interface QAResult {
  html: string;
  schema: PageSchema;
  patches: QAPatchItem[];
  critique: string;
  iterated: boolean;
}

/**
 * Runs a visual QA loop:
 * 1. Screenshot the rendered HTML
 * 2. Send to Gemini for critique
 * 3. Parse patches
 * 4. Apply patches to schema
 * 5. Re-render HTML
 *
 * Bounded to maxIterations (default 1).
 */
export async function runQALoop(
  html: string,
  schema: PageSchema,
  resolvedTokens: ResolvedDesignTokens,
  maxIterations: number = 1
): Promise<QAResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { html, schema, patches: [], critique: 'Gemini API key not set — QA skipped.', iterated: false };
  }

  let currentHtml = html;
  let currentSchema = schema;
  const allPatches: QAPatchItem[] = [];
  let critique = '';

  for (let i = 0; i < maxIterations; i++) {
    try {
      // 1. Screenshot the current HTML
      const screenshot = await screenshotHtml(currentHtml);

      // 2. Send to Gemini for critique
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const result = await model.generateContent([
        { text: geminiCritiquePrompt() },
        {
          inlineData: {
            mimeType: 'image/png',
            data: screenshot,
          },
        },
      ]);

      const text = result.response.text();
      const parsed = QAPatchSchema.parse(JSON.parse(text));

      critique = parsed.overallNote;

      // 3. If no patches, design is good
      if (parsed.patches.length === 0) {
        return { html: currentHtml, schema: currentSchema, patches: allPatches, critique, iterated: i > 0 };
      }

      // 4. Apply patches
      const { schema: patched, appliedCount } = applyPatches(currentSchema, parsed.patches);

      if (appliedCount === 0) {
        return { html: currentHtml, schema: currentSchema, patches: allPatches, critique, iterated: i > 0 };
      }

      allPatches.push(...parsed.patches.slice(0, appliedCount));
      currentSchema = patched;

      // 5. Re-render
      currentHtml = renderPageHtml(currentSchema, resolvedTokens);
    } catch (error) {
      console.error('QA loop iteration failed:', error);
      critique = `QA iteration ${i + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      break;
    }
  }

  return {
    html: currentHtml,
    schema: currentSchema,
    patches: allPatches,
    critique,
    iterated: allPatches.length > 0,
  };
}
