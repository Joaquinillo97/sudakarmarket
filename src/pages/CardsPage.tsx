
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

// Mock data
const mockCards = [
  {
    id: "1",
    name: "Ragavan, Nimble Pilferer",
    set: "Modern Horizons 2",
    imageUrl: "https://cards.scryfall.io/normal/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg",
    price: 50000,
    seller: {
      id: "seller1",
      name: "MagicDealer",
      rating: 4.8,
    },
    condition: "Near Mint",
    language: "Inglés",
    color: "red",
  },
  {
    id: "2",
    name: "Omnath, Locus of Creation",
    set: "Zendikar Rising",
    imageUrl: "https://cards.scryfall.io/normal/front/4/e/4e4fb50c-a81f-44d3-93c5-fa9a0b37f617.jpg",
    price: 12000,
    seller: {
      id: "seller2",
      name: "CardKingdom",
      rating: 4.9,
    },
    condition: "Excellent",
    language: "Inglés",
    color: "gold",
  },
  {
    id: "3",
    name: "Wrenn and Six",
    set: "Modern Horizons",
    imageUrl: "https://cards.scryfall.io/normal/front/4/a/4a706ecf-3277-40e3-871c-4ba4ead16e20.jpg",
    price: 48000,
    seller: {
      id: "seller3",
      name: "MTGStore",
      rating: 4.7,
    },
    condition: "Near Mint",
    language: "Inglés",
    color: "green",
  },
  {
    id: "4",
    name: "Teferi, Time Raveler",
    set: "War of the Spark",
    imageUrl: "https://cards.scryfall.io/normal/front/5/c/5cb76266-ae50-4bbc-8f96-d98f309b02d3.jpg",
    price: 20000,
    seller: {
      id: "seller1",
      name: "MagicDealer",
      rating: 4.8,
    },
    condition: "Near Mint",
    language: "Inglés",
    color: "blue",
  },
  {
    id: "5",
    name: "Solitude",
    set: "Modern Horizons 2",
    imageUrl: "https://cards.scryfall.io/normal/front/4/7/47a6234f-309f-4e03-9263-66da48b57153.jpg",
    price: 35000,
    seller: {
      id: "seller4",
      name: "MTGCollector",
      rating: 4.6,
    },
    condition: "Near Mint",
    language: "Español",
    color: "white",
  },
  {
    id: "6",
    name: "Grief",
    set: "Modern Horizons 2",
    imageUrl: "https://cards.scryfall.io/normal/front/e/6/e6befbc4-1320-4f26-bd9f-b1814fedda10.jpg",
    price: 18000,
    seller: {
      id: "seller2",
      name: "CardKingdom",
      rating: 4.9,
    },
    condition: "Near Mint",
    language: "Inglés",
    color: "black",
  },
  {
    id: "7",
    name: "Urza's Saga",
    set: "Modern Horizons 2",
    imageUrl: "https://cards.scryfall.io/normal/front/c/1/c1e0f201-42cb-46a1-901a-65bb4fc18f6c.jpg",
    price: 25000,
    seller: {
      id: "seller1",
      name: "MagicDealer",
      rating: 4.8,
    },
    condition: "Excellent",
    language: "Inglés",
    color: "colorless",
  },
  {
    id: "8",
    name: "Fury",
    set: "Modern Horizons 2",
    imageUrl: "https://cards.scryfall.io/normal/front/b/d/bd281158-8180-40b9-a5b7-03cfc712d81a.jpg",
    price: 22000,
    seller: {
      id: "seller3",
      name: "MTGStore",
      rating: 4.7,
    },
    condition: "Near Mint",
    language: "Inglés",
    color: "red",
  },
  {
    id: "9",
    name: "Cavern of Souls",
    set: "Avacyn Restored",
    imageUrl: "https://cards.scryfall.io/normal/front/2/5/25976cb2-3123-4935-adcc-70e3db51d381.jpg",
    price: 48000,
    seller: {
      id: "seller2",
      name: "CardKingdom",
      rating: 4.9,
    },
    condition: "Light Played",
    language: "Inglés",
    color: "colorless",
  },
  {
    id: "10",
    name: "Force of Negation",
    set: "Modern Horizons",
    imageUrl: "https://cards.scryfall.io/normal/front/e/9/e9be371c-c688-44ad-ab71-bd4c9f242d58.jpg",
    price: 30000,
    seller: {
      id: "seller4",
      name: "MTGCollector",
      rating: 4.6,
    },
    condition: "Near Mint",
    language: "Inglés",
    color: "blue",
  },
];

const CardsPage = () => {
  const isMobile = useIsMobile();
  const [filteredCards, setFilteredCards] = useState(mockCards);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = (filters: any) => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Apply actual filtering logic
      const filtered = mockCards.filter(card => {
        // Filter by name (case insensitive text search)
        if (filters.name && !card.name.toLowerCase().includes(filters.name.toLowerCase())) {
          return false;
        }
        
        // Filter by set
        if (filters.set && filters.set !== "all") {
          // Convert set name from filter format (modern_horizons_3) to display format (Modern Horizons 3)
          const formattedSetName = filters.set
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          if (!card.set.includes(formattedSetName)) {
            return false;
          }
        }
        
        // Filter by color
        if (filters.color && filters.color !== "all") {
          if (card.color !== filters.color) {
            return false;
          }
        }
        
        // Filter by price range
        const cardPrice = card.price;
        if (cardPrice < filters.priceRange[0] || cardPrice > filters.priceRange[1]) {
          return false;
        }
        
        // Filter by condition
        if (filters.condition && filters.condition !== "all") {
          // Convert condition from filter format (near_mint) to display format (Near Mint)
          const formattedCondition = filters.condition
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          if (card.condition !== formattedCondition) {
            return false;
          }
        }
        
        // Filter by language
        if (filters.language && filters.language !== "all") {
          // Map language codes to display names
          const languageMap: Record<string, string> = {
            'es': 'Español',
            'en': 'Inglés',
            'pt': 'Portugués',
            'ja': 'Japonés',
            'de': 'Alemán',
            'fr': 'Francés',
            'it': 'Italiano',
            'ko': 'Coreano',
            'ru': 'Ruso',
            'zh': 'Chino Simplificado'
          };
          
          if (card.language !== languageMap[filters.language]) {
            return false;
          }
        }
        
        // If all filters pass, include the card
        return true;
      });
      
      setFilteredCards(filtered);
      setIsLoading(false);
    }, 500); // Half second delay to simulate API call
  };

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
                      onApplyFilters={(filters) => {
                        handleApplyFilters(filters);
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
            <CardGrid cards={filteredCards} isLoading={isLoading} />
            {filteredCards.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No se encontraron cartas que coincidan con los filtros seleccionados.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => handleApplyFilters({
                    name: "",
                    set: "",
                    color: "",
                    rarity: "",
                    priceRange: [0, 100000],
                    condition: "",
                    language: ""
                  })}
                >
                  Limpiar filtros
                </Button>
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
