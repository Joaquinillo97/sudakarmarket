
// Scryfall API service
// Documentation: https://scryfall.com/docs/api

// Re-export types
export type { ScryfallCard, ScryfallListResponse, ScryfallError } from '@/types/scryfall';
export type { AppCard } from '@/types/cards';

// Re-export API functions
export {
  searchCards,
  getCardById,
  getCardByName,
  getAllPrintings,
  getAutocompleteSuggestions
} from './scryfall/api';

// Re-export mapper functions
export { mapScryfallCardToAppCard } from './scryfall/mappers';

// Re-export constants
export { SCRYFALL_API_BASE, languageMap, colorMap } from './scryfall/constants';
