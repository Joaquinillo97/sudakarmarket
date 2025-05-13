
import { useQuery } from "@tanstack/react-query";
import { searchCards, getCardById, getAutocompleteSuggestions, mapScryfallCardToAppCard, AppCard } from "@/services/scryfall";

// Hook for searching cards
export function useSearchCards(searchParams: {
  name?: string;
  set?: string;
  color?: string;
  rarity?: string;
  language?: string;
  page?: number;
}) {
  const { name = "", set = "", color = "", rarity = "", language = "", page = 1 } = searchParams;
  
  // Build Scryfall query
  let query = name ? `name:/^${name}/` : "";
  
  if (set && set !== "all") {
    // Convert set code from filter format (modern_horizons_3) to set code format (mh3)
    const setParam = set;
    query += query ? ` s:${setParam}` : `s:${setParam}`;
  }
  
  if (color && color !== "all") {
    const colorParam = color.charAt(0).toUpperCase();
    query += query ? ` c:${colorParam}` : `c:${colorParam}`;
  }
  
  if (rarity && rarity !== "all") {
    query += query ? ` r:${rarity}` : `r:${rarity}`;
  }
  
  if (language && language !== "all") {
    query += query ? ` lang:${language}` : `lang:${language}`;
  }
  
  // If no query is provided, search for recent cards
  if (!query) {
    query = "year>=2023 order:released";
  }
  
  return useQuery({
    queryKey: ['cards', query, page],
    queryFn: async () => {
      const response = await searchCards(query, page);
      return {
        ...response,
        data: response.data.map(mapScryfallCardToAppCard)
      };
    },
    enabled: !!query,
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
  });
}

// Function to build search params object from filters
export function buildSearchParams(filters: any) {
  return {
    name: filters.name || "",
    set: filters.set || "all",
    color: filters.color || "all",
    rarity: filters.rarity || "all",
    language: filters.language || "all",
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
