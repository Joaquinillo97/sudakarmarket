
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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const CardsPage = () => {
  const isMobile = useIsMobile();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<{
    totalCards: number;
    status: string;
    setsProcessed?: number;
    cardsThisRun?: number;
    remainingSets?: number;
  } | null>(null);
  
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

  // Function to trigger sequential Scryfall synchronization
  const handleSequentialSync = async (continueSync = false) => {
    setIsSyncing(true);
    setSyncStats(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-scryfall-cards', {
        body: {
          maxSetsToProcess: 5, // Process 5 sets per batch
          continueSync: continueSync
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        setSyncStats({
          totalCards: data.totalCards || 0,
          status: data.status || 'completed',
          setsProcessed: data.setsProcessed,
          cardsThisRun: data.cardsThisRun,
          remainingSets: data.remainingSets
        });

        if (data.status === 'completed') {
          toast.success(`¡Sincronización completa! ${data.totalCards} cartas en total en la base de datos`);
        } else if (data.status === 'in_progress') {
          toast.success(
            `Lote completado: ${data.setsProcessed} sets procesados (${data.cardsThisRun} cartas). Total: ${data.totalCards} cartas`,
            {
              action: {
                label: "Continuar",
                onClick: () => handleSequentialSync(true)
              }
            }
          );
        }
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

  // Function to check current database status
  const checkDatabaseStatus = async () => {
    try {
      const { count, error } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      setSyncStats({
        totalCards: count || 0,
        status: 'ready'
      });
    } catch (error) {
      console.error('Error checking database status:', error);
    }
  };

  // Check database status on component mount
  useState(() => {
    checkDatabaseStatus();
  });

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
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex-1">
            <PageHeader title="Explorar cartas" />
            {syncStats && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="default">
                  {syncStats.totalCards.toLocaleString()} cartas en BD
                </Badge>
                {syncStats.status === 'in_progress' && (
                  <Badge variant="secondary">
                    {syncStats.remainingSets} sets pendientes
                  </Badge>
                )}
                {syncStats.status === 'completed' && (
                  <Badge variant="outline" className="text-green-600">
                    Sync completo
                  </Badge>
                )}
                {syncStats.setsProcessed && (
                  <Badge variant="outline">
                    Último lote: {syncStats.setsProcessed} sets
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => handleSequentialSync(false)}
              disabled={isSyncing}
              variant="default"
              size="sm"
            >
              {isSyncing ? 'Sincronizando...' : 'Sincronizar por Sets'}
            </Button>
            
            {syncStats?.status === 'in_progress' && syncStats?.remainingSets > 0 && (
              <Button 
                onClick={() => handleSequentialSync(true)}
                disabled={isSyncing}
                variant="outline"
                size="sm"
              >
                Continuar Sync ({syncStats.remainingSets} sets)
              </Button>
            )}
            
            <Button 
              onClick={checkDatabaseStatus}
              variant="ghost"
              size="sm"
            >
              Verificar Estado
            </Button>
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
