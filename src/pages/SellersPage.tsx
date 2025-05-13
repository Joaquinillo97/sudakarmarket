
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon, Search, MapPin, MessageSquare, Box } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CardGrid from "@/components/cards/CardGrid";
import ChatInterface from "@/components/chat/ChatInterface";

// Mock data for sellers
const mockSellers = [
  // Premium tienda (first 10)
  ...Array(10).fill(null).map((_, i) => ({
    id: `premium-store-${i+1}`,
    name: `Tienda Magic ${i+1}`,
    region: ["CABA", "Córdoba", "Mendoza", "Rosario", "La Plata"][i % 5],
    rating: 4 + (Math.random() * 1),
    matchingCards: Math.floor(Math.random() * 15) + 5,
    subscriptionType: "premium-store",
    avatar: `https://api.dicebear.com/6.x/initials/svg?seed=Store${i+1}`
  })),
  
  // Premium normal (next 10)
  ...Array(10).fill(null).map((_, i) => ({
    id: `premium-${i+1}`,
    name: `Usuario Premium ${i+1}`,
    region: ["CABA", "Buenos Aires", "Mendoza", "Rosario", "Mar del Plata"][i % 5],
    rating: 3.5 + (Math.random() * 1.5),
    matchingCards: Math.floor(Math.random() * 10) + 2,
    subscriptionType: "premium",
    avatar: `https://api.dicebear.com/6.x/initials/svg?seed=Premium${i+1}`
  })),
  
  // Free users (last 20)
  ...Array(20).fill(null).map((_, i) => ({
    id: `free-${i+1}`,
    name: `Usuario ${i+1}`,
    region: ["CABA", "Buenos Aires", "Córdoba", "Santa Fe", "Entre Ríos", "Mendoza", "San Luis"][i % 7],
    rating: 3 + (Math.random() * 2),
    matchingCards: Math.floor(Math.random() * 5),
    subscriptionType: "free",
    avatar: `https://api.dicebear.com/6.x/initials/svg?seed=User${i+1}`
  }))
];

// Mock data for stock
const mockCards = [
  {
    id: "1",
    name: "Ragavan, Nimble Pilferer",
    set: "Modern Horizons 2",
    imageUrl: "https://cards.scryfall.io/normal/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg",
    price: 50000,
    seller: { id: "premium-store-1", name: "Tienda Magic 1", rating: 4.8 },
    condition: "Near Mint",
    language: "Inglés",
    color: "red"
  },
  {
    id: "2",
    name: "Omnath, Locus of Creation",
    set: "Zendikar Rising",
    imageUrl: "https://cards.scryfall.io/normal/front/4/e/4e4fb50c-a81f-44d3-93c5-fa9a0b37f617.jpg",
    price: 30000,
    seller: { id: "premium-store-1", name: "Tienda Magic 1", rating: 4.8 },
    condition: "Excellent",
    language: "Inglés",
    color: "multicolor"
  },
  {
    id: "3",
    name: "Wrenn and Six",
    set: "Modern Horizons",
    imageUrl: "https://cards.scryfall.io/normal/front/4/a/4a706ecf-3277-40e3-871c-4ba4ead16e20.jpg",
    price: 48000,
    seller: { id: "premium-store-1", name: "Tienda Magic 1", rating: 4.8 },
    condition: "Near Mint",
    language: "Inglés",
    color: "green"
  },
  {
    id: "4",
    name: "Teferi, Time Raveler",
    set: "War of the Spark",
    imageUrl: "https://cards.scryfall.io/normal/front/5/c/5cb76266-ae50-4bbc-8f96-d98f309b02d3.jpg",
    price: 20000,
    seller: { id: "premium-store-1", name: "Tienda Magic 1", rating: 4.8 },
    condition: "Near Mint",
    language: "Inglés",
    color: "blue"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  
  return (
    <div className="flex">
      {Array(5).fill(0).map((_, i) => (
        <StarIcon 
          key={i}
          className={`h-4 w-4 ${
            i < fullStars 
              ? "text-yellow-500 fill-yellow-500" 
              : i === fullStars && hasHalfStar 
                ? "text-yellow-500 fill-yellow-500/50" 
                : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
    </div>
  );
};

const SellersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [activeSeller, setActiveSeller] = useState<any | null>(null);

  // Filter sellers based on search term
  const filteredSellers = searchTerm 
    ? mockSellers.filter(seller => 
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockSellers;
  
  // Function to handle click on "Ver stock completo" button
  const handleViewStock = (sellerId: string) => {
    setSelectedSeller(sellerId);
  };

  // Function to handle chat button click
  const handleChatClick = (seller: any) => {
    setActiveSeller(seller);
    setShowChat(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Vendedores de cartas</h1>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o región..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Sellers list */}
        <div className="space-y-4">
          {filteredSellers.map((seller) => (
            <Card key={seller.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback>{seller.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h2 className="font-medium truncate">{seller.name}</h2>
                      {seller.subscriptionType === "premium-store" && (
                        <Badge className="bg-yellow-500">Tienda Premium</Badge>
                      )}
                      {seller.subscriptionType === "premium" && (
                        <Badge className="bg-blue-500">Premium</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{seller.region}</span>
                    </div>
                    
                    <div className="mt-2">
                      <StarRating rating={seller.rating} />
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm font-medium text-emerald-600">
                      {seller.matchingCards > 0 ? (
                        <>
                          <span className="mr-1">¡Tiene {seller.matchingCards} {seller.matchingCards === 1 ? 'carta' : 'cartas'} de tu wishlist!</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">No tiene cartas de tu wishlist</span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-8"
                        onClick={() => handleViewStock(seller.id)}
                      >
                        <Box className="h-3.5 w-3.5 mr-1" />
                        Ver stock completo
                      </Button>
                      
                      <Button 
                        size="sm" 
                        className="text-xs h-8"
                        onClick={() => handleChatClick(seller)}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Enviar mensaje
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stock dialog */}
        {selectedSeller && (
          <Dialog open={!!selectedSeller} onOpenChange={(open) => !open && setSelectedSeller(null)}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Stock de {mockSellers.find(s => s.id === selectedSeller)?.name}</DialogTitle>
              </DialogHeader>
              <CardGrid cards={mockCards} />
            </DialogContent>
          </Dialog>
        )}
        
        {/* Chat dialog */}
        {showChat && activeSeller && (
          <Dialog open={showChat} onOpenChange={setShowChat} modal={false}>
            <DialogContent className="sm:max-w-md p-0">
              <ChatInterface seller={activeSeller} onClose={() => setShowChat(false)} />
            </DialogContent>
          </Dialog>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SellersPage;
