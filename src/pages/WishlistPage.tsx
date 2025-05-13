
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CardGrid from "@/components/cards/CardGrid";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ImportIcon, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Mock wishlist data
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

// Mock match data (users who want your wishlist cards)
const mockMatches = [
  {
    userId: "user123",
    userName: "MTGFan42",
    userImage: "https://avatars.githubusercontent.com/u/1234567",
    cards: [
      {
        id: "1",
        name: "Ragavan, Nimble Pilferer",
        condition: "Near Mint",
        price: 52000,
      }
    ]
  },
  {
    userId: "user456",
    userName: "MoxfieldMaster",
    userImage: "https://avatars.githubusercontent.com/u/7654321",
    cards: [
      {
        id: "5",
        name: "Solitude",
        condition: "Excellent",
        price: 33000,
      },
      {
        id: "10",
        name: "Force of Negation",
        condition: "Near Mint",
        price: 28500,
      }
    ]
  }
];

const WishlistPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mi Wishlist</h1>
            <p className="text-muted-foreground">Cartas que estás buscando</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <ImportIcon className="mr-2 h-4 w-4" />
              Importar de Moxfield
            </Button>
            <Button size="sm" asChild>
              <Link to="/cards">
                <SearchIcon className="mr-2 h-4 w-4" />
                Buscar cartas
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Match alerts */}
        {mockMatches.length > 0 && (
          <Card className="mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800 dark:text-green-300">
                ¡Tienes matches! 🎉
              </CardTitle>
              <CardDescription>
                Hay usuarios que tienen cartas de tu wishlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMatches.map(match => (
                  <div key={match.userId} className="bg-white dark:bg-black/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                        <img 
                          src={match.userImage} 
                          alt={match.userName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{match.userName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Tiene {match.cards.length} {match.cards.length === 1 ? 'carta' : 'cartas'} de tu wishlist
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {match.cards.map(card => (
                        <div key={card.id} className="flex justify-between items-center py-2 border-t">
                          <span className="font-medium">{card.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{card.condition}</span>
                            <span className="font-bold">${card.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                      <Button variant="default" size="sm" className="w-full mt-2">
                        Contactar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wishlist cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Cartas en tu wishlist</h2>
          {mockWishlist.length === 0 ? (
            <Card className="bg-muted">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center mb-4">
                  No tienes cartas en tu wishlist. ¡Agrega algunas para empezar!
                </p>
                <Button asChild>
                  <Link to="/cards">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Buscar cartas
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <CardGrid cards={mockWishlist} isLoading={isLoading} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
