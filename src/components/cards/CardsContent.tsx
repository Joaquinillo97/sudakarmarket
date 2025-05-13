
import CardGrid from "@/components/cards/CardGrid";
import CardsEmptyState from "@/components/cards/CardsEmptyState";
import CardsPagination from "@/components/pagination/CardsPagination";
import { CardFiltersState, defaultFilters } from "@/hooks/use-card-filters";

interface CardsContentProps {
  cards: any[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
}

const CardsContent = ({ 
  cards, 
  isLoading, 
  totalPages,
  currentPage,
  onClearFilters,
  onPageChange
}: CardsContentProps) => {
  return (
    <div>
      <CardGrid cards={cards} isLoading={isLoading} />
      
      {/* Empty state */}
      {cards.length === 0 && !isLoading && (
        <CardsEmptyState onClearFilters={onClearFilters} />
      )}
      
      {/* Pagination */}
      {!isLoading && cards.length > 0 && totalPages > 1 && (
        <CardsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default CardsContent;
