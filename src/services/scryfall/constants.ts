
// Scryfall service constants

// Base URL for Scryfall API
export const SCRYFALL_API_BASE = 'https://api.scryfall.com';

// Map Scryfall language codes to display names
export const languageMap: Record<string, string> = {
  'es': 'Español',
  'en': 'Inglés',
  'pt': 'Portugués',
  'ja': 'Japonés',
  'de': 'Alemán',
  'fr': 'Francés',
  'it': 'Italiano',
  'ko': 'Coreano',
  'ru': 'Ruso',
  'zhs': 'Chino Simplificado',
  'zht': 'Chino Tradicional',
};

// Color mapping for card colors
export const colorMap: Record<string, string> = {
  'W': 'white',
  'U': 'blue',
  'B': 'black',
  'R': 'red',
  'G': 'green'
};
