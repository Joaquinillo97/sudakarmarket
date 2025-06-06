import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import SearchAutocomplete from "./SearchAutocomplete";

interface CardFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const CardFilters = ({ onApplyFilters }: CardFiltersProps) => {
  const [filters, setFilters] = useState({
    name: "",
    set: "all",
    color: "all",
    colorIdentity: "all",
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

  // Auto-apply filters when card name changes
  useEffect(() => {
    if (filters.name.trim() !== "") {
      console.log("Auto-applying filters due to name change:", filters.name);
      onApplyFilters(filters);
    }
  }, [filters.name, onApplyFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting filters:", filters);
    onApplyFilters(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="card-search" className="block mb-2">Nombre de carta</Label>
        <SearchAutocomplete 
          placeholder="¡Buscá tu carta!" 
          onSearch={handleSearchChange}
          redirectOnSelect={false}
          className="w-full"
          initialValue={filters.name}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="set-filter" className="block">Edición</Label>
          <Select
            value={filters.set}
            onValueChange={(value) => handleFilterChange("set", value)}
          >
            <SelectTrigger id="set-filter">
              <SelectValue placeholder="Todas las ediciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ediciones</SelectItem>
              <SelectItem value="mh3">Modern Horizons 3</SelectItem>
              <SelectItem value="otj">Outlaws of Thunder Junction</SelectItem>
              <SelectItem value="mkm">Murders at Karlov Manor</SelectItem>
              <SelectItem value="lci">Lost Caverns of Ixalan</SelectItem>
              <SelectItem value="woe">Wilds of Eldraine</SelectItem>
              <SelectItem value="mom">March of the Machine</SelectItem>
              <SelectItem value="one">Phyrexia: All Will Be One</SelectItem>
              <SelectItem value="bro">The Brothers' War</SelectItem>
              <SelectItem value="dmu">Dominaria United</SelectItem>
              <SelectItem value="snc">Streets of New Capenna</SelectItem>
              <SelectItem value="neo">Kamigawa: Neon Dynasty</SelectItem>
              <SelectItem value="vow">Innistrad: Crimson Vow</SelectItem>
              <SelectItem value="mid">Innistrad: Midnight Hunt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color-filter" className="block">Color</Label>
          <Select
            value={filters.color}
            onValueChange={(value) => handleFilterChange("color", value)}
          >
            <SelectTrigger id="color-filter">
              <SelectValue placeholder="Todos los colores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los colores</SelectItem>
              <SelectItem value="W">Blanco (W)</SelectItem>
              <SelectItem value="U">Azul (U)</SelectItem>
              <SelectItem value="B">Negro (B)</SelectItem>
              <SelectItem value="R">Rojo (R)</SelectItem>
              <SelectItem value="G">Verde (G)</SelectItem>
              <SelectItem value="M">Multicolor</SelectItem>
              <SelectItem value="C">Incoloro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color-identity-filter" className="block">Identidad de Color</Label>
        <Select
          value={filters.colorIdentity}
          onValueChange={(value) => handleFilterChange("colorIdentity", value)}
        >
          <SelectTrigger id="color-identity-filter">
            <SelectValue placeholder="Todas las identidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las identidades</SelectItem>
            <SelectItem value="W">Blanco (W)</SelectItem>
            <SelectItem value="U">Azul (U)</SelectItem>
            <SelectItem value="B">Negro (B)</SelectItem>
            <SelectItem value="R">Rojo (R)</SelectItem>
            <SelectItem value="G">Verde (G)</SelectItem>
            <SelectItem value="WU">Azorius (W/U)</SelectItem>
            <SelectItem value="WB">Orzhov (W/B)</SelectItem>
            <SelectItem value="UB">Dimir (U/B)</SelectItem>
            <SelectItem value="UR">Izzet (U/R)</SelectItem>
            <SelectItem value="BR">Rakdos (B/R)</SelectItem>
            <SelectItem value="BG">Golgari (B/G)</SelectItem>
            <SelectItem value="RG">Gruul (R/G)</SelectItem>
            <SelectItem value="WG">Selesnya (W/G)</SelectItem>
            <SelectItem value="WR">Boros (W/R)</SelectItem>
            <SelectItem value="UG">Simic (U/G)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced-filters">
          <AccordionTrigger className="text-sm">Filtros avanzados</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Rango de precio (USD convertido a ARS)</Label>
              <Slider 
                value={filters.priceRange}
                defaultValue={[0, 100000]} 
                max={100000} 
                step={1000}
                onValueChange={(value) => handleFilterChange("priceRange", value)} 
                className="mt-6"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${filters.priceRange[0].toLocaleString()}</span>
                <span>${filters.priceRange[1].toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Los precios se filtran del lado del cliente después de obtener los datos de Scryfall
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rarity-filter" className="block">Rareza</Label>
              <Select
                value={filters.rarity}
                onValueChange={(value) => handleFilterChange("rarity", value)}
              >
                <SelectTrigger id="rarity-filter">
                  <SelectValue placeholder="Todas las rarezas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las rarezas</SelectItem>
                  <SelectItem value="common">Común</SelectItem>
                  <SelectItem value="uncommon">Infrecuente</SelectItem>
                  <SelectItem value="rare">Rara</SelectItem>
                  <SelectItem value="mythic">Mítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language-filter" className="block">Idioma</Label>
              <Select
                value={filters.language}
                onValueChange={(value) => handleFilterChange("language", value)}
              >
                <SelectTrigger id="language-filter">
                  <SelectValue placeholder="Todos los idiomas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los idiomas</SelectItem>
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
            </div>
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
