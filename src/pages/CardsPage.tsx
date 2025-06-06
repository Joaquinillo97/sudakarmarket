
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchCards, buildSearchParams, extractCards } from "@/hooks/use-scryfall";
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
  
  // Build search parameters for Scryfall API
  const searchParams = buildSearchParams(filters);
  
  // Use Scryfall API instead of local database
  const queryResult = useSearchCards({
    ...searchParams,
    page: currentPage
  });
  
  // Extract cards and metadata from the query result
  const { cards, isLoading, error } = extractCards(queryResult);
  const isError = !!error;
  
  // Get pagination info from Scryfall response
  const scryfallData = queryResult.data;
  const totalCards = scryfallData?.total_cards || 0;
  const hasMore = scryfallData?.has_more || false;
  
  // Calculate total pages based on Scryfall's pagination (175 cards per page)
  const totalPages = Math.ceil(totalCards / 175);

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
              <span>{totalCards.toLocaleString()} cartas encontradas en Scryfall</span>
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
