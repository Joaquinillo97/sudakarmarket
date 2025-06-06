import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import { Seller, SellerCard } from "@/types/sellers";
import SearchBar from "@/components/sellers/SearchBar";
import SellersList from "@/components/sellers/SellersList";
import SellerStockDialog from "@/components/sellers/SellerStockDialog";
import SellerChatDialog from "@/components/sellers/SellerChatDialog";

const SellersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [activeSeller, setActiveSeller] = useState<Seller | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch sellers from Supabase
  const { data: sellers, isLoading, error } = useQuery({
    queryKey: ['sellers', user?.id],
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
        subscriptionType: 'free', // Default subscription type
        // Add name and avatar for ChatInterface compatibility
        name: profile.username || 'Usuario sin nombre',
        avatar: profile.avatar_url,
      }));
    },
    enabled: true // Always run, but exclude current user in query
  });
  
  // Fetch seller's cards that are marked for trade
  const { data: sellerCards, isLoading: isLoadingCards } = useQuery({
    queryKey: ['sellerCards', selectedSeller],
    queryFn: async () => {
      if (!selectedSeller) return [];
      
      const { data, error } = await supabase
        .from('user_inventory')
        .select(`
          *,
          cards(*)
        `)
        .eq('user_id', selectedSeller)
        .eq('for_trade', true); // Only get cards marked for trade
        
      if (error) throw error;
      
      // Transform inventory items into card format
      return data.map((item): SellerCard => ({
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
          <PageHeader title="Vendedores de cartas" />
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
        <PageHeader title="Vendedores de cartas" />
        
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <SellersList 
          sellers={filteredSellers} 
          isLoading={isLoading} 
          onViewStock={handleViewStock}
          onChatClick={handleChatClick}
        />

        {/* Stock dialog */}
        <SellerStockDialog 
          isOpen={!!selectedSeller}
          onOpenChange={(open) => !open && setSelectedSeller(null)}
          seller={filteredSellers?.find(s => s.id === selectedSeller) || null}
          cards={sellerCards}
          isLoading={isLoadingCards}
        />
        
        {/* Chat dialog */}
        <SellerChatDialog 
          isOpen={showChat}
          onOpenChange={setShowChat}
          seller={activeSeller}
        />
      </main>
      <Footer />
    </div>
  );
};

export default SellersPage;
