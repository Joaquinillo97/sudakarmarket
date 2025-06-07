
import { SCRYFALL_API_BASE } from './constants';
import type { ScryfallCard, ScryfallListResponse, ScryfallError } from '@/types/scryfall';

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

// Get card by exact name
export const getCardByName = async (name: string): Promise<ScryfallCard> => {
  const url = `${SCRYFALL_API_BASE}/cards/named?exact=${encodeURIComponent(name)}`;
  const response = await fetch(url);
  return handleResponse<ScryfallCard>(response);
};

// Get all printings of a card by name
export const getAllPrintings = async (cardName: string): Promise<ScryfallCard[]> => {
  const url = `${SCRYFALL_API_BASE}/cards/search?q=${encodeURIComponent(`!"${cardName}"`)}`;
  try {
    const response = await fetch(url);
    const result = await handleResponse<ScryfallListResponse>(response);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching card printings:', error);
    return [];
  }
};

// Get autocomplete suggestions
export const getAutocompleteSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  const url = `${SCRYFALL_API_BASE}/cards/autocomplete?q=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Autocomplete API error: ${response.status}`);
      return [];
    }
    
    const result = await response.json();
    
    if (result && Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
};
