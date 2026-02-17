// ===== Design System Types =====

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
  baseSize: number;
  scale: number;
  headingWeight: number;
  bodyWeight: number;
}

export interface ResolvedDesignTokens {
  brandName: string;
  palette: Palette;
  typography: Typography;
  borderRadius: string;
  spacing: string;
}

export interface FontPairing {
  id: string;
  heading: string;
  body: string;
  category: 'sans' | 'serif' | 'mixed';
  description: string;
}

export interface TypeScale {
  id: string;
  name: string;
  ratio: number;
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
}

export interface DesignPreset {
  id: string;
  name: string;
  description: string;
  mood: string;
  layoutStyle: 'corporate' | 'creative' | 'minimal' | 'bold' | 'elegant';
  palette: Palette;
  defaultFontPairingId: string;
  borderRadius: string;
  spacing: string;
}

export interface TokenTweaks {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  surface?: string;
  textPrimary?: string;
  textSecondary?: string;
}
