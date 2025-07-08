import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getCardById } from "@/services/scryfall";
import { Database } from "@/integrations/supabase/types";

type CardCondition = Database["public"]["Enums"]["card_condition"];
type CardLanguage = Database["public"]["Enums"]["card_language"];

export interface InventoryItem {
  id: string;
  user_id: string;
  card_id: string;
  quantity: number;
  condition: CardCondition;
  language: CardLanguage;
  price: number;
  for_trade: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryCardData {
  id: string;
  card_id: string;
  quantity: number;
  condition: CardCondition;
  language: CardLanguage;
  price: number;
  for_trade: boolean;
  notes?: string;
  name: string;
  set: string;
  imageUrl: string;
  color: string;
}

export interface AddInventoryData {
  card_id: string;
  quantity: number;
  condition: CardCondition;
  language: CardLanguage;
  price: number;
  for_trade?: boolean;
  notes?: string;
}

// Hook to get user's inventory
export function useUserInventory() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['inventory', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('🔍 Fetching inventory for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching inventory:', error);
        throw error;
      }
      
      console.log('📋 Raw inventory data:', data);
      
      // Fetch card details from Scryfall for each inventory item
      const inventoryWithCards = await Promise.all(
        (data || []).map(async (item) => {
          try {
            console.log(`🃏 Fetching card details for: ${item.card_id}`);
            const scryfallCard = await getCardById(item.card_id);
            return {
              id: item.id,
              card_id: item.card_id,
              quantity: item.quantity,
              condition: item.condition,
              language: item.language,
              price: item.price,
              for_trade: item.for_trade,
              notes: item.notes,
              name: scryfallCard.name,
              set: scryfallCard.set_name,
              imageUrl: scryfallCard.image_uris?.normal || scryfallCard.image_uris?.large || '',
              color: scryfallCard.colors?.[0]?.toLowerCase() || 'colorless'
            };
          } catch (error) {
            console.error('❌ Error fetching card details:', error);
            return {
              id: item.id,
              card_id: item.card_id,
              quantity: item.quantity,
              condition: item.condition,
              language: item.language,
              price: item.price,
              for_trade: item.for_trade,
              notes: item.notes,
              name: 'Carta no encontrada',
              set: 'Desconocido',
              imageUrl: '',
              color: 'colorless'
            };
          }
        })
      );
      
      console.log('✅ Processed inventory with card details:', inventoryWithCards);
      return inventoryWithCards;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to add item to inventory
export function useAddToInventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inventoryData: AddInventoryData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('➕ Adding card to inventory:', { userId: user.id, inventoryData });
      
      const { data, error } = await supabase
        .from('user_inventory')
        .insert({
          user_id: user.id,
          ...inventoryData
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error adding to inventory:', error);
        throw error;
      }
      
      console.log('✅ Successfully added to inventory:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "¡Agregada al inventario!",
        description: "La carta fue agregada a tu inventario",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('❌ Error adding to inventory:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la carta al inventario",
        variant: "destructive",
      });
    }
  });
}

// Hook to remove item from inventory by inventory row ID
export function useRemoveFromInventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inventoryRowId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('🗑️ Removing inventory item by ID:', { userId: user.id, inventoryRowId });
      
      const { error } = await supabase
        .from('user_inventory')
        .delete()
        .eq('id', inventoryRowId)
        .eq('user_id', user.id); // Extra security check
      
      if (error) {
        console.error('❌ Error removing from inventory by ID:', error);
        throw error;
      }
      
      console.log('✅ Successfully removed from inventory by ID');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Quitada del inventario",
        description: "La carta fue quitada de tu inventario",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('❌ Error removing from inventory by ID:', error);
      toast({
        title: "Error",
        description: "No se pudo quitar la carta del inventario",
        variant: "destructive",
      });
    }
  });
}

// Hook to update inventory item
export function useUpdateInventoryItem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      inventoryItemId, 
      updateData 
    }: { 
      inventoryItemId: string; 
      updateData: Partial<AddInventoryData> 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('✏️ Updating inventory item:', { userId: user.id, inventoryItemId, updateData });
      
      const { data, error } = await supabase
        .from('user_inventory')
        .update(updateData)
        .eq('id', inventoryItemId)
        .eq('user_id', user.id) // Extra security check
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error updating inventory item:', error);
        throw error;
      }
      
      console.log('✅ Successfully updated inventory item:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Inventario actualizado",
        description: "Los datos de la carta fueron actualizados",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('❌ Error updating inventory item:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los datos de la carta",
        variant: "destructive",
      });
    }
  });
}