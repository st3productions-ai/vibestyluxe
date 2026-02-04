
import { VibePalette, Hairstyle, Technique } from './types';

export const PALETTES: VibePalette[] = [
  { name: 'Icy Platinum', color: '#E1E8EB' },
  { name: 'Electric Purple', color: '#8A2BE2' },
  { name: 'Copper Balayage', color: '#B87333' },
  { name: 'Midnight Rose', color: '#800020' },
  { name: 'Golden Honey', color: '#E3A857' },
  { name: 'Smoky Charcoal', color: '#36454F' },
];

export const HAIRSTYLES: Hairstyle[] = [
  { id: 'wolf', name: 'Wolf Cut', description: 'Edgy shaggy layers with volume.' },
  { id: 'butterfly', name: 'Butterfly Cut', description: 'Long layers with face-framing feathers.' },
  { id: 'pixie', name: 'Tapered Pixie', description: 'Sharp, short, and sophisticated.' },
  { id: 'bob', name: 'Blunt Bob', description: 'Razor-straight chin-length edge.' },
  { id: 'curtain', name: 'Curtain Bangs', description: 'Soft 70s inspired framing.' },
  { id: 'waves', name: 'Beach Waves', description: 'Effortless luxury texture.' },
  { id: 'sleek', name: 'Sleek Straight', description: 'High-shine glass hair finish.' },
  { id: 'afro', name: 'Afro Curls', description: 'Defined, high-volume natural curls.' },
  { id: 'french', name: 'French Bob', description: 'Classic chic with a modern twist.' },
];

export const TECHNIQUES: Technique[] = [
  Technique.BALAYAGE,
  Technique.BLEACH_TONE,
  Technique.MONEY_PIECE,
  Technique.FANTASY,
];

export const PLACEHOLDER_BEFORE = 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=1200';
