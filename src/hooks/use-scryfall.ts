
import { useQuery } from "@tanstack/react-query";
import { searchCards, getCardById, getAutocompleteSuggestions, mapScryfallCardToAppCard, AppCard } from "@/services/scryfall";
import { buildScryfallQuery } from "@/utils/query-builders";
import { applyPriceFilter } from "@/utils/filters";

// Hook for searching cards
export function useSearchCards(searchParams: {
  name?: string;
  set?: string;
  color?: string;
  colorIdentity?: string;
  rarity?: string;
  language?: string;
  priceRange?: [number, number];
  page?: number;
}) {
  const { 
    name = "", 
    set = "", 
    color = "", 
    colorIdentity = "", 
    rarity = "", 
    language = "", 
    priceRange = [0, 100000],
    page = 1 
  } = searchParams;
  
  // Build query using the utility function
  const query = buildScryfallQuery({name, set, color, colorIdentity, rarity, language});
  
  console.log("Scryfall query:", query); // Debugging
  
  return useQuery({
    queryKey: ['cards', query, page],
    queryFn: async () => {
      try {
        const response = await searchCards(query, page);
        console.log("Scryfall API response:", response); // Debug API response
        console.log("Total cards before filtering:", response.data?.length || 0);
        
        // Apply client-side price filtering
        let filteredData = applyPriceFilter(response.data || [], priceRange);
        
        // Map the cards and ensure color data is included
        const mappedCards = filteredData.map(mapScryfallCardToAppCard);
        
        return {
          ...response,
          data: mappedCards
        };
      } catch (error) {
        console.error("Error in card search:", error);
        throw error;
      }
    },
    enabled: true, // Always enable the query to run even with empty string
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for getting card details by ID
export function useCardDetails(cardId: string) {
  return useQuery({
    queryKey: ['card', cardId],
    queryFn: async () => {
      const card = await getCardById(cardId);
      return mapScryfallCardToAppCard(card);
    },
    enabled: !!cardId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Hook for autocomplete suggestions
export function useCardAutocomplete(query: string) {
  return useQuery({
    queryKey: ['autocomplete', query],
    queryFn: () => getAutocompleteSuggestions(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 60, // 1 hour
    // Always return an empty array if the query fails or there are no results
    select: (data) => {
      if (!data || !Array.isArray(data)) {
        return [];
      }
      return data;
    },
    placeholderData: [], // Provide empty array as placeholder data
  });
}

// Function to build search params object from filters
export function buildSearchParams(filters: any) {
  return {
    name: filters.name || "",
    set: filters.set || "all",
    color: filters.color || "all",
    colorIdentity: filters.colorIdentity || "all",
    rarity: filters.rarity || "all",
    language: filters.language || "all",
    priceRange: filters.priceRange || [0, 100000],
    condition: filters.condition || "all",
  };
}

// Function to extract AppCards from query result with error handling
export function extractCards(queryResult: {
  data?: { data: AppCard[] };
  isLoading: boolean;
  error: Error | null;
}): { cards: AppCard[], isLoading: boolean, error: Error | null } {
  return {
    cards: queryResult.data?.data || [],
    isLoading: queryResult.isLoading,
    error: queryResult.error
  };
}
