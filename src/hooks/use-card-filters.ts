
import { useState } from "react";
import { toast } from "sonner";
import { buildSearchParams } from "./use-scryfall";

export interface CardFiltersState {
  name: string;
  set: string;
  color: string;
  rarity: string;
  priceRange: [number, number];
  condition: string;
  language: string;
}

export const defaultFilters: CardFiltersState = {
  name: "",
  set: "all",
  color: "all",
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
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Show toast for applying filters
    toast('Filtros aplicados', {
      description: 'Buscando cartas con los filtros seleccionados.',
    });
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
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
