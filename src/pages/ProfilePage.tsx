
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CardGrid from "@/components/cards/CardGrid";
import { ImportIcon, PlusIcon, StarIcon } from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Fetch user's inventory
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ['userInventory', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data.map((item) => ({
        id: item.id,
        name: `Carta ${item.card_id}`, // Placeholder name since we don't have card details
        set: 'Set desconocido',
        imageUrl: '',
        price: item.price,
        seller: { 
          id: user.id, 
          name: user.username || 'Mi colección',
          rating: 5.0
        },
        condition: item.condition,
        language: item.language,
        quantity: item.quantity,
        color: "colorless", // Default color
      }));
    },
    enabled: !!user?.id && isAuthenticated
  });

  // Fetch user's wishlist
  const { data: wishlist = [], isLoading: wishlistLoading } = useQuery({
    queryKey: ['userWishlist', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data.map((item) => ({
        id: item.id,
        name: `Carta ${item.card_id}`, // Placeholder name since we don't have card details
        set: 'Set desconocido',
        imageUrl: '',
        price: 0, // Wishlist items don't have prices
        seller: { 
          id: user.id, 
          name: user.username || 'Mi wishlist',
          rating: 5.0
        },
        condition: "NM",
        language: "Inglés",
        color: "colorless", // Default color
      }));
    },
    enabled: !!user?.id && isAuthenticated
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Debes iniciar sesión para ver tu perfil</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8">
          {/* Profile sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                  <AvatarFallback>{user.username?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{user.username || 'Usuario sin nombre'}</CardTitle>
                <CardDescription className="flex flex-col items-center gap-2">
                  <span>@{user.username || 'usuario'}</span>
                  <Badge variant="outline">Argentina</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1 inline" />
                    5.0/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transacciones</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miembro desde</span>
                  <span>2024</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <Button variant="outline" className="w-full" disabled>
                    Editar perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div>
            <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="inventory">Inventario</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  {activeTab === "inventory" && (
                    <>
                      <Button variant="outline" size="sm">
                        <ImportIcon className="h-4 w-4 mr-1" />
                        Importar de Moxfield
                      </Button>
                      <Button size="sm">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Agregar carta
                      </Button>
                    </>
                  )}
                  {activeTab === "wishlist" && (
                    <Button size="sm">
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Agregar a wishlist
                    </Button>
                  )}
                </div>
              </div>
              
              <TabsContent value="inventory" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">Mi inventario</h2>
                {inventoryLoading ? (
                  <p>Cargando inventario...</p>
                ) : inventory.length > 0 ? (
                  <CardGrid cards={inventory} />
                ) : (
                  <Card className="bg-muted">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground text-center mb-4">
                        No tienes cartas en tu inventario todavía
                      </p>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Agregar carta
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="wishlist" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">Mi wishlist</h2>
                {wishlistLoading ? (
                  <p>Cargando wishlist...</p>
                ) : wishlist.length > 0 ? (
                  <CardGrid cards={wishlist} />
                ) : (
                  <Card className="bg-muted">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground text-center mb-4">
                        No tienes cartas en tu wishlist todavía
                      </p>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Agregar carta a wishlist
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
