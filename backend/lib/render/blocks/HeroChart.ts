import { z } from 'zod';
import { HeroChartSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type HeroChartBlock = z.infer<typeof HeroChartSchema>;

export function renderHeroChart(block: HeroChartBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  switch (block.variant) {
    case 'bar-chart':
      return renderBarChart(block, palette, typography, borderRadius);
    case 'area-chart':
      return renderAreaChart(block, palette, typography, borderRadius);
    case 'line-chart':
    default:
      return renderLineChart(block, palette, typography, borderRadius);
  }
}

function buildTextBlock(
  block: HeroChartBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  return `
    <div class="flex-1">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6" style="color: ${palette.textPrimary}; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
        ${escapeHtml(block.headline)}
      </h1>
      <p class="text-lg lg:text-xl mb-8 max-w-xl" style="color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
        ${escapeHtml(block.subheadline)}
      </p>
      <a href="${escapeHtml(block.ctaHref)}"
         class="inline-block px-8 py-4 text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
         style="background-color: ${palette.accent}; border-radius: ${borderRadius};">
        ${escapeHtml(block.ctaText)}
      </a>
    </div>`;
}

function normalizeData(data: HeroChartBlock['chartData']): { label: string; value: number; norm: number }[] {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return data.map(d => ({
    label: d.label,
    value: d.value,
    norm: (d.value / maxVal) * 100,
  }));
}

function renderLineChart(
  block: HeroChartBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const data = normalizeData(block.chartData);
  const svgWidth = 400;
  const svgHeight = 250;
  const padX = 40;
  const padTop = 20;
  const padBottom = 40;
  const chartW = svgWidth - padX * 2;
  const chartH = svgHeight - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padTop + chartH - (d.norm / 100) * chartH;
    return { x, y, label: d.label };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const dots = points.map(p =>
    `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${palette.accent}" />`
  ).join('');

  const labels = points.map(p =>
    `<text x="${p.x}" y="${svgHeight - 10}" text-anchor="middle" fill="${palette.textSecondary}" font-size="11" font-family="'${typography.bodyFont}', sans-serif">${escapeHtml(p.label)}</text>`
  ).join('');

  const svgHtml = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" style="max-width: 400px; max-height: 250px;">
      <line x1="${padX}" y1="${padTop + chartH}" x2="${padX + chartW}" y2="${padTop + chartH}" stroke="${palette.textSecondary}30" stroke-width="1" />
      <path d="${pathD}" fill="none" stroke="${palette.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      ${dots}
      ${labels}
    </svg>`;

  return `
<section class="relative overflow-hidden" style="background: linear-gradient(135deg, ${palette.primary}08, ${palette.secondary}0A);">
  <div class="max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
    ${buildTextBlock(block, palette, typography, borderRadius)}
    <div class="flex-1 w-full flex items-center justify-center">
      <div style="width: 100%; max-width: 400px; background: ${palette.surface}; border-radius: ${borderRadius}; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid ${palette.secondary}15;">
        ${svgHtml}
      </div>
    </div>
  </div>
</section>`;
}

function renderBarChart(
  block: HeroChartBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const data = normalizeData(block.chartData);
  const barGap = 8;

  const barsHtml = data.map(d => `
    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0;">
      <div style="width: 100%; height: 200px; display: flex; align-items: flex-end;">
        <div style="width: 100%; height: ${d.norm}%; background: linear-gradient(180deg, ${palette.primary}, ${palette.accent}); border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.3s ease;"></div>
      </div>
      <div style="font-size: 11px; color: ${palette.textSecondary}; font-family: '${typography.bodyFont}', sans-serif; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
        ${escapeHtml(d.label)}
      </div>
    </div>
  `).join('');

  return `
<section class="relative overflow-hidden" style="background: linear-gradient(135deg, ${palette.primary}08, ${palette.secondary}0A);">
  <div class="max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
    ${buildTextBlock(block, palette, typography, borderRadius)}
    <div class="flex-1 w-full flex items-center justify-center">
      <div style="width: 100%; max-width: 400px; background: ${palette.surface}; border-radius: ${borderRadius}; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid ${palette.secondary}15;">
        <div style="display: flex; gap: ${barGap}px; align-items: flex-end; height: 250px;">
          ${barsHtml}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function renderAreaChart(
  block: HeroChartBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const data = normalizeData(block.chartData);
  const svgWidth = 400;
  const svgHeight = 250;
  const padX = 40;
  const padTop = 20;
  const padBottom = 40;
  const chartW = svgWidth - padX * 2;
  const chartH = svgHeight - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padTop + chartH - (d.norm / 100) * chartH;
    return { x, y, label: d.label };
  });

  const linePathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const areaPathD = linePathD
    + ` L ${points[points.length - 1].x} ${padTop + chartH}`
    + ` L ${points[0].x} ${padTop + chartH} Z`;

  const dots = points.map(p =>
    `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${palette.accent}" />`
  ).join('');

  const labels = points.map(p =>
    `<text x="${p.x}" y="${svgHeight - 10}" text-anchor="middle" fill="${palette.textSecondary}" font-size="11" font-family="'${typography.bodyFont}', sans-serif">${escapeHtml(p.label)}</text>`
  ).join('');

  const gradientId = 'area-grad-' + Math.random().toString(36).slice(2, 8);

  const svgHtml = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" style="max-width: 400px; max-height: 250px;">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      <line x1="${padX}" y1="${padTop + chartH}" x2="${padX + chartW}" y2="${padTop + chartH}" stroke="${palette.textSecondary}30" stroke-width="1" />
      <path d="${areaPathD}" fill="url(#${gradientId})" />
      <path d="${linePathD}" fill="none" stroke="${palette.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      ${dots}
      ${labels}
    </svg>`;

  return `
<section class="relative overflow-hidden" style="background: linear-gradient(135deg, ${palette.primary}08, ${palette.secondary}0A);">
  <div class="max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
    ${buildTextBlock(block, palette, typography, borderRadius)}
    <div class="flex-1 w-full flex items-center justify-center">
      <div style="width: 100%; max-width: 400px; background: ${palette.surface}; border-radius: ${borderRadius}; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid ${palette.secondary}15;">
        ${svgHtml}
      </div>
    </div>
  </div>
</section>`;
}
