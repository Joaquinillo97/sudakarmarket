
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook for getting cards from user inventories (cards in stock)
export function useLocalCards(searchParams: {
  name?: string;
  set?: string;
  color?: string;
  rarity?: string;
  language?: string;
  priceRange?: [number, number];
}) {
  const { name = "", set = "", color = "", rarity = "", language = "", priceRange = [0, 100000] } = searchParams;
  
  return useQuery({
    queryKey: ['localCards', name, set, color, rarity, language, priceRange],
    queryFn: async () => {
      // Since we don't have a cards table anymore, return empty array
      // This function is deprecated and should not be used
      console.warn('useLocalCards is deprecated - cards table no longer exists');
      return [];
    },
    enabled: false, // Disable this query since the table doesn't exist
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for getting a single card by ID (deprecated)
export function useLocalCard(cardId: string) {
  return useQuery({
    queryKey: ['localCard', cardId],
    queryFn: async () => {
      console.warn('useLocalCard is deprecated - cards table no longer exists');
      return null;
    },
    enabled: false, // Disable this query since the table doesn't exist
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
