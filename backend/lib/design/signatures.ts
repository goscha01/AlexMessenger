import type { Signature } from '@/lib/catalog/schemas';

export interface SignatureCSS {
  id: Signature;
  name: string;
  sectionBg: (index: number) => string;
  borderStyle: string;
  shadow: string;
  spacingScale: number; // multiplier for section padding
  accentStyle: string;
  cssVariables: Record<string, string>;
  sectionClass: string;
  wrapperCSS: string;
}

const SIGNATURES: Record<Signature, SignatureCSS> = {
  bento: {
    id: 'bento',
    name: 'Bento',
    sectionBg: () => 'var(--surface)',
    borderStyle: '1px solid var(--border, rgba(0,0,0,0.08))',
    shadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    spacingScale: 1,
    accentStyle: 'rounded',
    cssVariables: {
      '--sig-card-radius': '1rem',
      '--sig-card-padding': '1.5rem',
      '--sig-section-gap': '0.75rem',
    },
    sectionClass: 'sig-bento',
    wrapperCSS: `
      .sig-bento section { background: var(--surface); border-radius: 1rem; border: 1px solid rgba(0,0,0,0.08); }
      .sig-bento .block-card { border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    `,
  },
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    sectionBg: () => '#ffffff',
    borderStyle: 'none',
    shadow: 'none',
    spacingScale: 2,
    accentStyle: 'underline',
    cssVariables: {
      '--sig-card-radius': '0',
      '--sig-card-padding': '2rem',
      '--sig-section-gap': '0',
      '--sig-rule': '1px solid rgba(0,0,0,0.12)',
    },
    sectionClass: 'sig-editorial',
    wrapperCSS: `
      .sig-editorial section { border-bottom: 1px solid rgba(0,0,0,0.12); }
      .sig-editorial section:last-child { border-bottom: none; }
      .sig-editorial h2 { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 6px; }
    `,
  },
  colorBlocks: {
    id: 'colorBlocks',
    name: 'Color Blocks',
    sectionBg: (index: number) =>
      index % 2 === 0 ? 'var(--background)' : 'var(--primary)',
    borderStyle: 'none',
    shadow: 'none',
    spacingScale: 1.5,
    accentStyle: 'bold-block',
    cssVariables: {
      '--sig-card-radius': '0',
      '--sig-card-padding': '2.5rem',
      '--sig-section-gap': '0',
    },
    sectionClass: 'sig-colorblocks',
    wrapperCSS: `
      .sig-colorblocks section:nth-child(even) { background: var(--primary); color: var(--text-on-primary, #fff); }
      .sig-colorblocks section:nth-child(even) h2,
      .sig-colorblocks section:nth-child(even) h3,
      .sig-colorblocks section:nth-child(even) p { color: inherit; }
    `,
  },
  monoMinimal: {
    id: 'monoMinimal',
    name: 'Mono Minimal',
    sectionBg: (index: number) =>
      index % 3 === 0 ? '#ffffff' : '#fafafa',
    borderStyle: 'none',
    shadow: '0 1px 2px rgba(0,0,0,0.03)',
    spacingScale: 2,
    accentStyle: 'single-accent',
    cssVariables: {
      '--sig-card-radius': '0.375rem',
      '--sig-card-padding': '2rem',
      '--sig-section-gap': '0',
    },
    sectionClass: 'sig-monomin',
    wrapperCSS: `
      .sig-monomin section { max-width: 900px; margin-left: auto; margin-right: auto; }
      .sig-monomin h2 { letter-spacing: -0.02em; }
    `,
  },
  darkNeon: {
    id: 'darkNeon',
    name: 'Dark Neon',
    sectionBg: () => '#0a0a0a',
    borderStyle: '1px solid rgba(255,255,255,0.08)',
    shadow: '0 0 20px var(--accent-glow, rgba(0,255,200,0.15))',
    spacingScale: 1.5,
    accentStyle: 'neon',
    cssVariables: {
      '--sig-card-radius': '0.5rem',
      '--sig-card-padding': '1.5rem',
      '--sig-section-gap': '1px',
      '--sig-glow': '0 0 20px var(--accent)',
    },
    sectionClass: 'sig-darkneon',
    wrapperCSS: `
      .sig-darkneon { background: #0a0a0a; color: #e0e0e0; }
      .sig-darkneon section { background: #0a0a0a; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .sig-darkneon h2, .sig-darkneon h3 { color: #fff; }
      .sig-darkneon .block-card { border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 0 20px var(--accent-glow, rgba(0,255,200,0.1)); }
      .sig-darkneon a, .sig-darkneon .cta-button { text-shadow: 0 0 10px var(--accent); }
    `,
  },
  softCards: {
    id: 'softCards',
    name: 'Soft Cards',
    sectionBg: () => 'var(--background)',
    borderStyle: 'none',
    shadow: '0 2px 8px rgba(0,0,0,0.06)',
    spacingScale: 1.5,
    accentStyle: 'rounded-pastel',
    cssVariables: {
      '--sig-card-radius': '1.25rem',
      '--sig-card-padding': '2rem',
      '--sig-section-gap': '0',
    },
    sectionClass: 'sig-softcards',
    wrapperCSS: `
      .sig-softcards .block-card { border-radius: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: var(--surface); }
      .sig-softcards section { border-radius: 0; }
      .sig-softcards h2 { font-weight: 600; }
    `,
  },
  technicalGrid: {
    id: 'technicalGrid',
    name: 'Technical Grid',
    sectionBg: () => 'var(--background)',
    borderStyle: '1px solid rgba(0,0,0,0.06)',
    shadow: 'none',
    spacingScale: 1,
    accentStyle: 'mono-accent',
    cssVariables: {
      '--sig-card-radius': '0.25rem',
      '--sig-card-padding': '1.25rem',
      '--sig-section-gap': '1px',
      '--sig-grid-line': '1px solid rgba(0,0,0,0.06)',
    },
    sectionClass: 'sig-techgrid',
    wrapperCSS: `
      .sig-techgrid { background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px); background-size: 40px 40px; }
      .sig-techgrid section { border-bottom: 1px solid rgba(0,0,0,0.06); }
      .sig-techgrid .block-card { border: 1px solid rgba(0,0,0,0.06); border-radius: 0.25rem; }
      .sig-techgrid h2, .sig-techgrid h3 { font-family: var(--font-heading), monospace; letter-spacing: -0.01em; }
    `,
  },
};

export { SIGNATURES };

export function getSignatureStyles(id: string): SignatureCSS {
  return SIGNATURES[id as Signature] ?? SIGNATURES.monoMinimal;
}

export function getSignatureCSS(id: string): string {
  const sig = getSignatureStyles(id);
  let css = '';

  // CSS variables
  css += `.${sig.sectionClass} {\n`;
  for (const [key, value] of Object.entries(sig.cssVariables)) {
    css += `  ${key}: ${value};\n`;
  }
  css += '}\n';

  // Wrapper styles
  css += sig.wrapperCSS;

  return css;
}

export const SIGNATURE_IDS = Object.keys(SIGNATURES) as Signature[];
