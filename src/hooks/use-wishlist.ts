import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getCardById } from "@/services/scryfall";

export interface WishlistItem {
  id: string;
  user_id: string;
  card_id: string;
  quantity: number;
  created_at: string;
}

export interface WishlistCardData {
  id: string;
  card_id: string;
  quantity: number;
  name: string;
  set: string;
  imageUrl: string;
  price: number;
  condition: string;
  language: string;
  color: string;
}

// Hook to get user's wishlist
export function useUserWishlist() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('🔍 Fetching wishlist for user:', user.id);
      
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching wishlist:', error);
        throw error;
      }
      
      console.log('📋 Raw wishlist data:', data);
      
      // Fetch card details from Scryfall for each wishlist item
      const wishlistWithCards = await Promise.all(
        (data || []).map(async (item) => {
          try {
            console.log(`🃏 Fetching card details for: ${item.card_id}`);
            const scryfallCard = await getCardById(item.card_id);
            return {
              id: item.id,
              card_id: item.card_id,
              quantity: item.quantity,
              name: scryfallCard.name,
              set: scryfallCard.set_name,
              imageUrl: scryfallCard.image_uris?.normal || scryfallCard.image_uris?.large || '',
              price: parseFloat(scryfallCard.prices?.usd || '0'),
              condition: 'Near Mint',
              language: 'Inglés',
              color: scryfallCard.colors?.[0]?.toLowerCase() || 'colorless'
            };
          } catch (error) {
            console.error('❌ Error fetching card details:', error);
            return {
              id: item.id,
              card_id: item.card_id,
              quantity: item.quantity,
              name: 'Carta no encontrada',
              set: 'Desconocido',
              imageUrl: '',
              price: 0,
              condition: 'Near Mint',
              language: 'Inglés',
              color: 'colorless'
            };
          }
        })
      );
      
      console.log('✅ Processed wishlist with card details:', wishlistWithCards);
      return wishlistWithCards;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to add item to wishlist
export function useAddToWishlist() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cardId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('➕ Adding card to wishlist:', { userId: user.id, cardId });
      
      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          card_id: cardId,
          quantity: 1
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error adding to wishlist:', error);
        throw error;
      }
      
      console.log('✅ Successfully added to wishlist:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });
      toast({
        title: "¡Agregada a wishlist!",
        description: "La carta fue agregada a tu wishlist",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('❌ Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la carta a la wishlist",
        variant: "destructive",
      });
    }
  });
}

// Hook to remove item from wishlist by card_id
export function useRemoveFromWishlist() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cardId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('🗑️ Removing card from wishlist:', { userId: user.id, cardId });
      
      // First, let's check if the item exists
      const { data: existingItems, error: checkError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('card_id', cardId);
      
      if (checkError) {
        console.error('❌ Error checking existing items:', checkError);
        throw checkError;
      }
      
      console.log('📋 Existing items to delete:', existingItems);
      
      if (!existingItems || existingItems.length === 0) {
        console.warn('⚠️ No items found to delete');
        throw new Error('No se encontró la carta en tu wishlist');
      }
      
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('card_id', cardId);
      
      if (error) {
        console.error('❌ Error removing from wishlist:', error);
        throw error;
      }
      
      console.log('✅ Successfully removed from wishlist');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });
      toast({
        title: "Quitada de wishlist",
        description: "La carta fue quitada de tu wishlist",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('❌ Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "No se pudo quitar la carta de la wishlist",
        variant: "destructive",
      });
    }
  });
}

// Hook to remove item from wishlist by wishlist row ID
export function useRemoveFromWishlistById() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (wishlistRowId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('🗑️ Removing wishlist item by ID:', { userId: user.id, wishlistRowId });
      
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistRowId)
        .eq('user_id', user.id); // Extra security check
      
      if (error) {
        console.error('❌ Error removing from wishlist by ID:', error);
        throw error;
      }
      
      console.log('✅ Successfully removed from wishlist by ID');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });
      toast({
        title: "Quitada de wishlist",
        description: "La carta fue quitada de tu wishlist",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('❌ Error removing from wishlist by ID:', error);
      toast({
        title: "Error",
        description: "No se pudo quitar la carta de la wishlist",
        variant: "destructive",
      });
    }
  });
}

// Hook to check if card is in wishlist
export function useIsInWishlist(cardId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist-check', user?.id, cardId],
    queryFn: async () => {
      if (!user?.id || !cardId) return false;
      
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('card_id', cardId)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error checking wishlist:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user?.id && !!cardId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
