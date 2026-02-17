import type { FontPairing, TypeScale } from './types';

export const FONT_PAIRINGS: FontPairing[] = [
  { id: 'inter-inter', heading: 'Inter', body: 'Inter', category: 'sans', description: 'Clean modern — universal' },
  { id: 'poppins-inter', heading: 'Poppins', body: 'Inter', category: 'sans', description: 'Friendly SaaS' },
  { id: 'space-dm', heading: 'Space Grotesk', body: 'DM Sans', category: 'sans', description: 'Tech modern' },
  { id: 'manrope-inter', heading: 'Manrope', body: 'Inter', category: 'sans', description: 'Geometric clean' },
  { id: 'plus-jakarta-inter', heading: 'Plus Jakarta Sans', body: 'Inter', category: 'sans', description: 'Contemporary startup' },
  { id: 'outfit-source', heading: 'Outfit', body: 'Source Sans 3', category: 'sans', description: 'Modern corporate' },
  { id: 'sora-dm', heading: 'Sora', body: 'DM Sans', category: 'sans', description: 'Bold futuristic' },
  { id: 'playfair-source', heading: 'Playfair Display', body: 'Source Sans 3', category: 'mixed', description: 'Elegant editorial' },
  { id: 'lora-merriweather', heading: 'Lora', body: 'Merriweather Sans', category: 'mixed', description: 'Classic serif' },
  { id: 'dm-serif-inter', heading: 'DM Serif Display', body: 'Inter', category: 'mixed', description: 'Refined contrast' },
  { id: 'fraunces-inter', heading: 'Fraunces', body: 'Inter', category: 'mixed', description: 'Warm editorial' },
  { id: 'cormorant-source', heading: 'Cormorant Garamond', body: 'Source Sans 3', category: 'serif', description: 'Luxury classic' },
  { id: 'libre-merriweather', heading: 'Libre Baskerville', body: 'Merriweather Sans', category: 'serif', description: 'Traditional authority' },
  { id: 'josefin-open', heading: 'Josefin Sans', body: 'Open Sans', category: 'sans', description: 'Minimal art deco' },
  { id: 'raleway-open', heading: 'Raleway', body: 'Open Sans', category: 'sans', description: 'Light elegant' },
];

export const TYPE_SCALES: TypeScale[] = [
  {
    id: 'compact',
    name: 'Compact',
    ratio: 1.2,
    sizes: { xs: '0.694rem', sm: '0.833rem', base: '1rem', lg: '1.2rem', xl: '1.44rem', '2xl': '1.728rem', '3xl': '2.074rem', '4xl': '2.488rem' },
  },
  {
    id: 'default',
    name: 'Default',
    ratio: 1.25,
    sizes: { xs: '0.64rem', sm: '0.8rem', base: '1rem', lg: '1.25rem', xl: '1.563rem', '2xl': '1.953rem', '3xl': '2.441rem', '4xl': '3.052rem' },
  },
  {
    id: 'spacious',
    name: 'Spacious',
    ratio: 1.333,
    sizes: { xs: '0.563rem', sm: '0.75rem', base: '1rem', lg: '1.333rem', xl: '1.777rem', '2xl': '2.369rem', '3xl': '3.157rem', '4xl': '4.209rem' },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    ratio: 1.5,
    sizes: { xs: '0.444rem', sm: '0.667rem', base: '1rem', lg: '1.5rem', xl: '2.25rem', '2xl': '3.375rem', '3xl': '5.063rem', '4xl': '7.594rem' },
  },
];

const PAIRING_MAP = new Map(FONT_PAIRINGS.map((p) => [p.id, p]));

export function getFontPairing(id: string): FontPairing {
  return PAIRING_MAP.get(id) ?? FONT_PAIRINGS[0]; // fallback to inter-inter
}
