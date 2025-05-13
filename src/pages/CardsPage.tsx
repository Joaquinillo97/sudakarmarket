
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CardGrid from "@/components/cards/CardGrid";
import CardFilters from "@/components/search/CardFilters";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSearchCards, buildSearchParams } from "@/hooks/use-scryfall";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

const CardsPage = () => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState({
    name: "",
    set: "all",
    color: "all",
    rarity: "all",
    priceRange: [0, 100000],
    condition: "all",
    language: "all"
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Convert our filters to Scryfall search params
  const searchParams = buildSearchParams(filters);
  
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

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Show toast for applying filters
    toast('Filtros aplicados', {
      description: 'Buscando cartas con los filtros seleccionados.',
    });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

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
        <h1 className="text-3xl font-bold mb-6">Explorar cartas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          {/* Filters - Desktop */}
          {!isMobile && (
            <aside className="h-fit sticky top-24">
              <div className="bg-card rounded-lg border p-4">
                <h2 className="font-medium mb-4">Filtros</h2>
                <CardFilters onApplyFilters={handleApplyFilters} />
              </div>
            </aside>
          )}
          
          {/* Filters - Mobile */}
          {isMobile && (
            <div className="mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <div className="py-4 pr-6">
                    <CardFilters 
                      onApplyFilters={(newFilters) => {
                        handleApplyFilters(newFilters);
                        document.querySelector<HTMLButtonElement>('.sheet-close-button')?.click();
                      }} 
                    />
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button className="sheet-close-button">Cerrar</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          )}
          
          {/* Card Grid */}
          <div>
            <CardGrid cards={cards} isLoading={isLoading} />
            
            {/* Empty state */}
            {cards.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No se encontraron cartas que coincidan con los filtros seleccionados.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => handleApplyFilters({
                    name: "",
                    set: "all",
                    color: "all",
                    rarity: "all",
                    priceRange: [0, 100000],
                    condition: "all",
                    language: "all"
                  })}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && cards.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(1);
                        }}
                        isActive={currentPage === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    
                    {/* Ellipsis if current page > 3 */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Page before current if not first or second page */}
                    {currentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                        >
                          {currentPage - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Current page if not first page */}
                    {currentPage !== 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage);
                          }}
                          isActive={true}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Next page if available and not last */}
                    {currentPage < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                        >
                          {currentPage + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis if current page < totalpages - 2 */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page if not the first page */}
                    {totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                          }}
                          isActive={currentPage === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CardsPage;
