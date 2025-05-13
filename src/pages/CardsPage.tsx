
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchCards } from "@/hooks/use-scryfall";
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
    searchParams,
    handleApplyFilters,
    handleClearFilters,
    handlePageChange
  } = useCardFilters();
  
  // Fetch cards from Scryfall API using our custom hook
  const { 
    data: cardResults, 
    isLoading, 
    error,
    isError
  } = useSearchCards({ ...searchParams, page: currentPage });

  // Extract cards from the result
  const cards = cardResults?.data || [];
  const totalCards = cardResults?.total_cards || 0;
  const hasMore = cardResults?.has_more || false;

  // Calculate total pages (Scryfall has 175 cards per page)
  const totalPages = Math.ceil(totalCards / 175);

  // Display error if API request fails
  if (isError) {
    toast.error('Error al cargar cartas', {
      description: (error as Error).message || 'Hubo un problema al conectar con Scryfall API',
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <PageHeader title="Explorar cartas" />
        
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
