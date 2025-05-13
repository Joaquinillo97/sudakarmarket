
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search } from "lucide-react";

interface CardFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const CardFilters = ({ onApplyFilters }: CardFiltersProps) => {
  const [filters, setFilters] = useState({
    name: "",
    set: "",
    color: "",
    rarity: "",
    priceRange: [0, 100000],
    condition: "",
    language: "",
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="¡Buscá tu carta!"
          className="pl-8"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
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
            <SelectItem value="modern_horizons_3">Modern Horizons 3</SelectItem>
            <SelectItem value="outlaws_of_thunder_junction">Outlaws of Thunder Junction</SelectItem>
            <SelectItem value="murders_at_karlov_manor">Murders at Karlov Manor</SelectItem>
            <SelectItem value="lost_caverns_of_ixalan">Lost Caverns of Ixalan</SelectItem>
            <SelectItem value="wilds_of_eldraine">Wilds of Eldraine</SelectItem>
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

      <Button type="submit" className="w-full bg-gradient-to-r from-mtg-blue via-mtg-red to-mtg-green text-white hover:opacity-90">
        ¡Encontrar cartas!
      </Button>
    </form>
  );
};

export default CardFilters;
