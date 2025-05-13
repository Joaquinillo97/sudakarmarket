
import CardFilters from "@/components/search/CardFilters";
import { CardFiltersState } from "@/hooks/use-card-filters";

interface DesktopFiltersProps {
  onApplyFilters: (filters: CardFiltersState) => void;
}

const DesktopFilters = ({ onApplyFilters }: DesktopFiltersProps) => {
  return (
    <aside className="h-fit sticky top-24">
      <div className="bg-card rounded-lg border p-4">
        <h2 className="font-medium mb-4">Filtros</h2>
        <CardFilters onApplyFilters={onApplyFilters} />
      </div>
    </aside>
  );
};

export default DesktopFilters;
