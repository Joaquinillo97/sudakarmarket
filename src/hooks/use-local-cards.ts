
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook for searching cards in our local database
export function useLocalCardSearch(searchParams: {
  name?: string;
  set?: string;
  page?: number;
  limit?: number;
}) {
  const { 
    name = "", 
    set = "", 
    page = 1,
    limit = 20
  } = searchParams;
  
  return useQuery({
    queryKey: ['localCards', name, set, page, limit],
    queryFn: async () => {
      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (name) {
        query = query.ilike('name', `%${name}%`);
      }
      
      if (set && set !== 'all') {
        query = query.eq('set_code', set);
      }
      
      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);
      
      // Order by name
      query = query.order('name');
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Transform to match our card interface
      const transformedCards = data?.map(card => ({
        id: card.scryfall_id, // Use scryfall_id as the public ID
        name: card.name,
        set: card.set_name,
        imageUrl: card.image_uri || '',
        price: 0, // Default price, will be set by user inventory
        condition: "NM" as const,
        language: "Inglés" as const,
        color: "colorless" as const,
        // Additional fields for compatibility
        seller: undefined
      })) || [];
      
      return {
        data: transformedCards,
        total_cards: count || 0,
        has_more: (count || 0) > (page * limit),
        current_page: page
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for getting a specific card by scryfall_id
export function useLocalCard(scryfallId: string) {
  return useQuery({
    queryKey: ['localCard', scryfallId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('scryfall_id', scryfallId)
        .single();
        
      if (error) throw error;
      
      return {
        id: data.scryfall_id,
        name: data.name,
        set: data.set_name,
        imageUrl: data.image_uri || '',
        price: 0,
        condition: "NM" as const,
        language: "Inglés" as const,
        color: "colorless" as const,
        scryfall_id: data.scryfall_id,
        set_code: data.set_code,
        collector_number: data.collector_number
      };
    },
    enabled: !!scryfallId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Hook for card autocomplete suggestions using local database
export function useLocalCardAutocomplete(query: string) {
  return useQuery({
    queryKey: ['localCardAutocomplete', query],
    queryFn: async () => {
      if (query.length < 2) return [];
      
      const { data, error } = await supabase
        .from('cards')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(10);
        
      if (error) throw error;
      
      return data?.map(card => card.name) || [];
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 60, // 1 hour
    placeholderData: [],
  });
}

// Hook for getting unique sets from local database
export function useLocalSets() {
  return useQuery({
    queryKey: ['localSets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('set_code, set_name')
        .order('set_name');
        
      if (error) throw error;
      
      // Remove duplicates and return unique sets
      const uniqueSets = data?.reduce((acc, card) => {
        if (!acc.find(s => s.set_code === card.set_code)) {
          acc.push({
            set_code: card.set_code,
            set_name: card.set_name
          });
        }
        return acc;
      }, [] as Array<{set_code: string, set_name: string}>) || [];
      
      return uniqueSets;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
