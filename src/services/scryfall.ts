
// Scryfall API service
// Documentation: https://scryfall.com/docs/api

// Types for Scryfall API responses
export interface ScryfallCard {
  id: string;
  name: string;
  set_name: string;
  set: string;
  collector_number: string;
  rarity: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  card_faces?: Array<{
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
      art_crop: string;
      border_crop: string;
    };
  }>;
  colors: string[];
  color_identity: string[];
  lang: string;
  prices: {
    usd: string | null;
    usd_foil: string | null;
    eur: string | null;
    eur_foil: string | null;
  };
}

export interface ScryfallListResponse {
  object: string;
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
}

export interface ScryfallError {
  status: number;
  code: string;
  details: string;
}

// Base URL for Scryfall API
const SCRYFALL_API_BASE = 'https://api.scryfall.com';

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json() as ScryfallError;
    throw new Error(error.details || response.statusText);
  }
  return response.json() as Promise<T>;
};

// Search cards based on query parameters
export const searchCards = async (query: string, page = 1): Promise<ScryfallListResponse> => {
  // Convert page to Scryfall pagination format (page size is 175 by default)
  const pageParam = page > 1 ? `&page=${page}` : '';
  const url = `${SCRYFALL_API_BASE}/cards/search?q=${encodeURIComponent(query)}${pageParam}`;
  
  try {
    const response = await fetch(url);
    return handleResponse<ScryfallListResponse>(response);
  } catch (error) {
    if ((error as Error).message?.includes('No cards found')) {
      // Return empty result set for "no cards found" instead of throwing
      return {
        object: 'list',
        total_cards: 0,
        has_more: false,
        data: []
      };
    }
    throw error;
  }
};

// Get card details by ID
export const getCardById = async (id: string): Promise<ScryfallCard> => {
  const url = `${SCRYFALL_API_BASE}/cards/${id}`;
  const response = await fetch(url);
  return handleResponse<ScryfallCard>(response);
};

// Get autocomplete suggestions
export const getAutocompleteSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  const url = `${SCRYFALL_API_BASE}/cards/autocomplete?q=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    const result = await handleResponse<{ data: string[] }>(response);
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
};

// Helper function to map Scryfall cards to our application's card format
export interface AppCard {
  id: string;
  name: string;
  set: string;
  imageUrl: string;
  price: number;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  condition: string;
  language: string;
  color?: string;
}

// Map Scryfall language codes to display names
const languageMap: Record<string, string> = {
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

// Helper function to determine card color from Scryfall color data
const determineCardColor = (colors: string[]): string => {
  if (colors.length === 0) return 'colorless';
  if (colors.length > 1) return 'gold';
  
  const colorMap: Record<string, string> = {
    'W': 'white',
    'U': 'blue',
    'B': 'black',
    'R': 'red',
    'G': 'green'
  };
  
  return colorMap[colors[0]] || 'colorless';
};

// Convert Scryfall card to app card format with mock seller data
export const mapScryfallCardToAppCard = (card: ScryfallCard): AppCard => {
  // Get image URL, handling cards with multiple faces
  let imageUrl = card.image_uris?.normal || '';
  if (!imageUrl && card.card_faces && card.card_faces[0]?.image_uris) {
    imageUrl = card.card_faces[0].image_uris.normal;
  }
  
  // Convert price from USD to fictitious ARS (mock conversion rate)
  const usdPrice = parseFloat(card.prices.usd || card.prices.usd_foil || '0');
  const arsPrice = Math.round(usdPrice * 1000); // 1 USD = 1000 ARS (fictitious rate)
  
  // Map language code to display name
  const language = languageMap[card.lang] || 'Desconocido';
  
  // Determine card color
  const color = determineCardColor(card.colors);
  
  // Create mock seller data (in a real app, this would come from your database)
  const sellers = [
    { id: "seller1", name: "MagicDealer", rating: 4.8 },
    { id: "seller2", name: "CardKingdom", rating: 4.9 },
    { id: "seller3", name: "MTGStore", rating: 4.7 },
    { id: "seller4", name: "MTGCollector", rating: 4.6 }
  ];
  const randomSellerIndex = Math.floor(Math.random() * sellers.length);
  
  return {
    id: card.id,
    name: card.name,
    set: card.set_name,  // Usar siempre el nombre de la edición (set_name)
    imageUrl: imageUrl,
    price: arsPrice,
    seller: sellers[randomSellerIndex],
    condition: "Near Mint", // Mock condition
    language: language,
    color: color
  };
};
