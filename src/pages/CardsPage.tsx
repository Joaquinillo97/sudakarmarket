
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCardFilters } from "@/hooks/use-card-filters";
import MobileFilters from "@/components/search/MobileFilters";
import DesktopFilters from "@/components/search/DesktopFilters";
import CardsContent from "@/components/cards/CardsContent";
import PageHeader from "@/components/layout/PageHeader";

const CardsPage = () => {
  const isMobile = useIsMobile();
  
  const {
    filters,
    currentPage,
    handleApplyFilters,
    handleClearFilters,
    handlePageChange
  } = useCardFilters();
  
  // Fetch cards from user inventories (cards in stock)
  const { data: inventoryData = [], isLoading, error } = useQuery({
    queryKey: ['cardsInStock', filters, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('user_inventory')
        .select('*')
        .gt('quantity', 0); // Only show cards with quantity > 0
      
      // Apply search filter if name is provided
      if (filters.name && filters.name.trim() !== "") {
        // Since we don't have card names in user_inventory, we'll search by card_id for now
        query = query.ilike('card_id', `%${filters.name}%`);
      }
      
      // Apply pagination
      const itemsPerPage = 175;
      const offset = (currentPage - 1) * itemsPerPage;
      query = query.range(offset, offset + itemsPerPage - 1);
      
      const { data, error } = await query;
      if (error) throw error;
      
      // Group by card_id and sum quantities to avoid duplicates
      const cardGroups = data.reduce((acc, item) => {
        if (!acc[item.card_id]) {
          acc[item.card_id] = {
            id: item.card_id,
            name: `Carta ${item.card_id}`, // Placeholder name
            set: 'Edición desconocida',
            imageUrl: '',
            price: item.price,
            condition: item.condition,
            language: item.language,
            color: "colorless",
            seller: { id: item.user_id, name: "Usuario", rating: 5 },
            totalQuantity: 0
          };
        }
        acc[item.card_id].totalQuantity += item.quantity;
        return acc;
      }, {} as Record<string, any>);
      
      return Object.values(cardGroups);
    }
  });
  
  const cards = inventoryData || [];
  const isError = !!error;
  
  // Calculate pagination info based on available inventory
  const totalCards = cards.length;
  const totalPages = Math.max(1, Math.ceil(totalCards / 175));

  // Display error if query fails
  if (isError) {
    toast.error('Error al cargar cartas', {
      description: (error as Error).message || 'Hubo un problema al cargar las cartas',
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-6">
          <PageHeader title="Explorar cartas" />
          <div className="mt-2 text-sm text-muted-foreground">
            {totalCards > 0 && (
              <span>{totalCards.toLocaleString()} cartas disponibles en stock</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          {/* Filters - Desktop */}
          {!isMobile && (
            <DesktopFilters onApplyFilters={handleApplyFilters} />
          )}
          
          {/* Filters - Mobile */}
          {isMobile && (
            <div className="mb-4">
              <MobileFilters onApplyFilters={handleApplyFilters} />
            </div>
          )}
          
          {/* Card Grid and Pagination */}
          <CardsContent
            cards={cards}
            isLoading={isLoading}
            totalPages={totalPages}
            currentPage={currentPage}
            onClearFilters={handleClearFilters}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CardsPage;
