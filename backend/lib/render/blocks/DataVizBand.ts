import { z } from 'zod';
import { DataVizBandSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type DataVizBandBlock = z.infer<typeof DataVizBandSchema>;

export function renderDataVizBand(block: DataVizBandBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  switch (block.variant) {
    case 'progress-bars':
      return renderProgressBars(block, palette, typography, borderRadius);
    case 'gauge':
      return renderGauge(block, palette, typography, borderRadius);
    case 'sparklines':
    default:
      return renderSparklines(block, palette, typography, borderRadius);
  }
}

function parsePercentage(value: string): number {
  const match = value.match(/(\d+(?:\.\d+)?)\s*%/);
  if (match) return Math.min(parseFloat(match[1]), 100);
  return 75;
}

function buildSectionTitle(
  title: string | undefined,
  typography: ResolvedDesignTokens['typography'],
): string {
  if (!title) return '';
  return `
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12" style="color: #ffffff; font-family: '${typography.headingFont}', sans-serif;">
      ${escapeHtml(title)}
    </h2>`;
}

function getTrendArrow(trend?: 'up' | 'down' | 'flat'): string {
  switch (trend) {
    case 'up':
      return `<span style="color: #22c55e; font-size: 14px; margin-left: 6px;">\u2191</span>`;
    case 'down':
      return `<span style="color: #ef4444; font-size: 14px; margin-left: 6px;">\u2193</span>`;
    case 'flat':
      return `<span style="color: #9ca3af; font-size: 14px; margin-left: 6px;">\u2192</span>`;
    default:
      return '';
  }
}

function buildSparklineSvg(accent: string): string {
  // Generate a deterministic-looking zigzag sparkline
  const points = [0, 30, 15, 45, 25, 55, 35, 60, 50, 70, 55, 80, 65, 75, 85];
  const w = 80;
  const h = 30;
  const stepX = w / (points.length - 1);

  const pathD = points.map((y, i) => {
    const px = i * stepX;
    const py = h - (y / 100) * h;
    return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
  }).join(' ');

  return `
    <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display: block;">
      <path d="${pathD}" fill="none" stroke="${accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`;
}

function renderSparklines(
  block: DataVizBandBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const items = block.items.slice(0, 6);

  const cardsHtml = items.map(item => `
    <div style="background: ${palette.surface}15; border: 1px solid rgba(255,255,255,0.08); border-radius: ${borderRadius}; padding: 20px;">
      <div style="font-size: 12px; color: rgba(255,255,255,0.5); font-family: '${typography.bodyFont}', sans-serif; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
        ${escapeHtml(item.label)}
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <div style="font-size: 28px; font-weight: 700; color: #ffffff; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(item.value)}${getTrendArrow(item.trend)}
        </div>
      </div>
      ${buildSparklineSvg(palette.accent)}
    </div>
  `).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.surface};">
  <div class="max-w-6xl mx-auto px-6">
    ${buildSectionTitle(block.sectionTitle, typography)}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${cardsHtml}
    </div>
  </div>
</section>`;
}

function renderProgressBars(
  block: DataVizBandBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const items = block.items.slice(0, 6);

  const barsHtml = items.map(item => {
    const pct = parsePercentage(item.value);
    return `
    <div style="background: ${palette.surface}15; border: 1px solid rgba(255,255,255,0.08); border-radius: ${borderRadius}; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 14px; color: rgba(255,255,255,0.7); font-family: '${typography.bodyFont}', sans-serif;">
          ${escapeHtml(item.label)}
        </span>
        <span style="font-size: 18px; font-weight: 700; color: #ffffff; font-family: '${typography.headingFont}', sans-serif;">
          ${escapeHtml(item.value)}${getTrendArrow(item.trend)}
        </span>
      </div>
      <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
        <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, ${palette.accent}, ${palette.primary}); border-radius: 4px; transition: width 0.5s ease;"></div>
      </div>
    </div>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.surface};">
  <div class="max-w-6xl mx-auto px-6">
    ${buildSectionTitle(block.sectionTitle, typography)}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${barsHtml}
    </div>
  </div>
</section>`;
}

function renderGauge(
  block: DataVizBandBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const items = block.items.slice(0, 6);

  const gaugesHtml = items.map(item => {
    const pct = parsePercentage(item.value);
    // conic-gradient for semi-circle gauge (180deg = 100%)
    const fillDeg = (pct / 100) * 180;

    return `
    <div style="background: ${palette.surface}15; border: 1px solid rgba(255,255,255,0.08); border-radius: ${borderRadius}; padding: 20px; text-align: center;">
      <div style="width: 120px; height: 60px; margin: 0 auto 16px; position: relative; overflow: hidden;">
        <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(
          ${palette.accent} 0deg,
          ${palette.primary} ${fillDeg}deg,
          rgba(255,255,255,0.08) ${fillDeg}deg,
          rgba(255,255,255,0.08) 360deg
        ); position: absolute; top: 0; left: 0;"></div>
        <div style="width: 80px; height: 80px; border-radius: 50%; background: ${palette.surface}; position: absolute; top: 20px; left: 20px;"></div>
      </div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.5); font-family: '${typography.bodyFont}', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
        ${escapeHtml(item.label)}
      </div>
      <div style="font-size: 22px; font-weight: 700; color: #ffffff; font-family: '${typography.headingFont}', sans-serif;">
        ${escapeHtml(item.value)}${getTrendArrow(item.trend)}
      </div>
    </div>`;
  }).join('');

  return `
<section class="py-16 lg:py-24" style="background: ${palette.surface};">
  <div class="max-w-6xl mx-auto px-6">
    ${buildSectionTitle(block.sectionTitle, typography)}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${gaugesHtml}
    </div>
  </div>
</section>`;
}
