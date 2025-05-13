
import { Button } from "@/components/ui/button";

interface CardsEmptyStateProps {
  onClearFilters: () => void;
}

const CardsEmptyState = ({ onClearFilters }: CardsEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-lg text-muted-foreground">No se encontraron cartas que coincidan con los filtros seleccionados.</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onClearFilters}
      >
        Limpiar filtros
      </Button>
    </div>
  );
};

export default CardsEmptyState;
