import { z } from 'zod';
import { HeroTerminalSchema } from '@/lib/catalog/schemas';
import { escapeHtml } from '../renderHtml';
import type { ResolvedDesignTokens } from '@/lib/design/types';

type HeroTerminalBlock = z.infer<typeof HeroTerminalSchema>;

export function renderHeroTerminal(block: HeroTerminalBlock, tokens: ResolvedDesignTokens): string {
  const { palette, typography, borderRadius } = tokens;

  switch (block.variant) {
    case 'matrix':
      return renderMatrix(block, palette, typography, borderRadius);
    case 'retro':
      return renderRetro(block, palette, typography, borderRadius);
    case 'dark':
    default:
      return renderDark(block, palette, typography, borderRadius);
  }
}

function buildWindowChrome(dotStyle: string): string {
  return `
    <div style="display: flex; align-items: center; gap: 6px; padding: 12px 16px; ${dotStyle}">
      <span style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; display: inline-block;"></span>
      <span style="width: 12px; height: 12px; border-radius: 50%; background: #febc2e; display: inline-block;"></span>
      <span style="width: 12px; height: 12px; border-radius: 50%; background: #28c840; display: inline-block;"></span>
    </div>`;
}

function buildCommandLines(
  lines: string[],
  promptColor: string,
  textColor: string,
  cursorColor: string,
): string {
  return lines.map((line, i) => {
    const isLast = i === lines.length - 1;
    return `
      <div style="display: flex; align-items: center; margin-bottom: 6px;">
        <span style="color: ${promptColor}; margin-right: 8px; user-select: none;">$</span>
        <span style="color: ${textColor};">${escapeHtml(line)}</span>${isLast ? `<span class="terminal-cursor" style="display: inline-block; width: 8px; height: 18px; background: ${cursorColor}; margin-left: 4px; vertical-align: middle;"></span>` : ''}
      </div>`;
  }).join('');
}

function renderDark(
  block: HeroTerminalBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const commandsHtml = buildCommandLines(
    block.commandLines,
    '#888888',
    '#00ffc8',
    '#00ffc8',
  );

  return `
<section class="relative overflow-hidden" style="background: #0a0a0a;">
  <style>
    @keyframes terminal-blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    .terminal-cursor { animation: terminal-blink 1s step-end infinite; }
  </style>
  <div class="max-w-4xl mx-auto px-6 py-20 lg:py-28">
    <div style="background: #1a1a2e; border-radius: ${borderRadius}; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 1px solid #333;">
      ${buildWindowChrome('border-bottom: 1px solid #333;')}
      <div style="padding: 20px 24px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 14px; line-height: 1.7; min-height: 120px;">
        ${commandsHtml}
      </div>
    </div>
    <div class="text-center mt-12">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6" style="color: #ffffff; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
        ${escapeHtml(block.headline)}
      </h1>
      <p class="text-lg lg:text-xl mb-8 max-w-2xl mx-auto" style="color: rgba(255,255,255,0.7); font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
        ${escapeHtml(block.subheadline)}
      </p>
      <a href="${escapeHtml(block.ctaHref)}"
         class="inline-block px-8 py-4 font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
         style="background-color: ${palette.accent}; color: #fff; border-radius: ${borderRadius};">
        ${escapeHtml(block.ctaText)}
      </a>
    </div>
  </div>
</section>`;
}

function renderMatrix(
  block: HeroTerminalBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const commandsHtml = buildCommandLines(
    block.commandLines,
    '#006600',
    '#00ff41',
    '#00ff41',
  );

  return `
<section class="relative overflow-hidden" style="background: #000000;">
  <style>
    @keyframes terminal-blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    .terminal-cursor { animation: terminal-blink 1s step-end infinite; }
    @keyframes matrix-fall {
      0% { transform: translateY(-100%); opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateY(100vh); opacity: 0; }
    }
    .matrix-backdrop::before {
      content: '01001010 11010010 00110101 10101010 01110011 11001100 00101110 10010110 01100101 11101001';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 200%;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 14px;
      line-height: 1.8;
      color: #00ff4118;
      word-break: break-all;
      white-space: pre-wrap;
      animation: matrix-fall 12s linear infinite;
      pointer-events: none;
      z-index: 0;
    }
  </style>
  <div class="matrix-backdrop" style="position: absolute; inset: 0; overflow: hidden;"></div>
  <div class="max-w-4xl mx-auto px-6 py-20 lg:py-28 relative" style="z-index: 1;">
    <div style="background: #0a0a0a; border-radius: ${borderRadius}; overflow: hidden; box-shadow: 0 0 40px rgba(0,255,65,0.15); border: 1px solid #00ff4130;">
      ${buildWindowChrome('border-bottom: 1px solid #00ff4120;')}
      <div style="padding: 20px 24px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 14px; line-height: 1.7; min-height: 120px;">
        ${commandsHtml}
      </div>
    </div>
    <div class="text-center mt-12">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6" style="color: #00ff41; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
        ${escapeHtml(block.headline)}
      </h1>
      <p class="text-lg lg:text-xl mb-8 max-w-2xl mx-auto" style="color: #00ff4199; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
        ${escapeHtml(block.subheadline)}
      </p>
      <a href="${escapeHtml(block.ctaHref)}"
         class="inline-block px-8 py-4 font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
         style="background-color: #00ff41; color: #000; border-radius: ${borderRadius};">
        ${escapeHtml(block.ctaText)}
      </a>
    </div>
  </div>
</section>`;
}

function renderRetro(
  block: HeroTerminalBlock,
  palette: ResolvedDesignTokens['palette'],
  typography: ResolvedDesignTokens['typography'],
  borderRadius: string,
): string {
  const commandsHtml = buildCommandLines(
    block.commandLines,
    '#996600',
    '#ffb000',
    '#ffb000',
  );

  return `
<section class="relative overflow-hidden" style="background: #1a0800;">
  <style>
    @keyframes terminal-blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    .terminal-cursor { animation: terminal-blink 1s step-end infinite; }
    .retro-scanlines::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15) 0px,
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 3px
      );
      pointer-events: none;
      z-index: 2;
    }
  </style>
  <div class="max-w-4xl mx-auto px-6 py-20 lg:py-28">
    <div class="retro-scanlines" style="position: relative; background: #2a1000; border-radius: 12px; overflow: hidden; box-shadow: 0 0 30px rgba(255,176,0,0.1); border: 2px solid #ffb00030;">
      ${buildWindowChrome('border-bottom: 1px solid #ffb00020;')}
      <div style="padding: 20px 24px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 14px; line-height: 1.7; min-height: 120px; position: relative; z-index: 1;">
        ${commandsHtml}
      </div>
    </div>
    <div class="text-center mt-12">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6" style="color: #ffb000; font-family: '${typography.headingFont}', sans-serif; font-weight: ${typography.headingWeight};">
        ${escapeHtml(block.headline)}
      </h1>
      <p class="text-lg lg:text-xl mb-8 max-w-2xl mx-auto" style="color: #ffb00099; font-family: '${typography.bodyFont}', sans-serif; font-weight: ${typography.bodyWeight};">
        ${escapeHtml(block.subheadline)}
      </p>
      <a href="${escapeHtml(block.ctaHref)}"
         class="inline-block px-8 py-4 font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
         style="background-color: #ffb000; color: #1a0800; border-radius: ${borderRadius};">
        ${escapeHtml(block.ctaText)}
      </a>
    </div>
  </div>
</section>`;
}
