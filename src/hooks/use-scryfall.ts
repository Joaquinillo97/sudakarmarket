
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
  let query = "";
  
  // Name filter - use exact name match if specified
  if (name) {
    // Change to allow partial name matches for better results
    query += `name:"${name}"`;
  }
  
  // Set filter - use set: operator with the set code
  if (set && set !== "all") {
    query += query ? ` set:${set}` : `set:${set}`;
    console.log(`Set filter applied: ${set}`);
  }
  
  // Color filter - use c: operator with the Scryfall color codes
  // Color codes in Scryfall: W = white, U = blue, B = black, R = red, G = green, C = colorless, M = multicolor
  if (color && color !== "all") {
    // Fix color filter mapping to ensure it works with Scryfall's expected format
    let colorQuery;
    if (color === "M") {
      colorQuery = "multicolor";
    } else if (color === "C") {
      colorQuery = "colorless";
    } else {
      colorQuery = color;
    }
    query += query ? ` c:${colorQuery}` : `c:${colorQuery}`;
    console.log(`Color filter applied: ${color} → ${colorQuery}`);
  }
  
  // Color identity filter - use ci: operator
  if (colorIdentity && colorIdentity !== "all") {
    query += query ? ` ci:${colorIdentity}` : `ci:${colorIdentity}`;
    console.log(`Color identity filter applied: ${colorIdentity}`);
  }
  
  // Rarity filter - use r: operator
  if (rarity && rarity !== "all") {
    query += query ? ` r:${rarity}` : `r:${rarity}`;
    console.log(`Rarity filter applied: ${rarity}`);
  }
  
  // Language filter - use lang: operator
  if (language && language !== "all") {
    query += query ? ` lang:${language}` : `lang:${language}`;
    console.log(`Language filter applied: ${language}`);
  }
  
  // If no query is provided, search for recent cards
  if (!query) {
    query = "year>=2023 order:released";
  }
  
  console.log("Scryfall query:", query); // Debugging
  
  return useQuery({
    queryKey: ['cards', query, page],
    queryFn: async () => {
      try {
        const response = await searchCards(query, page);
        console.log("Scryfall API response:", response); // Added to debug API response
        console.log("Total cards before filtering:", response.data?.length || 0);
        
        // Apply client-side price filtering
        let filteredData = response.data || [];
        
        // More detailed logging of incoming card data for debugging
        if (filteredData.length > 0) {
          console.log("Sample card data:", {
            name: filteredData[0].name,
            colors: filteredData[0].colors,
            color_identity: filteredData[0].color_identity,
            set: filteredData[0].set,
            set_name: filteredData[0].set_name,
            rarity: filteredData[0].rarity,
            lang: filteredData[0].lang,
            prices: filteredData[0].prices
          });
        }
        
        if (priceRange && (priceRange[0] > 0 || priceRange[1] < 100000)) {
          const [minPrice, maxPrice] = priceRange;
          // Convert to USD for comparison with Scryfall prices
          const minUsd = minPrice / 1000; // Assuming 1 USD = 1000 ARS
          const maxUsd = maxPrice / 1000;
          
          console.log(`Filtering prices from ${minUsd} to ${maxUsd} USD`);
          
          filteredData = filteredData.filter(card => {
            // Get the card price in USD (using usd or usd_foil)
            const cardPriceUsd = parseFloat(card.prices.usd || card.prices.usd_foil || '0');
            const withinRange = cardPriceUsd >= minUsd && cardPriceUsd <= maxUsd;
            
            // Log each card's price assessment for debugging
            if (!withinRange) {
              console.log(`Card "${card.name}" price ${cardPriceUsd} USD is outside range [${minUsd}, ${maxUsd}]`);
            }
            
            return withinRange;
          });
          
          console.log(`Cards after price filtering: ${filteredData.length}`);
        }
        
        // Map the cards and ensure color data is included
        const mappedCards = filteredData.map(card => {
          const mappedCard = mapScryfallCardToAppCard(card);
          // Log color info for more cards to verify color mapping
          if (filteredData.indexOf(card) < 5) {
            console.log(`Card "${card.name}" colors: ${card.colors.join(',')}, color identity: ${card.color_identity.join(',')}, mapped color: ${mappedCard.color}`);
          }
          return mappedCard;
        });
        
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
