
import { languageMap, colorMap } from './constants';
import type { ScryfallCard } from '@/types/scryfall';
import type { AppCard } from '@/types/cards';

// Helper function to determine card color from Scryfall color data
const determineCardColor = (colors: string[]): string => {
  if (colors.length === 0) return 'colorless';
  if (colors.length > 1) return 'gold';
  
  return colorMap[colors[0]] || 'colorless';
};

// Convert Scryfall card to app card format
export const mapScryfallCardToAppCard = (card: ScryfallCard): AppCard => {
  // Get image URL, handling cards with multiple faces
  let imageUrl = card.image_uris?.normal || '';
  if (!imageUrl && card.card_faces && card.card_faces[0]?.image_uris) {
    imageUrl = card.card_faces[0].image_uris.normal;
  }
  
  // Use USD price directly from Scryfall
  const usdPrice = parseFloat(card.prices.usd || card.prices.usd_foil || '0');
  
  // Map language code to display name
  const language = languageMap[card.lang] || 'Desconocido';
  
  // Determine card color
  const color = determineCardColor(card.colors);
  
  return {
    id: card.id,
    name: card.name,
    set: card.set_name,
    imageUrl: imageUrl,
    price: usdPrice,
    condition: "Near Mint", // Default condition
    language: language,
    color: color
  };
};
