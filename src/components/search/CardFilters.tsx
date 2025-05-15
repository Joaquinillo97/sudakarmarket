
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Slider
} from "@/components/ui/slider";
import SearchAutocomplete from "./SearchAutocomplete";

interface CardFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const CardFilters = ({ onApplyFilters }: CardFiltersProps) => {
  const [filters, setFilters] = useState({
    name: "",
    set: "all",
    color: "all",
    rarity: "all",
    priceRange: [0, 100000],
    condition: "all",
    language: "all",
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (cardName: string) => {
    handleFilterChange("name", cardName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <SearchAutocomplete 
          placeholder="¡Buscá tu carta!" 
          onSearch={handleSearchChange}
          redirectOnSelect={false}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={filters.set}
          onValueChange={(value) => handleFilterChange("set", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Edición" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="mh3">Modern Horizons 3</SelectItem>
            <SelectItem value="otj">Outlaws of Thunder Junction</SelectItem>
            <SelectItem value="mkm">Murders at Karlov Manor</SelectItem>
            <SelectItem value="lci">Lost Caverns of Ixalan</SelectItem>
            <SelectItem value="woe">Wilds of Eldraine</SelectItem>
            <SelectItem value="mom">March of the Machine</SelectItem>
            <SelectItem value="one">Phyrexia: All Will Be One</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.color}
          onValueChange={(value) => handleFilterChange("color", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="white">Blanco</SelectItem>
            <SelectItem value="blue">Azul</SelectItem>
            <SelectItem value="black">Negro</SelectItem>
            <SelectItem value="red">Rojo</SelectItem>
            <SelectItem value="green">Verde</SelectItem>
            <SelectItem value="multicolor">Multicolor</SelectItem>
            <SelectItem value="colorless">Incoloro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced-filters">
          <AccordionTrigger className="text-sm">Filtros avanzados</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm">Rango de precio (ARS)</label>
              <Slider 
                defaultValue={[0, 100000]} 
                max={100000} 
                step={1000}
                onValueChange={(value) => handleFilterChange("priceRange", value)} 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${filters.priceRange[0].toLocaleString()}</span>
                <span>${filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            
            <Select
              value={filters.rarity}
              onValueChange={(value) => handleFilterChange("rarity", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rareza" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="common">Común</SelectItem>
                <SelectItem value="uncommon">Infrecuente</SelectItem>
                <SelectItem value="rare">Rara</SelectItem>
                <SelectItem value="mythic">Mítica</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.condition}
              onValueChange={(value) => handleFilterChange("condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="mint">Mint (M)</SelectItem>
                <SelectItem value="near_mint">Near Mint (NM)</SelectItem>
                <SelectItem value="excellent">Excellent (EX)</SelectItem>
                <SelectItem value="good">Good (GD)</SelectItem>
                <SelectItem value="light_played">Light Played (LP)</SelectItem>
                <SelectItem value="played">Played (PL)</SelectItem>
                <SelectItem value="poor">Poor (PR)</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.language}
              onValueChange={(value) => handleFilterChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">Inglés</SelectItem>
                <SelectItem value="pt">Portugués</SelectItem>
                <SelectItem value="ja">Japonés</SelectItem>
                <SelectItem value="de">Alemán</SelectItem>
                <SelectItem value="fr">Francés</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="ko">Coreano</SelectItem>
                <SelectItem value="ru">Ruso</SelectItem>
                <SelectItem value="zh">Chino Simplificado</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button type="submit" className="w-full bg-mtg-orange text-white font-magic">
        ¡Encontrar cartas!
      </Button>
    </form>
  );
};

export default CardFilters;
