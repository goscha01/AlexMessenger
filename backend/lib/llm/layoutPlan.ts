import { GoogleGenerativeAI } from '@google/generative-ai';
import { LayoutPlanV2, LayoutPlanV2Schema, StyleSpec, ExtractedContent } from '@/lib/catalog/schemas';
import { BLOCK_CATALOG } from '@/lib/catalog/blocks';
import { layoutPlanV2Prompt } from './prompts';

export async function generateLayoutPlan(
  styleSpec: StyleSpec,
  content: ExtractedContent
): Promise<LayoutPlanV2> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  });

  const prompt = layoutPlanV2Prompt(styleSpec, content, BLOCK_CATALOG);

  const result = await model.generateContent([{ text: prompt }]);
  const text = result.response.text();
  const json = JSON.parse(text);

  return LayoutPlanV2Schema.parse(json);
}
