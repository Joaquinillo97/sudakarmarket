
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { StarIcon, ArrowLeft, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock data - in a real app, this would come from API calls
const mockCards = [
  {
    id: "1",
    name: "Ragavan, Nimble Pilferer",
    set: "Modern Horizons 2",
    imageUrl: "https://cards.scryfall.io/normal/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg",
    price: 50000,
    seller: { id: "seller1", name: "MagicDealer", rating: 4.8 },
    condition: "Near Mint",
    language: "Inglés",
    color: "red",
    description: "Mono legendario que roba tesoros y hechizos a tus oponentes."
  },
  {
    id: "2",
    name: "Omnath, Locus of Creation",
    set: "Zendikar Rising",
    imageUrl: "https://cards.scryfall.io/normal/front/4/e/4e4fb50c-a81f-44d3-93c5-fa9a0b37f617.jpg",
    price: 12000,
    seller: { id: "seller2", name: "CardKingdom", rating: 4.9 },
    condition: "Excellent",
    language: "Inglés",
    color: "gold",
    description: "Elemental de cuatro colores con habilidades basadas en landfall."
  },
  {
    id: "3",
    name: "Wrenn and Six",
    set: "Modern Horizons",
    imageUrl: "https://cards.scryfall.io/normal/front/4/a/4a706ecf-3277-40e3-871c-4ba4ead16e20.jpg",
    price: 48000,
    seller: { id: "seller3", name: "MTGStore", rating: 4.7 },
    condition: "Near Mint",
    language: "Inglés",
    color: "green",
    description: "Planeswalker de dos manas con la habilidad de recuperar tierras del cementerio."
  }
];

// Mock sellers data
const mockSellers = [
  {
    id: "seller1",
    name: "MagicDealer",
    rating: 4.8,
    region: "CABA",
    price: 50000,
    condition: "Near Mint",
    language: "Inglés",
    avatar: "https://api.dicebear.com/6.x/initials/svg?seed=MD",
    inStock: 3
  },
  {
    id: "seller2",
    name: "CardKingdom",
    rating: 4.9,
    region: "Buenos Aires",
    price: 49500,
    condition: "Near Mint",
    language: "Inglés",
    avatar: "https://api.dicebear.com/6.x/initials/svg?seed=CK",
    inStock: 1
  },
  {
    id: "seller3",
    name: "MTGStore",
    rating: 4.7,
    region: "Córdoba",
    price: 52000,
    condition: "Excellent",
    language: "Inglés",
    avatar: "https://api.dicebear.com/6.x/initials/svg?seed=MS",
    inStock: 2
  },
  {
    id: "seller4",
    name: "MTGCollector",
    rating: 4.6,
    region: "Rosario",
    price: 48000,
    condition: "Light Played",
    language: "Español",
    avatar: "https://api.dicebear.com/6.x/initials/svg?seed=MC",
    inStock: 4
  }
];

interface Seller {
  id: string;
  name: string;
  rating: number;
  region: string;
  price: number;
  condition: string;
  language: string;
  avatar: string;
  inStock: number;
}

// Star rating component
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

const CardDetailsPage = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<any | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch card details
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, this would be an API call with the cardId
      const foundCard = mockCards.find(c => c.id === cardId);
      setCard(foundCard || null);
      
      // Simulate fetching sellers that have this card
      // In a real app, this would be a separate API call
      setSellers(mockSellers);
      
      setIsLoading(false);
    }, 500);
  }, [cardId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-8">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 bg-muted rounded-lg h-96"></div>
            <div className="w-full md:w-2/3 space-y-4">
              <div className="h-8 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-40 bg-muted rounded w-full mt-8"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Carta no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            La carta que estás buscando no existe o ha sido eliminada.
          </p>
          <Button asChild>
            <Link to="/cards">Volver a explorar cartas</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8">
        {/* Back button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="mb-6"
        >
          <Link to="/cards">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a explorar cartas
          </Link>
        </Button>

        {/* Card details section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Card image */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-2">
                <AspectRatio ratio={745/1040} className="bg-muted">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full h-full object-contain"
                  />
                </AspectRatio>
              </CardContent>
            </Card>
          </div>

          {/* Card info */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{card.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{card.set}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Precio más bajo</p>
                <p className="text-2xl font-bold">${card.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendedores</p>
                <p className="text-2xl font-bold">{sellers.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponibilidad</p>
                <p className="text-2xl font-bold">{sellers.reduce((acc, s) => acc + s.inStock, 0)} unidades</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Descripción</h2>
              <p className="text-muted-foreground">{card.description || "No hay descripción disponible para esta carta."}</p>
            </div>
          </div>
        </div>

        {/* Sellers section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Vendedores ({sellers.length})</h2>
          
          <div className="space-y-4">
            {sellers.map((seller) => (
              <Card key={seller.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={seller.avatar} alt={seller.name} />
                      <AvatarFallback>{seller.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <Link to={`/sellers/${seller.id}`} className="font-medium hover:text-primary">
                          {seller.name}
                        </Link>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{seller.region}</span>
                        </div>
                        <div className="mt-1">
                          <StarRating rating={seller.rating} />
                        </div>
                      </div>
                      
                      <div className="md:col-span-1">
                        <p className="text-sm text-muted-foreground">Condición</p>
                        <p className="font-medium">{seller.condition}</p>
                      </div>
                      
                      <div className="md:col-span-1">
                        <p className="text-sm text-muted-foreground">Idioma</p>
                        <p className="font-medium">{seller.language}</p>
                      </div>
                      
                      <div className="md:col-span-1">
                        <p className="text-sm text-muted-foreground">Stock</p>
                        <p className="font-medium">{seller.inStock} unidad{seller.inStock !== 1 ? 'es' : ''}</p>
                      </div>
                      
                      <div className="md:col-span-1 flex flex-col items-end justify-center">
                        <div className="font-bold text-lg">
                          ${seller.price.toLocaleString()}
                        </div>
                        <Button size="sm" className="mt-2 w-full">
                          Contactar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CardDetailsPage;
