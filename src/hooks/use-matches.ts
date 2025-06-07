
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getCardById } from "@/services/scryfall";

export interface MatchedCard {
  id: string;
  name: string;
  condition: string;
  price: number;
  card_id: string;
}

export interface UserMatch {
  userId: string;
  userName: string;
  userImage: string;
  cards: MatchedCard[];
}

// Hook to find matches between user's wishlist and other users' inventories
export function useWishlistMatches() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist-matches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        // Get user's wishlist card IDs
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlists')
          .select('card_id')
          .eq('user_id', user.id);
        
        if (wishlistError) throw wishlistError;
        
        const wishlistCardIds = wishlistData?.map(item => item.card_id) || [];
        
        if (wishlistCardIds.length === 0) return [];
        
        // Find inventory items from other users that match wishlist cards
        const { data: inventoryMatches, error: inventoryError } = await supabase
          .from('user_inventory')
          .select(`
            *,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .in('card_id', wishlistCardIds)
          .neq('user_id', user.id);
        
        if (inventoryError) throw inventoryError;
        
        // Group matches by user and fetch card details
        const userMatches: { [userId: string]: UserMatch } = {};
        
        await Promise.all(
          (inventoryMatches || []).map(async (inventory) => {
            const profile = inventory.profiles as any;
            const userId = profile?.id;
            const userName = profile?.username || 'Usuario desconocido';
            const userImage = profile?.avatar_url || `https://avatar.vercel.sh/${userName}`;
            
            if (!userMatches[userId]) {
              userMatches[userId] = {
                userId,
                userName,
                userImage,
                cards: []
              };
            }
            
            try {
              const scryfallCard = await getCardById(inventory.card_id);
              userMatches[userId].cards.push({
                id: inventory.id,
                name: scryfallCard.name,
                condition: inventory.condition,
                price: inventory.price,
                card_id: inventory.card_id
              });
            } catch (error) {
              console.error('Error fetching card details for match:', error);
              userMatches[userId].cards.push({
                id: inventory.id,
                name: 'Carta no encontrada',
                condition: inventory.condition,
                price: inventory.price,
                card_id: inventory.card_id
              });
            }
          })
        );
        
        return Object.values(userMatches);
      } catch (error) {
        console.error('Error finding matches:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
