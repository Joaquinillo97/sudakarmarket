
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocalCardSearch } from "@/hooks/use-local-cards";
import { useCardFilters } from "@/hooks/use-card-filters";
import MobileFilters from "@/components/search/MobileFilters";
import DesktopFilters from "@/components/search/DesktopFilters";
import CardsContent from "@/components/cards/CardsContent";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const CardsPage = () => {
  const isMobile = useIsMobile();
  const [isSyncing, setIsSyncing] = useState(false);
  
  const {
    filters,
    currentPage,
    handleApplyFilters,
    handleClearFilters,
    handlePageChange
  } = useCardFilters();
  
  // Use local database search instead of Scryfall API
  const { 
    data: cardResults, 
    isLoading, 
    error,
    isError
  } = useLocalCardSearch({ 
    name: filters.name,
    set: filters.set,
    page: currentPage,
    limit: 20 
  });

  // Extract cards from the result
  const cards = cardResults?.data || [];
  const totalCards = cardResults?.total_cards || 0;
  const hasMore = cardResults?.has_more || false;

  // Calculate total pages
  const totalPages = Math.ceil(totalCards / 20);

  // Function to trigger Scryfall synchronization
  const handleSyncCards = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-scryfall-cards');
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success(`Sincronización completa! ${data.totalProcessed} cartas procesadas`);
      } else {
        throw new Error(data?.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Error al sincronizar cartas: ' + (error as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <PageHeader title="Explorar cartas" />
          <Button 
            onClick={handleSyncCards}
            disabled={isSyncing}
            variant="outline"
          >
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Scryfall'}
          </Button>
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
