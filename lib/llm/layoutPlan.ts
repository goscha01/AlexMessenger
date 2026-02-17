import { GoogleGenerativeAI } from '@google/generative-ai';
import { LayoutPlan, LayoutPlanSchema, DesignDirectionBrief, ExtractedContent } from '@/lib/catalog/schemas';
import { BLOCK_CATALOG, BlockMeta } from '@/lib/catalog/blocks';
import { DESIGN_PRESETS } from '@/lib/design/presets';
import { FONT_PAIRINGS } from '@/lib/design/fonts';
import { layoutPlanPrompt } from './prompts';

export async function generateLayoutPlan(
  direction: DesignDirectionBrief,
  content: ExtractedContent
): Promise<LayoutPlan> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const prompt = layoutPlanPrompt(direction, content, DESIGN_PRESETS, FONT_PAIRINGS, BLOCK_CATALOG);

  const result = await model.generateContent([{ text: prompt }]);
  const text = result.response.text();
  const json = JSON.parse(text);

  return LayoutPlanSchema.parse(json);
}
