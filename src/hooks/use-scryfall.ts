
import { useQuery } from "@tanstack/react-query";
import { searchCards, getCardById, getAutocompleteSuggestions, mapScryfallCardToAppCard, AppCard } from "@/services/scryfall";

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
  
  // Build Scryfall query
  let query = name ? `name:/^${name}/` : "";
  
  if (set && set !== "all") {
    // Use the set code directly (already in Scryfall format)
    query += query ? ` set:${set}` : `set:${set}`;
  }
  
  // Color filter uses c: operator
  if (color && color !== "all") {
    // Convert color from UI display name to Scryfall code
    const colorMap: Record<string, string> = {
      "white": "W",
      "blue": "U",
      "black": "B",
      "red": "R",
      "green": "G",
      "colorless": "C",
      "multicolor": "M"
    };
    const colorCode = colorMap[color] || color;
    query += query ? ` c:${colorCode}` : `c:${colorCode}`;
  }
  
  // Color identity filter uses ci: operator
  if (colorIdentity && colorIdentity !== "all") {
    query += query ? ` ci:${colorIdentity}` : `ci:${colorIdentity}`;
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
  
  console.log("Scryfall query:", query); // Debugging
  
  return useQuery({
    queryKey: ['cards', query, page],
    queryFn: async () => {
      const response = await searchCards(query, page);
      
      // Apply client-side price filtering
      let filteredData = response.data;
      
      if (priceRange && (priceRange[0] > 0 || priceRange[1] < 100000)) {
        const [minPrice, maxPrice] = priceRange;
        // Convert to USD for comparison with Scryfall prices
        const minUsd = minPrice / 1000; // Assuming 1 USD = 1000 ARS
        const maxUsd = maxPrice / 1000;
        
        filteredData = filteredData.filter(card => {
          // Get the card price in USD (using usd or usd_foil)
          const cardPriceUsd = parseFloat(card.prices.usd || card.prices.usd_foil || '0');
          return cardPriceUsd >= minUsd && cardPriceUsd <= maxUsd;
        });
      }
      
      return {
        ...response,
        data: filteredData.map(mapScryfallCardToAppCard)
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
