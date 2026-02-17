import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiObservations, GeminiObservationsSchema } from '@/lib/catalog/schemas';
import { geminiObservationsPrompt } from './prompts';

export async function observeDesign(
  desktopScreenshot: string,
  mobileScreenshot: string,
  context: { title: string; description: string; brandName: string }
): Promise<GeminiObservations> {
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

  const result = await model.generateContent([
    { text: geminiObservationsPrompt(context) },
    {
      inlineData: {
        mimeType: 'image/png',
        data: desktopScreenshot,
      },
    },
    {
      inlineData: {
        mimeType: 'image/png',
        data: mobileScreenshot,
      },
    },
  ]);

  const text = result.response.text();
  let json = JSON.parse(text);
  if (Array.isArray(json)) json = json[0];
  return GeminiObservationsSchema.parse(json);
}

// Legacy alias
export const analyzeDesign = observeDesign;
