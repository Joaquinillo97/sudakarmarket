
import { useState } from "react";
import { toast } from "sonner";
import { buildSearchParams } from "./use-scryfall";

export interface CardFiltersState {
  name: string;
  set: string;
  color: string;
  colorIdentity: string;
  rarity: string;
  priceRange: [number, number];
  condition: string;
  language: string;
}

export const defaultFilters: CardFiltersState = {
  name: "",
  set: "all",
  color: "all",
  colorIdentity: "all",
  rarity: "all",
  priceRange: [0, 100000],
  condition: "all",
  language: "all"
};

export const useCardFilters = () => {
  const [filters, setFilters] = useState<CardFiltersState>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // Convert our filters to Scryfall search params
  const searchParams = buildSearchParams(filters);

  const handleApplyFilters = (newFilters: CardFiltersState) => {
    // Log the filter values for debugging
    console.log("Applying filters:", JSON.stringify(newFilters));
    
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Log which filters are active
    const activeFilters = Object.entries(newFilters)
      .filter(([key, value]) => {
        if (key === 'priceRange') {
          return value[0] > 0 || value[1] < 100000;
        }
        return value !== 'all' && value !== '';
      })
      .map(([key]) => key);
      
    const filterDescription = activeFilters.length > 0 
      ? `Filtros activos: ${activeFilters.join(', ')}`
      : 'Mostrando todas las cartas';
      
    // Show toast for applying filters
    toast('Filtros aplicados', {
      description: filterDescription,
    });
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    
    toast('Filtros eliminados', {
      description: 'Mostrando todas las cartas sin filtros.',
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return {
    filters,
    currentPage,
    searchParams,
    handleApplyFilters,
    handleClearFilters,
    handlePageChange,
    setCurrentPage
  };
};
