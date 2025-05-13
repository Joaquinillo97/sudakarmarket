
import { useState } from "react";
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

// Mock user data
const mockUser = {
  id: "user123",
  name: "Carlos Rodriguez",
  username: "mtgmendoza",
  avatar: "https://avatars.githubusercontent.com/u/123456",
  location: "Mendoza, Argentina",
  rating: 4.7,
  transactions: 23,
  joined: "Noviembre 2023"
};

// Mock inventory/collection data (small subset)
const mockInventory = [
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
];

// Mock wishlist - using same data structure as inventory for simplicity
const mockWishlist = [
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
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  
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
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{mockUser.name}</CardTitle>
                <CardDescription className="flex flex-col items-center gap-2">
                  <span>@{mockUser.username}</span>
                  <Badge variant="outline">{mockUser.location}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1 inline" />
                    {mockUser.rating}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transacciones</span>
                  <span>{mockUser.transactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miembro desde</span>
                  <span>{mockUser.joined}</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Enviar mensaje
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
                {mockInventory.length > 0 ? (
                  <CardGrid cards={mockInventory} />
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
                {mockWishlist.length > 0 ? (
                  <CardGrid cards={mockWishlist} />
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
