
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

interface Seller {
  id: string;
  username: string;
  avatar_url?: string;
  location?: string;
  rating: number;
  matchingCards?: number;
  subscriptionType?: string;
}

const SellersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [activeSeller, setActiveSeller] = useState<Seller | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch sellers from Supabase
  const { data: sellers, isLoading, error } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '') // Exclude current user
        .order('username');
        
      if (error) throw error;
      
      // Transform profiles into seller format
      return data.map((profile): Seller => ({
        id: profile.id,
        username: profile.username || 'Usuario sin nombre',
        avatar_url: profile.avatar_url,
        location: profile.location,
        rating: profile.rating || 5.0,
        subscriptionType: profile.subscription_type || 'free',
      }));
    },
    enabled: isAuthenticated // Only run query if user is authenticated
  });
  
  // Fetch seller's cards
  const { data: sellerCards, isLoading: isLoadingCards } = useQuery({
    queryKey: ['sellerCards', selectedSeller],
    queryFn: async () => {
      if (!selectedSeller) return [];
      
      const { data, error } = await supabase
        .from('user_inventory')
        .select(`
          *,
          cards:card_id(*)
        `)
        .eq('user_id', selectedSeller)
        .eq('for_trade', true);
        
      if (error) throw error;
      
      // Transform inventory items into card format
      return data.map(item => ({
        id: item.id,
        name: item.cards?.name || 'Carta sin nombre',
        set: item.cards?.set_name || 'Set desconocido',
        imageUrl: item.cards?.image_uri || '',
        price: item.price,
        seller: { 
          id: item.user_id, 
          name: sellers?.find(s => s.id === item.user_id)?.username || 'Vendedor',
          rating: sellers?.find(s => s.id === item.user_id)?.rating || 5.0
        },
        condition: item.condition,
        language: item.language,
      }));
    },
    enabled: !!selectedSeller && !!sellers
  });

  // Filter sellers based on search term
  const filteredSellers = searchTerm && sellers 
    ? sellers.filter(seller => 
        seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seller.location && seller.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : sellers;
  
  // Function to handle click on "Ver stock completo" button
  const handleViewStock = (sellerId: string) => {
    setSelectedSeller(sellerId);
  };

  // Function to handle chat button click
  const handleChatClick = (seller: Seller) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para enviar mensajes");
      navigate('/auth', { state: { from: '/sellers' } });
      return;
    }
    setActiveSeller(seller);
    setShowChat(true);
  };

  if (error) {
    console.error("Error fetching sellers:", error);
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Vendedores de cartas</h1>
          <p className="text-red-500">Error al cargar los vendedores. Por favor, intenta más tarde.</p>
        </main>
        <Footer />
      </div>
    );
  }

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
        {isLoading ? (
          <div className="text-center py-10">Cargando vendedores...</div>
        ) : filteredSellers && filteredSellers.length > 0 ? (
          <div className="space-y-4">
            {filteredSellers.map((seller) => (
              <Card key={seller.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={seller.avatar_url} alt={seller.username} />
                      <AvatarFallback>{seller.username[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 className="font-medium truncate">{seller.username}</h2>
                        {seller.subscriptionType === "premium-store" && (
                          <Badge className="bg-yellow-500">Tienda Premium</Badge>
                        )}
                        {seller.subscriptionType === "premium" && (
                          <Badge className="bg-blue-500">Premium</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{seller.location || 'Ubicación no especificada'}</span>
                      </div>
                      
                      <div className="mt-2">
                        <StarRating rating={seller.rating} />
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
        ) : (
          <div className="text-center py-10">
            {filteredSellers ? 'No se encontraron vendedores.' : 'Por favor, inicia sesión para ver los vendedores.'}
          </div>
        )}

        {/* Stock dialog */}
        {selectedSeller && (
          <Dialog open={!!selectedSeller} onOpenChange={(open) => !open && setSelectedSeller(null)}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Stock de {filteredSellers?.find(s => s.id === selectedSeller)?.username}</DialogTitle>
              </DialogHeader>
              {isLoadingCards ? (
                <div className="text-center py-10">Cargando cartas...</div>
              ) : sellerCards && sellerCards.length > 0 ? (
                <CardGrid cards={sellerCards} />
              ) : (
                <div className="text-center py-10">Este vendedor no tiene cartas para vender actualmente.</div>
              )}
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
