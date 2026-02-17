import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { captureScreenshots } from '@/lib/ingest/screenshot';
import { extractContent } from '@/lib/ingest/extract';
import { analyzeDesign } from '@/lib/llm/gemini';
import { generateBlockSchema } from '@/lib/llm/claude';
import { generateLayoutPlan } from '@/lib/llm/layoutPlan';
import { validateAndAutofixV2 } from '@/lib/rules/autofix';
import { generateAssets } from '@/lib/llm/recraft';
import { renderPageHtml } from '@/lib/render/renderHtml';
import { resolveTokens } from '@/lib/design/presets';
import { computeDesignScore } from '@/lib/design/score';
import { runQALoop } from '@/lib/qa/qaLoop';

export const runtime = 'nodejs';
export const maxDuration = 300;

const RequestSchema = z.object({
  url: z.string().url().refine((u) => u.startsWith('https://'), {
    message: 'Only HTTPS URLs are supported',
  }),
  withIllustrations: z.boolean().default(false),
  withQA: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = RequestSchema.parse(body);

    // Step A: Ingest (parallel — screenshots + content extraction)
    const [screenshots, content] = await Promise.all([
      captureScreenshots(input.url),
      extractContent(input.url),
    ]);

    // Step B: Gemini Vision — design direction analysis
    const direction = await analyzeDesign(
      screenshots.desktop,
      screenshots.mobile,
      {
        title: content.title,
        description: content.description,
        brandName: content.brandName,
      }
    );

    // Step B2: Layout Plan — Gemini picks preset, fonts, block order+variants
    const layoutPlan = await generateLayoutPlan(direction, content);

    // Step C: Claude — fills content into layout plan → PageSchemaV2
    const rawSchema = await generateBlockSchema(layoutPlan, content);

    // Step D: Validate + Autofix (enhanced with deterministic fixes)
    const { schema: validatedV2, warnings } = await validateAndAutofixV2(rawSchema);

    // Step D2: Resolve tokens from preset
    const resolvedTokens = resolveTokens(
      validatedV2.presetId,
      validatedV2.tokenTweaks,
      validatedV2.fontPairingId
    );
    resolvedTokens.brandName = content.brandName;

    // Build the legacy PageSchema for rendering
    const pageSchema = {
      tokens: {
        brandName: content.brandName,
        primaryColor: resolvedTokens.palette.primary,
        secondaryColor: resolvedTokens.palette.secondary,
        accentColor: resolvedTokens.palette.accent,
        headingFont: resolvedTokens.typography.headingFont,
        bodyFont: resolvedTokens.typography.bodyFont,
      },
      blocks: validatedV2.blocks,
    };

    // Step D3: Score
    const score = computeDesignScore(pageSchema, resolvedTokens);

    // Step E: Optional Recraft illustrations
    if (input.withIllustrations) {
      const valueBlock = pageSchema.blocks.find((b) => b.type === 'ValueProps3');
      const iconSubjects = valueBlock && valueBlock.type === 'ValueProps3'
        ? valueBlock.items.map((item) => item.title)
        : [];

      const assets = await generateAssets(
        content.brandName,
        direction.mood,
        direction.siteType,
        iconSubjects
      );

      // Inject hero image
      if (assets.heroImage) {
        const heroBlock = pageSchema.blocks.find((b) => b.type === 'HeroSplit');
        if (heroBlock && heroBlock.type === 'HeroSplit') {
          (heroBlock as { imageUrl?: string }).imageUrl = assets.heroImage;
          (heroBlock as { imageAlt?: string }).imageAlt = `${content.brandName} hero illustration`;
        }
      }

      // Inject feature icons into ValueProps3
      if (assets.icons.length > 0 && valueBlock && valueBlock.type === 'ValueProps3') {
        valueBlock.items.forEach((item, i) => {
          if (assets.icons[i]) {
            item.icon = assets.icons[i];
          }
        });
      }
    }

    // Step F: Render deterministic HTML
    let html = renderPageHtml(pageSchema, resolvedTokens);

    // Step G: Optional QA loop (if toggle ON and score < 75)
    let qaResult = undefined;
    if (input.withQA && score.total < 75) {
      const qa = await runQALoop(html, pageSchema, resolvedTokens, 1);
      if (qa.iterated) {
        html = qa.html;
        qaResult = {
          patches: qa.patches,
          critique: qa.critique,
        };
      } else {
        qaResult = {
          patches: [],
          critique: qa.critique,
        };
      }
    }

    return NextResponse.json({
      html,
      schema: pageSchema,
      direction,
      layoutPlan,
      score,
      qaResult,
      warnings,
    });
  } catch (error) {
    console.error('Redesign pipeline error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
