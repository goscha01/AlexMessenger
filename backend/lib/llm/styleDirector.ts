import { GoogleGenerativeAI } from '@google/generative-ai';
import { StyleSpec, StyleSpecSchema, GeminiObservations } from '@/lib/catalog/schemas';
import { DESIGN_PRESETS } from '@/lib/design/presets';
import { FONT_PAIRINGS } from '@/lib/design/fonts';
import { SIGNATURES, SIGNATURE_IDS } from '@/lib/design/signatures';
import { styleDirectorPrompt } from './prompts';

export async function generateStyleSpec(
  observations: GeminiObservations,
): Promise<StyleSpec> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.5,
    },
  });

  // Build signature descriptions for the prompt
  const signatureDescriptions = SIGNATURE_IDS.map((id) => ({
    id,
    name: SIGNATURES[id].name,
    description: `${SIGNATURES[id].accentStyle} style, ${SIGNATURES[id].spacingScale > 1.5 ? 'generous' : 'compact'} spacing, ${SIGNATURES[id].borderStyle === 'none' ? 'no borders' : SIGNATURES[id].borderStyle}`,
  }));

  const prompt = styleDirectorPrompt(
    JSON.stringify(observations, null, 2),
    signatureDescriptions,
    DESIGN_PRESETS,
    FONT_PAIRINGS
  );

  const result = await model.generateContent([{ text: prompt }]);
  const text = result.response.text();
  const json = JSON.parse(text);

  return StyleSpecSchema.parse(json);
}
